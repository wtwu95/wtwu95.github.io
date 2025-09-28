(function () {
  'use strict';

  var EXCLUDED_SLUGS = ['publications', 'news', 'awards', 'services'];

  function getPathSegments(path) {
    if (!path) {
      return [];
    }

    var cleaned = path.split('?')[0].split('#')[0];
    if (cleaned.length > 1 && cleaned.charAt(cleaned.length - 1) === '/') {
      cleaned = cleaned.slice(0, -1);
    }

    return cleaned
      .split('/')
      .map(function (segment) {
        return segment.trim();
      })
      .filter(function (segment) {
        return Boolean(segment);
      });
  }

  function shouldSkipPage() {
    var segments = getPathSegments(window.location.pathname || '');
    if (!segments.length) {
      return false;
    }

    var lastSegment = segments[segments.length - 1];
    return EXCLUDED_SLUGS.indexOf(lastSegment) !== -1;
  }

  function hasScrollWindow() {
    return Boolean(
      document.querySelector('[data-news-window].news-window--scroll') ||
        document.querySelector('.news-window--scroll')
    );
  }

  function moveMapsAfterContent() {
    var mapSidebar = document.querySelector('.sidebar .author__map-sidebar');
    if (!mapSidebar) {
      return;
    }

    var content = document.querySelector('.page__content');
    if (!content) {
      return;
    }

    if (mapSidebar.parentElement === content) {
      return;
    }

    content.appendChild(mapSidebar);
    mapSidebar.classList.add('author__map-sidebar--after-content');
  }

  function init() {
    if (shouldSkipPage()) {
      return;
    }

    if (!hasScrollWindow()) {
      return;
    }

    moveMapsAfterContent();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
