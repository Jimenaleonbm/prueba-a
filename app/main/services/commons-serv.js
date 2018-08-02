'use strict';
angular.module('main')
  .service('$commons', function ($log) {

  var commons = this;

  commons.apply = function(scope){
    if (scope.$root && scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest')
      scope.$apply();
  };

});
