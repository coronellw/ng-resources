var myDirectives = angular.module('wcgDirectives',[]);

myDirectives.directive('wcgDialog',[function(){
	var defDialog = {
		restrict: 'E',
		templateUrl: '../partials/dialog.html',
		replace: true
	};

	return defDialog;
}]);

myDirectives.directive('wcgExpander',[function(){
	return {
		restrict: 'EA',
		replace: true,
		transclude: true,
		scope: {title: "@expanderTitle"},
		templateUrl: '../partials/expander.html',
		link: function(scope, element, attrs){
			scope.showMe = false;

			scope.toggle = function(){
				scope.showMe = !scope.showMe;
			}
		}
	};
}]);