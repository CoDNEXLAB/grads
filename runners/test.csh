#!/usr/bin/csh
set ModRunTime = $1
set ModName = $2
set FHour = $3
set dataDir = "/home/data/models"

switch ($ModName)
	case 'NAM':
		set modDir = 'nam_218'
		breaksw
	case 'NAMAK':
		set modDir = 'nam_242'
		breaksw
	case 'NAM4KM':
		set modDir = 'nam_conus_nest'
		breaksw
	case 'GFS':
		set modDir = 'gfs_004'
		breaksw
	case 'GEFS':
		set modDir = 'gefs'
		breaksw
	case 'HRRR':
		set modDir = 'hrrr'
		breaksw
	case 'RAP':
		set modDir = 'rap'
		breaksw
	case 'CFS':
		set modDir = 'cfs'
		breaksw
	default:
		set modDir = 'nam_conus_nest'
		breaksw
endsw
# Find the data file we are looking for:
if (($FHour == 000) || ($FHour == 003)) then
	#set dataFile = `find ${dataDir}/${modDir}/*${ModRunTime}00F${FHour}.* ! -name '*c' ! -name '*.idx'| tail -n1`
	#set ctlFile = `echo ${dataFile} | sed -e "s/00F[^ ]../00F%f3/"`
	#perl /home/scripts/grads/functions/nam_g2ctl.pl ${ctlFile} > ${dataDir}/grads_ctl/${ModName}/${ModRunTime}${ModName}.ctl
	set dataFile = `find ${dataDir}/nam_242/*${ModRunTime}00F${FHour}.* ! -name '*c' ! -name '*.idx'| tail -n1`
	set ctlFile = `echo ${dataFile} | sed -e "s/00F[^ ]../00F%f3/"`
	perl /home/scripts/grads/functions/nam_g2ctl.pl ${ctlFile} > ${dataDir}/grads_ctl/NAMAK/${ModRunTime}NAMAK.ctl
endif
gribmap -q -i ${dataDir}/grads_ctl/${ModName}/${ModRunTime}${ModName}.ctl
#foreach Sector (US MW SGP CGP NGP SW NW SE MA NE)
foreach Sector (WCAN)
	#mkdir -p /home/apache/climate/data/forecast/${ModName}/${ModRunTime}/${Sector}
	grads -bxcl "run /home/scripts/grads/runners/test_prodlist.gs ${ModRunTime} ${ModName} ${FHour} ${Sector}" &
end
wait
