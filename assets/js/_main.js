$(document).ready(function () {
  'use strict';

  var requestFrame =
    window.requestAnimationFrame ||
    function (callback) {
      return window.setTimeout(callback, 16);
    };
  var cancelFrame = window.cancelAnimationFrame || window.clearTimeout;

  var $window = $(window);
  var $body = $('body');
  var $footer = $('.page__footer');
  var $authorWrapper = $('.author__urls-wrapper');
  var $authorButton = $authorWrapper.find('button');
  var $authorUrls = $('.author__urls');
  var $main = $('#main');
  var $sticky = $('.sticky');

  var stickyfill = typeof Stickyfill !== 'undefined' ? Stickyfill : null;
  var hasSmoothScroll = typeof $.fn.smoothScroll === 'function';
  var hasMagnificPopup = typeof $.fn.magnificPopup === 'function';

  var isSidebarVisible = null;
  var resizeFrame = null;

  function updateFooterSpacing() {
    if (!$footer.length) {
      $body.css('margin-bottom', '');
      return;
    }

    $body.css('margin-bottom', $footer.outerHeight(true));
  }

  function matchDesktopQuery() {
    if (typeof window.matchMedia === 'function') {
      return window.matchMedia('(min-width: 926px)').matches;
    }

    return $window.width() > 925;
  }

  function shouldShowSidebar() {
    if (!$authorUrls.length) {
      return false;
    }

    if (!$authorButton.length) {
      return matchDesktopQuery();
    }

    return !$authorButton.is(':visible');
  }

  function applyStickyState(shouldEnable) {
    if (!stickyfill) {
      return;
    }

    if (shouldEnable) {
      if (typeof stickyfill.rebuild === 'function') {
        stickyfill.rebuild();
      }

      if (typeof stickyfill.init === 'function') {
        stickyfill.init();
      }

      return;
    }

    if (typeof stickyfill.stop === 'function') {
      stickyfill.stop();
    }
  }

  function updateStickySidebar(force) {
    if (!$authorUrls.length) {
      return;
    }

    var shouldShow = shouldShowSidebar();

    if (!force && shouldShow === isSidebarVisible) {
      return;
    }

    isSidebarVisible = shouldShow;
    applyStickyState(shouldShow);

    if (shouldShow) {
      $authorUrls.stop(true, true).show();
    } else {
      $authorUrls.stop(true, true).hide();
    }
  }

  function handleResize() {
    updateFooterSpacing();
    updateStickySidebar(false);
  }

  function scheduleResize() {
    if (resizeFrame !== null) {
      cancelFrame(resizeFrame);
    }

    resizeFrame = requestFrame(function () {
      resizeFrame = null;
      handleResize();
    });
  }

  updateFooterSpacing();
  updateStickySidebar(true);

  if ($footer.length) {
    $window.on('load', updateFooterSpacing);
  }

  $window.on('resize orientationchange', scheduleResize);

  if ($authorButton.length) {
    $authorButton.on('click', function () {
      $authorUrls.stop(true, true).fadeToggle('fast');
      $authorButton.toggleClass('open');
    });
  }

  if ($main.length && typeof $main.fitVids === 'function') {
    $main.fitVids();
  }

  if ($sticky.length && typeof $sticky.Stickyfill === 'function') {
    $sticky.Stickyfill();
  }

  if (hasSmoothScroll) {
    $('a').smoothScroll({ offset: -20 });
  }

  var $imageLinks = $(
    "a[href$='.jpg'],a[href$='.jpeg'],a[href$='.JPG'],a[href$='.png'],a[href$='.gif']"
  );

  if ($imageLinks.length) {
    $imageLinks.addClass('image-popup');
  }

  if (hasMagnificPopup) {
    var $popups = $('.image-popup');

    if ($popups.length) {
      $popups.magnificPopup({
        type: 'image',
        tLoading: 'Loading image #%curr%...',
        gallery: {
          enabled: true,
          navigateByImgClick: true,
          preload: [0, 1],
        },
        image: {
          tError: '<a href="%url%">Image #%curr%</a> could not be loaded.',
        },
        removalDelay: 500,
        mainClass: 'mfp-zoom-in',
        callbacks: {
          beforeOpen: function () {
            this.st.image.markup = this.st.image.markup.replace(
              'mfp-figure',
              'mfp-figure mfp-with-anim'
            );
          },
        },
        closeOnContentClick: true,
        midClick: true,
      });
    }
  }
});
