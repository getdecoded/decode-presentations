var $ = require('jquery');
var Debut = require('debut');
var presentationElement = $('.presentation');
var Decode = { };

if (presentationElement.length > 0) {
  Decode.presentation = new Debut(presentationElement[0], {
    presenterUrl: '/presenter.html',
    clickToProceed: false,
    focusFlash: false,
    baseWidth: 1920
  });
}

Decode.addStarter = function addStarter() {
  Decode.presentation
    .step('.starter-slide .main-heading', 'fade', { reverse: true })
    .and('.starter-slide .main-logo', 'fade');
};

module.exports = Decode;
window.decode = Decode;
