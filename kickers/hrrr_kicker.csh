#!/bin/csh -f
#########################################################
#THIS IS THE HOLY GRAIL OF RUNNER SCRIPTS				#		
#########################################################
#PURPOSE: RUN MODELS PROMPTLY!							#
#DESCRIPTION: THIS SCRIPT KICKS OFF MODEL RUNNERS		#
#LAST EDIT:  03/03/2017  GENSINI						#
#########################################################
#CHANGE TO WORKING DIRECTORY
cd /home/scripts/grads/kickers

#FIND CORRECT MODEL TIME
set modtime = $1

#PATH AND NAME OF MODEL RUNNER SCRIPT:
set Runner = "/home/scripts/grads/runners/hrrr_runner.csh"
if (`date -u +%H` < $modtime) then
	set dtstr = `date -u --date="yesterday" +%y%m%d`
	set dateForDir = `date -u --date="yesterday" +%Y%m%d`${modtime}
else
	set dtstr = `date -u +%y%m%d`
	set dateForDir = `date -u +%Y%m%d`${modtime}
endif
set datadir = "/home/data/models/hrrr"
###############################################
#BEGIN SNAKE LOOP TO CHECK FOR AVAILABLE TIMES#
###############################################
foreach FHour (000 001 002 003 004 005 006 007 008 009 010 011 012 013 014 015 016 017 018)
	set filename = ${datadir}/${dtstr}${modtime}00F${FHour}.hrrr
	set filegrids = `/usr/local/bin/wgrib2 ${filename}.temp | tail -n1 | sed 's/ *:.*//'`
	#CHECK TO SEE IF FILE EXISTS AND IT IS GREATER THAN xx SIZE. IF NO NEW, SLEEP FOR 10s
	@ count = 0
	#79
	#81
	if ($FHour == 000) then
		while (($count < 60) && ($filegrids < 79 ))
			sleep 10
			set filegrids = `/usr/local/bin/wgrib2 ${filename}.temp | tail -n1 | sed 's/ *:.*//'`
			@ count = $count + 1
		end
	else
		while (($count < 60) && ($filegrids < 81 ))
			sleep 5
			set filegrids = `/usr/local/bin/wgrib2 ${filename}.temp | tail -n1 | sed 's/ *:.*//'`
			@ count = $count + 1
		end
	endif
	#wgrib2mv is using 16 cores as we have found it optimal
	/home/scripts/fsonde/wgrib2mv 16 ${filename}.temp -set_grib_type c3 -new_grid_winds earth -new_grid_vectors none -new_grid latlon 238.445999:2145:0.0246001009814572 20.191999:1377:0.0230882090909091 ${filename}
	rm ${filename}.temp
	if ($FHour == 018) then
		csh $Runner $dateForDir $modtime HRRR $FHour
		php /home/scripts/models/blister.php HRRR $dateForDir $FHour
		echo `date` ": ${modtime}Z HRRR Finished" >> /home/apache/atlas/data/forecast/text/hrrrtimes.txt
	else
		if ($FHour == 000) then
			echo `date` ": ${modtime}Z HRRR Starting" >> /home/apache/atlas/data/forecast/text/hrrrtimes.txt
			csh $Runner $dateForDir $modtime HRRR $FHour
			#perl /home/scripts/models/newclearmodeldir.pl $modtime HRRR
		else
			csh $Runner $dateForDir $modtime HRRR $FHour
		endif			
		php /home/scripts/models/blister.php HRRR $dateForDir $FHour
	endif
end	
exit

