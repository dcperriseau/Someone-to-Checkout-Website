chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'activatePopup') {
        chrome.action.openPopup(); // Open the popup programmatically when the content script detects a matching URL
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

            // Try to get the token from storage first
            chrome.storage.local.get(['oauthToken'], function (result) {
                const storedToken = result.oauthToken;
                
                if (storedToken) {
                    // Use the stored token if available
                    console.log('Using stored OAuth token:', storedToken);
                    proceedWithPropertySubmission(url, storedToken, sender, sendResponse);
                } else {
                    // No token found, request a new one
                    getNewAuthToken(url, sender, sendResponse);
                }
            });
        });

        return true;
    }
});

function getNewAuthToken(url, sender, sendResponse) {
    // Request a new token from Chrome identity API
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
        if (chrome.runtime.lastError || !token) {
            console.error('Authentication error:', chrome.runtime.lastError || 'No token retrieved');
            sendResponse({ success: false, message: 'Failed to authenticate user.' });
            chrome.tabs.sendMessage(sender.tab.id, { action: 'showStatus', text: 'Failed to authenticate user.', type: 'error' });
            return;
        }

        console.log('New OAuth Token retrieved:', token);

        // Store the token in chrome.storage for future use
        chrome.storage.local.set({ oauthToken: token }, function () {
            console.log('OAuth token stored.');
            proceedWithPropertySubmission(url, token, sender, sendResponse);
        });
    });
}

function proceedWithPropertySubmission(url, token, sender, sendResponse) {
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
}

// Trigger submission directly from the browser action (if needed)
chrome.action.onClicked.addListener((tab) => {
    const url = tab.url;

    chrome.storage.local.get(['oauthToken'], function (result) {
        const token = result.oauthToken;

        if (token) {
            // Use the stored token
            console.log('Using stored token for submission');
            proceedWithPropertySubmission(url, token, null, () => {});
        } else {
            // Get a new token if not stored
            getNewAuthToken(url, null, () => {});
        }
    });
});
