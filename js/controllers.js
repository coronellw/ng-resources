app.controller('IndexController', function($scope){
	$scope.title = "Hello world";
});

app.controller('SidebarController', function($scope, Topics){
	$scope.title = "Sidebar";
	$scope.topics = Topics.allTopics;
});

app.controller('IndividualController', ['$scope', 'persona', 'People', function($scope, persona, People){
	$scope.title = "Buscar una persona";
	$scope.description = "Busca personas en una base de datos, soportada por un servicio restfull en php";
	$scope.persona = persona;
	$scope.id;
	$scope.buscarPersona = function(){
		if ($scope.id) {
			People.get({id: $scope.id}, function(person){
				$scope.persona = person;
			}, function(){
				$scope.persona = {};
				console.log("No se encontró ningun usuario con ese id");
			});
		}
	};
}]);

app.controller('GrupalController', ['$scope', 'personas', function($scope, personas){
	$scope.title = "Buscar todos";
	$scope.description = "Busca a todas las personas registradas en la base de datos, soportada por un servicio restfull en php";
	$scope.personas = personas;
}]);

app.controller('CreateController',['$scope','persona', 'People', function($scope, persona, People){
	$scope.title="Crear nueva persona";
	$scope.description = "En esta página puede proporcionar los datos para crear una nueva persona en el sistema";
	$scope.infromation = "";
	$scope.persona = persona;
	$scope.addPersona = function(){
		$scope.persona.$save(function(){
			alert("Saved!\nNombres: "+ $scope.persona.nombres + "\nApellidos: "+ $scope.persona.apellidos);
			$scope.persona = new People();
		}, function(){
			alert("For some reason it is saying it didn't work, but it did");
		});
	};
}]);