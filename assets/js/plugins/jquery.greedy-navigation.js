/*
* Greedy Navigation
*
* http://codepen.io/lukejacksonn/pen/PwmwWV
*
*/

var $nav = $('#site-nav');
var $btn = $('.greedy-nav__toggle');
var $vlinks = $('#site-nav .visible-links');
var $hlinks = $('.greedy-nav__hidden-links');

function getVisibleItems() {
  return $vlinks.children();
}

function getHiddenItems() {
  return $hlinks.children();
}

function hideDropdown() {
  if ($hlinks.hasClass('hidden')) {
    return;
  }

  $hlinks.addClass('hidden');
  $btn.removeClass('close');
  $btn.attr('aria-expanded', 'false');
}

var breaks = [];

function updateNav() {
  var availableSpace = $nav.width();
  var $visibleItems = getVisibleItems();

  if ($vlinks.width() > availableSpace && $visibleItems.length) {
    breaks.push($vlinks.width());
    $visibleItems.last().prependTo($hlinks);

    if ($btn.hasClass('hidden')) {
      $btn.removeClass('hidden');
    }
  } else {
    if (breaks.length && availableSpace > breaks[breaks.length - 1]) {
      var $hiddenItems = getHiddenItems();
      if ($hiddenItems.length) {
        $hiddenItems.first().appendTo($vlinks);
        breaks.pop();
      } else {
        breaks = [];
      }
    }

    if (getHiddenItems().length < 1) {
      if (!$btn.hasClass('hidden')) {
        $btn.addClass('hidden');
      }
      hideDropdown();
      breaks = [];
    }
  }

  var hiddenCount = getHiddenItems().length;
  $btn.attr('count', hiddenCount);

  if ($vlinks.width() > availableSpace && getVisibleItems().length) {
    updateNav();
  }
}

$(window).on('resize orientationchange', function () {
  hideDropdown();
  updateNav();
});

$btn.on('click', function () {
  if (getHiddenItems().length < 1) {
    return;
  }

  var isHidden = $hlinks.hasClass('hidden');
  $hlinks.toggleClass('hidden');

  var isExpanded = isHidden && !$hlinks.hasClass('hidden');
  $(this).toggleClass('close', isExpanded);
  $(this).attr('aria-expanded', isExpanded);
});

hideDropdown();
updateNav();