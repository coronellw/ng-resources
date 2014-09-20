<?php
function getContacto($id){
	global $link, $app;
	$query = "SELECT * FROM contactos WHERE id = $id";
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
}

function agregarContactos($id_user, $contactos){
	global $link, $app;
	$update = 0;
	$create = 0;
	$response = array();

	$base = "INSERT INTO contactos(numero, persona, tipo) VALUES ";
	foreach ($contactos as $contacto) {
		$numero = $link->real_escape_string($contacto->numero);
		$tipo = $link->real_escape_string($contacto->tipo);
		$query_creates = "";
		$query_updates = "";

		if (isset($contacto->id)) {
			$id = $contacto->id;
			$query_updates = $query_updates."UPDATE contactos SET numero = $numero, tipo = $tipo WHERE id = $id;";
			$update ++;
		}else{
			$query_creates = $query_creates."($numero, $id_user, $tipo),";
			$create++;
		}
	}

	if ($create > 0 && strlen($query_creates) > 0) {
		$query_creates = $base.rtrim($query_creates,',');
		$rc = $link->query($query_creates);
		if ($rc && mysqli_affected_rows($link)>0) {
			$response['result_insert'] ="ok";
			$response['amount_inserted'] = $create;
		}else{
			$response['result_insert'] ="fail";
			$response['insert_error_msg'] = mysqli_error($link);
			$response['q_insert'] = $query_creates;
		}
	}

	if ($update > 0 && strlen($query_updates) > 0) {
		$ru = $link->query($query_updates);
		$response['debio'] = $query_updates;
		if ($ru && mysqli_affected_rows($link)>0) {
			$response['result_update'] ="ok";
			$response['amount_updated'] = $create;
		}else{
			$response['result_insert'] ="fail";
			$response['insert_error_msg'] = mysqli_error($link);
			$response['q_insert'] = $query_updates;
		}
	}
	
	return $response;
}

function deleteContacto($id){
	global $link, $app;
	$response = array();

	$query = "DELETE FROM contactos WHERE id = $id";
	$result = $link->query($query);

	if ($result && mysqli_affected_rows($link)>0) {
		$response['result'] = "ok";
	}else{
		$response['result'] = "fail";
		$response['query'] = $query;
	}

	$app->response()->header("Content-Type", "application/json");
	echo json_encode($response);
}

function getContactos($id_user){
	global $link;
	$qcontacts = $link->prepare("SELECT c.numero, tc.nombre as tipoNombre FROM contactos c, tipos_contacto tc WHERE c.tipo = tc.id and persona = ?");
	$qcontacts->bind_param('i',$id_user);
	$qcontacts->execute();
	$rcontacts = $qcontacts->get_result();
	$allContacts = array();
	while($rcontacts && $contact = $rcontacts->fetch_assoc()){
		$allContacts[] = $contact;
	}
	$qcontacts->free_result();
	$qcontacts->close();
	return $allContacts;
}