/* eslint-disable */
var icon = require('vue-svgicon')
icon.register({
  'cart': {
    width: 16,
    height: 16,
    viewBox: '0 0 20 20',
    data: '<image x="1.011" y="1.48" width="17.23" height="16.957" image-rendering="optimizeSpeed" preserveAspectRatio="none" xlink:href="data:image/png;base64,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 AElFTkSuQmCC"/>'
  }
})
