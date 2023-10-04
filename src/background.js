'use strict';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'createCard') {
    // Retrieve the API endpoint URL from Chrome Storage
    const apiEndpoint = 'http://localhost:3000/api/cards'; // TODO: Replace with production API endpoint
    const payload = JSON.stringify(request.data);
    console.log(`Sending request to ${apiEndpoint}, payload=${payload}}`);
    // Send a POST request to the web app's API
    fetch(apiEndpoint, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload,
    })
      .then((response) => response.json())
      .then((payload) => {
        // Handle the API response here
        if (payload && payload.data) {
          sendResponse({ error: null });
        } else {
          sendResponse({ error: payload?.error?.message || 'Unknown error' });
        }
      })
      .catch((error) => {
        console.error('Error creating card:', error);
        sendResponse({ error: error.message || 'Unknown error' });
      });

    // Ensure the sendResponse callback is called asynchronously
    return true;
  }
});
