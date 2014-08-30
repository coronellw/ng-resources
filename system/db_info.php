<?php
$hst = "localhost:3306";
$usrnm = "testuser";
$psswrd = "testuser";
$schm = "resources";
$link = new mysqli($hst, $usrnm, $psswrd, $schm) or die("Error " . mysqli_error($link));
$acentos = $link->query("SET NAMES 'utf8'");