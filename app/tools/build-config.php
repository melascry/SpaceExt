<?php
define('NL', "\n");
define('TAB', "\t");

if(!isset($argv[1])){
	throw new Exception('Missing argument : php build-config {build-target}');
}
define('BUILD_TARGET', $argv[1]);

$configPath = '../config/';

// Import config commune
echo 'Retrieving config files...'.NL;
$d = opendir($configPath);
while($f = readdir($d)){
	if(substr($f, -4) == '.php'){
		if(isset($configFileList[$f])){
			trigger_error('Config filename '.$f.' already exists at '.$configFileList[$f].'. Skipped', E_WARNING);
		}else{
			$configFileList[$f] = $configPath.$f;
		}
	}
}
closedir($d);


// Import config spécifique build cible
echo 'Retrieving build config files...'.NL;
$buildConfigPath = $configPath.BUILD_TARGET.'/';
$d = opendir($buildConfigPath);
while($f = readdir($d)){
	if(substr($f, -4) == '.php'){
		if(isset($configFileList[$f])){
			trigger_error('Config filename '.$f.' already exists at '.$configFileList[$f].'. Skipped', E_WARNING);
		}else{
			$configFileList[$f] = $buildConfigPath.$f;
		}
	}
}
closedir($d);

ksort($configFileList);

echo 'Writing config file...'.NL;
$output = fopen('../config.php', 'w');
fwrite($output, '<?php'.NL);
foreach($configFileList as $f){
	echo ' - Appending '.$f.'...'.TAB;
	fwrite($output, NL.NL.'/**** '.$f.' ****/'.NL);
	fwrite($output, str_replace(array('<?php', '?>'), '', file_get_contents($f)));
	echo '[OK]'.NL;
}
fclose($output);
echo 'Config build done'.NL;