(function () {
  'use strict';

  function getFallback(mapContainer) {
    if (!mapContainer) {
      return null;
    }

    return mapContainer.querySelector('[data-author-map-fallback]');
  }

  function showFallback(mapContainer) {
    if (!mapContainer) {
      return;
    }

    var fallback = getFallback(mapContainer);
    if (!fallback) {
      return;
    }

    fallback.style.display = '';
    fallback.removeAttribute('aria-hidden');
    mapContainer.classList.add('author-location-map--showing-fallback');
  }

  function hideFallback(mapContainer) {
    if (!mapContainer) {
      return;
    }

    var fallback = getFallback(mapContainer);
    if (!fallback) {
      return;
    }

    fallback.style.display = 'none';
    fallback.setAttribute('aria-hidden', 'true');
    mapContainer.classList.remove('author-location-map--showing-fallback');
  }

  function hasMapError(mapContainer) {
    if (!mapContainer) {
      return false;
    }

    return Boolean(mapContainer.querySelector('.gm-err-container, .gm-err-message'));
  }

  function registerAuthFailureHandler(mapContainer) {
    window.__authorLocationAuthHandlers = window.__authorLocationAuthHandlers || [];
    var handlers = window.__authorLocationAuthHandlers;

    if (mapContainer && handlers.indexOf(mapContainer) === -1) {
      handlers.push(mapContainer);
    }

    if (window.__authorLocationAuthFailureBound) {
      return;
    }

    window.__authorLocationAuthFailureBound = true;

    var previous = typeof window.gm_authFailure === 'function' ? window.gm_authFailure : null;

    window.gm_authFailure = function gmAuthFailure() {
      var containers = window.__authorLocationAuthHandlers || [];
      for (var i = 0; i < containers.length; i += 1) {
        showFallback(containers[i]);
      }

      if (previous) {
        try {
          previous.apply(this, arguments);
        } catch (error) {
          // Ignore errors from previously registered handlers
        }
      }
    };
  }

  function createInitializer(mapContainer, lat, lng, zoom, title) {
    return function initializeMap() {
      if (!window.google || !window.google.maps || !window.google.maps.Map) {
        return;
      }

      var center = { lat: lat, lng: lng };
      var map = new window.google.maps.Map(mapContainer, {
        zoom: zoom,
        center: center,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        clickableIcons: false
      });

      new window.google.maps.Marker({
        position: center,
        map: map,
        title: title
      });

      registerAuthFailureHandler(mapContainer);

      var mapHasTiles = false;

      window.google.maps.event.addListenerOnce(map, 'tilesloaded', function () {
        mapHasTiles = true;

        if (hasMapError(mapContainer)) {
          showFallback(mapContainer);
        } else {
          hideFallback(mapContainer);
        }
      });

      window.setTimeout(function () {
        if (!mapHasTiles || hasMapError(mapContainer)) {
          showFallback(mapContainer);
        }
      }, 4000);
      }
    };
  }

  function loadMapScript(apiKey, language) {
    var existingScript = document.querySelector('script[data-google-maps-api]');
    if (existingScript) {
      return existingScript;
    }

    var script = document.createElement('script');
    var scriptSrc = 'https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(apiKey) + '&callback=initAuthorLocationMap';
    if (language) {
      scriptSrc += '&language=' + encodeURIComponent(language);
    }
    script.src = scriptSrc;
    script.async = true;
    script.defer = true;
    script.setAttribute('data-google-maps-api', 'true');
    document.head.appendChild(script);
    return script;
  }

  function initLocationMap() {
    var mapContainer = document.querySelector('[data-author-map]');
    if (!mapContainer) {
      return;
    }

    var dataset = mapContainer.dataset || {};
    var lat = parseFloat(dataset.lat);
    var lng = parseFloat(dataset.lng);

    if (isNaN(lat) || isNaN(lng)) {
      return;
    }

    var zoom = parseInt(dataset.zoom, 10);
    if (isNaN(zoom)) {
      zoom = 14;
    }

    var title = dataset.markerTitle || '';
    var apiKey = dataset.apiKey;
    var language = dataset.language;
    if (!apiKey) {
      return;
    }

    var initializer = createInitializer(mapContainer, lat, lng, zoom, title);

    window.__authorLocationMapCallbacks = window.__authorLocationMapCallbacks || [];
    window.__authorLocationMapCallbacks.push(initializer);

    if (window.google && window.google.maps && window.google.maps.Map) {
      initializer();
      return;
    }

    if (typeof window.initAuthorLocationMap !== 'function') {
      window.initAuthorLocationMap = function initAuthorLocationMap() {
        var callbacks = window.__authorLocationMapCallbacks || [];
        while (callbacks.length > 0) {
          var callback = callbacks.shift();
          if (typeof callback === 'function') {
            callback();
          }
        }
      };
    }

    loadMapScript(apiKey, language);
  }

  function initMapHeightSync() {
    if (typeof window === 'undefined' || !window.document) {
      return;
    }

    var mapGroups = document.querySelectorAll('.author__maps');
    if (!mapGroups || !mapGroups.length) {
      return;
    }

    var raf = window.requestAnimationFrame || function (callback) {
      return window.setTimeout(callback, 16);
    };

    for (var i = 0; i < mapGroups.length; i += 1) {
      (function (group) {
        var visitorsFrame = group.querySelector('.author__map--visitors .author__map-frame');
        var locationFrame = group.querySelector('.author__map--location .author__map-frame');

        if (!visitorsFrame || !locationFrame) {
          return;
        }

        var updateScheduled = false;

        function applyHeight(height) {
          if (!height || !isFinite(height)) {
            return;
          }

          locationFrame.style.setProperty('--author-location-map-height', height + 'px');
        }

        function measureHeight() {
          updateScheduled = false;

          var height = visitorsFrame.getBoundingClientRect().height;

          if (!height) {
            var content = visitorsFrame.querySelector('div, iframe, object, img, embed');

            if (content) {
              height = content.getBoundingClientRect().height;
            }
          }

          if (height) {
            applyHeight(height);
          }
        }

        function scheduleMeasure() {
          if (updateScheduled) {
            return;
          }

          updateScheduled = true;
          raf(measureHeight);
        }

        if ('ResizeObserver' in window) {
          var resizeObserver = new window.ResizeObserver(function () {
            scheduleMeasure();
          });

          resizeObserver.observe(visitorsFrame);
        }

        if ('MutationObserver' in window) {
          var mutationObserver = new window.MutationObserver(function () {
            scheduleMeasure();
          });

          mutationObserver.observe(visitorsFrame, {
            childList: true,
            subtree: true,
            attributes: true
          });
        }

        window.addEventListener('resize', scheduleMeasure, { passive: true });
        window.addEventListener('load', scheduleMeasure, { passive: true });

        scheduleMeasure();
      })(mapGroups[i]);
    }
  }

  function init() {
    initLocationMap();
    initMapHeightSync();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
