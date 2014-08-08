/* jshint boss: true */

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

angular.module('blades')
  .provider('blades', Provider)
;  
