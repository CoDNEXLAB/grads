#!/bin/csh -f
#DESCRIPTION: THIS SCRIPT DOWNLOADS GFS 0.5 deg data
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
#SET WORKING DIRECTORY FOR GFS MODEL DATA
set DIR = /home/data/models/ecmwf
cd $DIR
echo ${filstr}/${ModRunTime}00F000 > /home/apache/servername/data/forecast/text/ecmwfstatus.txt
echo -1 >> /home/apache/servername/data/forecast/text/ecmwfstatus.txt
#BEGIN LOOP
foreach FHour (000 024 048 072 096 120 144 168 192 216 240)
    switch ($FHour)
	case 000:
		set namehr = 'an'
		breaksw
	case 024:
		set namehr = '24h'
		breaksw
	case 048:
		set namehr = '48h'
		breaksw
	case 072:
		set namehr = '72h'
		breaksw
	case 096:
		set namehr = '96h'
		breaksw
	case 120:
		set namehr = '120h'
		breaksw
	case 144:
		set namehr = '144h'
		breaksw
	case 168:
		set namehr = '168h'
		breaksw
	case 192:
		set namehr = '192h'
		breaksw
	case 216:
		set namehr = '216h'
		breaksw
	case 240:
		set namehr = '240h'
		breaksw
	default:
		set namehr = 0
		breaksw
    endsw
	# Full grib file path and name:
	set filepathname = ${DIR}/${filstr}${ModRunTime}00F${FHour}.ecmwf
	set count = 0
	set filesize = 0
	while (($filesize < 750000) && ($count < 100))
		#wget -v -rnc "http://nomads.ncep.noaa.gov/pub/data/nccf/com/gfs/prod/gfs.${dtstr}${ModRunTime}/gfs.t${ModRunTime}z.pgrb2.0p50.f${FHour}" -O ${filepathname}
		wget -r -A "*??ECMF*_ECMF_*_${namehr}_*" "ftp://wmo:essential@data-portal.ecmwf.int/${dtstr}${ModRunTime}0000/" -O ${filepathname}
		set filesize = `stat -c %s ${filepathname}`
		if ($filesize < 750000) then
			sleep 10
			@ count = $count + 1	
		endif
	end
	echo ${filstr}/${ModRunTime}00F${FHour} > /home/apache/servername/data/forecast/text/ecmwfstatus.txt
	echo ${FHour} >> /home/apache/servername/data/forecast/text/ecmwfstatus.txt
end
