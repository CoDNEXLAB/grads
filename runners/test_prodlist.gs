function gradsrunner(args)
 modinit=subwrd(args,1)
 modname=subwrd(args,2)
 fhour=subwrd(args,3)
 sector=subwrd(args,4)
 runtime=subwrd(args,5)
*'run /home/scripts/grads/prodscripts/radarrefc.gs 'modinit' 'modname' 'fhour' 'sector' 'runtime
*'run /home/scripts/grads/prodscripts/stp.gs 'modinit' 'modname' 'fhour' 'sector' 'runtime
*'run /home/scripts/grads/prodscripts/mucape.gs 'modinit' 'modname' 'fhour' 'sector' 'runtime
*'run /home/scripts/grads/prodscripts/uphlcy.gs 'modinit' 'modname' 'fhour' 'sector' 'runtime
*'run /home/scripts/grads/prodscripts/scp.gs 'modinit' 'modname' 'fhour' 'sector' 'runtime
*'run /home/scripts/grads/prodscripts/2mtemp.gs 'modinit' 'modname' 'fhour' 'sector' 'runtime
*'run /home/scripts/grads/prodscripts/2mdewpt.gs 'modinit' 'modname' 'fhour' 'sector' 'runtime
*'run /home/scripts/grads/prodscripts/ptype.gs 'modinit' 'modname' 'fhour' 'sector' 'runtime
*'run /home/scripts/grads/prodscripts/irsat.gs 'modinit' 'modname' 'fhour' 'sector' 'runtime
*'run /home/scripts/grads/prodscripts/windgust.gs 'modinit' 'modname' 'fhour' 'sector' 'runtime
'run /home/scripts/grads/prodscripts/lsi.gs 'modinit' 'modname' 'fhour' 'sector' 'runtime
if fhour != 000
* 'run /home/scripts/grads/prodscripts/uphlcy_swath.gs 'modinit' 'modname' 'fhour' 'sector' 'runtime
* 'run /home/scripts/grads/prodscripts/snowaccum.gs 'modinit' 'modname' 'fhour' 'sector' 'runtime
* 'run /home/scripts/grads/prodscripts/new_wind.gs 'modinit' 'modname' 'fhour' 'sector' 'runtime
* 'run /home/scripts/grads/prodscripts/sfc_lows_ens.gs 'modinit' 'modname' 'fhour' 'sector' 'runtime
* 'run /home/scripts/grads/prodscripts/gfs_ptype.gs 'modinit' 'modname' 'fhour' 'sector' 'runtime
* 'run /home/scripts/grads/prodscripts/shapefile.gs 'modinit' 'modname' 'fhour' 'sector' 'runtime
endif
