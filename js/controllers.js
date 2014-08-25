app.controller('IndexController', function($scope){
	$scope.title = "Index";
});

app.controller('SidebarController', function($scope, Topics){
	$scope.title = "Sidebar";
	$scope.topics = Topics.allTopics;
});

app.controller('IndividualController', ['$scope', 'persona', 'API', function($scope, persona, API){
	$scope.title = "Buscar una persona";
	$scope.description = "Busca personas en una base de datos, soportada por un servicio restfull en php";
	$scope.persona = persona;
	$scope.id;
	$scope.name;
	$scope.buscarPersona = function(){
		if ($scope.id) {
			API.Personas.get({id: $scope.id}, function(person){
				$scope.persona = person;
			}, function(){
				$scope.persona = {};
				console.log("No se encontró ningun usuario con ese id");
			});
		}
	};
	$scope.buscarPersonaPorNombre = function(){
		if ($scope.name) {
			API.Personas.byName({name: $scope.name}, function(person){
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

app.controller('CreateController',['$scope','$location','persona', function($scope, $location, persona){
	$scope.remaining = 250;
	$scope.information = "";
	$scope.persona = persona;
	if (!$scope.persona.contactos) {
		$scope.persona.contactos = [];
	};	
	
	if (persona && persona.id) {
		$scope.title="Editar persona";
		$scope.description = "En esta página puede proporcionar los datos para actualizar la informacion una persona en el sistema";
		$scope.remaining = 250 - $scope.persona.observaciones.length;
	}else{
		$scope.title="Crear nueva persona";
		$scope.description = "En esta página puede proporcionar los datos para crear una nueva persona en el sistema";
	}
	
	$scope.save = function(){
		$scope.persona.$save(function(){
			$location.path("/grupal");
		}, function(){
			$scope.information = "Fail to save person";
		});
	};

	$scope.calcRemaining = function(){
		$scope.remaining = 250 - $scope.persona.observaciones.length;
	};
}]);

app.controller('ContactoController',['$scope', 'API', function($scope, API){
	$scope.tiposContacto = {};
	API.TiposContacto.query(function(datos){
		if (datos && datos.result !== "fail") {
			$scope.tiposContacto = datos;
		};
	});
	$scope.addContacto = function(){
		if ($scope.tipo && $scope.numero) {
			var contacto = {tipoNombre: $scope.tipo.nombre, numero: $scope.numero, tipo: $scope.tipo.id};
			$scope.persona.contactos.push(contacto);
			$scope.numero = "";
		}else{
			alert("Falta información para agregar ese contacto");
		}
	};
	$scope.removeContacto = function(indice){
		var id = $scope.persona.contactos[indice].id;
		if (id) {
			var c = confirm("Seguro que desea eliminar este contacto?");
			if(c){
				API.Contactos.remove({id: id}, function(){
					$scope.persona.contactos.splice(indice, 1);
				}, function(){alert("Something went wrong");});				
			}
		}else{
			$scope.persona.contactos.splice(indice, 1);
		}
		
	};
	$scope.setSeleccion = function(indice){
		$scope.tipo = $scope.tiposContacto[indice];
	};

	$scope.isEmpty = function(){
		return $scope.persona.contactos.length == 0;
	}

}]);