//this is what happens when the user actually clicks on the actual extension button, not on the Dibby icon that pops up on the
//page you are wanting it to show up on 

console.log('Popup.js loaded');

// Event listener for the button click
document.getElementById('submitButton').addEventListener('click', () => {
    console.log('Submit button clicked');

    // Get the active tab's URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        const url = activeTab?.url || '';
        console.log('Active tab URL:', url); // Log URL

        // Check if URL is missing
        if (!url) {
            console.error('URL is missing');
            showStatus('Failed to submit property: Missing URL.', 'error');
            return;
        }

        // Authenticate and fetch user's email using OAuth2
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            if (chrome.runtime.lastError) {
                console.error('Authentication error:', chrome.runtime.lastError);
                showStatus('Failed to authenticate user.', 'error');
                return;
            }

            // Use the OAuth2 token to get the user's email
            fetch('https://www.googleapis.com/oauth2/v2/userinfo?alt=json', {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            .then(response => response.json())
            .then(userInfo => {
                const contact = userInfo?.email || '';

                // Check if contact (email) is missing
                if (!contact) {
                    console.error('Contact (email) is missing');
                    showStatus('Failed to submit property: Missing contact info.', 'error');
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
                    console.log('Response from Firebase function:', data);
                    showStatus('Property submitted successfully!', 'success');
                })
                .catch(error => {
                    console.error('Error submitting property:', error);
                    showStatus('Failed to submit property.', 'error');
                });
            })
            .catch(error => {
                console.error('Error fetching user info:', error);
                showStatus('Failed to retrieve user info.', 'error');
            });
        });
    });
});

// Function to show status message
function showStatus(message, type) {
    const statusDiv = document.createElement('div');
    statusDiv.textContent = message;
    statusDiv.style.position = 'fixed';
    statusDiv.style.top = '150px';
    statusDiv.style.right = '20px';
    statusDiv.style.padding = '10px';
    statusDiv.style.border = '1px solid #ddd';
    statusDiv.style.borderRadius = '5px';
    statusDiv.style.backgroundColor = type === 'error' ? 'red' : 'green';
    statusDiv.style.color = '#fff';
    statusDiv.style.zIndex = '10001';
    document.body.appendChild(statusDiv);

    // Hide the message after 3 seconds
    setTimeout(() => {
        statusDiv.remove();
    }, 3000);
}
