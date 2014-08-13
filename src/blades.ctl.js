 /* jshint boss: true */

var Controller =
    function($rootScope, $scope, $compile, $controller, $templateCache,
      $blades) {
  var blades = [];
  var right = 0;
  var parent;

  this.link = function(element) {
    parent = element;
  };

  this.$bootstrap = function() {
    $blades.$bootstrap();
  };

  var pop = function(blade) {
    right = blade.element[0].getBoundingClientRect().left;

    blade.element.remove();
    blade.scope.$destroy();
    blades.pop();

    setWidth(right);
  };

  $rootScope.$on('blades:push', function(e, blade, mark, controller) {
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

    newBlade.width = newBlade.element[0].getBoundingClientRect().width;
    right += newBlade.width;
    setWidth(right);

    mark.blade = newBlade;

    e.stopPropagation();
  });

  $rootScope.$on('blades:pop', function(e, mark) {
    var blade;

    if (blade = last(blades))
      pop(blade);

    mark.blade = last(blades);

    e.stopPropagation();
  });

  $rootScope.$on('blades:emptyTo', function(e, name, mark) {
    var blade;

    while(blade = last(blades)) {
      if (blade.name === name)
        break;
      pop(blade);
    }

    mark.blade = blade;

    e.stopPropagation();
  });

  $rootScope.$on('blades:empty', function(e) {
    var blade;
    
    while (blade = last(blades))
      pop(blade);

    e.stopPropagation();
  });

  $rootScope.$on('blades:resize', function(e, change) {
    right += change;
    setWidth(right);

    e.stopPropagation();
  });
};

angular.module('blades')
  .controller('bladesController',
    ['$rootScope', '$scope', '$compile', '$controller', '$templateCache',
    'blades', Controller])
;  
