var setWidth;

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
        'height: 100%',
        'overflow-y: hidden',
        'overflow-x: auto',
      ].join('; '));
      addRule('.blade', [
        'height: 100%',
        'overflow-y: scroll',
        'float: left',
        'display: inline-box',
      ].join('; '));

      angular.forEach([10, 20, 30, 40, 50, 60, 70, 80, 90], function(height) {
        addRule('.blade' + height, 'height: ' + height + '%');
      });

      setWidth = function(px) {
        removeRule.call(sheet, 0);
        addRule('.blades', 'width: ' + px + 'px');
      };
    }
  })
;
