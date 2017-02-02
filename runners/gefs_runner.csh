#!/usr/bin/csh
set ModRunTime = $1
set ModInit = $2
set ModName = $3
set FHour = $4
set dataDir = "/home/data/models"
set modDir = 'gefs'
#Find the data file we are looking for:
if (($FHour == 000) || ($FHour == 006)) then
	set dataFile = `find ${dataDir}/${modDir}/*${ModInit}00F${FHour}.* ! -name '*c' ! -name '*.idx'| tail -n1`
	set ctlFile = `echo ${dataFile} | sed -e "s/00F[^ ]...gefs_.../00F%f3.gefs_%e/"`
	echo ${ctlFile}
	#perl /home/scripts/grads/functions/gefs_g2ctl.pl ${ctlFile} > /home/scripts/grads/grads_ctl/${ModName}/${ModInit}${ModName}.ctl	
	perl /home/scripts/grads/functions/gefs_g2ctl.pl -ens "p01,p02,p03,p04,p05,p06,p07,p08,p09,p10,p11,p12,p13,p14,p15,p16,p17,p18,p19,p20,c00" ${ctlFile} > /home/scripts/grads/grads_ctl/${ModName}/${ModInit}${ModName}.ctl	
endif
gribmap -i /home/scripts/grads/grads_ctl/${ModName}/${ModInit}${ModName}.ctl
foreach Sector (US)
	mkdir -p /home/apache/servername/data/forecast/${ModName}/${ModRunTime}/${Sector}/readout
	grads -bxcl "run /home/scripts/grads/runners/gefs_grads_prodlist.gs ${ModInit} ${ModName} ${FHour} ${Sector} ${ModRunTime}" &
end
wait
cd /home/apache/servername/data/forecast/$ModName/$ModRunTime/
set FilesToFind="*_${FHour}.png"
find . -name "${FilesToFind}" -print0 | xargs -0 -P32 -L1 pngquant --ext .png --force 256
