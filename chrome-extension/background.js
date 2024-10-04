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
  