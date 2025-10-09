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
var transitionEndHandler = null;

function getVisibleItems() {
  return $vlinks.children();
}

function getHiddenItems() {
  return $hlinks.children();
}

var breaks = [];

function clearCloseHandlers() {
  if (transitionEndHandler) {
    $hlinks.off('transitionend.greedyNav', transitionEndHandler);
    transitionEndHandler = null;
  }

  if (closeTimer) {
    window.clearTimeout(closeTimer);
    closeTimer = null;
  }
}

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
  var settings = $.extend({ animate: true }, options || {});
  var shouldAnimate = settings.animate !== false;

  if(isOpen) {
    clearCloseHandlers();
    $hlinks.removeClass('hidden');

    if(shouldAnimate && typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(function() {
        $hlinks.addClass('is-open');
      });
    } else if(shouldAnimate) {
      window.setTimeout(function() {
        $hlinks.addClass('is-open');
      }, 16);
    } else {
      $hlinks.addClass('is-open');
    }

    $hlinks.attr('aria-hidden', 'false');
    $btn.addClass('close');
    $btn.attr('aria-expanded', 'true');
    manageDocClickListener(true);
    return;
  }

  $btn.removeClass('close');
  $btn.attr('aria-expanded', 'false');
  manageDocClickListener(false);

  $hlinks.attr('aria-hidden', 'true');

  clearCloseHandlers();

  function finalizeClose() {
    clearCloseHandlers();
    $hlinks.addClass('hidden');
  }

  if(!shouldAnimate) {
    $hlinks.removeClass('is-open');
    finalizeClose();
    return;
  }

  if($hlinks.hasClass('is-open') && $hlinks.is(':visible')) {
    transitionEndHandler = function(event) {
      if(event.target !== $hlinks[0]) {
        return;
      }

      var propertyName = event.originalEvent ? event.originalEvent.propertyName : event.propertyName;

      if(propertyName && propertyName !== 'opacity') {
        return;
      }

      finalizeClose();
    };

    $hlinks.on('transitionend.greedyNav', transitionEndHandler);

    closeTimer = window.setTimeout(finalizeClose, 250);

    // Force reflow to help the transition trigger consistently
    void $hlinks[0].offsetWidth;

    $hlinks.removeClass('is-open');
  } else {
    $hlinks.removeClass('is-open');
    finalizeClose();
  }
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
      setMenuOpen(false, { animate: false });
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
