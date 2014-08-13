/* jshint boss: true */

var Service = function($exceptionHandler, scope, $q, $http, $templateCache,
    register, bootstack, padding) {
  var mark = {};

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
        'blades:push', blade, mark, options.controller);

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
    scope.$emit('blades:pop', mark);
  };

  this.emptyTo = function(blade) {
    scope.$emit('blades:emptyTo', blade, mark);
  };

  this.empty = function() {
    scope.$emit('blades:empty');
    mark = {};
  };

  this.resize = function() {
    var change = mark.blade.element[0].getBoundingClientRect().width - mark.blade.width;
    scope.$emit('blades:resize', change + padding);
    mark.blade.width += change;
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
