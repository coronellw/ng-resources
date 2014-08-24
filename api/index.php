<?php
include '../system/db_info.php';
require '../Slim/Slim.php';
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

$app->get("/personas", 'getPersonas');
$app->get("/personas/:id", 'getPersona');
$app->post("/personas", 'addPersona');
$app->post("/personas/:id", "updatePersona");
$app->delete("/personas/:id", "deletePersona");
$app->get("/personas/:name/byName","getPersonaByName");

$app->run();

function getPersona($id){
	global $link, $app;
    $query = "SELECT * FROM personas WHERE id = $id";
    $result = $link->query($query);
    $response = array();

    if ($result && mysqli_num_rows($result)>0) {
    	$response = mysqli_fetch_assoc($result);	
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
	$query = "INSERT INTO personas(nombres, apellidos, observaciones) VALUES ('".$person->nombres."', '".$person->apellidos."','".$person->observaciones."')";
	$result = $link->query($query);
	$id = mysqli_insert_id($link);

	if ($result && $id != 0) {
		$response['nombres'] = $person->nombres;
		$response['apellidos'] = $person->apellidos;
		$response['id'] = $id;
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

	$query = "UPDATE personas SET nombres='".$person->nombres."', apellidos='".$person->apellidos."', observaciones = '".$person->observaciones."' WHERE id=".$person->id;
	$result = $link->query($query);

	if ($result && mysqli_affected_rows($link)>0) {
		$response['result'] = "ok";
	}else{
		$response['result'] = "fail";
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