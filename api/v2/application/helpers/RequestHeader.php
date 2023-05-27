<?php
header("Access-Control-Allow-Headers: Content-Type, Content-Length, Accept-Encoding");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: authorization");
header('Content-Type: application/json');
$inputs = json_decode(file_get_contents("php://input"), true);

?>