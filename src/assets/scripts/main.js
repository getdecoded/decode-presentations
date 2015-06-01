var $ = require('jquery');
var Debut = require('debut');
var presentationElement = $('.presentation');
var Decode = { };

if (presentationElement.length > 0) {
  Decode.presentation = new Debut(presentationElement[0]);
}

module.exports = Decode;
