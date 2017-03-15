#!/usr/bin/csh
set ModRunTime = $1
set ModInit = $2
set ModName = $3
set FHour = $4
set dataDir = "/home/data/models"
set modDir = 'gefs'
#STRING VARIABLE FORMATTED YYMMDD
set filstr = `date -u +%y%m%d`
#Find the data file we are looking for:
#if (($FHour == 000) || ($FHour == 006)) then
set dataFile = `find ${dataDir}/${modDir}/*${ModInit}00F${FHour}.* ! -name '*.idx'| tail -n1`
set ctlFile = `echo ${dataFile} | sed -e "s/00F[^ ]...gefs_.../00F%f3.gefs_%e/"`
#set ctlFile = `echo ${dataFile} | sed -e "s/00F[^ ]../00F%f3.gefs_%e/"`
#perl /home/scripts/grads/functions/gefs_g2ctl.pl -ens "Ep1,Ep2,Ep3,Ep4,Ep5,Ep6,Ep7,Ep8,Ep9,Ep10,Ep11,Ep12,Ep13,Ep14,Ep15,Ep16,Ep17,Ep18,Ep19,Ep20,E10" ${ctlFile} > /home/scripts/grads/grads_ctl/${ModName}/${ModInit}${ModName}.ctl	
perl /home/scripts/grads/functions/gefs_g2ctl.pl -ens "p01,p02,p03,p04,p05,p06,p07,p08,p09,p10,p11,p12,p13,p14,p15,p16,p17,p18,p19,p20,c00" ${ctlFile} > /home/scripts/grads/grads_ctl/${ModName}/${ModInit}${ModName}.ctl
#perl /home/scripts/grads/functions/gefs_g2ctl.pl ${ctlFile} > /home/scripts/grads/grads_ctl/${ModName}/${ModInit}${ModName}.ctl	
#perl /home/scripts/grads/functions/gefs_mpi_g2ctl.pl -nthreads 32 ${ctlFile} > /home/scripts/grads/grads_ctl/${ModName}/${ModInit}${ModName}.ctl
#endif
gribmap -i /home/scripts/grads/grads_ctl/${ModName}/${ModInit}${ModName}.ctl
sleep 2
perl /home/scripts/grads/functions/gefs_g2ctl.pl -ens "p01,p02,p03,p04,p05,p06,p07,p08,p09,p10,p11,p12,p13,p14,p15,p16,p17,p18,p19,p20,c00" ${ctlFile} > /home/scripts/grads/grads_ctl/${ModName}/${ModInit}${ModName}.ctl
gribmap -i /home/scripts/grads/grads_ctl/${ModName}/${ModInit}${ModName}.ctl
#perl /home/scripts/grads/functions/mpi_gribmap.pl -i /home/scripts/grads/grads_ctl/${ModName}/${ModInit}${ModName}.ctl
foreach Sector (US PO NA MW SGP NGP)
	mkdir -p /home/apache/servername/data/forecast/${ModName}/${ModRunTime}/${Sector}/readout
	grads -bxcl "run /home/scripts/grads/runners/gefs_grads_prodlist.gs ${ModInit} ${ModName} ${FHour} ${Sector} ${ModRunTime}" &
end
wait
#set idxFile = `find ${dataDir}/${modDir}/*${ModInit}00*.idx | tail -n1`
#rm ${idxFile}
echo ${filstr}/${ModRunTime}00F${FHour} > /home/apache/climate/data/forecast/text/gefsstatus.txt
echo ${FHour} >> /home/apache/climate/data/forecast/text/gefsstatus.txt
cd /home/apache/servername/data/forecast/$ModName/$ModRunTime/
set FilesToFind="*_${FHour}.png"
find . -name "${FilesToFind}" -print0 | xargs -0 -P32 -L1 pngquant --ext .png --force 256
