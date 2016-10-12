#!/usr/bin/csh
set ModRunTime = $1
set ModName = $2
set FHour = $3
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
	set dataFile = `find ${dataDir}/${modDir}/*${ModRunTime}00.* ! -name '*c' ! -name '*.idx'| tail -n1`
	#set ctlFile = `echo ${dataFile} | sed -e "s/00F[^ ]../00F%f3/"`
	perl /home/scripts/grads/functions/hrrr15_g2ctl.pl ${dataFile} > /home/scripts/grads/grads_ctl/${ModName}/${ModRunTime}${ModName}.ctl	
endif
gribmap -q -i /home/scripts/grads/grads_ctl/${ModName}/${ModRunTime}${ModName}.ctl
foreach Sector (CHI MW SGP CGP NGP OKC DEN SW NW SE MA NE FLT)
	mkdir -p /home/apache/servername/data/forecast/${ModName}/${ModRunTime}/${Sector}
	grads -bxcl "run /home/scripts/grads/runners/hrrr15_grads_prodlist.gs ${ModRunTime} ${ModName} ${FHour} ${Sector}" &
end
wait
