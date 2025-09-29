(function () {
  'use strict';

  var BREAKPOINT_MAX = '(max-width: 924px)';

  function onReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  onReady(function () {
    var mapSidebar = document.querySelector('.author__map-sidebar');
    if (!mapSidebar) {
      return;
    }

    var mapsContainer = mapSidebar.querySelector('.author__maps');
    if (mapsContainer && mapsContainer.classList.contains('author__maps--mobile-hidden')) {
      return;
    }

    var sidebar = mapSidebar.closest('.sidebar');
    var main = document.getElementById('main');
    if (!sidebar || !main) {
      return;
    }

    var article = main.querySelector('article.page');
    if (!article) {
      return;
    }

    var pageInner = article.querySelector('.page__inner-wrap') || article;

    var placeholder = document.createComment('author__map-sidebar placeholder');
    if (mapSidebar.parentNode) {
      mapSidebar.parentNode.insertBefore(placeholder, mapSidebar);
    }

    var mediaQuery = window.matchMedia ? window.matchMedia(BREAKPOINT_MAX) : null;
    var scheduleMapSizeUpdate = function () {};

    initResponsiveMapSizing();

    function initResponsiveMapSizing() {
      if (!mapsContainer) {
        return;
      }

      var visitorsMap = mapsContainer.querySelector('.author__map--visitors');
      var locationMap = mapsContainer.querySelector('.author__map--location');
      if (!visitorsMap || !locationMap) {
        return;
      }

      var requestFrame =
        typeof window.requestAnimationFrame === 'function'
          ? window.requestAnimationFrame.bind(window)
          : function (callback) {
              return window.setTimeout(callback, 16);
            };
      var aspectRatio = null;
      var rafId = null;
      var ensureIntervalId = null;

      function findActiveChild(element) {
        if (!element) {
          return null;
        }
        var child = element.firstElementChild;
        while (child && child.tagName === 'SCRIPT') {
          child = child.nextElementSibling;
        }
        return child || null;
      }

      function applyChildFill(element) {
        var child = findActiveChild(element);
        if (!child) {
          return;
        }
        child.style.setProperty('width', '100%', 'important');
        child.style.setProperty('height', '100%', 'important');
      }

      function applyHeight(height) {
        if (!(height > 0)) {
          return;
        }

        [visitorsMap, locationMap].forEach(function (mapElement) {
          if (!mapElement) {
            return;
          }

          mapElement.style.height = height + 'px';
          mapElement.style.minHeight = height + 'px';
          mapElement.style.maxHeight = height + 'px';
          applyChildFill(mapElement);
        });
      }

      function captureAspectRatio() {
        var reference = findActiveChild(visitorsMap) || visitorsMap;
        if (!reference) {
          return false;
        }

        var rect = reference.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          aspectRatio = rect.width / rect.height;
          if (ensureIntervalId) {
            window.clearInterval(ensureIntervalId);
            ensureIntervalId = null;
          }
          return true;
        }

        return false;
      }

      function ensureAspectRatio() {
        if (aspectRatio !== null) {
          return;
        }

        if (captureAspectRatio()) {
          scheduleUpdate();
        }
      }

      function runUpdate() {
        rafId = null;

        if (aspectRatio === null && !captureAspectRatio()) {
          return;
        }

        var width = visitorsMap.getBoundingClientRect().width;
        if (!(width > 0) || !(aspectRatio > 0)) {
          return;
        }

        var height = width / aspectRatio;
        applyHeight(height);
      }

      function scheduleUpdate() {
        if (rafId !== null) {
          return;
        }

        rafId = requestFrame(runUpdate);
      }

      scheduleMapSizeUpdate = scheduleUpdate;

      applyChildFill(visitorsMap);
      applyChildFill(locationMap);

      if (typeof ResizeObserver === 'function') {
        var resizeObserver = new ResizeObserver(scheduleUpdate);
        resizeObserver.observe(mapsContainer);
      }

      window.addEventListener('resize', scheduleUpdate);

      if (typeof MutationObserver === 'function') {
        var mutationObserver = new MutationObserver(function () {
          ensureAspectRatio();
          scheduleUpdate();
        });
        mutationObserver.observe(visitorsMap, {
          childList: true,
          subtree: true,
          attributes: true
        });
      }

      window.addEventListener('load', scheduleUpdate);

      ensureIntervalId = window.setInterval(function () {
        if (aspectRatio !== null) {
          if (ensureIntervalId) {
            window.clearInterval(ensureIntervalId);
            ensureIntervalId = null;
          }
          return;
        }

        if (captureAspectRatio()) {
          scheduleUpdate();
        }
      }, 200);

      ensureAspectRatio();
      scheduleUpdate();
    }

    function shouldMoveToContent() {
      return mediaQuery ? mediaQuery.matches : window.innerWidth <= 924;
    }

    function moveToContent() {
      if (mapSidebar.parentNode !== pageInner) {
        pageInner.appendChild(mapSidebar);
      }
      mapSidebar.classList.add('author__map-sidebar--inline');
      scheduleMapSizeUpdate();
    }

    function moveToSidebar() {
      if (placeholder.parentNode && mapSidebar.parentNode !== placeholder.parentNode) {
        placeholder.parentNode.insertBefore(mapSidebar, placeholder);
      }
      mapSidebar.classList.remove('author__map-sidebar--inline');
      scheduleMapSizeUpdate();
    }

    function updatePlacement() {
      if (shouldMoveToContent()) {
        moveToContent();
      } else {
        moveToSidebar();
      }
    }

    updatePlacement();

    if (mediaQuery) {
      if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', updatePlacement);
      } else if (typeof mediaQuery.addListener === 'function') {
        mediaQuery.addListener(updatePlacement);
      }
    } else {
      window.addEventListener('resize', updatePlacement);
    }
  });
})();
