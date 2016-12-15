#!/usr/bin/php

<?php

$modName = $argv[1];

# Keep this many runs:
switch ($modName) {
	case 'HRRR':
		$runsPerDay = 24;
		break;
	case 'HRRR15':
		$runsPerDay = 24;
		break;
	case 'RAP':
		$runsPerDay = 8;
		break;
	case 'ECMWF':
		$runsPerDay = 2;
		break;	
	default:
		$runsPerDay = 4;
		break;
}
$numRunsToKeep = 3*$runsPerDay;

# Get a list of all model run directories:
$baseDir = "/home/apache/climate/data/forecast/$modName";
$subDirs = glob($baseDir."/*",GLOB_ONLYDIR);
rsort($subDirs);

# Delete recursively all but the first set,
# using the system "rm -rf" command.
for ($i=$numRunsToKeep; $i < count($subDirs); $i++) { 
	system("rm -rf ".escapeshellarg($subDirs[$i]));
}

?>