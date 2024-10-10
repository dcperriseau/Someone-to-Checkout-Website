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
                if (chrome.runtime.lastError || !token) {
                    console.error('Authentication error:', chrome.runtime.lastError);
                    sendResponse({ success: false, message: 'Failed to authenticate user.' });
                    chrome.tabs.sendMessage(sender.tab.id, { action: 'showStatus', text: 'Failed to authenticate user.', type: 'error' });
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

                    // Send the URL and contact to the submitProperty Firebase function
                    fetch('https://us-central1-sightonscene-a87ca.cloudfunctions.net/submitProperty', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token
                        },
                        body: JSON.stringify({ url, contact })
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Property submitted:', data);
                        
                        // Call the sendUsageEmails Firebase function after successful submission
                        fetch('https://us-central1-sightonscene-a87ca.cloudfunctions.net/sendUsageEmails', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + token
                            },
                            body: JSON.stringify({ userEmail: contact, url })
                        })
                        .then(emailResponse => emailResponse.json())
                        .then(emailData => {
                            console.log('Email sent:', emailData);
                            sendResponse({ success: true, message: 'Link submitted and email sent successfully!' });
                            chrome.tabs.sendMessage(sender.tab.id, { action: 'showStatus', text: 'Link submitted successfully!', type: 'success' });
                        })
                        .catch(error => {
                            console.error('Error sending email:', error);
                            sendResponse({ success: true, message: 'Link submitted, but failed to send email.' });
                            chrome.tabs.sendMessage(sender.tab.id, { action: 'showStatus', text: 'Link submitted, but failed to send email', type: 'error' });
                        });
                    })
                    .catch(error => {
                        console.error('Error submitting property:', error);
                        sendResponse({ success: false, message: 'Failed to submit Link.' });
                        chrome.tabs.sendMessage(sender.tab.id, { action: 'showStatus', text: 'Failed to submit Link.', type: 'error' });
                    });
                })
                .catch(error => {
                    console.error('Error fetching user info:', error);
                    sendResponse({ success: false, message: 'Failed to retrieve user info.' });
                    chrome.tabs.sendMessage(sender.tab.id, { action: 'showStatus', text: 'Failed to retrieve user info.', type: 'error' });
                });
            });

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

        // Send the URL and contact to the submitProperty Firebase function
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
            
            // sendUsageEmails Firebase function after successful submission
            fetch('https://us-central1-sightonscene-a87ca.cloudfunctions.net/sendUsageEmails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userEmail: contact })
            })
            .then(emailResponse => emailResponse.json())
            .then(emailData => console.log('Email sent:', emailData))
            .catch(error => console.error('Error sending email:', error));
        })
        .catch(error => console.error('Error submitting link:', error));
    });
});


// chrome.browserAction.onClicked.addListener((tab) => {
//     chrome.tabs.sendMessage(tab.id, { action: 'toggleFloatingContainer' });
// });
