/* jshint boss: true */

var Service = function($exceptionHandler, scope, $q, $http, $templateCache,
    register, bootstack, padding) {

  this.$bootstrap = function() {
    angular.forEach(bootstack, function(blade) {
      this.push(blade);
    }, this);
  };

  this.push = function(blade, advance) {
    var options;

    if (!(options = register[blade])) {
      $exceptionHandler(Error('Blade [' + blade + '] is not registered.'));
      return;
    }

    var push = function() {
      scope.$emit('blades:push', blade, options.controller);
      if (advance)
        scope.$emit('blades:advance');
    };

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

  this.advance = function() {
    scope.$emit('blades:advance');
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
  var padding = 1;

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
  
  this.padding = function(px) {
    padding = px;
  };

  this.$get =
      function($exceptionHandler, $rootScope, $q, $http, $templateCache) {
    return new Service($exceptionHandler, $rootScope, $q, $http, $templateCache,
      register, bootstack, padding);
  };
};

angular.module('blades')
  .provider('blades', Provider)
;  
