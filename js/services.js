var service = angular.module('exampleService',['ngResource']);

service.factory('Topics', function(){
	var topics = {};
	topics.allTopics = [
		{url:"/", name: "index"},
		{url:"/personas/new", name: "Agregar persona"},
		{url:"individual", name: "Buscar persona"},
		{url:"grupal", name: "Listar personas"},
		{url:"directives", name: "Cool stuffs"}
	];
	return topics;
});

service.factory('API', ['$resource', function($resource){
	return {
		Personas: $resource('api/personas/:id',{id: '@id'}, {
			byName: {
				method: "GET",
				params: {name: "@name"},
				url: "api/personas/:name/byName",
				isArray: true
			}
		}),
		TiposContacto: $resource('api/tiposContacto/:id',{id:'@id'}),
		Contactos: $resource('api/contactos/:id',{id:'@id'})
	};
}]);



service.factory('PeopleLoader', ['API','$q',
	function(API, $q){
		return function(){
			var delay = $q.defer();
			API.Personas.query(function(people){
							delay.resolve(people);
						}, function(){
							delay.reject('unable to fetch people');
						});
			return delay.promise;
		}
	}]);

service.factory('PersonLoader',['API','$q', '$route',
	function(API, $q, $route){
		return function(){
			var delay = $q.defer();
			API.Personas.get({id: $route.current.params.personId}, function(person){
							delay.resolve(person);
						}, function(){
							delay.reject('unable to fetch person'+$routeParams.personId);
						});
			return delay.promise;	
		};
	}]);