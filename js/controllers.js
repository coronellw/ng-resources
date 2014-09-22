app.controller('IndexController', function($scope, $rootScope){
	$scope.title = "Index";
});

app.controller('SidebarController', function($scope, Topics){
	$scope.title = "Sidebar";
	$scope.topics = Topics.allTopics;
});

app.controller('IndividualController', ['$scope', '$rootScope','persona', 'API', function($scope, $rootScope, persona, API){
	$scope.title = "Buscar una persona";
	$scope.description = "Busca personas en una base de datos, soportada por un servicio restfull en php";
	$scope.persona = persona;
	$scope.id;
	$scope.name;
	$scope.buscarPersona = function(){
		if ($scope.id) {
			var msg = {type:"warning",body:"No se encontró ningun usuario con ese <strong>id</strong>", title:"Usuario no encontrado"};
			API.Personas.get({id: $scope.id}, function(person){
				$scope.persona = person;
				if (typeof person.result !== 'undefined') {
					$rootScope.$broadcast("SystemMessage", msg)
				};
			}, function(){
				$scope.persona = {};
				$rootScope.$broadcast("SystemMessage",msg);
			});
		}else{
			var msg = {type:"warning",body:"Debe proporcionar un <strong>id</strong> para buscar a una persona", title:"Falta información"};
			$rootScope.$broadcast("SystemMessage",msg);
		}
	};
	$scope.buscarPersonaPorNombre = function(){
		if ($scope.name) {
			var msg = {type:"warning",body:"No se encontró ningun usuario con ese <strong>nombre</strong>", title:"Usuario no encontrado"};
			API.Personas.byName({name: $scope.name}, function(person){
				if (person.length > 1) {
					$scope.personas = person;
					jQuery("#resultados").modal('show');
				}else{
					$scope.persona = person[0];
					if (!$scope.persona) {
						$rootScope.$broadcast("SystemMessage", msg);
					};
				}
			}, function(){
				$scope.persona = {};
				$rootScope.$broadcast("SystemMessage", msg);
			});
		}else{
			var msg = {type:"warning",body:"Debe proporcionar un <strong>nombre</strong> para buscar a una persona", title:"Falta información"};
			$rootScope.$broadcast("SystemMessage",msg);
		}
	};

	$scope.setPersona = function(person){
		$scope.persona = person;
	};
}]);

app.controller('GrupalController', ['$scope', '$rootScope', 'personas', function($scope, $rootScope, personas){
	$scope.title = "Buscar todos";
	$scope.description = "Busca a todas las personas registradas en la base de datos, soportada por un servicio restfull en php";
	$scope.personas = personas;
	$scope.delete = function(indice){
		var full_name = $scope.personas[indice].nombres +" "+ $scope.personas[indice].apellidos;
		var c = confirm("Esta seguro de borrar a " + full_name + " del sistema?");
		if (c) {
			$scope.personas[indice].$remove(function(){
				var msg = {type: "info", body:"User "+full_name+" was removed from system", title: "User deleted"};
				$rootScope.$broadcast("SystemMessage", msg);
				$scope.personas.splice(indice, 1);
			});
		}
	}
}]);

app.controller('CreateController',['$scope', '$rootScope', '$location','persona', function($scope, $rootScope, $location, persona){
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
		$scope.newUser = true;
	}
	
	$scope.save = function(){
		var full_name = $scope.persona.nombres+" "+$scope.persona.apellidos;
		
		$scope.persona.$save(function(){
			$scope.information = $scope.newUser?"User "+full_name+" was correctly added":"User "+full_name+" was correctly updated";
			var msg = {type:"success", body: $scope.information, title: "Person saved"};
			$rootScope.$broadcast("SystemMessage", msg);
			$location.path("/grupal");
		}, function(){
			$scope.information = "There seems we had an error";
			var msg = {type:"danger", body: $scope.information, title: "Unable to save person"};
			$rootScope.$broadcast("SystemMessage", msg);
		});
	};

	$scope.calcRemaining = function(){
		$scope.remaining = 250 - $scope.persona.observaciones.length;
	};
}]);

app.controller('ContactoController',['$scope','$rootScope', 'API', function($scope, $rootScope, API){
	$scope.tiposContacto = {};
	API.TiposContacto.query(function(datos){
		if (datos && datos.result !== "fail") {
			$scope.tiposContacto = datos;
		};
	});
	$scope.addContacto = function(){
		if ($scope.tipo && $scope.numero) {
			var contacto = {tipo: $scope.tipo.nombre, numero: $scope.numero, id_tipo: $scope.tipo.id};
			$scope.persona.contactos.push(contacto);
			$scope.numero = "";
		}else{
			var msg = {type: "danger", title:"Información adiconal requerida"};
			msg.body="Falta información para agregar ese contacto";
			var pending = "<ul>"
			if (!$scope.numero) {
				pending +="<li>Porporcione el n&uacute;mero de contacto</li>";
			}
			if (!$scope.tipo) {
				pending +="<li>Seleccione el tipo de contacto</li>";
			}
			pending+="</ul>"
			msg.body+=pending;
			$rootScope.$broadcast("SystemMessage",msg);
		}
	};
	$scope.removeContacto = function(indice){
		var id = $scope.persona.contactos[indice].id;
		if (id && id !== null) {
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
		if ($scope.persona) {
			return $scope.persona.contactos.length == 0;
		}
		return false;
	}

}]);


app.controller('messageController',['$scope',function($scope){
	$scope.messages=[];
	$scope.checkMessages = function(){
		return $scope.messages.length > 0;
	};

	$scope.dismissMsg = function(indice){
		$scope.messages.splice(indice,1);
	};

	$scope.$on('SystemMessage',function(event, message){
		message.sticky = false;
		message.autoRemove = function(){
			if (!message.sticky) {
				message.timeout = setTimeout(function(){
					var pos = $scope.messages.indexOf(message);
					if (pos !== -1) {
						$scope.$apply(function(){
							$scope.messages.splice(pos,1);
						});
					}
				},3000);
			}
		}
		message.autoRemove();
		message.stopRemove = function(){
			clearTimeout(message.timeout);
		};
		message.toggleSticky = function(){
			message.sticky = !message.sticky;
		}
		$scope.messages.push(message);
	});
}]);

app.controller('exampleCtrl',['$scope', '$rootScope', function($scope, $rootScope){
	$scope.title = "Ejemplos de directivas de angular JS"
	$scope.description = "Algunas veces resulta util crear elementos con un template, que puedan ser reutilizados n-veces, angular ofrece la solucion de directivas";
	$scope.etext = "Hello, I am being serve fromt he controller";
	$scope.etitle = "Click me to exapnd";
	$scope.msg = "";
	$scope.type = "success";
	$scope.sendTestMsg = function(){
		var testMsg = {title:$scope.titulo, body: $scope.msg, type: $scope.type};
		$rootScope.$broadcast('SystemMessage', testMsg);
	};
}]);