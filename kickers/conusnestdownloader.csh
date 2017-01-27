#!/bin/csh -f
#DESCRIPTION: THIS SCRIPT DOWNLOADS NAM CONUS NEST
#from the NCEP NOMADS server	
#LAST EDIT:  01-15-2015  GENSINI									
#LAST EDIT: 01-20-2015 GENSINI
#####################################################
#PASS THE VALID RUN HOUR
set ModRunTime = $1
#DATE VARIABLE formatted YYYYMMDD
set dtstr = `date -u +%Y%m%d`
#STRING VARIABLE FORMATTED YYMMDD
set filstr = `date -u +%y%m%d`
#MANUAL OVERRIDE OF DATE AND TIME STRING
#set dtstr = "20150114" 
#set filstr = "150114"
#SET WORKING DIRECTORY FOR NAM MODEL DATA
set DIR = /home/data/models/nam_conus_nest
echo ${filstr}/${ModRunTime}00F000 > /home/apache/climate/data/forecast/text/nam4kmstatus.txt
echo -1 >> /home/apache/climate/data/forecast/text/nam4kmstatus.txt
#BEGIN LOOP
foreach FHour (00 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 39 42 45 48 51 54 57 60)
	# Full grib file path and name: (Z)
	set filepathname = ${DIR}/${filstr}${ModRunTime}00F0${FHour}.nam4km	
	set filepathnamesnd = ${DIR}/${filstr}${ModRunTime}00F0${FHour}.nam4km.sound
	set count = 0
	set filesize = 0
	while (($filesize < 17000000) && ($count < 75))
		wget -nv -c "http://nomads.ncep.noaa.gov/cgi-bin/filter_nam_conusnest.pl?file=nam.t${ModRunTime}z.conusnest.hiresf${FHour}.tm00.grib2&lev_1000-0_m_above_ground=on&lev_1000_mb=on&lev_top_of_atmosphere=on&var_BRTMP=on&lev_10_m_above_ground=on&lev_180-0_mb_above_ground=on&lev_2_m_above_ground=on&lev_3000-0_m_above_ground=on&lev_5000-2000_m_above_ground=on&lev_500_mb=on&lev_6000-0_m_above_ground=on&lev_850_mb=on&lev_entire_atmosphere_%5C%28considered_as_a_single_layer%5C%29=on&lev_mean_sea_level=on&lev_surface=on&lev_cloud_ceiling=on&var_SNOD=on&var_APCP=on&var_CAPE=on&var_CIN=on&var_DPT=on&var_HGT=on&var_HLCY=on&var_MSLET=on&var_MXUPHL=on&var_PRMSL=on&var_REFC=on&var_TMP=on&var_UGRD=on&var_CFRZR=on&var_CICEP=on&var_CRAIN=on&var_CSNOW=on&var_USTM=on&var_GUST=on&var_4LFTX=on&var_VGRD=on&var_VSTM=on&dir=%2Fnam.${dtstr}" -O ${filepathname}
		wget -nv -c "http://nomads.ncep.noaa.gov/cgi-bin/filter_nam_conusnest.pl?file=nam.t${ModRunTime}z.conusnest.hiresf${FHour}.tm00.grib2&lev_1000_mb=on&lev_100_mb=on&lev_10_m_above_ground=on&lev_150_mb=on&lev_200_mb=on&lev_250_mb=on&lev_2_m_above_ground=on&lev_300_mb=on&lev_350_mb=on&lev_400_mb=on&lev_450_mb=on&lev_500_mb=on&lev_550_mb=on&lev_600_mb=on&lev_650_mb=on&lev_700_mb=on&lev_750_mb=on&lev_800_mb=on&lev_825_mb=on&lev_850_mb=on&lev_875_mb=on&lev_900_mb=on&lev_925_mb=on&lev_950_mb=on&lev_975_mb=on&lev_surface=on&var_HGT=on&var_PRES=on&var_RH=on&var_TMP=on&var_UGRD=on&var_VGRD=on&var_VVEL=on&leftlon=0&rightlon=360&toplat=90&bottomlat=-90&dir=%2Fnam.${dtstr}" -O ${filepathnamesnd}
		set filesize = `stat -c %s ${filepathname}`
		if ($filesize < 17000000) then
			sleep 15
			@ count = $count + 1
		endif
	end
	#decode
	echo ${filstr}/${ModRunTime}00F0${FHour} > /home/apache/climate/data/forecast/text/nam4kmstatus.txt
	echo 0${FHour} >> /home/apache/climate/data/forecast/text/nam4kmstatus.txt
end
