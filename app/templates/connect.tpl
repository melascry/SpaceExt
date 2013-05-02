<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" type="text/css" href="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.10/themes/base/jquery-ui.css"/>
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js"></script>
<!-- 
<script type="text/javascript" src="<?php echo WEB_STATIC_URI;?>js/vendor/aes.js"></script>
<script type="text/javascript" src="<?php echo WEB_STATIC_URI;?>js/utils.js"></script>

<script type="text/javascript" src="js.php"></script>
 -->

<title>connect SpaceExt</title>

</head>
<body>
<?php
if(isset($_REQUEST['bad_login'])){
	echo 'Bad login or password';
}
?>
<form method="POST" id="connect-form" action="<?php echo $_SERVER['PHP_SELF'];?>" onsubmit="return encrypt()">
<label for="login">Login</label> <input type="text" id="login" name="login"/><br/>
<label for="password">Password</label> <input type="password" id="password" name="password"/><br/>
<input type="submit" value="Login" name="action-login"/>
<input type="submit" value="Register" name="action-register"/>
</form>
</body>
</html>