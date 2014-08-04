(function() {

  function last(array) {
    return array.length ? array[array.length - 1] : undefined;
  }

  var Service = function($exceptionHandler, scope, $http, $templateCache,
      register, bootstack) {
    this.$bootstrap = function() {
      angular.forEach(bootstack, function(blade) {
        this.push(blade);
      }, this);
    };

    this.push = function(blade) {
      var options;

      if (!(options = register[blade])) {
        $exceptionHandler(Error('Blade [' + blade + '] is not registered.'));
        return;
      }

      var push =
        angular.bind(scope, scope.$emit,
          'blades:push', blade, options.controller);

      if (template = $templateCache.get(blade)) {
        push();
      } else {
        if (options.template) {
          $templateCache.put(blade, options.template);
          push();
        } else {
          $http.get(register[blade].templateUrl)
            .success(function(template) {
              $templateCache.put(blade, template);
              push();
            })
            .error(function(error) {
              error.message =
                'Blade [' + blade + '] could not be retrieved from server.\n' +
               error.message;
              $exceptionHandler(error);
            });
        }
      }
    };

    this.pop = function() {
      scope.$emit('blades:pop');
    };

    this.emptyTo = function(blade) {
      scope.$emit('blades:emptyTo', blade);
    };

    this.empty = function() {
      scope.$emit('blades:empty');
    };
  };

  var Provider = function() {
    var register = {};
    var bootstack = [];

    this.register = function(name, options) {
      register[name] = options;
      return this;
    };

    this.bootstrap = function(names) {
      var push = angular.bind(bootstack, Array.prototype.push);

      if (angular.isArray(names)) {
        angular.forEach(names, function(name) { push(name); });
      } else
        push(names);
    };

    this.$get =
        function($exceptionHandler, $rootScope, $http, $templateCache) {
      return new Service($exceptionHandler, $rootScope, $http, $templateCache,
        register, bootstack);
    };
  };

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

  angular.module('blades', [])
    .provider('blades', Provider)
    .controller('bladesController',
      ['$rootScope', '$scope', '$compile', '$controller', '$templateCache',
      'blades', Controller])
    .directive('blades', blades)
    .directive('blade', blade)
  ;  
}() ) ;
