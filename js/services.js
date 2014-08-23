app.factory('Topics', function(){
	var topics = {};
	topics.allTopics = [
		{url:"/", name: "index"},
		{url:"individual", name: "Búsqueda individual"},
		{url:"grupal", name: "Búsqueda grupal"}
	];
	return topics;
});

app.factory('People', ['$resource', function($resource){
	return $resource('/personas/:id',{id: '@id'});
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