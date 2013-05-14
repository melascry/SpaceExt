<?php
include('../app/config.php');

if(
	!isset($_SESSION['user'])
  )
{	
	$result = array('error' => 'Session user not set');
}
else
{
	$result = array();
	if(!isset($_POST['action']))
	{
		$result = array('error'=> 'Missing Action');
	}
	else
	{
		switch($_POST['action'])
		{
			case 'goldFound':
				$_SESSION['user']->addGold($_POST['gold']);
				$result = array('gold' => $_SESSION['user']->getGold());
				break;
		}
	}
}
echo json_encode($result);