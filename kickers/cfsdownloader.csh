#!/bin/csh -f
#DESCRIPTION: THIS SCRIPT DOWNLOADS CFS DATA
#from the NCEP NOMADS server	
#LAST EDIT: 02-20-2015  GENSINI									
#LAST EDIT: 02-20-2015 GENSINI
#####################################################
#PASS THE VALID RUN HOUR
set ModRunTime = $1
#DATE VARIABLE formatted YYYYMMDD
if ($ModRunTime == 18) then
	set dtstr = `date -d "-1 day" +%Y%m%d`
	set filstr = `date -d "-1 day" +%y%m%d`
	set InitDate = `date -d "-1 day" +"%b %d %Y"`
else
	set dtstr = `date -u +%Y%m%d`
	set filstr = `date -u +%y%m%d`
	set InitDate = `date +"%b %d %Y"`
endif
set InitDate = `date -d "${InitDate} + ${ModRunTime} hours"`
#set dtstrh = `date -u +%Y%m%d%H`
#STRING VARIABLE FORMATTED YYMMDD
#set filstr = `date -u +%y%m%d`
#MANUAL OVERRIDE OF DATE AND TIME STRING
#set dtstr = "20150219" 
#set filstr = "150219"
#SET WORKING DIRECTORY FOR GFS MODEL DATA
set DIR = /home/data/models/cfs
echo ${filstr}/${ModRunTime}00F000 > /home/apache/climate/data/forecast/text/cfsstatus.txt
echo -1 >> /home/apache/climate/data/forecast/text/cfsstatus.txt
#BEGIN LOOP
foreach FHour (000 006 012 018 024 030 036 042 048 054 060 066 072 078 084 090 096 102 108 114 120 126 132 138 144 150 156 162 168 174 180 186 192 198 204 210 216 222 228 234 240 246 252 258 264 270 276 282 288 294 300 306 312 318 324 330 336 342 348 354 360 366 372 378 384 390 396 402 408 414 420 426 432 438 444 450 456 462 468 474 480 486 492 498 504 510 516 522 528 534 540 546 552 558 564 570 576 582 588 594 600 606 612 618 624 630 636 642 648 654 660 666 672 678 684 690 696 702 708 714 720 726 732 738 744 750 756 762 768 774 780 786 792 798)
	# Full grib file path and name: (Z)
	set filepathname = ${DIR}/${filstr}${ModRunTime}00F${FHour}.cfs
	set count = 0
	set filesize = 0
	set ftime = ( `date -d "${InitDate} +${FHour} hours" +%Y%m%d%H` )
	while (($filesize < 444) && ($count < 75))
		wget -nv -c "http://nomads.ncep.noaa.gov/cgi-bin/filter_cfs_pgb.pl?file=pgbf${ftime}.01.${dtstr}${ModRunTime}.grb2&lev_3000-0_m_above_ground=on&lev_500_mb=on&lev_850_mb=on&lev_mean_sea_level=on&lev_surface=on&var_CAPE=on&var_HGT=on&var_HLCY=on&var_PRMSL=on&var_TMP=on&var_UGRD=on&var_VGRD=on&var_CIN=on&var_HGT=on&lev_2_m_above_ground=on&leftlon=0&rightlon=360&toplat=90&bottomlat=-90&dir=%2Fcfs.${dtstr}%2F${ModRunTime}%2F6hrly_grib_01" -O ${filepathname}
		set filesize = `stat -c %s ${filepathname}`
		if ($filesize < 444) then
			sleep 15
			@ count = $count + 1	
		endif
	end
	#decode
	/home/ldm/decoders/dcgrib2 -d /home/data/gempak/logs/dcgrib2_cfs.log /home/data/gempak/model/cfs/${dtstr}${ModRunTime}F${FHour}_cfs.gem < ${filepathname}
	echo ${filstr}/${ModRunTime}00F${FHour} > /home/apache/climate/data/forecast/text/cfsstatus.txt
	echo ${FHour} >> /home/apache/climate/data/forecast/text/cfsstatus.txt
end
