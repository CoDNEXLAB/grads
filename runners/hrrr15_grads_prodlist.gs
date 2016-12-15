function gradsrunner(args)
 modinit=subwrd(args,1)
 modname=subwrd(args,2)
 fhour=subwrd(args,3)
 sector=subwrd(args,4)
 runtime=subwrd(args,5)
'run /home/scripts/grads/prodscripts/radarrefc.gs 'modinit' 'modname' 'fhour' 'sector' 'runtime
*'run /home/scripts/grads/prodscripts/uphlcy.gs 'modinit' 'modname' 'fhour' 'sector' 'runtime
if fhour != 000
 'run /home/scripts/grads/prodscripts/uphlcy_swath.gs 'modinit' 'modname' 'fhour' 'sector' 'runtime
endif
