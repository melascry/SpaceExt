<?php

require_once('../app/config.php');
require_once('../app/SpaceExt/App.php');
require_once('../vendor/fbapi/facebook.php');

if(isset($_SESSION['user'])){
	echo'user created';
	SpaceExt\App::handleGameForm();
	include TEMPLATES_PATH.'index.tpl';
}else{
	echo'user absent';
	SpaceExt\App::handleConnectForm();
	include TEMPLATES_PATH.'connect.tpl';
}