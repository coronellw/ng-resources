<?php
function getTiposContacto(){
	global $link, $app;

	$query = "SELECT * FROM tipos_contacto";
	$result = $link->query($query);
	$response = array();
	if ($result) {
		while($tc = mysqli_fetch_assoc($result)){
			$response[] = $tc;
		}
	}else{
		$response["result"] = "fail";
		$response["query"] = $query;
		$response["error_msg"] = mysqli_error($link);
	}

	$app->response()->header("Content-Type", "application/json");
	echo json_encode($response);
}