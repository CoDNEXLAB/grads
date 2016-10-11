function gradsrunner(args)
 modinit=subwrd(args,1)
 modname=subwrd(args,2)
 fhour=subwrd(args,3)
 sector=subwrd(args,4)
'run /home/scripts/grads/prodscripts/radarrefc.gs 'modinit' 'modname' 'fhour' 'sector
*'run /home/scripts/grads/prodscripts/uphlcy.gs 'modinit' 'modname' 'fhour' 'sector
if fhour != 000
 'run /home/scripts/grads/prodscripts/uphlcy_swath.gs 'modinit' 'modname' 'fhour' 'sector
endif
