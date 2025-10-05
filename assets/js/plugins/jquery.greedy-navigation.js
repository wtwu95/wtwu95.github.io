/*
* Greedy Navigation
*
* http://codepen.io/lukejacksonn/pen/PwmwWV
*
*/

var $nav = $('#site-nav');
var $btn = $('[data-nav-toggle]');
var $vlinks = $('#site-nav .visible-links');
var $hlinks = $('.greedy-nav__more .hidden-links');
var docClickHandler = null;
var resizeTimer;
var closeTimer = null;

function raf(callback) {
  if (typeof window.requestAnimationFrame === 'function') {
    window.requestAnimationFrame(callback);
    return;
  }

  window.setTimeout(callback, 16);
}

function cancelCloseHandlers() {
  if (closeTimer !== null) {
    window.clearTimeout(closeTimer);
    closeTimer = null;
  }

  $hlinks.off('transitionend.greedyNavVisibility');
}

function getVisibleItems() {
  return $vlinks.children();
}

function getHiddenItems() {
  return $hlinks.children();
}

var breaks = [];

function manageDocClickListener(shouldBind) {
  if(shouldBind) {
    if(!docClickHandler) {
      docClickHandler = function(event) {
        if(!$(event.target).closest('.greedy-nav__more').length) {
          setMenuOpen(false);
        }
      };
      $(document).on('click.greedyNavOutside', docClickHandler);
    }
  } else if(docClickHandler) {
    $(document).off('click.greedyNavOutside', docClickHandler);
    docClickHandler = null;
  }
}

function setMenuOpen(isOpen, options) {
  var settings = $.extend({ immediate: false }, options);

  cancelCloseHandlers();

  if (isOpen) {
    $hlinks.removeClass('hidden');

    var activate = function () {
      $hlinks.addClass('is-open');
    };

    if (settings.immediate) {
      activate();
    } else {
      raf(activate);
    }

    $hlinks.attr('aria-hidden', 'false');
  } else {
    $hlinks.removeClass('is-open');
    $hlinks.attr('aria-hidden', 'true');

    if (settings.immediate) {
      $hlinks.addClass('hidden');
    } else {
      $hlinks.on('transitionend.greedyNavVisibility', function (event) {
        if (event.target !== this) {
          return;
        }

        cancelCloseHandlers();
        $hlinks.addClass('hidden');
      });

      closeTimer = window.setTimeout(function () {
        cancelCloseHandlers();
        $hlinks.addClass('hidden');
      }, 250);
    }
  }

  $btn.toggleClass('close', isOpen);
  $btn.attr('aria-expanded', isOpen ? 'true' : 'false');
  manageDocClickListener(isOpen);
}

function updateNav() {

  var availableSpace = $nav.width();
  var $visibleItems = getVisibleItems();

  // The visible list is overflowing the nav
  if($vlinks.width() > availableSpace && $visibleItems.length) {

    // Record the width of the list
    breaks.push($vlinks.width());

    // Move item to the hidden list
    $visibleItems.last().prependTo($hlinks);

    // Show the dropdown btn
    if($btn.hasClass('hidden')) {
      $btn.removeClass('hidden');
      $btn.removeClass('close');
      $btn.attr('aria-expanded', 'false');
      $hlinks.attr('aria-hidden', 'true');
    }

  // The visible list is not overflowing
  } else {

    // There is space for another item in the nav
    if(breaks.length && availableSpace > breaks[breaks.length-1]) {

      // Move the item to the visible list
      var $hiddenItems = getHiddenItems();
      if ($hiddenItems.length) {
        $hiddenItems.first().appendTo($vlinks);
        breaks.pop();
      } else {
        breaks = [];
      }
    }

    // Hide the dropdown btn if hidden list is empty
    if(getHiddenItems().length < 1) {
      $btn.addClass('hidden');
      setMenuOpen(false, { immediate: true });
      $btn.attr('aria-expanded', 'false');
      breaks = [];
    }
  }

  // Keep counter updated
  $btn.attr("count", getHiddenItems().length);

  // Recur if the visible list is still overflowing the nav
  if($vlinks.width() > availableSpace && getVisibleItems().length) {
    updateNav();
  }

}

// Window listeners

$(window).on('resize', function() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
    if(typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(updateNav);
    } else {
      updateNav();
    }
  }, 150);
});

$btn.on('click', function() {
  var isHidden = $hlinks.hasClass('hidden');
  setMenuOpen(isHidden);
});

$btn.on('keydown', function(event) {
  if(event.key === 'Escape' || event.keyCode === 27) {
    setMenuOpen(false);
  }
});

updateNav();
