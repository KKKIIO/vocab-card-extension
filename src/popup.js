'use strict';

import './popup.css';

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const textInput = document.getElementById('text');
    const cardForm = document.getElementById('card-form');
    const resultContainer = document.getElementById('result');

    // Load selected text into the text input
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: 'getSelectedText' },
        function (response) {
          if (response && response.selectedText) {
            textInput.value = response.selectedText;
          }
        }
      );
    });

    // Handle form submission
    cardForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Collect form data
      const formData = new FormData(cardForm);
      const data = {
        text: formData.get('text'),
      };

      // Send a message to the background script to create the card
      chrome.runtime.sendMessage(
        { action: 'createCard', data },
        function (response) {
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
