<?php 
include_once './contactos.php';

function getPersona($id){
	global $link, $app;
	$response['result']="Not found";

	$stmt = $link->prepare("SELECT * FROM personas WHERE id = ?");
	$stmt->bind_param('i',$id);
	$stmt->execute();
	$result = $stmt->get_result();

	while($result && $row = $result->fetch_assoc()){
		$response=$row;
		$response['contactos']=getContactos($id);
	}

	$stmt->free_result();
	$stmt->close();

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
	$response['contactos_response']=agregarContactos($person->id, $person->contactos);

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
			$r['contactos'] = getContactos($r['id']);
			$response[] = $r;
		}
	}else{
		$response['result']="fail";
		$response['query'] = $query;
	}

	$app->response()->header("Content-Type", "application/json");
	echo json_encode($response);
}