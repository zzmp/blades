angular.module('blades')
  .run(function() {
    // Don't break with in tests
    if (document) {
      var style = document.createElement('style');
      // Webkit compatibility
      style.appendChild(document.createTextNode(''));
      document.head.appendChild(style);
      
      var sheet = style.sheet;

      addRule = angular.bind(sheet,  addRule);
      addRule('.blades', [
        'display: -moz-flex',
        'display: -webkit-flex',
        'display: flex',
        'height: 100%',
        'overflow-y: hidden',
        'overflow-x: auto',
      ].join('; '));
      addRule('.blade', [
        'flex: none',
        'height: 100%',
        'overflow-y: scroll',
      ].join('; '));

      angular.forEach([10, 20, 30, 40, 50, 60, 70, 80, 90], function(height) {
        addRule('.blade' + height, 'height: ' + height + '%');
      });
    }
  })
;
