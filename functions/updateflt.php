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
		#die();
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

		# Send the new file to Atlas:
		// try {
		// 	exec("scp -P 31950 ".escapeshellarg($sectorFile)." ldm@atlas:".escapeshellarg($sectorFile),$out);
		// 	#print_r($out);
		// } catch (Exception $e) {
		// 	print("Error sending file to Atlas: ".$sectorFile);
		// 	return $status;
		// 	#die();
		// }

		# Made it this far, that's a success!
		$status = TRUE;
	} else {
		# Couldn't find the segment in the sector file.
		# I don't want to make automated changes now, bail out!
		print("Error: '".$needle."' not found in ".$sectorFile);
		return $status;
		#die();		
	}
	return $status;
}
?>