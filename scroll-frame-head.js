(function() {

  // Ignore for unsupported browsers
  if (!(window.history && window.history.pushState)) return;

  // If we're inside an iframe modal then send a message to the parent
  // indicating what the iframe's location is so that the parent can decide
  // not to go down a rabbit hole inside the iframe.
  if (parent && parent.postMessage) {
    // postMessage support for IE & other browsers
    if (window.MessageChannel && navigator.userAgent.indexOf('MSIE') > -1) {
      var m = new MessageChannel();
      parent.postMessage({
        href: location.href,
        scrollFrame: true
      }, "*", [m.port2]);
    } else {
      parent.postMessage({
        href: location.href,
        scrollFrame: true
      }, location.origin);
    }
  }

  // If we are inside frame... we do not want that future links to navigate inside iframe, but to target back to parent window...
  if(window && window.frameElement && window.frameElement.className == 'scroll-frame-iframe') {
    window.addEventListener("DOMContentLoaded", function() {
      // do stuff
      var links = document.getElementsByTagName("a");
      for(var i in links) if(!links[i].target || links[i].target.toLowerCase() == '_self') {
        links[i].target = '_parent';
      }

      var forms = document.getElementsByTagName("form");
      for(var i in forms) if(!forms[i].target || forms[i].target.toLowerCase() == '_self') {
        forms[i].target = '_parent';
      }
    }, false);
  }

  // When navigating another level deep scrollFrame will refresh the page.
  // Hitting the back button will halt when it gets to the popstate point
  // at which scrollFrame added the iframe modal. This will notice that and
  // make the full refresh instead.
  addEventListener('popstate', function(e) {
    if(e && e.state && e.state.scrollFramesParentDocument && !document.querySelector('.scroll-frame-iframe')) {
      //back button when target website was refreshed in browser by clicking refresh button and parent website is no longer in DOM
      location.reload();
    }
  });
})();