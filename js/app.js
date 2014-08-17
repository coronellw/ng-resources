var app = angular.module('myApp', ['ngRoute','ngResource']);

function appRouteConfig($routeProvider){
	$routeProvider
	.when('/',{
		controller: 'IndexController',
		templateUrl: 'chapters/main.html'
	})
	.when('/individual',{
		controller: 'IndividualController',
		templateUrl: 'chapters/individual.html'
	})
	.when('/grupal',{
		controller: 'GrupalController',
		templateUrl: 'chapters/grupal.html'
	})
	.otherwise({
		redirectTo: '/'
	});
}

app.config(appRouteConfig);