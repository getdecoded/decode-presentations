var Decode = window.decode;
var $ = require('jquery');

Decode.addStarter();

Decode.presentation
  .step('.starter-slide', 'slide', { reverse: true })
  .milestone('Road');

$('.road-container .building').css({ scale: 1.2, opacity: 0 });

Decode.presentation
  .step('.road-container .car', 'animatecss', { props: { opacity: 1, y: -200 } })
  .step('.road-container .car', 'animatecss', { props: { y: -600 }, duration: 1500 })
  .and('.road-label', 'fade', { delay: 1000 });

Decode.presentation.step('.road-container .building.first', 'animatecss', { props: { scale: 1, opacity: 1 } })
  .and('.road-container .building.second', 'animatecss', { props: { scale: 1, opacity: 1 }, delay: 200 });
