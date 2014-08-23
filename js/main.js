function callCreate(){
	jQuery.ajax({
		type: "POST",
		url: "/personas",
		data: {nombres: "Test", apellidos: "User"} 
	}).success(function(data){
		console.dir(data);
		alert("We received a response");
	});
}