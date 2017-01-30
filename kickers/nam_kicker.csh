#!/bin/csh -f
#########################################################
#THIS IS THE HOLY GRAIL OF RUNNER SCRIPTS				#		
#########################################################
#PURPOSE: RUN MODELS PROMPTLY!							#
#DESCRIPTION: THIS SCRIPT KICKS OFF MODEL RUNNERS		#
#LAST EDIT:  01/20/2016  GENSINI						#
#########################################################
#CHANGE TO WORKING DIRECTORY
cd /home/scripts/grads/kickers
#FIND CORRECT MODEL TIME
set modtime = $1
#PATH AND NAME OF MODEL RUNNER SCRIPT:
set Runner = "/home/scripts/grads/runners/nam_runner.csh"
if (`date -u +%H` < $modtime) then
	set dtstr = `date -u --date="yesterday" +%y%m%d`
	set dateForDir = `date -u --date="yesterday" +%Y%m%d`${modtime}
else
	set dtstr = `date -u +%y%m%d`
	set dateForDir = `date -u +%Y%m%d`${modtime}
endif
set datadir = "/home/data/models/nam_218"
###############################################
#BEGIN SNAKE LOOP TO CHECK FOR AVAILABLE TIMES#
###############################################
foreach FHour (000 003 006 009 012 015 018 021 024 027 030 033 036 039 042 045 048 051 054 057 060 063 066 069 072 075 078 081 084)
	set filename = ${datadir}/${dtstr}${modtime}00F${FHour}.nam218
	set filegrids = `/usr/local/bin/wgrib2 ${filename} | tail -n1 | sed 's/ *:.*//'`
	set filegrids = `/usr/bin/printf '%.0f' ${filegrids}` # To make sure it's an integer
	#CHECK TO SEE IF FILE EXISTS AND IT IS GREATER THAN xx SIZE. IF NO NEW, SLEEP FOR 10s
	@ count = 0
	echo "count='${count}'"
	echo "filegrids='${filegrids}'"
	if ($FHour == 000) then
		while (($count < 200) && ($filegrids < 420))
			sleep 10
			set filegrids = `/usr/local/bin/wgrib2 ${filename} | tail -n1 | sed 's/ *:.*//'`
			set filegrids = `/usr/bin/printf '%.0f' ${filegrids}` # To make sure it's an integer
			@ count = $count + 1
			echo "count='${count}'"
			echo "filegrids='${filegrids}'"
		end
	else
		while (($count < 150) && ($filegrids < 420))
			sleep 5
			set filegrids = `/usr/local/bin/wgrib2 ${filename} | tail -n1 | sed 's/ *:.*//'`
			set filegrids = `/usr/bin/printf '%.0f' ${filegrids}` # To make sure it's an integer
			@ count = $count + 1
		end
	endif
	if ($FHour == 084) then
		#nice +10 /usr/local/bin/wgrib2 ${filename} -small_grib -140:-55 17:60 ${filename}c
		csh $Runner $dateForDir $modtime NAM $FHour
		php /home/scripts/models/blister.php NAM $dateForDir $FHour
		echo `date` ": ${modtime}Z NAM Finished" >> /home/apache/climate/data/forecast/text/namtimes.txt
			python /home/scripts/stats/modtimes/nam.py
	else
		if ($FHour == 000) then
			echo `date` ": ${modtime}Z NAM Starting" >> /home/apache/climate/data/forecast/text/namtimes.txt
			python /home/scripts/stats/modtimes/nam.py
			#nice +10 /usr/local/bin/wgrib2 ${filename} -small_grib -140:-55 17:60 ${filename}c
			csh $Runner $dateForDir $modtime NAM $FHour
			perl /home/scripts/models/clearmodeldirpng.pl $modtime NAM
		else
			#nice +10 /usr/local/bin/wgrib2 ${filename} -small_grib -140:-55 17:60 ${filename}c
			csh $Runner $dateForDir $modtime NAM $FHour
		endif			
		php /home/scripts/models/blister.php NAM $dateForDir $FHour
	endif
end	
exit

