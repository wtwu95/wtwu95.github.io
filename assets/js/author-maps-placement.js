(function () {
  'use strict';

  var BREAKPOINT_MAX_WIDTH = 924;
  var mapsContainer;
  var placeholder;
  var mainContainer;
  var hasMoved = false;
  var mediaQuery;

  function ensurePlaceholder() {
    if (!mapsContainer || !mapsContainer.parentNode) {
      return;
    }

    if (!placeholder) {
      placeholder = document.createComment('author__maps-placeholder');
    }

    if (!placeholder.parentNode) {
      mapsContainer.parentNode.insertBefore(placeholder, mapsContainer.nextSibling);
    }
  }

  function moveMapsToBottom() {
    if (!mapsContainer || !mainContainer || hasMoved) {
      return;
    }

    ensurePlaceholder();
    mainContainer.appendChild(mapsContainer);
    mapsContainer.classList.add('author__maps--mobile');
    hasMoved = true;
  }

  function restoreMaps() {
    if (!mapsContainer || !placeholder || !placeholder.parentNode || !hasMoved) {
      return;
    }

    placeholder.parentNode.insertBefore(mapsContainer, placeholder);
    mapsContainer.classList.remove('author__maps--mobile');
    hasMoved = false;
  }

  function shouldUseMobileLayout() {
    if (mediaQuery && typeof mediaQuery.matches === 'boolean') {
      return mediaQuery.matches;
    }

    return window.innerWidth <= BREAKPOINT_MAX_WIDTH;
  }

  function handleLayoutChange() {
    if (!mapsContainer || !mainContainer) {
      return;
    }

    if (shouldUseMobileLayout()) {
      moveMapsToBottom();
    } else {
      restoreMaps();
    }
  }

  function registerListeners() {
    if (mediaQuery) {
      if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', handleLayoutChange);
        return;
      }

      if (typeof mediaQuery.addListener === 'function') {
        mediaQuery.addListener(handleLayoutChange);
        return;
      }
    }

    window.addEventListener('resize', handleLayoutChange);
  }

  function init() {
    var sidebar = document.querySelector('.sidebar');
    mainContainer = document.getElementById('main');

    if (!sidebar || !mainContainer) {
      return;
    }

    mapsContainer = sidebar.querySelector('.author__maps');
    if (!mapsContainer) {
      return;
    }

    if (typeof window.matchMedia === 'function') {
      mediaQuery = window.matchMedia('(max-width: ' + BREAKPOINT_MAX_WIDTH + 'px)');
    }

    handleLayoutChange();
    registerListeners();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
