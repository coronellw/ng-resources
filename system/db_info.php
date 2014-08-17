<?php
$hst = "localhost";
$usrnm = "testuser";
$psswrd = "testuser";
$schm = "resources";
$link = mysqli_connect($hst, $usrnm, $psswrd, $schm) or die("Error " . mysqli_error($link));
$acentos = $link->query("SET NAMES 'utf8'");