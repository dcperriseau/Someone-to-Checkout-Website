console.log('Dibby Content Script Loaded.');

const allowedWebsites = [
    'facebook.com',
    'zillow.com',
    'apartments.com',
    'trulia.com',
    'craigslist.org',
    'furnishedfinder.com',
    'homes.com',
    'rent.com',
    'realtor.com',
    'streeteasy.com',
    'redfin.com',
    'hotpads.com',
    'apartmentfinder.com'
];

// Check if the URL matches the condition
if (allowedWebsites.some(website => window.location.href.includes(website))) {
    // Create a container for the floating button UI
    const container = document.createElement('div');
    container.id = 'dibby-floating-container';
    container.style.position = 'fixed';
    container.style.top = '80px';
    container.style.right = '20px';
    container.style.zIndex = '10000';
    container.style.padding = '10px';
    container.style.backgroundColor = '#fff';
    container.style.border = '1px solid #ddd';
    container.style.borderRadius = '5px';
    container.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';

    // Set the inner HTML to the content of your popup
    container.innerHTML = `
      <h3 style="font-size: 20px;">Submit Property URL</h3>
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
        chrome.runtime.sendMessage({ action: 'submitProperty' });
    });

    // Function to show status message
    function showStatus(message, type) {
        const statusDiv = document.getElementById('status');
        statusDiv.textContent = message;
        statusDiv.className = `status ${type}`;
        statusDiv.style.display = 'block';
        statusDiv.style.color = type === 'error' ? 'red' : 'green';

        // Hide the message after 3 seconds
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 3000);
    }

    chrome.runtime.onMessage.addListener((message) => {
        if (message.action === 'showStatus') {
            showStatus(message.text, message.type);
        }
    });
};

