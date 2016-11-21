#!/usr/bin/csh
set ModRunTime = $1
set ModName = $2
set FHour = $3
set dataDir = "/home/data/models"
switch ($ModName)
	case 'ECMWF':
		set modDir = 'ecmwf'
		breaksw
	default:
		set modDir = 'nam_conus_nest'
		breaksw
endsw
# Find the data file we are looking for:
if (($FHour == 000) || ($FHour == 012)) then
	set dataFile = `find ${dataDir}/${modDir}/*${ModRunTime}00F${FHour}.* ! -name '*c' ! -name '*.idx'| tail -n1`
	set ctlFile = `echo ${dataFile} | sed -e "s/00F[^ ]../00F%f3/"`
	perl /home/scripts/grads/functions/ecmwf_grib2ctl.pl ${ctlFile} > /home/scripts/grads/grads_ctl/${ModName}/${ModRunTime}${ModName}.ctl
endif
gribmap -q -i /home/scripts/grads/grads_ctl/${ModName}/${ModRunTime}${ModName}.ctl
foreach Sector (US NA PO AO WLD)
	mkdir -p /home/apache/servername/data/forecast/${ModName}/${ModRunTime}/${Sector}
	grads -bxcl "run /home/scripts/grads/runners/ecmwf_grads_prodlist.gs ${ModRunTime} ${ModName} ${FHour} ${Sector}" &
end
wait
cd /home/apache/servername/data/forecast/$ModName/$ModRunTime/
set FilesToFind="*_${FHour}.png"
find . -name "${FilesToFind}" -print0 | xargs -0 -P32 -L1 pngquant --ext .png --force 256
