#!usr/bin/csh
set ModRunTime = $1
set ModName = $2
set FHour = $3
set dataDir = "/home/data/models"
switch ($ModName)
	case 'NAM':
		set modDir = 'nam_218'
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
if (($FHour == 000) || ($FHour == 001)) then
	set dataFile = `find ${dataDir}/${modDir}/*${ModRunTime}00F${FHour}.* ! -name '*c' ! -name '*.idx'| tail -n1`
	set ctlFile = `echo ${dataFile} | sed -e "s/00F[^ ]../00F%f3/"`
	perl /home/scripts/grads/functions/rap_g2ctl.pl ${ctlFile} > /home/scripts/grads/grads_ctl/${ModName}/${ModRunTime}${ModName}.ctl
endif
gribmap -q -i /home/scripts/grads/grads_ctl/${ModName}/${ModRunTime}${ModName}.ctl
foreach Sector (MW US SGP CGP NGP SW NW SE MA NE FLT)
	mkdir -p /home/apache/servername/data/forecast/${ModName}/${ModRunTime}/${Sector}/readout
	grads -bxcl "run /home/scripts/grads/runners/rap_grads_prodlist.gs ${ModRunTime} ${ModName} ${FHour} ${Sector}" &
end
wait
cd /home/apache/servername/data/forecast/$ModName/$ModRunTime/
set FilesToFind="*_${FHour}.png"
find . -name "${FilesToFind}" -print0 | xargs -0 -P32 -L1 pngquant --ext .png --force 256
