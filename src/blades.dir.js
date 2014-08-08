/* jshint shadow: true */

var blades = function() {
  return {
    restrict: 'EA',
    transclude: false,
    replace: true,
    template: '<div class="blades" />',
    controller: 'bladesController',
    link: function(_, element, _, ctrl) {
      ctrl.link(element);
      ctrl.$bootstrap();
    }
  };
};

var blade = function() {
  return {
    require: '^blades',
    restrict: 'E',
    transclude: true,
    replace: true,
    template: '<div class="blade" ng-transclude />'
  };
};

angular.module('blades')
  .directive('blades', blades)
  .directive('blade', blade)
;  
