#!/usr/bin/csh
set ModRunTime = $1
set ModInit = $2
set ModName = $3
set FHour = $4
set dataDir = "/home/data/models"

switch ($ModName)
	case 'NAM':
		set modDir = 'nam_212'
		breaksw
	case 'NAM4KM':
		set modDir = 'nam4km'
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
	case 'HRRR15':
		set modDir = 'hrrr15'
		breaksw
	case 'RAP':
		set modDir = 'rap'
		breaksw
	case 'CFS':
		set modDir = 'cfs'
		breaksw
	default:
		set modDir = 'nam4km'
		breaksw
endsw
# Find the data file we are looking for:
if ($FHour == 000) then
	set dataFile = `find ${dataDir}/${modDir}/*${ModInit}00.* ! -name '*c' ! -name '*.idx'| tail -n1`
	#set ctlFile = `echo ${dataFile} | sed -e "s/00F[^ ]../00F%f3/"`
	perl /home/scripts/grads/functions/hrrr15_g2ctl.pl ${dataFile} > /home/scripts/grads/grads_ctl/${ModName}/${ModInit}${ModName}.ctl	
endif
gribmap -q -i /home/scripts/grads/grads_ctl/${ModName}/${ModInit}${ModName}.ctl
foreach Sector (CHI MW SGP CGP NGP OKC DEN SW NW SE MA NE FLT)
	mkdir -p /home/apache/servername/data/forecast/${ModName}/${ModRunTime}/${Sector}/readout
	grads -bxcl "run /home/scripts/grads/runners/hrrr15_grads_prodlist.gs ${ModInit} ${ModName} ${FHour} ${Sector} ${ModRunTime}" &
end
wait
