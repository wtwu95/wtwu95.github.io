(function () {
  'use strict';

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
    };
  }

  function loadMapScript(apiKey) {
    var existingScript = document.querySelector('script[data-google-maps-api]');
    if (existingScript) {
      return existingScript;
    }

    var script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(apiKey) + '&callback=initAuthorLocationMap';
    script.async = true;
    script.defer = true;
    script.setAttribute('data-google-maps-api', 'true');
    document.head.appendChild(script);
    return script;
  }

  function init() {
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

    loadMapScript(apiKey);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
