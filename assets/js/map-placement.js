(function () {
  var excludedPaths = ['/publications/', '/news/', '/awards/', '/services/'];

  function normalizePath(path) {
    if (!path) {
      return '/';
    }

    var hashIndex = path.indexOf('#');
    if (hashIndex !== -1) {
      path = path.slice(0, hashIndex);
    }

    var queryIndex = path.indexOf('?');
    if (queryIndex !== -1) {
      path = path.slice(0, queryIndex);
    }

    if (path.length > 1 && path.slice(-1) !== '/') {
      path += '/';
    }

    return path;
  }

  var currentPath = normalizePath(window.location.pathname);

  if (excludedPaths.indexOf(currentPath) !== -1) {
    return;
  }

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  onReady(function () {
    var mapSidebar = document.querySelector('.sidebar .author__map-sidebar');
    if (!mapSidebar) {
      return;
    }

    var sidebar = document.querySelector('.sidebar');
    var pageContent = document.querySelector('.page__inner-wrap .page__content');
    if (!sidebar || !pageContent || !mapSidebar.parentNode) {
      return;
    }

    var placeholder = document.createElement('div');
    placeholder.className = 'author__map-sidebar-placeholder';
    placeholder.style.display = 'none';
    mapSidebar.parentNode.insertBefore(placeholder, mapSidebar);

    var matchMediaQuery = window.matchMedia('(max-width: 768px)');

    function moveMapAfterContent() {
      if (!pageContent || !mapSidebar) {
        return;
      }
      pageContent.insertAdjacentElement('afterend', mapSidebar);
      mapSidebar.classList.add('author__map-sidebar--after-content');
    }

    function moveMapBackToSidebar() {
      if (!placeholder.parentNode) {
        return;
      }
      placeholder.parentNode.insertBefore(mapSidebar, placeholder.nextSibling);
      mapSidebar.classList.remove('author__map-sidebar--after-content');
    }

    function applyPlacement(e) {
      if (e.matches) {
        moveMapAfterContent();
      } else {
        moveMapBackToSidebar();
      }
    }

    applyPlacement(matchMediaQuery);

    if (typeof matchMediaQuery.addEventListener === 'function') {
      matchMediaQuery.addEventListener('change', applyPlacement);
    } else if (typeof matchMediaQuery.addListener === 'function') {
      matchMediaQuery.addListener(applyPlacement);
    }
  });
})();
