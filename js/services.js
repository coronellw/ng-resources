app.factory('Topics', function(){
	var topics = {};
	topics.allTopics = [
		{url:"/", name: "index"},
		{url:"/personas/new", name: "Agregar persona"},
		{url:"individual", name: "Buscar persona"},
		{url:"grupal", name: "Listar personas"}
	];
	return topics;
});

app.factory('People', ['$resource', function($resource){
	return $resource('/api/personas/:id',{id: '@id'}, {
		byName: {
			method: "GET",
			params: {name: "@name"},
			url: "/api/personas/:name/byName",
			isArray: true
		}
	});
}]);

app.factory('PeopleLoader', ['People','$q',
	function(People, $q){
		return function(){
			var delay = $q.defer();
			People.query(function(people){
							delay.resolve(people);
						}, function(){
							delay.reject('unable to fetch people');
						});
			return delay.promise;
		}
	}]);

app.factory('PersonLoader',['People','$q', '$route',
	function(People, $q, $route){
		return function(){
			var delay = $q.defer();
			People.get({id: $route.current.params.personId}, function(person){
							delay.resolve(person);
						}, function(){
							delay.reject('unable to fetch person'+$routeParams.personId);
						});
			return delay.promise;	
		};
	}]);