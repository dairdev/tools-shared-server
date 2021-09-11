<?php 
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");

$method = $_SERVER['REQUEST_METHOD'];
if($method == "OPTIONS") {
    die();
}

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode( '/', $uri );

require_once("./controllers/FileSystemController.php");

$fileSystemController = new FileSystemController();

$json = file_get_contents('php://input');

$data = json_decode($json);

$path = $data->url;

switch($uri[2]){
case 'ld':
	$fileSystemController->listFiles($path);
	break;
}


?>
