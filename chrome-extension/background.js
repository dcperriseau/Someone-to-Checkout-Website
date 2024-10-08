  chrome.action.onClicked.addListener((tab) => {
      const url = tab.url;
    
      // get the user's email address from the Chrome identity API
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
    

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'activatePopup') {
      // Open the popup programmatically when the content script detects a matching URL
      chrome.action.openPopup();
    }
  });


  chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.action === 'submitProperty') {
        // Use the chrome.tabs API to get the active tab URL
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            console.log("This is tabs: ", tabs)
            const activeTab = tabs[0];
            const url = activeTab?.url || '';
            console.log('Active tab URL:', url);

            if (!url) {
                console.error('URL is missing');
                chrome.tabs.sendMessage(sender.tab.id, { action: 'showStatus', text: 'Failed to submit property: Missing URL.', type: 'error' });
                return;
            }

            // Authenticate and fetch user's email using OAuth2
            chrome.identity.getAuthToken({ interactive: true }, function (token) {
                if (chrome.runtime.lastError) {
                    console.error('Authentication error:', chrome.runtime.lastError);
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
                        chrome.tabs.sendMessage(sender.tab.id, { action: 'showStatus', text: 'Failed to submit property: Missing contact info.', type: 'error' });
                        return;
                    }

                    console.log('User email:', contact);

                    fetch('https://us-central1-sightonscene-a87ca.cloudfunctions.net/submitProperty', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ url, contact })
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Response from Firebase function:', data);
                        chrome.tabs.sendMessage(sender.tab.id, { action: 'showStatus', text: 'Property submitted successfully!', type: 'success' });
                    })
                    .catch(error => {
                        console.error('Error submitting property:', error);
                        chrome.tabs.sendMessage(sender.tab.id, { action: 'showStatus', text: 'Failed to submit property.', type: 'error' });
                    });
                })
                .catch(error => {
                    console.error('Error fetching user info:', error);
                    chrome.tabs.sendMessage(sender.tab.id, { action: 'showStatus', text: 'Failed to retrieve user info.', type: 'error' });
                });
            });
        });
    }
  });
