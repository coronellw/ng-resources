<?php
include_once '../system/db_info.php';
include_once './personas.php';
include_once './tiposContacto.php';
include_once './contactos.php';

require '../Slim/Slim.php';
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

/* PERSONAS */
$app->get("/personas", 'getPersonas');
$app->get("/personas/:id", 'getPersona');
$app->post("/personas", 'addPersona');
$app->post("/personas/:id", "updatePersona");
$app->delete("/personas/:id", "deletePersona");
$app->get("/personas/:name/byName","getPersonaByName");

/* CONTACTOS */
$app->get("/contactos/:id", "getContacto");
$app->delete("/contactos/:id", "deleteContacto");

/* TIPOS DE CONTACTOS */
$app->get("/tiposContacto", "getTiposContacto");

$app->run();
