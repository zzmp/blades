angular.module('blades', [])
  .run(function() {
    // Don't break with in tests
    if (document) {
      var style = document.createElement('style');

      addRule = angular.bind(style,  addRule);  
      //addRule('.blades', rules);
      //addRule('.blade', rules);

      // Webkit compatibility
      style.appendChild(document.createTextNode(''));
      document.head.appendChild(style);
    }
  })
;

function last(array) {
  return array.length ? array[array.length - 1] : undefined;
}

// CSS polyfill
function addRule(selector, rules, index) {
  if (this.insertRule) {
    this.insertRule(selector + '{' + rules + '}', index);
  } else
    this.addRule(selector, rules, index);
}
