#!/usr/bin/csh
set ModRunTime = $1
set ModInit = $2
set ModName = $3
set FHour = $4
set dataDir = "/home/data/models"
switch ($ModName)
	case 'NAM':
		set modDir = 'nam_218'
		breaksw
	case 'NAMNST':
		set modDir = 'nam_conus_nest'
		breaksw
	default:
		set modDir = 'nam_conus_nest'
		breaksw
endsw
# Find the data file we are looking for:
if (($FHour == 000) || ($FHour == 001)) then
	set dataFile = `find ${dataDir}/${modDir}/*${ModInit}00F${FHour}.* ! -name '*.sound' ! -name '*.idx'| tail -n1`
	set ctlFile = `echo ${dataFile} | sed -e "s/${ModInit}00F[^ ]../${ModInit}00F%f3/"`
	perl /home/scripts/grads/functions/namnest_g2ctl.pl ${ctlFile} > /home/scripts/grads/grads_ctl/${ModName}/${ModInit}${ModName}.ctl	
endif
gribmap -q -i /home/scripts/grads/grads_ctl/${ModName}/${ModInit}${ModName}.ctl
foreach Sector (MW SGP CGP NGP SW NW SE MA NE FLT)
	mkdir -p /home/apache/servername/data/forecast/${ModName}/${ModRunTime}/${Sector}/readout
	grads -bxcl "run /home/scripts/grads/runners/namnest_grads_prodlist.gs ${ModInit} ${ModName} ${FHour} ${Sector} ${ModRunTime}" &
end
wait
cd /home/apache/servername/data/forecast/$ModName/$ModRunTime/
set FilesToFind="*_${FHour}.png"
find . -name "${FilesToFind}" -print0 | xargs -0 -P32 -L1 pngquant --ext .png --force 256
