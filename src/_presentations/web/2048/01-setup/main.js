var Decode = window.decode;
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
