// Read the Wikipedia page to find the Artist name (in 'firstHeading' element)
heading = document.getElementById('firstHeading');
title = heading.childNodes[0].textContent;

// Remove trailing "(Band)","(Musician)","(Singer)" etc from Title (if present)
artistname = '';
if (title.indexOf('(') != -1){
	artistname = title.substring(0,title.lastIndexOf('(')-1);
} else {
	artistname = title;
}

// Listener responds to click from extension button
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting == "hello")
      sendResponse({farewell: artistname});
  });
