chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'activatePopup') {
        // Open the popup programmatically when the content script detects a matching URL
        chrome.action.openPopup();
    }

    if (message.action === 'submitProperty') {
        // Use the chrome.tabs API to get the active tab URL
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            const url = activeTab?.url || '';

            if (!url) {
                console.error('URL is missing');
                sendResponse({ success: false, message: 'Failed to submit property: Missing URL.' });
                return;
            }

            // Authenticate and fetch user's email using OAuth2
            chrome.identity.getAuthToken({ interactive: true }, function (token) {
                if (chrome.runtime.lastError) {
                    console.error('Authentication error:', chrome.runtime.lastError);
                    sendResponse({ success: false, message: 'Failed to authenticate user.' });
                    return;
                }

                fetch('https://www.googleapis.com/oauth2/v2/userinfo?alt=json', {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                })
                .then(response => response.json())
                .then(userInfo => {
                    const contact = userInfo?.email || '';

                    if (!contact) {
                        console.error('Contact (email) is missing');
                        sendResponse({ success: false, message: 'Failed to submit property: Missing contact info.' });
                        return;
                    }

                    console.log('User email:', contact);

                    // Send the URL and contact to Firebase function
                    fetch('https://us-central1-sightonscene-a87ca.cloudfunctions.net/submitProperty', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ url, contact })
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Property submitted:', data);
                        sendResponse({ success: true, message: 'Property submitted successfully!' });
                    })
                    .catch(error => {
                        console.error('Error submitting property:', error);
                        sendResponse({ success: false, message: 'Failed to submit property.' });
                    });
                })
                .catch(error => {
                    console.error('Error fetching user info:', error);
                    sendResponse({ success: false, message: 'Failed to retrieve user info.' });
                });
            });

            // Keep sendResponse function valid for asynchronous use
            return true;
        });
    }
});

// Trigger submission directly from the browser action (if needed)
chrome.action.onClicked.addListener((tab) => {
    const url = tab.url;

    // Get the user's email address from the Chrome identity API
    chrome.identity.getProfileUserInfo({ accountStatus: 'ANY' }, function(userInfo) {
        const contact = userInfo.email;

        // Send the URL and contact to Firebase function
        fetch('https://us-central1-sightonscene-a87ca.cloudfunctions.net/submitProperty', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url, contact })
        })
        .then(response => response.json())
        .then(data => console.log('Property submitted:', data))
        .catch(error => console.error('Error submitting property:', error));
    });
});
