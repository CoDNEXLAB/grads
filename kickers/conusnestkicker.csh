#!/bin/csh -f
#DESCRIPTION: THIS SCRIPT KICKS OFF NAM CONUS NEST	
#LAST EDIT:  1-15-2015  GENSINI									
#LAST EDIT: 2-3-2017 GENSINI
#####################################################
#PASS THE VALID RUN HOUR
set ModRunTime = $1
#LOCATION OF RUNNER SCRIPT
set Runner = "/home/scripts/grads/runners/nam4km_runner.csh"
#Launch downloader script
csh /home/scripts/grads/kickers/conusnestdownloader.csh $ModRunTime &
#DATE VARIABLE formatted YYYYMMDD
set dtstr = `date -u +%Y%m%d`
set dateForDir = `date -u +%Y%m%d`${ModRunTime}
#STRING VARIABLE FORMATTED YYMMDD
set filstr = `date -u +%y%m%d`
#MANUAL OVERRIDE OF DATE AND TIME STRING
#set dtstr = "20150114" 
#set filstr = "150114"
sleep 15
#BEGIN LOOP
foreach FHour (00 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60)
	set valid = `awk '{if (NR==2) print}' /home/apache/servername/data/forecast/text/nam4kmstatus.txt`
	set count = 0
	while (($valid < $FHour) && ($count < 85))
		sleep 20
		@ count = $count + 1	
		set valid = `awk '{if (NR==2) print}' /home/apache/servername/data/forecast/text/nam4kmstatus.txt`
	end	
	#process
	if ($FHour == 00) then
		echo `date` ": ${ModRunTime}Z NAM4KM Starting" >> /home/apache/servername/data/forecast/text/nam4kmtimes.txt
		python /home/scripts/stats/modtimes/nam4km.py
		csh $Runner $dateForDir $ModRunTime NAM4KM 0$FHour
		#perl /home/scripts/models/clearmodeldirpng.pl $ModRunTime NAM4KM
		
	else if ($FHour == 60) then
		csh $Runner $dateForDir $ModRunTime NAM4KM 0$FHour
		echo `date` ": ${ModRunTime}Z NAM4KM Finished" >> /home/apache/servername/data/forecast/text/nam4kmtimes.txt
		python /home/scripts/stats/modtimes/nam4km.py
	else
		csh $Runner $dateForDir $ModRunTime NAM4KM 0$FHour
	endif
	#perl /home/scripts/models/blister.pl $ModRunTime NAM4KM $FHour 87
	ssh -p31950 climate /usr/bin/php /home/scripts/models/blister.php NAM4KM $dateForDir $FHour
end
wait
