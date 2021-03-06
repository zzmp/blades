var duScrollDefaultEasing=function(e){"use strict";return.5>e?Math.pow(2*e,2)/2:1-Math.pow(2*(1-e),2)/2};angular.module("duScroll",["duScroll.scrollspy","duScroll.smoothScroll","duScroll.scrollContainer","duScroll.spyContext","duScroll.scrollHelpers"]).value("duScrollDuration",350).value("duScrollSpyWait",100).value("duScrollGreedy",!1).value("duScrollEasing",duScrollDefaultEasing),angular.module("duScroll.scrollHelpers",["duScroll.requestAnimation"]).run(["$window","$q","cancelAnimation","requestAnimation","duScrollEasing",function(e,t,n,r,o){"use strict";var l=angular.element.prototype,i=function(e){return"undefined"!=typeof HTMLDocument&&e instanceof HTMLDocument||e.nodeType&&e.nodeType===e.DOCUMENT_NODE},u=function(e){return"undefined"!=typeof HTMLElement&&e instanceof HTMLElement||e.nodeType&&e.nodeType===e.ELEMENT_NODE},c=function(e){return u(e)||i(e)?e:e[0]};l.scrollTo=function(t,n,r){var o;if(angular.isElement(t)?o=this.scrollToElement:r&&(o=this.scrollToAnimated),o)return o.apply(this,arguments);var l=c(this);return i(l)?e.scrollTo(t,n):(l.scrollLeft=t,void(l.scrollTop=n))};var a,s;l.scrollToAnimated=function(e,l,i,u){i&&!u&&(u=o);var c=this.scrollLeft(),d=this.scrollTop(),f=Math.round(e-c),p=Math.round(l-d),m=null,g=this,v="scroll mousedown mousewheel touchmove keydown",y=function(e){(!e||e.which>0)&&(g.unbind(v,y),n(a),s.reject(),a=null)};if(a&&y(),s=t.defer(),!f&&!p)return s.resolve(),s.promise;var h=function(e){null===m&&(m=e);var t=e-m,n=t>=i?1:u(t/i);g.scrollTo(c+Math.ceil(f*n),d+Math.ceil(p*n)),1>n?a=r(h):(g.unbind(v,y),a=null,s.resolve())};return g.scrollTo(c,d),g.bind(v,y),a=r(h),s.promise},l.scrollToElement=function(e,t,n,r){var o=c(this),l=this.scrollTop()+c(e).getBoundingClientRect().top-(t||0);return u(o)&&(l-=o.getBoundingClientRect().top),this.scrollTo(0,l,n,r)};var d={scrollLeft:function(t,n,r){if(angular.isNumber(t))return this.scrollTo(t,this.scrollTop(),n,r);var o=c(this);return i(o)?e.scrollX||document.documentElement.scrollLeft||document.body.scrollLeft:o.scrollLeft},scrollTop:function(t,n,r){if(angular.isNumber(t))return this.scrollTo(this.scrollTop(),t,n,r);var o=c(this);return i(o)?e.scrollY||document.documentElement.scrollTop||document.body.scrollTop:o.scrollTop}},f=function(e,t){return function(n,r){return r?t.apply(this,arguments):e.apply(this,arguments)}};for(var p in d)l[p]=l[p]?f(l[p],d[p]):d[p]}]),angular.module("duScroll.polyfill",[]).factory("polyfill",["$window",function(e){"use strict";var t=["webkit","moz","o","ms"];return function(n,r){if(e[n])return e[n];for(var o,l=n.substr(0,1).toUpperCase()+n.substr(1),i=0;i<t.length;i++)if(o=t[i]+l,e[o])return e[o];return r}}]),angular.module("duScroll.requestAnimation",["duScroll.polyfill"]).factory("requestAnimation",["polyfill","$timeout",function(e,t){"use strict";var n=0,r=function(e){var r=(new Date).getTime(),o=Math.max(0,16-(r-n)),l=t(function(){e(r+o)},o);return n=r+o,l};return e("requestAnimationFrame",r)}]).factory("cancelAnimation",["polyfill","$timeout",function(e,t){"use strict";var n=function(e){t.cancel(e)};return e("cancelAnimationFrame",n)}]),angular.module("duScroll.spyAPI",["duScroll.scrollContainerAPI"]).factory("spyAPI",["$rootScope","$timeout","scrollContainerAPI","duScrollGreedy","duScrollSpyWait",function(e,t,n,r,o){"use strict";var l=function(n){var l=!1,i=!1,u=function(){i=!1;var t=n.container,o=t[0],l=0;("undefined"!=typeof HTMLElement&&o instanceof HTMLElement||o.nodeType&&o.nodeType===o.ELEMENT_NODE)&&(l=o.getBoundingClientRect().top);var u,c,a,s,d,f;for(s=n.spies,c=n.currentlyActive,a=void 0,u=0;u<s.length;u++)d=s[u],f=d.getTargetPosition(),f&&f.top+d.offset-l<20&&-1*f.top+l<f.height&&(!a||a.top<f.top)&&(a={top:f.top,spy:d});a&&(a=a.spy),c===a||r&&!a||(c&&(c.$element.removeClass("active"),e.$broadcast("duScrollspy:becameInactive",c.$element)),a&&(a.$element.addClass("active"),e.$broadcast("duScrollspy:becameActive",a.$element)),n.currentlyActive=a)};return o?function(){l?i=!0:(u(),l=t(function(){l=!1,i&&u()},o))}:u},i={},u=function(e){var t=e.$id,n={spies:[]};return n.handler=l(n),i[t]=n,e.$on("$destroy",function(){c(e)}),t},c=function(e){var t=e.$id,n=i[t],r=n.container;r&&r.off("scroll",n.handler),delete i[t]},a=u(e),s=function(e){return i[e.$id]?i[e.$id]:e.$parent?s(e.$parent):i[a]},d=function(e){var t,n,r=e.$element.scope();if(r)return s(r);for(n in i)if(t=i[n],-1!==t.spies.indexOf(e))return t},f=function(e){for(;e.parentNode;)if(e=e.parentNode,e===document)return!0;return!1},p=function(e){var t=d(e);d(e).spies.push(e),t.container&&f(t.container)||(t.container&&t.container.off("scroll",t.handler),t.container=n.getContainer(e.$element.scope()),t.container.on("scroll",t.handler).triggerHandler("scroll"))},m=function(e){var t=d(e);e===t.currentlyActive&&(t.currentlyActive=null);var n=t.spies.indexOf(e);-1!==n&&t.spies.splice(n,1)};return{addSpy:p,removeSpy:m,createContext:u,destroyContext:c,getContextForScope:s}}]),angular.module("duScroll.scrollContainerAPI",[]).factory("scrollContainerAPI",["$document",function(e){"use strict";var t={},n=function(e,n){var r=e.$id;return t[r]=n,r},r=function(e){return t[e.$id]?e.$id:e.$parent?r(e.$parent):void 0},o=function(n){var o=r(n);return o?t[o]:e},l=function(e){var n=r(e);n&&delete t[n]};return{getContainerId:r,getContainer:o,setContainer:n,removeContainer:l}}]),angular.module("duScroll.smoothScroll",["duScroll.scrollHelpers","duScroll.scrollContainerAPI"]).directive("duSmoothScroll",["duScrollDuration","scrollContainerAPI",function(e,t){"use strict";return{link:function(n,r,o){r.on("click",function(r){if(o.href&&-1!==o.href.indexOf("#")){var l=document.getElementById(o.href.replace(/.*(?=#[^\s]+$)/,"").substring(1));if(l&&l.getBoundingClientRect){r.stopPropagation&&r.stopPropagation(),r.preventDefault&&r.preventDefault();var i=o.offset?parseInt(o.offset,10):0,u=o.duration?parseInt(o.duration,10):e,c=t.getContainer(n);c.scrollToElement(angular.element(l),isNaN(i)?0:i,isNaN(u)?0:u)}}})}}}]),angular.module("duScroll.spyContext",["duScroll.spyAPI"]).directive("duSpyContext",["spyAPI",function(e){"use strict";return{restrict:"A",scope:!0,compile:function(){return{pre:function(t){e.createContext(t)}}}}}]),angular.module("duScroll.scrollContainer",["duScroll.scrollContainerAPI"]).directive("duScrollContainer",["scrollContainerAPI",function(e){"use strict";return{restrict:"A",scope:!0,compile:function(){return{pre:function(t,n,r){r.$observe("duScrollContainer",function(r){angular.isString(r)&&(r=document.getElementById(r)),r=angular.isElement(r)?angular.element(r):n,e.setContainer(t,r),t.$on("$destroy",function(){e.removeContainer(t)})})}}}}}]),angular.module("duScroll.scrollspy",["duScroll.spyAPI"]).directive("duScrollspy",["spyAPI","$timeout","$rootScope",function(e,t,n){"use strict";var r=function(e,t,n){angular.isElement(e)?this.target=e:angular.isString(e)&&(this.targetId=e),this.$element=t,this.offset=n};return r.prototype.getTargetElement=function(){return!this.target&&this.targetId&&(this.target=document.getElementById(this.targetId)),this.target},r.prototype.getTargetPosition=function(){var e=this.getTargetElement();return e?e.getBoundingClientRect():void 0},r.prototype.flushTargetCache=function(){this.targetId&&(this.target=void 0)},{link:function(o,l,i){var u,c=i.ngHref||i.href;c&&-1!==c.indexOf("#")?u=c.replace(/.*(?=#[^\s]+$)/,"").substring(1):i.duScrollspy&&(u=i.duScrollspy),u&&t(function(){var t=new r(u,l,-(i.offset?parseInt(i.offset,10):0));e.addSpy(t),o.$on("$destroy",function(){e.removeSpy(t)}),o.$on("$locationChangeSuccess",t.flushTargetCache.bind(t)),n.$on("$stateChangeSuccess",t.flushTargetCache.bind(t))},0)}}}]);
//# sourceMappingURL=angular-scroll.min.js.map
(function(angular) {

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

angular.module('blades')
  .run(function() {
    // Don't break with in tests
    if (document) {
      var style = document.createElement('style');
      // Webkit compatibility
      style.appendChild(document.createTextNode(''));
      document.head.appendChild(style);
      
      var sheet = style.sheet;

      addRule = angular.bind(sheet,  addRule);
      addRule('.blades', [
        'display: -moz-flex',
        'display: -webkit-flex',
        'display: flex',
        'height: 100%',
        'overflow-y: hidden',
        'overflow-x: auto',
      ].join('; '));
      addRule('.blade', [
        'flex: none',
        'height: 100%',
        'overflow-y: scroll',
      ].join('; '));

      angular.forEach([10, 20, 30, 40, 50, 60, 70, 80, 90], function(height) {
        addRule('.blade' + height, 'height: ' + height + '%');
      });
    }
  })
;

 /* jshint boss: true */

var Controller =
    function($rootScope, $scope, $compile, $controller, $templateCache, $timeout,
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

  $rootScope.$on('blades:advance', function(e) {
    /* Ensure that blades are only advanced after the $digest loop
     * This allows lists to be filled with ngRepeat, etc.
     */
    $timeout(function() {
      var blade = last(blades);
      if (!blade)
        // No blades
        return;

      var bladesEl = blade.element.parent()[0];

      // TODO: Animate the scroll
      bladesEl.scrollLeft +=
        blade.element[0].getClientRects()[0].left -
        bladesEl.getClientRects()[0].left;

      e.stopPropagation();
    }, 0, false);
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
    ['$rootScope', '$scope', '$compile', '$controller', '$templateCache', '$timeout',
    'blades', Controller])
;  

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

}(angular) );
