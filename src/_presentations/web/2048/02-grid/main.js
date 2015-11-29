var Decode = window.decode;
var $ = require('jquery');

Decode.addStarter();

function addTag(tag, first) {
  Decode.presentation
    .step(tag, 'toggleclass', { class: 'code-emphasis', start: !!first ? 'step' : 'with' })
    .step(tag, 'toggleclass', { class: 'code-emphasis' });
}

Decode.presentation
  .step('.starter-slide', 'slide', { reverse: true })

Decode.presentation
  .step('.css-example', 'appear')
  .milestone('css');

addTag('.css-selector', true);
addTag('.css-property');
addTag('.css-colon');
addTag('.css-value');
addTag('.css-semicolon');

Decode.presentation
  .step('.css-example', 'appear', { reverse: true });

Decode.presentation
  .step('.grid-example', 'slide', { from: 'right' })
  .milestone('Board')
  .step('.grid-example', 'toggleclass', { class: 'extra-view' })
  .step('.grid-example', 'toggleclass', { class: 'extra-view' })
  .step('.grid-example', 'toggleclass', { class: 'show-grid' })
  .step('.grid-example', 'toggleclass', { class: 'show-row' })
  .step('.grid-example', 'toggleclass', { class: 'show-item' })
  .step('.grid-example', 'slide', { from: 'left', reverse: true });
