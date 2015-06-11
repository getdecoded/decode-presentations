var Decode = require('./src/assets/scripts/main.js');
var $ = require('jquery');

Decode.addStarter();

Decode.presentation
  .step('.starter-slide', 'slide', { reverse: true });



function addTag(tag, first) {
  Decode.presentation
    .step(tag, 'toggleclass', { class: 'code-emphasis', start: !!first ? 'step' : 'with' })
    .step(tag, 'toggleclass', { class: 'code-emphasis' });
}

Decode.presentation
  .step('.html-example', 'appear')
  .milestone('html');

addTag('.html-first-tag-name', true);
addTag('.html-content');
addTag('.html-end-tag-name');

Decode.presentation
  .and('.html-example .row-2', 'appear');

addTag('.html-self-tag-name', true);
addTag('.html-attr');
addTag('.html-attr-value');


Decode.presentation
  .step('.html-example', 'appear', { reverse: true })
  .step('.css-example', 'appear')
  .milestone('css');

addTag('.css-selector', true);
addTag('.css-property');
addTag('.css-colon');
addTag('.css-value');
addTag('.css-semicolon');

Decode.presentation
  .step('.css-example', 'appear', { reverse: true })

Decode.presentation.goTo('html');
