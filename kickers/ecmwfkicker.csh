#!/bin/csh -f
#DESCRIPTION: THIS SCRIPT STARTS GFS0.5 RUNNER
#from the NCEP NOMADS server	
#LAST EDIT:  01-15-2015  GENSINI									
#LAST EDIT: 02-27-2015 GENSINI
#LAST EDIT TO ADD wgrib2 clip for change back to CONDUIT feed
#LAST EDIT: 09-09-2015 & 09-10-2015 ZURANSKI
#LAST EDIT TO reenable downloader script, and to sleep on -1 in status file because that's what the downloader does. /shrug
#####################################################
#PASS THE VALID RUN HOUR
set ModRunTime = $1
#LOCATION OF RUNNER SCRIPT
set Runner = "/home/scripts/grads/runners/ecmwf_runner.csh"
#Launch downloader script
csh /home/scripts/grads/kickers/ecmwfdownloader.csh $ModRunTime &
#DATE VARIABLE formatted YYYYMMDD
set dtstr = `date -u +%Y%m%d`
set dateForDir = `date -u +%Y%m%d`${ModRunTime}
#STRING VARIABLE FORMATTED YYMMDD
set filstr = `date -u +%y%m%d`
#MANUAL OVERRIDE OF DATE AND TIME STRING
#set dtstr = "20150114" 
#set filstr = "150114"
sleep 15
set DIR = /home/data/models/ecmwf
set valid = `awk '{if (NR==2) print}' /home/apache/climate/data/forecast/text/ecmwfstatus.txt`
while (($valid == 240) || ($valid == -1))
	sleep 60
	set valid = `awk '{if (NR==2) print}' /home/apache/climate/data/forecast/text/ecmwfstatus.txt`
end

#BEGIN LOOP
foreach FHour (000 024 048 072 096 120 144 168 192 216 240)
	set valid = `awk '{if (NR==2) print}' /home/apache/climate/data/forecast/text/ecmwfstatus.txt`
	set count = 0
	while (($valid < $FHour) && ($count < 20))
		sleep 60
		@ count = $count + 1	
		set valid = `awk '{if (NR==2) print}' /home/apache/climate/data/forecast/text/ecmwfstatus.txt`
	end
	set filepathname = ${DIR}/${filstr}${ModRunTime}00F${FHour}.ecmwf
	#nice +10 /usr/local/bin/wgrib2 ${filepathname} -small_grib -140:-55 17:60 ${filepathname}c
	#process
	if ($FHour == 000) then
		echo `date` ": ${ModRunTime}Z ECMWF Starting" >> /home/apache/climate/data/forecast/text/ecmwftimes.txt
        #python /home/scripts/stats/modtimes/gfs.py
		csh $Runner $dateForDir $ModRunTime ECMWF $FHour
		perl /home/scripts/models/clearmodeldirpng.pl $ModRunTime ECMWF
		
	else if ($FHour == 240) then
		csh $Runner $dateForDir $ModRunTime ECMWF $FHour
		echo `date` ": ${ModRunTime}Z ECMWF Finished" >> /home/apache/climate/data/forecast/text/ecmwftimes.txt
        #python /home/scripts/stats/modtimes/gfs.py
	else
		csh $Runner $dateForDir $ModRunTime ECMWF $FHour
	endif
	php /home/scripts/models/blister.php ECMWF $dateForDir $FHour
end
wait
#Added by DaveBB on 20151016 for monitoring download speeds from the wget downloader script.  This data will be used for graphing the download speeds over time
#/bin/grep saved /home/ldm/model_logs/gfskicker$ModRunTime.log >> /home/apache/climate/tmp1/gfsdownloadlogs.txt

