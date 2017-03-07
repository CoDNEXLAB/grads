#!/bin/csh -f
#DESCRIPTION: THIS SCRIPT KICKS OFF GEFS	
#LAST EDIT:  1-15-2015  GENSINI									
#LAST EDIT: 3-7-2017 GENSINI
#####################################################
#PASS THE VALID RUN HOUR
set ModRunTime = $1
#LOCATION OF RUNNER SCRIPT
set Runner = "/home/scripts/grads/runners/gefs_runner.csh"
#Launch downloader script
csh /home/scripts/grads/kickers/gefs_downloader.csh $ModRunTime &
#DATE VARIABLE formatted YYYYMMDD
set dtstr = `date -u +%Y%m%d`
set dateForDir = `date -u +%Y%m%d`${ModRunTime}
#STRING VARIABLE FORMATTED YYMMDD
set filstr = `date -u +%y%m%d`
#MANUAL OVERRIDE OF DATE AND TIME STRING
#set dtstr = "20150114" 
#set filstr = "150114"
set datadir = "/home/data/models/gefs"
sleep 22
#BEGIN LOOP
foreach FHour (000 006 012 018 024 030 036 042 048 054 060 066 072 078 084 090 096 102 108 114 120 126 132 138 144 150 156 162 168 174 180 186 192 198 204 210 216 222 228 234 240 246 252 258 264 270 276 282 288 294 300 306 312 318 324 330 336 342 348 354 360 366 372 378 384)
	set filename = ${datadir}/${filstr}${ModRunTime}00F${FHour}.gefs
	set filegrids = `/usr/local/bin/wgrib2 ${filename} | tail -n1 | sed 's/ *:.*//'`
	set filegrids = `/usr/bin/printf '%.0f' ${filegrids}` # To make sure it's an integer
	#CHECK TO SEE IF FILE EXISTS AND IT IS GREATER THAN xx SIZE. IF NO NEW, SLEEP FOR 10s
	@ count = 0
	if ($FHour == 000) then
		while (($count < 222) && ($filegrids < 415))
			sleep 9
			set filegrids = `/usr/local/bin/wgrib2 ${filename} | tail -n1 | sed 's/ *:.*//'`
			set filegrids = `/usr/bin/printf '%.0f' ${filegrids}` # To make sure it's an integer
			@ count = $count + 1
		end
	else
		while (($count < 150) && ($filegrids < 565))
			sleep 5
			set filegrids = `/usr/local/bin/wgrib2 ${filename} | tail -n1 | sed 's/ *:.*//'`
			set filegrids = `/usr/bin/printf '%.0f' ${filegrids}` # To make sure it's an integer
			@ count = $count + 1
		end
	endif
	#process
	if ($FHour == 000) then
		echo `date` ": ${ModRunTime}Z GEFS Starting" >> /home/apache/climate/data/forecast/text/gefstimes.txt
		#python /home/scripts/stats/modtimes/nam4km.py
		csh $Runner $dateForDir $ModRunTime GEFS $FHour
		#perl /home/scripts/models/clearmodeldirpng.pl $ModRunTime NAM4KM
		
	else if ($FHour == 384) then
		csh $Runner $dateForDir $ModRunTime GEFS $FHour
		echo `date` ": ${ModRunTime}Z GEFS Finished" >> /home/apache/climate/data/forecast/text/gefstimes.txt
		#python /home/scripts/stats/modtimes/nam4km.py
	else
		csh $Runner $dateForDir $ModRunTime GEFS $FHour
	endif
	#perl /home/scripts/models/blister.pl $ModRunTime NAM4KM $FHour 87
	php /home/scripts/models/blister.php GEFS $dateForDir $FHour
end
wait
