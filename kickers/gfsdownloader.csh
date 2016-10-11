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
set DIR = /home/data/models/gfs_004
echo ${filstr}/${ModRunTime}00F000 > /home/apache/climate/data/forecast/text/gfs0.5status.txt
echo -1 >> /home/apache/climate/data/forecast/text/gfs0.5status.txt
#BEGIN LOOP
foreach FHour (000 003 006 009 012 015 018 021 024 027 030 033 036 039 042 045 048 051 054 057 060 063 066 069 072 075 078 081 084 087 090 093 096 099 102 105 108 111 114 117 120 123 126 129 132 135 138 141 144 147 150 153 156 159 162 165 168 171 174 177 180 183 186 189 192 195 198 201 204 207 210 213 216 219 222 225 228 231 234 237 240 252 264 276 288 300 312 324 336 348 360 372 384)
	# Full grib file path and name:
	set filepathname = ${DIR}/${filstr}${ModRunTime}00F${FHour}.gfs004
	set count = 0
	set filesize = 0
	while (($filesize < 57000000) && ($count < 100))
		wget -v -c "http://nomads.ncep.noaa.gov/pub/data/nccf/com/gfs/prod/gfs.${dtstr}${ModRunTime}/gfs.t${ModRunTime}z.pgrb2.0p50.f${FHour}" -O ${filepathname}
		set filesize = `stat -c %s ${filepathname}`
		if ($filesize < 57000000) then
			sleep 15
			@ count = $count + 1	
		endif
	end
	#decode
	#/home/ldm/decoders/dcgrib2 /home/data/gempak/model/gfs0.5deg/${dtstr}${ModRunTime}f${FHour}_gfs.gem < ${filepathname}
	# WGRIB2 SUBSET FOR WXP FORECAST SOUNDINGS
	nice +10 /usr/local/bin/wgrib2 ${filepathname} -small_grib -140:-55 17:60 ${filepathname}c
	echo ${filstr}/${ModRunTime}00F${FHour} > /home/apache/climate/data/forecast/text/gfs0.5status.txt
	echo ${FHour} >> /home/apache/climate/data/forecast/text/gfs0.5status.txt
end
