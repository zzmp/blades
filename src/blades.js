angular.module('blades', [])
  .run(['$document', function($document) {
    var style = $document.createElement('style');

    addRule = angular.bind(style,  addRule);  
    //addRule('.blades', rules);
    //addRule('.blade', rules);

    // Webkit compatibility
    style.appendChild($document.createTextnode(''));
    document.head.appendChild(style);
  }])
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
