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

    function shouldMoveToContent() {
      return mediaQuery ? mediaQuery.matches : window.innerWidth <= 924;
    }

    function moveToContent() {
      if (mapSidebar.parentNode !== pageInner) {
        pageInner.appendChild(mapSidebar);
      }
      mapSidebar.classList.add('author__map-sidebar--inline');
    }

    function moveToSidebar() {
      if (placeholder.parentNode && mapSidebar.parentNode !== placeholder.parentNode) {
        placeholder.parentNode.insertBefore(mapSidebar, placeholder);
      }
      mapSidebar.classList.remove('author__map-sidebar--inline');
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
