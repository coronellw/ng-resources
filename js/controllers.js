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
	$scope.delete = function(indice){
		var c = confirm("Esta seguro de borrar a esta persona?");
		if (c) {
			$scope.personas[indice].$remove(function(){
				alert("User was removed from system");
			});
		}
	}
}]);

app.controller('CreateController',['$scope','persona', 'People', function($scope, persona, People){
	if (persona && persona.id) {
		$scope.title="Editar persona";
		$scope.description = "En esta página puede proporcionar los datos para actualizar la informacion una persona en el sistema";
	}else{
		$scope.title="Crear nueva persona";
		$scope.description = "En esta página puede proporcionar los datos para crear una nueva persona en el sistema";
	}
	
	$scope.information = "";
	$scope.persona = persona;
	$scope.save = function(){
		$scope.persona.$save(function(){
			$scope.information = "Saved!";
			$scope.persona = new People();
		}, function(){
			$scope.information = "Fail to save person";
		});
	};
}]);