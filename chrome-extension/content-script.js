console.log('Dibby Content Script Loaded.');

// Check if the URL matches the condition
if (window.location.href.includes('chakra-ui.com')) {
    // Create a container for the floating button UI
    const container = document.createElement('div');
    container.id = 'dibby-floating-container';
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.zIndex = '10000';
    container.style.padding = '10px';
    container.style.backgroundColor = '#fff';
    container.style.border = '1px solid #ddd';
    container.style.borderRadius = '5px';
    container.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';

    // Set the inner HTML to the content of your popup
    container.innerHTML = `
      <h3>Submit Property URL</h3>
      <button id="submitButton" style="border: 1px solid black; padding: 5px; margin-top: 10px; color: white; background-color: #b8b894; border-radius: 15px">Submit Current URL</button>
      <div id="status" class="status" style="display: none; margin-top: 10px; padding: 10px; text-align: center; border: 1px solid #ddd; border-radius: 5px;"></div>
    `;

    // Append the container to the body of the webpage
    document.body.appendChild(container);

    // Re-add the JavaScript functionality from your popup.js file
    const button = document.getElementById('submitButton');
    button.addEventListener('click', () => {
        console.log('Submit button clicked');

        // Get the active tab's URL
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            const url = activeTab?.url || '';
            console.log('Active tab URL:', url);

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
                        showStatus('Failed to submit property: Missing contact info.', 'error');
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
        const statusDiv = document.getElementById('status');
        statusDiv.textContent = message;
        statusDiv.className = `status ${type}`;
        statusDiv.style.display = 'block';

        // Hide the message after 3 seconds
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 3000);
    }
};

