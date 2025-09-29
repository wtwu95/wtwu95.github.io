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
    var scheduleSharedHeightUpdate = function () {};

    initSharedMapHeight();

    function initSharedMapHeight() {
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
      var rafId = null;
      var ensureIntervalId = null;

      function setSharedHeight(height) {
        if (!mapsContainer) {
          return;
        }

        if (height > 0) {
          mapsContainer.style.setProperty('--author-map-shared-height', height + 'px');
        }
      }

      function runUpdate() {
        rafId = null;
        if (!visitorsMap) {
          return;
        }

        var rect = visitorsMap.getBoundingClientRect();
        if (rect.height > 0) {
          setSharedHeight(rect.height);
        }
      }

      function scheduleUpdate() {
        if (rafId !== null) {
          return;
        }

        rafId = requestFrame(runUpdate);
      }

      scheduleSharedHeightUpdate = scheduleUpdate;

      if (typeof ResizeObserver === 'function') {
        var resizeObserver = new ResizeObserver(scheduleUpdate);
        resizeObserver.observe(visitorsMap);
      } else {
        window.addEventListener('resize', scheduleUpdate);
      }

      if (typeof MutationObserver === 'function') {
        var mutationObserver = new MutationObserver(scheduleUpdate);
        mutationObserver.observe(visitorsMap, {
          childList: true,
          subtree: true,
          attributes: true
        });
      }

      var attempts = 0;
      ensureIntervalId = window.setInterval(function () {
        attempts += 1;
        var rect = visitorsMap.getBoundingClientRect();
        if (rect.height > 0 || attempts > 20) {
          if (rect.height > 0) {
            setSharedHeight(rect.height);
          }
          if (ensureIntervalId) {
            window.clearInterval(ensureIntervalId);
            ensureIntervalId = null;
          }
        }
      }, 200);

      window.addEventListener('load', scheduleUpdate);
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
      scheduleSharedHeightUpdate();
    }

    function moveToSidebar() {
      if (placeholder.parentNode && mapSidebar.parentNode !== placeholder.parentNode) {
        placeholder.parentNode.insertBefore(mapSidebar, placeholder);
      }
      mapSidebar.classList.remove('author__map-sidebar--inline');
      scheduleSharedHeightUpdate();
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
