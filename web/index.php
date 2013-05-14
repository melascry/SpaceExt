<?php

include('../app/config.php');


//include('../app/SpaceExt/App.php');
include('../vendor/fbapi/facebook.php');

if(isset($_SESSION['user']))
{
	
	SpaceExt\App::handleGameForm();
	include TEMPLATE_PATH.'/index.tpl';
}
else
{
	
	SpaceExt\App::handleConnectForm();
	include TEMPLATE_PATH.'/connect.tpl';
}