<?php
function updateFloater($latTop, $lonRight, $latBot, $lonLeft){

	# Will return status at the end, set to FALSE until we're done:
	$status = FALSE;

	# What to look for in sector file:
	$needle = "sector = FLT";

	# Sector File:
	$sectorFile = "/home/scripts/grads/functions/sectors.gs";

	# Read Sector File into Array:
	try {
		$sectorArr = file($sectorFile);
	} catch (Exception $e) {
		print("Error opening file: ".$sectorFile);
		return $status;
	}

	# Look for our float sector segment:
	$found = FALSE;
	for ($i=0; $i < count($sectorArr); $i++) { 
		if (strstr($sectorArr[$i], $needle)) {
			$found = TRUE;
			break;
		}
	}

	# Found the segment, now let's change it:
	if ($found) {
		# Write new sector info to Sector File:
		try {
			$fltLats = $i + 1;
			$fltLons = $i + 2;
			$sectorArr[$fltLats] = " 'set lat ${latBot} ${latTop}'\n";
			$sectorArr[$fltLons] = " 'set lon ${lonLeft} ${lonRight}'\n";
			file_put_contents($sectorFile, $sectorArr);
		} catch (Exception $e) {
			print("Error writing file: ".$sectorFile);
			return $status;
			#die();
		}

		# Generate float sector shapefiles, determine number of cols, and update:
		try {
			# Scripts and Shapefiles:
			$MakeShpScript = "/home/scripts/grads/runners/shapefile_runner.csh";
			$ReadShpScript = "/home/scripts/grads/functions/getshapedims.py";
			$NAMshape = "/home/scripts/grads/runners/shapefiles/flt_NAM.shp";
			$NAM4KMshape = "/home/scripts/grads/runners/shapefiles/flt_NAM4KM.shp";
			$GFSshape = "/home/scripts/grads/runners/shapefiles/flt_GFS.shp";

			# Readout Scripts:
			$Readouts[0] = "/home/scripts/grads/functions/readout.gs";
			$Readouts[1] = "/home/scripts/grads/functions/readout1.gs";
			$Readouts[2] = "/home/scripts/grads/functions/readout2.gs";

			# Make the shapefiles:
			$modArr = ["NAM", "NAM4KM", "GFS"];
			putenv("GADDIR=/home/ldm/grads-2.1.a2/data");
			foreach ($modArr as $modName) {
				exec('/home/ldm/grads-2.1.a2/bin/grads -bxcl "run /home/scripts/grads/prodscripts/create_shapefile.gs 06 '.$modName.' 003 FLT"', $output);
			}

			# Read the shapefiles:
			exec("/usr/bin/python $ReadShpScript ".escapeshellarg($NAMshape), $NAMcols);
			exec("/usr/bin/python $ReadShpScript ".escapeshellarg($NAM4KMshape), $NAM4KMcols);
			exec("/usr/bin/python $ReadShpScript ".escapeshellarg($GFSshape), $GFScols);

			# First Readout Script:
			$ROfile = file($Readouts[0]);
			for ($i=0; $i < count($ROfile); $i++) { 
				if (strstr($ROfile[$i], "NAM & sector = FLT")) {
					$ROfile[$i+1] = " 'set prnopts %0.0f $NAMcols[0] 1 u'\n";
				}
				if (strstr($ROfile[$i], "NAM4KM & sector = FLT")) {
					$ROfile[$i+1] = " 'set prnopts %0.0f $NAM4KMcols[0] 1 u'\n";
				}
				if (strstr($ROfile[$i], "GFS & sector = FLT")) {
					$ROfile[$i+1] = " 'set prnopts %0.0f $GFScols[0] 1 u'\n";
				}
			}
			file_put_contents($Readouts[0], $ROfile);

			# Second Readout Script:
			$ROfile = file($Readouts[1]);
			for ($i=0; $i < count($ROfile); $i++) { 
				if (strstr($ROfile[$i], "NAM & sector = FLT")) {
					$ROfile[$i+1] = " 'set prnopts %0.1f $NAMcols[0] 1 u'\n";
				}
				if (strstr($ROfile[$i], "NAM4KM & sector = FLT")) {
					$ROfile[$i+1] = " 'set prnopts %0.1f $NAM4KMcols[0] 1 u'\n";
				}
				if (strstr($ROfile[$i], "GFS & sector = FLT")) {
					$ROfile[$i+1] = " 'set prnopts %0.1f $GFScols[0] 1 u'\n";
				}
			}
			file_put_contents($Readouts[1], $ROfile);

			# Third Readout Script:
			$ROfile = file($Readouts[2]);
			for ($i=0; $i < count($ROfile); $i++) { 
				if (strstr($ROfile[$i], "NAM & sector = FLT")) {
					$ROfile[$i+1] = " 'set prnopts %0.2f $NAMcols[0] 1 u'\n";
				}
				if (strstr($ROfile[$i], "NAM4KM & sector = FLT")) {
					$ROfile[$i+1] = " 'set prnopts %0.2f $NAM4KMcols[0] 1 u'\n";
				}
				if (strstr($ROfile[$i], "GFS & sector = FLT")) {
					$ROfile[$i+1] = " 'set prnopts %0.2f $GFScols[0] 1 u'\n";
				}
			}
			file_put_contents($Readouts[2], $ROfile);

		} catch (Exception $e) {
			print("Error dealing with shapefiles!");
		}

		# Made it this far, that's a success!
		$status = TRUE;
	} else {
		# Couldn't find the segment in the sector file.
		# I don't want to make automated changes now, bail out!
		print("Error: '".$needle."' not found in ".$sectorFile);
		return $status;
	}
	return $status;
}
?>
