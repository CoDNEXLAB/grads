#!/bin/csh -f
#DESCRIPTION: THIS SCRIPT DOWNLOADS GEFS ENSEMBLE DATA
#from the NCEP NOMADS server	
#LAST EDIT:  01-15-2015  GENSINI									
#LAST EDIT: 01-20-2015 GENSINI
#####################################################
source /home/gempak/NAWIPS/Gemenviron
#PASS THE VALID RUN HOUR
set ModRunTime = $1
#DATE VARIABLE formatted YYYYMMDD
set dtstr = `date -u +%Y%m%d`
#STRING VARIABLE FORMATTED YYMMDD
set filstr = `date -u +%y%m%d`
#LOCATION OF RUNNER SCRIPT
set Runner = "/home/scripts/models/gefsrunnerphp.csh"
#MANUAL OVERRIDE OF DATE AND TIME STRING
#set dtstr = "20150114" 
#set filstr = "150114"
#SET WORKING DIRECTORY FOR GFS MODEL DATA
setenv ENSEXT 0
set DIR = /home/data/models/gefs
echo ${filstr}/${ModRunTime}00F000 > /home/apache/climate/data/forecast/text/gefsstatus.txt
echo -1 >> /home/apache/climate/data/forecast/text/gefsstatus.txt
#BEGIN LOOP
foreach FHour (00 06 12 18 24 30 36 42 48 54 60 66 72 78 84 90 96 102 108 114 120 126 132 138 144 150 156 162 168 174 180 186 192 198 204 210 216 222 228 234 240 246 252 258 264 270 276 282 288 294 300 306 312 318 324 330 336 342 348 354 360 366 372 378 384)
	set strFHour = `printf "%03d" $FHour`
	foreach member ('c00' 'p01' 'p02' 'p03' 'p04' 'p05' 'p06' 'p07' 'p08' 'p09' 'p10' 'p11' 'p12' 'p13' 'p14' 'p15' 'p16' 'p17' 'p18' 'p19' 'p20')
		# Full grib file path and name:
		set filepathname = ${DIR}/${filstr}${ModRunTime}00F${strFHour}.gefs_${member}
		set count = 0
		set filesize = 0
		while (($filesize < 4444) && ($count < 50))
			wget -nv -c "http://nomads.ncep.noaa.gov/cgi-bin/filter_gens.pl?file=ge${member}.t${ModRunTime}z.pgrb2f${FHour}&lev_10_m_above_ground=on&lev_3000-0_m_above_ground=on&lev_500_mb=on&lev_850_mb=on&lev_surface=on&var_ACPCP=on&var_CFRZR=on&var_CICEP=on&var_APCP=on&var_CAPE=on&var_CIN=on&var_CRAIN=on&var_CSNOW=on&var_DPT=on&var_HLCY=on&var_PRMSL=on&var_PWAT=on&var_UGRD=on&var_VGRD=on&var_HGT=on&var_TMP=on&subregion=&leftlon=-200&rightlon=-20&toplat=90&bottomlat=5&dir=%2Fgefs.${dtstr}%2F${ModRunTime}%2Fpgrb2" -O ${filepathname}
			set filesize = `stat -c %s ${filepathname}`
			if ($filesize < 4444) then
				sleep 15
				@ count = $count + 1	
			endif
		end
		#decode
		/home/ldm/decoders/dcgrib2 /home/data/gempak/model/gefs/gefs_${member}_${dtstr}${ModRunTime}f${strFHour} < ${filepathname}
	end	
	if ($FHour == 00) then
		echo `date` ": ${ModRunTime}Z GEFS Starting" >> /home/apache/climate/data/forecast/text/gefstimes.txt
		csh $Runner $ModRunTime $strFHour
		perl /home/scripts/models/newclearmodeldir.pl $ModRunTime GEFS
	
	else if ($FHour == 384) then
		sleep 3
		csh $Runner $ModRunTime $strFHour
		echo `date` ": ${ModRunTime}Z GEFS Finished" >> /home/apache/climate/data/forecast/text/gefstimes.txt
	else
		csh $Runner $ModRunTime $strFHour
	endif
	php /home/scripts/models/blister.php GEFS $ModRunTime $FHour
	echo ${filstr}/${ModRunTime}00F${strFHour} > /home/apache/climate/data/forecast/text/gefsstatus.txt
	echo ${strFHour} >> /home/apache/climate/data/forecast/text/gefsstatus.txt
end
