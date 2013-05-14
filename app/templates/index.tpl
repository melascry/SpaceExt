<!DOCTYPE html>
<html>
<head>

	<link rel="stylesheet" type="text/css" href="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.10/themes/base/jquery-ui.css"/>
	<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
	<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js"></script>
	<script type="text/javascript" src="/spaceext-static/js/script.js"></script>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>index SpaceExt</title>
	<script>
		<?php
			echo 'var WEB_STATIC_URL = "'.WEB_STATIC_URL.'";';
			echo 'var IMAGE_URL = "'.IMAGE_URL.'";';
			echo' var userData = '.$_SESSION['user']->toJSON().';';
		?>
	</script>
</head>
<body onload="start()">
	<div id="UI">
	<canvas width="1024" height="600" id="canvas" style="border:1px solid #f00; z-index:-1; position: fixed;">
	</canvas>
		<div style=" z-index:0;color:white;">
			<dl>
				<dt> Gold retrieved : </dt>
				<dd id="score"> 0</dd>
			</dl>
		</div>
	</div>
</body>
</html>