(function () {
  'use strict';

  var RESIZE_DEBOUNCE_MS = 50;

  function onReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function firstNonScriptChild(container) {
    if (!container) {
      return null;
    }

    var child = container.firstElementChild;
    while (child && child.tagName === 'SCRIPT') {
      child = child.nextElementSibling;
    }

    return child || null;
  }

  function getVisitorRatio(visitorsContainer) {
    var content = firstNonScriptChild(visitorsContainer);
    if (!content) {
      return null;
    }

    var rect = content.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return null;
    }

    return rect.height / rect.width;
  }

  function stretchVisitorContent(visitorsContainer) {
    var content = firstNonScriptChild(visitorsContainer);
    if (!content) {
      return;
    }

    content.style.width = '100%';
    content.style.height = '100%';

    var descendants = content.querySelectorAll('iframe, img, canvas, svg, object, embed');
    for (var i = 0; i < descendants.length; i += 1) {
      var element = descendants[i];
      element.style.width = '100%';
      element.style.height = '100%';
    }
  }

  function applyMapHeights(ratio, visitorsContainer, googleMapContainer) {
    if (!ratio || !visitorsContainer || !googleMapContainer) {
      return;
    }

    var visitorsWidth = visitorsContainer.getBoundingClientRect().width;
    if (!visitorsWidth) {
      var parentRect = visitorsContainer.parentElement ? visitorsContainer.parentElement.getBoundingClientRect() : null;
      visitorsWidth = parentRect ? parentRect.width : 0;
    }

    if (!visitorsWidth) {
      return;
    }

    var desiredHeight = Math.round(visitorsWidth * ratio);

    visitorsContainer.style.height = desiredHeight + 'px';
    googleMapContainer.style.height = desiredHeight + 'px';

    stretchVisitorContent(visitorsContainer);

    var fallback = googleMapContainer.querySelector('.author-location-map__fallback');
    if (fallback) {
      fallback.style.height = '100%';
    }
  }

  function setupObservers(updateFn, visitorsContainer, googleWrapper) {
    if (typeof window.ResizeObserver === 'function') {
      var resizeObserver = new window.ResizeObserver(function () {
        updateFn();
      });
      resizeObserver.observe(visitorsContainer);
      resizeObserver.observe(googleWrapper);
    }

    var observer = new MutationObserver(function () {
      updateFn(true);
    });

    observer.observe(visitorsContainer, { childList: true, subtree: true });
  }

  function init() {
    var visitorsContainer = document.querySelector('.author__map--visitors');
    var googleWrapper = document.querySelector('.author__map--location');
    var googleMapContainer = googleWrapper ? googleWrapper.querySelector('.author-location-map') : null;

    if (!visitorsContainer || !googleMapContainer) {
      return;
    }

    var ratio = null;
    var scheduled = false;
    var lastUpdate = 0;

    function refreshRatio(force) {
      if (!ratio || force) {
        var newRatio = getVisitorRatio(visitorsContainer);
        if (newRatio) {
          ratio = newRatio;
        }
      }
    }

    function updateSizes(forceRatio) {
      var now = Date.now();
      if (scheduled && now - lastUpdate < RESIZE_DEBOUNCE_MS) {
        return;
      }

      scheduled = true;
      lastUpdate = now;

      window.requestAnimationFrame(function () {
        scheduled = false;
        refreshRatio(forceRatio);
        applyMapHeights(ratio, visitorsContainer, googleMapContainer);
      });
    }

    setupObservers(function (force) {
      updateSizes(force);
    }, visitorsContainer, googleWrapper);

    window.addEventListener('resize', function () {
      updateSizes(false);
    });

    updateSizes(true);
    window.setTimeout(function () {
      updateSizes(true);
    }, 600);
  }

  onReady(init);
})();
