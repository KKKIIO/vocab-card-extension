'use strict';

// Content script file will run in the context of web page.
// With content script you can manipulate the web pages using
// Document Object Model (DOM).
// You can also pass information to the parent extension.

// We execute this script by making an entry in manifest.json file
// under `content_scripts` property

// For more information on Content Scripts,
// See https://developer.chrome.com/extensions/content_scripts

// Listen for message
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'getContextFromPage') {
    // get selected text
    const selectedText = window.getSelection().toString();
    // get page url and title
    const pageUrl = window.location.href;
    const pageTitle = document.head.getElementsByTagName('title')[0].innerHTML;
    sendResponse({
      selectedText,
      pageUrl,
      pageTitle,
    });
  }

  // Send an empty response
  // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
  // sendResponse({});
  // return true;
});
