angular.module('blades', []);

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
function removeRule(index) {
  if (this.removeRule) {
    this.removeRule(index);
  } else
    this.deleteRule(index);
}
