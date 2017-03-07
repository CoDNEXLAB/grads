#!/usr/bin/php

<?php

# $file = file('/home/scripts/grads/functions/precip_stations.gs');
$file = file($argv[1]);

foreach ($file as $line) {
	echo preg_replace_callback("/( 'run \/home\/scripts\/grads\/functions\/.*\.gs )(-\d*\.?\d*)(\s*\d*\.?\d.*)/", "NegToPos", $line);
}

function NegToPos($matches) {
	$lon  = $matches[2] + 360;
	return $matches[1].$lon.$matches[3];
}


?>