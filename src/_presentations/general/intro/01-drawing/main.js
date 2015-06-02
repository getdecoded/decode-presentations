var Decode = require('./src/assets/scripts/main.js');
var $ = require('jquery');

Decode.addStarter();

Decode.presentation
  .step('.starter-slide', 'slide', { reverse: true })
  .milestone('Mystery');

var rows = 4;
var cols = 8;

for (var i = 0; i < rows; i ++) {
  for (var n = 0; n < cols; n ++) {
    var circle = $('<div class="complexity-circle"></div>').appendTo($('.computer-mystery'));
    circle.css({
      x: (n - (cols - 1) / 2) * 80,
      y: (i - (rows - 1) / 2) * 80,
      scale: 0
    });

    var options = {
      entrance: true,
      props: {
        scale: 1
      },
      start: 'with',
      delay: 20,
      duration: 200
    };

    if ((i == 0) && (n == 0)) {
      options.delay = 0;
      options.start = 'step';
      circle.addClass('first-circle');
    }

    Decode.presentation.step(circle, 'animatecss', options);
  }
}

// Complexity Circles
Decode.presentation
  .step('.computer-mystery', 'toggleclass', { class: 'cycling' })
  .step('.complexity-circle', 'animatecss', {
    props: { x: 0 }
  })
  .step('.complexity-circle', 'animatecss', {
    props: { y: 0 }
  })
    .and('.complexity-circle:not(.first-circle)', 'animatecss', {
      props: { scale: 0 }
    })
    .and('.first-circle', 'animatecss', { props: { scale: 8 } })
    .and('.computer-mystery .instructions-text', 'fade', {
      duration: 200,
      delay: 300
    })
  .step('.instructions-example', 'slide', { from: 'bottom' });

// Instructions
var topRight = {
  x: 200,
  y: -100
};

var bottomLeft = {
  x: -150,
  y: 150
};

var middleRight = {
  x: 100,
  y: 40
};

$('.instructions-token.top-right').css(topRight);
$('.instructions-token.bottom-left').css(bottomLeft);
$('.instructions-token.middle-right').css(middleRight);

var changeGrammar = function (context, callback) {
  if (context.direction === 1) {
    context.$element.text('grammar');
  } else {
    context.$element.text('syntax');
  }
  callback();
};

Decode.presentation.milestone('Instructions')
  .step('.instructions-example .example-text', 'animatecss', { props: { opacity: 0.5 } })
    .and('.instructions-robot', 'fade')
  .step('.instructions-token.top-right', 'fade')
    .and('.i-1', 'fade')
  .step('.instructions-robot', 'animatecss', { props: { x: topRight.x, y: topRight.y } })
    .and('.i-2', 'fade')
  .step('.instructions-token.top-right', 'fade', { reverse: true })
    .and('.i-3', 'fade')
  .step('.instructions-group', 'toggleclass', { class: 'looped' })
    .and('.i-cycle', 'fade')
  .step('.instructions-token.bottom-left', 'fade')
    .then('.instructions-robot', 'animatecss', { props: { x: bottomLeft.x, y: bottomLeft.y } })
    .then('.instructions-token.bottom-left', 'fade', { reverse: true })
  .step('.instructions-token.middle-right', 'fade')
    .then('.instructions-robot', 'animatecss', { props: { x: middleRight.x, y: middleRight.y } })
    .then('.instructions-token.middle-right', 'fade', { reverse: true })
  .step('.instructions-robot, .instructions-example .example-text', 'slide', { reverse: true })
    .and('.instructions', 'animatecss', { props: { x: 150, y: 100, scale: 1.5 } })
  .milestone('Instructions Over')
  .step('.grammar-slide', 'slide', { from: 'top' })
    .and('.instructions', 'slide', { from: 'bottom', reverse: true })
  .step('.grammar', changeGrammar, { duration: 0 })
  .step('.time-to-code', 'appear');






