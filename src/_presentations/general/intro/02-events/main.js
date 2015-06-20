var Decode = require('./src/assets/scripts/main.js');
var $ = require('jquery');

// Split snippet into an element per line
var snippet = $('.code-snippet');
lines = snippet.text().split('\n');
snippet.html('');
lines.forEach(function (line, i) {
  if (line == '') {
    if (i === lines.length - 1) {
      return;
    }

    line = '&nbsp;';
  }
  snippet.append($('<div>').html(line));
});

Decode.addStarter();

Decode.presentation
  .step('.starter-slide', 'slide', { reverse: true })
  .milestone('Script');

function addSnippets(maxInd, firstInd) {
  var first = true;
  var children = snippet.children();
  maxInd = maxInd || children.length;
  firstInd = firstInd || 0;

  for (var i = firstInd; i < maxInd; i ++) {
    var el = children.get(i);
    var options = { start: 'with', delay: 20 };
    if (first) {
      options.start = 'step';
      options.delay = 0;
      first = false;
    }

    Decode.presentation.step(el, 'appear', options);
  }
}

$('.interactive-button').on('mousedown', function () {
  if (emit) {
    var emitter = $('<div class="emit-ball"></div>');
    $('.slide-interactive').append(emitter);
    emitter.on('animationend webkitAnimationEnd oanimationend MSAnimationend', function() {
      $(this).remove();
    });
  }
});

addSnippets();
Decode.presentation.step('.code-snippet > div', 'appear', { reverse: true });

addSnippets();
Decode.presentation.step('.code-snippet > div', 'appear', { reverse: true });

addSnippets(9);
addSnippets(14, 9);
addSnippets(20, 14);

Decode.presentation.step('.slide-interactive', 'slide', { from: 'right' }).milestone('events');

var emit = false;
Decode.presentation.step(function (context, callback) { emit = !context.reversed; callback(); });

Decode.presentation.step('.time-to-code', 'slide', { from: 'bottom' });
