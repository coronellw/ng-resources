<?php
header("Content-type:application/json");
include "../system/db_info.php";
$id = filter_input(INPUT_GET, "id");
$personas = array();

if (isset($id) && strlen($id)>0) {
	$query = "SELECT * FROM personas WHERE id = $id";
} else {
	$query = "SELECT * FROM personas";
}

$result = $link->query($query);

if ($result) {
	if (mysqli_num_rows($result)>0) {
		if (isset($id) && strlen($id)>0) {
			$persona = mysqli_fetch_assoc($result);
			deliverResponse(200, "ok", $persona);
		}else{
			while($persona = mysqli_fetch_assoc($result)){
				$personas[] = $persona;
			}
			deliverResponse(200, "ok", $personas);
		}

	} else {
		deliverResponse(200, "No match found", NULL);
	}

}else {
	deliverResponse(400, "Invalid request", NULL);
}

function deliverResponse($status, $msg, $data){
	header("HTTP/1.1 $status $msg");

	$response['status'] = $status;
	$response['status_message'] = $msg;
	$response['data'] = $data;

	echo json_encode($response);
}