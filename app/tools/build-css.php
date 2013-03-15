<?php
define('NL', "\n");
define('TAB', "\t");

define('CSS_SRC_PATH', '../../web-static/src/css/');
define('CSS_MIN_PATH', '../../web-static/css/');

echo 'Minimizing CSS...'.NL;
passthru('sass "'.realpath(CSS_SRC_PATH).'/style.scss":"'.realpath(CSS_MIN_PATH).'/style.css"');
echo 'CSS build done'.NL;