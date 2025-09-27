/*
* Greedy Navigation
*
* http://codepen.io/lukejacksonn/pen/PwmwWV
*
*/

var $nav = $('#site-nav');
var $btn = $('#site-nav button');
var $vlinks = $('#site-nav .visible-links');
var $hlinks = $('#site-nav .hidden-links');

var breaks = [];

function updateNav() {
  var isMobile = window.matchMedia ? window.matchMedia('(max-width: 640px)').matches : window.innerWidth <= 640;
  var availableSpace = $btn.hasClass('hidden') ? $nav.width() : $nav.width() - $btn.width() - 30;
  var $movableItems = $vlinks.children(':not([data-static])');
  var $hiddenMovableItems = $hlinks.children(':not([data-static])');
  var hasStaticHiddenItems = $hlinks.children('[data-static]').length > 0;

  while ($movableItems.length && $vlinks.width() > availableSpace) {
    breaks.push($vlinks.width());
    $movableItems.last().prependTo($hlinks);
    $btn.removeClass('hidden');
    availableSpace = $nav.width() - $btn.width() - 30;
    $movableItems = $vlinks.children(':not([data-static])');
  }

  while (breaks.length && availableSpace > breaks[breaks.length - 1]) {
    if ($hiddenMovableItems.length) {
      $hiddenMovableItems.first().appendTo($vlinks);
      breaks.pop();
      availableSpace = $btn.hasClass('hidden') ? $nav.width() : $nav.width() - $btn.width() - 30;
      $hiddenMovableItems = $hlinks.children(':not([data-static])');
      continue;
    }

    breaks.pop();
  }

  if (!breaks.length && !(isMobile && hasStaticHiddenItems)) {
    $btn.addClass('hidden');
    $hlinks.addClass('hidden');
  } else {
    $btn.removeClass('hidden');
  }

  if (isMobile && hasStaticHiddenItems) {
    $btn.removeClass('hidden');
  }

  $btn.attr('count', breaks.length);
}

// Window listeners

$(window).resize(function() {
  updateNav();
});

$btn.on('click', function() {
  $hlinks.toggleClass('hidden');
  $(this).toggleClass('close');
});

updateNav();
