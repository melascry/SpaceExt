<?php

include('../app/config.php');
include('../app/SpaceExt/App.php');
include('../vendor/fbapi/facebook.php');

if(isset($_SESSION['indexUser'])){
	echo' user created ';
	SpaceExt\App::handleGameForm();
	include TEMPLATES_PATH.'index.tpl';
}else{
	echo' user absent ';
	SpaceExt\App::handleConnectForm();
	include TEMPLATES_PATH.'connect.tpl';
}