 /* jshint boss: true */

var Controller =
    function($rootScope, $scope, $compile, $controller, $templateCache,
      $blades) {
  var blades = [];
  var parent;

  this.link = function(element) {
    parent = element;
  };

  this.$bootstrap = function() {
    $blades.$bootstrap();
  };

  var pop = function(blade) {
    blade.element.remove();
    blade.scope.$destroy();
    blades.pop();
  };

  $rootScope.$on('blades:push', function(e, blade, controller) {
    var lastBlade = last(blades);
    var scope, element;

    var newBlade = {
      name: blade,
      scope: scope = (lastBlade ? lastBlade.scope : $scope).$new()
    };
    
    newBlade.element = element = controller ?
        $compile($templateCache.get(blade))
          (scope, null, $controller(controller, {$scope: scope})) :
        $compile($templateCache.get(blade))(scope);

    parent.append(element);
    blades.push(newBlade);

    e.stopPropagation();
  });

  $rootScope.$on('blades:pop', function(e) {
    var blade;

    if (blade = last(blades))
      pop(blade);

    e.stopPropagation();
  });

  $rootScope.$on('blades:emptyTo', function(e, name) {
    var blade;

    while(blade = last(blades)) {
      if (blade.name === name)
        break;
      pop(blade);
    }

    e.stopPropagation();
  });

  $rootScope.$on('blades:empty', function(e) {
    var blade;
    
    while (blade = last(blades))
      pop(blade);

    e.stopPropagation();
  });
};

angular.module('blades')
  .controller('bladesController',
    ['$rootScope', '$scope', '$compile', '$controller', '$templateCache',
    'blades', Controller])
;  
