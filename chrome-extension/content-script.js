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
    // Create a white box container for the icon
    const container = document.createElement('div');
    container.id = 'dibby-floating-container';
    container.style.position = 'fixed';
    container.style.top = '80px';
    container.style.right = '0px';
    container.style.zIndex = '10000';
    container.style.width = '120px'; //size of box
    container.style.height = '120px';
    container.style.backgroundColor = '#fff';
    container.style.border = '1px solid #ddd';
    container.style.borderRadius = '10px'; // Rounded corners for the white box
    container.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.cursor = 'pointer';

    // Add the Dibby icon image inside the container
    const dibbyIcon = document.createElement('img');
    dibbyIcon.src = chrome.runtime.getURL('dibby-icon.PNG'); 
    dibbyIcon.alt = 'Dibby Icon';
    dibbyIcon.style.width = '88px'; //size of dibby dog
    dibbyIcon.style.height = '88px';

    // Add the close button
    // const closeButton = document.createElement('div');
    // closeButton.textContent = 'X';
    // closeButton.style.padding = '1px';
    // closeButton.style.borderRadius = '50%';
    // closeButton.style.border = '1px solid black';
    // closeButton.style.backgroundColor = 'black';
    // closeButton.style.color = 'white';
    // closeButton.style.position = 'absolute';
    // closeButton.style.top = '0';
    // closeButton.style.right = '0';
    // closeButton.style.cursor = 'pointer';

    // Append the button to the container
    //container.appendChild(closeButton);

    // Append the image to the container
    container.appendChild(dibbyIcon);

    // Append the container to the body of the webpage
    document.body.appendChild(container);

    // Add click event listener to the close button
    //  closeButton.addEventListener('click', () => {
    //     event.stopPropagation();
    //     console.log("Close button has been clicked");
    //     container.remove();
    //  });

     // Add click event listener to the container
     container.addEventListener('click', () => {
        console.log('Dibby icon clicked');
        
        // Send message to background.js to submit the property and handle the response
        chrome.runtime.sendMessage({ action: 'submitProperty' }, (response) => {
            if (response.success) {
                showStatus(response.message, 'success'); // Show success message
            } else {
                showStatus(response.message, 'error'); // Show error message
            }
        });
    });
    
    // Optional: Function to show status message (if needed)
    function showStatus(message, type) {
        const statusDiv = document.createElement('div');
        statusDiv.textContent = message;
        statusDiv.style.position = 'fixed';
        statusDiv.style.top = '50%';
        statusDiv.style.left = '50%';
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

    // Optional: Listen for messages to show status updates
    chrome.runtime.onMessage.addListener((message) => {
        if (message.action === 'showStatus') {
            showStatus(message.text, message.type);
        }
    });
}
