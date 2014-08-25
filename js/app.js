var app = angular.module('myApp', ['ngRoute','ngResource']);

function appRouteConfig($routeProvider){
	$routeProvider
	.when('/',{
		controller: 'IndexController',
		templateUrl: 'chapters/main.html'
	})
	.when('/personas/update/:personId',{
		controller: 'CreateController',
		resolve : {
			persona: function(PersonLoader){
				return PersonLoader();
			}
		},
		templateUrl: 'chapters/create.html'
	})
	.when('/personas/new',{
		controller: 'CreateController',
		resolve : {
			persona: function(API){
				return new API.Personas();
			}
		},
		templateUrl: 'chapters/create.html'
	})
	.when('/individual',{
		controller: 'IndividualController',
		resolve : {
			persona: function(){return {};}
		},
		templateUrl: 'chapters/individual.html'
	})
	.when('/individual/:personId',{
		controller: 'IndividualController',
		resolve : {
			persona : function(PersonLoader){
				return PersonLoader();
			}
		},
		templateUrl: 'chapters/individual.html'
	})
	.when('/grupal',{
		controller: 'GrupalController',
		resolve : {
			personas : function(PeopleLoader){
				return PeopleLoader();
			}
		},
		templateUrl: 'chapters/grupal.html'
	})
	.otherwise({
		redirectTo: '/'
	});
}

app.config(appRouteConfig);