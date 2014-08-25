<?php 
include_once './personas.php';

function getPersona($id){
	global $link, $app;
    $query = "SELECT * FROM personas WHERE id = $id";
    $result = $link->query($query);
    $response = array();

    if ($result && mysqli_num_rows($result)>0) {
    	$response = mysqli_fetch_assoc($result);
    	$response['contactos'] = array();
    	$q_contactos = "SELECT c.id, c.numero, c.tipo, tc.nombre AS 'tipoNombre' FROM contactos c LEFT OUTER JOIN tipos_contacto tc ON tc.id = c.tipo WHERE persona = $id";
    	$r_contactos = $link->query($q_contactos);

    	if ($r_contactos && mysqli_num_rows($r_contactos)>0) {
    		$telefonos = array();
    		while($c = mysqli_fetch_assoc($r_contactos)){
    			$telefonos[] = $c;
    		}
    		$response['contactos'] = $telefonos;
    	}
    } else{
    	$response['error'] = "No se pudo encontrar la persona buscada";
		$response['msg'] = mysqli_error($link);
    }

    $app->response()->header("Content-Type", "application/json");
    echo json_encode($response);
};

function getPersonas() {
	global $link, $app;
	$query = "SELECT * FROM personas";
	$result = $link->query($query);
	$response = array();

	if ($result && mysqli_num_rows($result)>0) {
		while($r = mysqli_fetch_assoc($result)){
			$response[] = $r;
		}
	}else{
		$response['error'] = "No fue posible cargar el listado de personas";
		$response['msg'] = mysqli_error($link);
	}

	$app->response()->header("Content-Type", "application/json");
	echo json_encode($response);
};

function addPersona(){
	global $link, $app;
	$request = $app->request();
	$person = json_decode($request->getBody());
	$response = array();
	$nombres = $link->real_escape_string($person->nombres);
	$apellidos = $link->real_escape_string($person->apellidos);
	$observaciones = $link->real_escape_string($person->observaciones);

	$query = "INSERT INTO personas(nombres, apellidos, observaciones) VALUES ('".$nombres."', '".$apellidos."','".$observaciones."')";
	$result = $link->query($query);
	$id = mysqli_insert_id($link);

	if ($result && $id != 0) {
		$response['nombres'] = $person->nombres;
		$response['apellidos'] = $person->apellidos;
		$response['id'] = $id;
		// Agregar contactos
		agregarContactos($id, $person->contactos);
	}else{
		$response['error'] = "No fue posible guardar esa persona";
		$response['msg'] = mysqli_error($link);
	}

	$app->response()->header("Content-Type", "application/json");
	echo json_encode($response);
};

function updatePersona(){
	global $link, $app;

	$request = $app->request();
	$person = json_decode($request->getBody());
	$response = array();
	$nombres = $link->real_escape_string($person->nombres);
	$apellidos = $link->real_escape_string($person->apellidos);
	$observaciones = $link->real_escape_string($person->observaciones);

	$query = "UPDATE personas SET nombres='".$nombres."', apellidos='".$apellidos."', observaciones = '".$observaciones."' WHERE id=".$person->id;
	$result = $link->query($query);

	// Agregar contactos
	$resposne['contactos_response']=agregarContactos($person->id, $person->contactos);

	if ($result && mysqli_affected_rows($link)>0) {
		$response['result'] = "ok";
	}else{
		$response['result'] = "fail";
		$response['query']=$query;
		$response['Error'] = mysqli_error($link);
	}

	$app->response()->header("Content-Type", "application/json");
	echo json_encode($response);
};

function deletePersona($id){
	global $link, $app;

	$query = "DELETE FROM personas WHERE id=$id";
	$result = $link->query($query);
	$response = array();

	if ($result && mysqli_affected_rows($link)>0) {
		$response['result'] = "ok";
	}else{
		$response['result'] = "fail";
		$response['query'] = $query;
	}

	$app->response()->header("Content-Type", "application/json");
	echo json_encode($response);
}

function getPersonaByName($name){
	global $link, $app;

	$query = "SELECT * FROM personas WHERE nombres LIKE '%$name%' OR apellidos LIKE '%$name%'";
	$result = $link->query($query);
	$response = array();

	if ($result) {
		while($r = mysqli_fetch_assoc($result)){
			$response[] = $r;
		}
	}else{
		$response['result']="fail";
		$response['query'] = $query;
	}

	$app->response()->header("Content-Type", "application/json");
	echo json_encode($response);
}