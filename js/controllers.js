app.controller('IndexController', function($scope){
	$scope.title = "Index";
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
	$scope.name;
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
	$scope.buscarPersonaPorNombre = function(){
		if ($scope.name) {
			People.byName({name: $scope.name}, function(person){
				if (person.length > 1) {
					$scope.personas = person;
					jQuery("#resultados").modal('show');
				}else{
					$scope.persona = person[0];
				}
			}, function(){
				$scope.persona = {};
				console.log("No se encontró ningun usuario con ese nombre");
			});
		};
	};

	$scope.setPersona = function(person){
		$scope.persona = person;
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
				$scope.personas.splice(indice, 1);
			});
		}
	}
}]);

app.controller('CreateController',['$scope','$location','persona', 'People', function($scope, $location, persona, People){
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
			$location.path("/grupal");
		}, function(){
			$scope.information = "Fail to save person";
		});
	};
}]);