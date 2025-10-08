/*
* Greedy Navigation
*
* http://codepen.io/lukejacksonn/pen/PwmwWV
*
*/

var $nav = $('#site-nav');
var $btn = $('[data-nav-toggle]');
var $more = $('.greedy-nav__more');
var $vlinks = $('#site-nav .visible-links');
var $hlinks = $('.greedy-nav__more .hidden-links');
var docClickHandler = null;
var resizeTimer;
var $liveRegion = $('<span />', {
  'class': 'sr-only greedy-nav__status',
  'aria-live': 'polite',
  'aria-atomic': 'true'
});

if($btn.length && !$btn.find('.greedy-nav__status').length) {
  $btn.append($liveRegion);
}
var isOpen = false;

function getVisibleItems() {
  return $vlinks.children();
}

function getHiddenItems() {
  return $hlinks.children();
}

var breaks = [];

function announceState() {
  if(!$btn.length) {
    return;
  }

  var statusMessage = isOpen ? 'Navigation menu expanded' : 'Navigation menu collapsed';
  $btn.attr('data-state', isOpen ? 'expanded' : 'collapsed');
  $btn.find('.greedy-nav__status').text(statusMessage);
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

function setMenuOpen(shouldOpen) {
  if(!$btn.length || !$hlinks.length) {
    return;
  }

  if($btn.hasClass('hidden') || getHiddenItems().length < 1) {
    shouldOpen = false;
  }

  if(isOpen === shouldOpen) {
    manageDocClickListener(isOpen);
    return;
  }

  isOpen = shouldOpen;
  $hlinks.toggleClass('hidden', !isOpen);
  $hlinks.attr('aria-hidden', isOpen ? 'false' : 'true');
  $btn.toggleClass('close', isOpen);
  $btn.attr('aria-expanded', isOpen ? 'true' : 'false');
  manageDocClickListener(isOpen);
  announceState();
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
      setMenuOpen(false);
      $hlinks.attr('aria-hidden', 'true');
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

function focusFirstHiddenLink() {
  var $focusable = $hlinks.find('a, button, [tabindex]').filter(':visible');
  if($focusable.length) {
    $focusable.first().focus();
  }
}

function focusLastHiddenLink() {
  var $focusable = $hlinks.find('a, button, [tabindex]').filter(':visible');
  if($focusable.length) {
    $focusable.last().focus();
  }
}

// Window listeners

$(window).on('resize.greedyNav', function() {
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
  setMenuOpen(!isOpen);
});

$btn.on('greedyNav:open', function() {
  setMenuOpen(true);
});

$btn.on('greedyNav:close', function() {
  setMenuOpen(false);
});

$btn.on('keydown', function(event) {
  if(event.key === 'Escape' || event.keyCode === 27) {
    setMenuOpen(false);
    return;
  }

  if(event.key === 'ArrowDown' || event.keyCode === 40) {
    if(!isOpen) {
      setMenuOpen(true);
    }
    focusFirstHiddenLink();
    event.preventDefault();
  }

  if(event.key === 'ArrowUp' || event.keyCode === 38) {
    if(!isOpen) {
      setMenuOpen(true);
    }
    focusLastHiddenLink();
    event.preventDefault();
  }
});

$hlinks.on('keydown', 'a, button, [tabindex]', function(event) {
  if(!isOpen) {
    return;
  }

  var $focusable = $hlinks.find('a, button, [tabindex]').filter(':visible');
  var $current = $(this);
  var currentIndex = $focusable.index($current);

  if(event.key === 'Escape' || event.keyCode === 27) {
    setMenuOpen(false);
    $btn.focus();
    return;
  }

  if(event.key === 'ArrowDown' || event.keyCode === 40) {
    event.preventDefault();
    $focusable.eq((currentIndex + 1) % $focusable.length).focus();
  }

  if(event.key === 'ArrowUp' || event.keyCode === 38) {
    event.preventDefault();
    $focusable.eq((currentIndex - 1 + $focusable.length) % $focusable.length).focus();
  }

  if(event.key === 'Home' || event.keyCode === 36) {
    event.preventDefault();
    focusFirstHiddenLink();
  }

  if(event.key === 'End' || event.keyCode === 35) {
    event.preventDefault();
    focusLastHiddenLink();
  }

  if(event.key === 'Tab') {
    var isShiftTab = !!event.shiftKey;
    if((!isShiftTab && currentIndex === $focusable.length - 1) || (isShiftTab && currentIndex === 0)) {
      setMenuOpen(false);
    }
  }
});

$more.on('focusin.greedyNav', function() {
  if(!isOpen) {
    setMenuOpen(true);
  }
});

$more.on('focusout.greedyNav', function(event) {
  var relatedTarget = event.relatedTarget || document.activeElement;
  if(!$more.has(relatedTarget).length) {
    setMenuOpen(false);
  }
});

announceState();
updateNav();
