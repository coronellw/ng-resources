app.factory('Topics', function(){
	var topics = {};
	topics.allTopics = [
		{url:"/", name: "index"},
		{url:"individual", name: "Búsqueda individual"},
		{url:"grupal", name: "Búsqueda grupal"}
	];
	return topics;
});

app.factory('People', function($resource){
	return $resource('/ng-resources/personas/:id',{id: '@id'});
});