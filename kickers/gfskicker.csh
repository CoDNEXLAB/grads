#!/bin/csh -f
#DESCRIPTION: THIS SCRIPT STARTS GFS0.5 RUNNER
#from the NCEP NOMADS server	
#LAST EDIT:  01-15-2015  GENSINI									
#LAST EDIT: 02-27-2015 GENSINI
#LAST EDIT TO ADD wgrib2 clip for change back to CONDUIT feed
#LAST EDIT: 09-09-2015 & 09-10-2015 ZURANSKI
#LAST EDIT TO reenable downloader script, and to sleep on -1 in status file because that's what the downloader does. /shrug
#####################################################
# START TIME added by DaveBB for debugging
echo __STARTTIME__
/bin/date
#PASS THE VALID RUN HOUR
set ModRunTime = $1
#LOCATION OF RUNNER SCRIPT
set Runner = "/home/scripts/grads/runners/gfs_runner.csh"
#Launch downloader script
csh /home/scripts/grads/kickers/gfsdownloader.csh $ModRunTime &
#DATE VARIABLE formatted YYYYMMDD
set dtstr = `date -u +%Y%m%d`
set dateForDir = `date -u +%Y%m%d`${ModRunTime}
#STRING VARIABLE FORMATTED YYMMDD
set filstr = `date -u +%y%m%d`
#MANUAL OVERRIDE OF DATE AND TIME STRING
#set dtstr = "20150114" 
#set filstr = "150114"
sleep 10
set DIR = /home/data/models/gfs_004
set valid = `awk '{if (NR==2) print}' /home/apache/climate/data/forecast/text/gfs0.5status.txt`
while (($valid == 384) || ($valid == -1))
	sleep 60
	set valid = `awk '{if (NR==2) print}' /home/apache/climate/data/forecast/text/gfs0.5status.txt`
end

#BEGIN LOOP
foreach FHour (000 003 006 009 012 015 018 021 024 027 030 033 036 039 042 045 048 051 054 057 060 063 066 069 072 075 078 081 084 087 090 093 096 099 102 105 108 111 114 117 120 123 126 129 132 135 138 141 144 147 150 153 156 159 162 165 168 171 174 177 180 183 186 189 192 195 198 201 204 207 210 213 216 219 222 225 228 231 234 237 240 252 264 276 288 300 312 324 336 348 360 372 384)
	set valid = `awk '{if (NR==2) print}' /home/apache/climate/data/forecast/text/gfs0.5status.txt`
	set count = 0
	while (($valid < $FHour) && ($count < 20))
		sleep 120
		@ count = $count + 1	
		set valid = `awk '{if (NR==2) print}' /home/apache/climate/data/forecast/text/gfs0.5status.txt`
	end
	set filepathname = ${DIR}/${filstr}${ModRunTime}00F${FHour}.gfs004
	#nice +10 /usr/local/bin/wgrib2 ${filepathname} -small_grib -140:-55 17:60 ${filepathname}c
	#process
	if ($FHour == 000) then
		echo `date` ": ${ModRunTime}Z GFS Starting" >> /home/apache/climate/data/forecast/text/gfstimes.txt
        python /home/scripts/stats/modtimes/gfs.py
		csh $Runner $dateForDir $ModRunTime GFS $FHour
		#perl /home/scripts/models/clearmodeldirpng.pl $ModRunTime GFS
		
	else if ($FHour == 384) then
		csh $Runner $dateForDir $ModRunTime GFS $FHour
		echo `date` ": ${ModRunTime}Z GFS Finished" >> /home/apache/climate/data/forecast/text/gfstimes.txt
        python /home/scripts/stats/modtimes/gfs.py
	else
		csh $Runner $dateForDir $ModRunTime GFS $FHour
	endif
	php /home/scripts/models/blister.php GFS $dateForDir $FHour
end
wait
#Added by DaveBB on 20151016 for monitoring download speeds from the wget downloader script.  This data will be used for graphing the download speeds over time
/bin/grep saved /home/ldm/model_logs/gfskicker$ModRunTime.log >> /home/apache/climate/tmp1/gfsdownloadlogs.txt
# END TIME
echo __ENDTIME__
/bin/date
