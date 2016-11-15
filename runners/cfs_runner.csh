#!/usr/bin/csh
set ModRunTime = $1
set ModName = $2
set FHour = $3
set ModInit = $4
set dataDir = "/home/data/models"
switch ($ModName)
	case 'NAM':
		set modDir = 'nam_218'
		breaksw
	case 'CFS':
		set modDir = 'cfs'
		breaksw
	default:
		set modDir = 'nam_conus_nest'
		breaksw
endsw
#Find the data file we are looking for:
if (($FHour == 000) || ($FHour == 006)) then
	set dataFile = `find ${dataDir}/${modDir}/*${ModRunTime}00F${FHour}.* ! -name '*c' ! -name '*.idx'| tail -n1`
	set ctlFile = `echo ${dataFile} | sed -e "s/00F[^ ]../00F%f3/"`
	perl /home/scripts/grads/functions/cfs_mpi_g2ctl.pl -nthreads 32 ${ctlFile} > /home/scripts/grads/grads_ctl/${ModName}/${ModRunTime}${ModName}.ctl	
endif
perl /home/scripts/grads/functions/mpi_gribmap.pl -i /home/scripts/grads/grads_ctl/${ModName}/${ModRunTime}${ModName}.ctl
foreach Sector (US PO NA WLD)
	mkdir -p /home/apache/servername/data/forecast/${ModName}/${ModInit}/${Sector}
	grads -bxcl "run /home/scripts/grads/runners/cfs_prodlist.gs ${ModRunTime} ${ModName} ${FHour} ${Sector} ${ModInit}" &
end
wait
cd /home/apache/servername/data/forecast/$ModName/$ModInit/
set FilesToFind="*_${FHour}.png"
find . -name "${FilesToFind}" -print0 | xargs -0 -P32 -L1 pngquant --ext .png --force 256
