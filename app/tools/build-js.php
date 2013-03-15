<?php
define('NL', "\n");
define('TAB', "\t");

define('JS_FILENAME', 'script.js');
define('JS_MIN_FILENAME', 'script-min.js');
define('JS_DIR', '../../web-static/js/');
define('JS_SRC_DIR', '../../web-static/src/js/');

function browseDir($dir, $output){
	echo '* Browsing directory '.$dir.'...'.NL;
	$fileList = array();
	$d = opendir($dir);
	while($f = readdir($d)){
		if($f != '.' && $f != '..'){
			$fileList[$f] = $dir.$f;
		}
	}
	closedir($d);
	ksort($fileList);
	foreach($fileList as $f){
		if(is_dir($f)){
			browseDir($f.'/', $output);
		}else{
			echo ' - Importing '.$f.'...';
			fwrite($output, NL.NL.'/**** '.$f.' ****/'.NL);
			fwrite($output, file_get_contents($f));
			echo ' [OK]'.NL;
		}
	}
}
echo 'Building js file...'.NL;
$f = fopen(JS_DIR.JS_FILENAME, 'w');
browseDir(JS_SRC_DIR, $f);
fclose($f);

echo 'Minimizing JS..'.NL;
exec('uglifyjs -c -o '.JS_DIR.JS_MIN_FILENAME.' '.JS_DIR.JS_FILENAME);
echo 'JS build done'.NL;