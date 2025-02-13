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
#csh /home/scripts/grads/kickers/gefs_downloader.csh $ModRunTime &
#DATE VARIABLE formatted YYYYMMDD
set dtstr = `date -u +%Y%m%d`
set dateForDir = `date -u +%Y%m%d`${ModRunTime}
#STRING VARIABLE FORMATTED YYMMDD
set filstr = `date -u +%y%m%d`
#MANUAL OVERRIDE OF DATE AND TIME STRING
#set dtstr = "20170307" 
#set filstr = "170307"
set DIR = "/home/data/models/gefs"
echo ${filstr}/${ModRunTime}00F000 > /home/apache/climate/data/forecast/text/gefsstatus.txt
echo -1 >> /home/apache/climate/data/forecast/text/gefsstatus.txt
sleep 5
#BEGIN LOOP
foreach FHour (00 06 12 18 24 30 36 42 48 54 60 66 72 78 84 90 96 102 108 114 120 126 132 138 144 150 156 162 168 174 180 186 192 198 204 210 216 222 228 234 240 246 252 258 264 270 276 282 288 294 300 306 312 318 324 330 336 342 348 354 360 366 372 378 384)
	foreach member ('c00' 'p01' 'p02' 'p03' 'p04' 'p05' 'p06' 'p07' 'p08' 'p09' 'p10' 'p11' 'p12' 'p13' 'p14' 'p15' 'p16' 'p17' 'p18' 'p19' 'p20')
		set strFHour = `printf "%03d" $FHour`
		set filename = ${DIR}/${filstr}${ModRunTime}00F${strFHour}.gefs_${member}
		set filegrids = 0
		@ count = 0
		if (${FHour} == 00) then 
			while (($filegrids < 20) && ($count < 51))
				wget -nv -c "http://nomads.ncep.noaa.gov/cgi-bin/filter_gens.pl?file=ge${member}.t${ModRunTime}z.pgrb2f${FHour}&lev_10_m_above_ground=on&lev_3000-0_m_above_ground=on&lev_500_mb=on&lev_850_mb=on&lev_mean_sea_level=on&lev_surface=on&var_ACPCP=on&var_CFRZR=on&var_PRES=on&lev_2_m_above_ground=on&var_CICEP=on&var_APCP=on&var_CAPE=on&var_CIN=on&var_CRAIN=on&var_CSNOW=on&var_DPT=on&var_HLCY=on&var_PRMSL=on&var_PWAT=on&var_UGRD=on&var_VGRD=on&var_HGT=on&var_TMP=on&subregion=&leftlon=0&rightlon=360&toplat=80&bottomlat=-5&dir=%2Fgefs.${dtstr}%2F${ModRunTime}%2Fpgrb2" -O ${filename}
				set filegrids = `/usr/local/bin/wgrib2 ${filename} | tail -n1 | sed 's/ *:.*//'`
                set filegrids = `/usr/bin/printf '%.0f' ${filegrids}` # To make sure it's an integer
				if ($filegrids < 20) then
					sleep 15
					@ count = $count + 1	
				endif
			end
		else
			while (($filegrids < 27) && ($count < 51))
				wget -nv -c "http://nomads.ncep.noaa.gov/cgi-bin/filter_gens.pl?file=ge${member}.t${ModRunTime}z.pgrb2f${FHour}&lev_10_m_above_ground=on&lev_3000-0_m_above_ground=on&lev_500_mb=on&lev_850_mb=on&lev_mean_sea_level=on&lev_surface=on&var_ACPCP=on&var_CFRZR=on&var_PRES=on&lev_2_m_above_ground=on&var_CICEP=on&var_APCP=on&var_PRATE=on&var_CAPE=on&var_CIN=on&var_CRAIN=on&var_CSNOW=on&var_DPT=on&var_HLCY=on&var_PRMSL=on&var_PWAT=on&var_UGRD=on&var_VGRD=on&var_HGT=on&var_TMP=on&subregion=&leftlon=0&rightlon=360&toplat=80&bottomlat=-5&dir=%2Fgefs.${dtstr}%2F${ModRunTime}%2Fpgrb2" -O ${filename}
				set filegrids = `/usr/local/bin/wgrib2 ${filename} | tail -n1 | sed 's/ *:.*//'`
				set filegrids = `/usr/bin/printf '%.0f' ${filegrids}` # To make sure it's an integer
				if ($filegrids < 26) then
					sleep 15
					@ count = $count + 1
				endif
			end
		endif
	end
	#process
	if ($FHour == 00) then
		echo `date` ": ${ModRunTime}Z GEFS Starting" >> /home/apache/climate/data/forecast/text/gefstimes.txt
		#python /home/scripts/stats/modtimes/nam4km.py
		csh $Runner $dateForDir $ModRunTime GEFS $strFHour
		#perl /home/scripts/models/clearmodeldirpng.pl $ModRunTime NAM4KM
		
	else if ($FHour == 384) then
		csh $Runner $dateForDir $ModRunTime GEFS $strFHour
		echo `date` ": ${ModRunTime}Z GEFS Finished" >> /home/apache/climate/data/forecast/text/gefstimes.txt
		#python /home/scripts/stats/modtimes/nam4km.py
	else
		csh $Runner $dateForDir $ModRunTime GEFS $strFHour
	endif
	#perl /home/scripts/models/blister.pl $ModRunTime NAM4KM $FHour 87
	php /home/scripts/models/blister.php GEFS $dateForDir $strFHour
	echo ${filstr}/${ModRunTime}00F${strFHour} > /home/apache/climate/data/forecast/text/gefsstatus.txt
	echo ${strFHour} >> /home/apache/climate/data/forecast/text/gefsstatus.txt
end
wait
