'use strict';

import './popup.css';

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const sourceNameInput = document.getElementById('source_name');
    const sourceUrlInput = document.getElementById('source_url');
    const textInput = document.getElementById('text');
    const cardForm = document.getElementById('card_form');
    const resultContainer = document.getElementById('result');

    // Load selected text into the text input
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: 'getContextFromPage' },
        function (response) {
          if (response) {
            sourceNameInput.value = response.pageTitle;
            sourceUrlInput.value = response.pageUrl;
            textInput.value = response.selectedText;
          }
        }
      );
    });

    // Handle form submission
    cardForm.addEventListener('submit', function (e) {
      e.preventDefault();
      // disable the submit button
      const submitButton = cardForm.querySelector('button[type="submit"]');
      submitButton.setAttribute('disabled', 'true');

      // Collect form data
      const formData = new FormData(cardForm);
      const data = {
        text: formData.get('text'),
        source: {
          name: formData.get('source_name'),
          url: formData.get('source_url'),
        },
      };

      // Send a message to the background script to create the card
      chrome.runtime.sendMessage(
        { action: 'createCard', data },
        function (response) {
          // Re-enable the submit button
          submitButton.removeAttribute('disabled');

          if (response && !response.error) {
            resultContainer.textContent = 'Card created successfully!';
            // Optionally, you can close the popup or perform other actions here.
          } else {
            resultContainer.textContent = `Failed to create card: ${response?.error}`;
          }
        }
      );
    });
  });
})();
