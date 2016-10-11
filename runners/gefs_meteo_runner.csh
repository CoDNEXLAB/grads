#!/usr/bin/csh
set ModRunTime = $1
set ModName = $2
set dataDir = "/home/data/models"

switch ($ModName)
	case 'NAM':
		set modDir = 'nam_218'
		breaksw
	case 'NAM4KM':
		set modDir = 'nam_conus_nest'
		breaksw
	case 'GFS':
		set modDir = 'gfs_212'
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
# if (($FHour == 000) || ($FHour == 001)) then
set dataFile = `find ${dataDir}/${modDir}/*${ModRunTime}00F000.* ! -name '*c' ! -name '*.idx'| tail -n1`
set ctlFile = `echo ${dataFile} | sed -e "s/00F[^ ]../00F%f3/"`
perl /home/scripts/grads/functions/gefs_g2ctl.pl ${ctlFile} > ${dataDir}/grads_ctl/${ModName}/${ModRunTime}${ModName}.ctl	
# endif
gribmap -q -i ${dataDir}/grads_ctl/${ModName}/${ModRunTime}${ModName}.ctl
grads -bxcl "run /home/scripts/grads/runners/gefs_meteo_prodlist.gs ${ModRunTime} ${ModName}"
