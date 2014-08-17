app.controller('IndexController', function($scope){
	$scope.title = "Hello world";
});

app.controller('SidebarController', function($scope, Topics){
	$scope.title = "Sidebar";
	$scope.topics = Topics.allTopics;
});

app.controller('IndividualController', function($scope, People){
	$scope.title = "Buscar una persona";
	$scope.description = "Busca personas en una base de datos, soportada por un servicio restfull en php";
	$scope.persona = {};
	$scope.id;

	$scope.getPersona = function(){
		People.get({id: $scope.id}).$promise.then(function(successResponse){
			$scope.persona = successResponse.data;
		}, function(errResponse){
			console.log(errResponse);
		});
	};
});

app.controller('GrupalController', function($scope, People){
	$scope.title = "Buscar todos";
	$scope.description = "Busca a todas las personas registradas en la base de datos, soportada por un servicio restfull en php";
	$scope.personas = {};

	$scope.loadPersonas = function(){
		People.query().$promise.then(function(successResponse){
			$scope.personas = successResponse.data;
		}, function(errResponse){
			console.log(errResponse);
		});
	};
});