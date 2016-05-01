angular.module("MyApp", ["appRoutes", "ngMessages", "mainCtrl", "authService", "userCtrl", "userService", "diaryService", "diaryCtrl", "ngAnimate"])
.config(function($httpProvider){
	$httpProvider.interceptors.push("AuthInterceptor");
})
.filter('offset', function() {
  return function(input, start) {
    start = parseInt(start, 10);
    return input.slice(start);
  };
})
.directive('inputFocus', function () {
	return {
	  restrict: 'A',
	  priority: 0,
	  link: function (scope, element, attrs, ctrl) {
	    element.bind('focus',function () {
	      element.parent().addClass("has-focus");    
	    });
	    /*.bind('blur', function () { console.log(element);
	      element.parent().removeClass("has-focus");
	    });*/
	    
	  }
	};
})
.directive('formAutofillFix', function() {
  return function(scope, elem, attrs) {
    // Fixes Chrome bug: https://groups.google.com/forum/#!topic/angular/6NlucSskQjY
    elem.prop('method', 'POST');

    // Fix autofill issues where Angular doesn't know about autofilled inputs
    if(attrs.ngSubmit) {
      setTimeout(function() {
        elem.off('submit').submit(function(e) {
          e.preventDefault();
          elem.find('input, textarea, select').trigger('input').trigger('change').trigger('keydown');
          scope.$apply(attrs.ngSubmit);
        });
      }, 0);
    }
  };
});
$(document).ready(function(){
   //working
  
});