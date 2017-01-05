function gradsrunner(args)
 modinit=subwrd(args,1)
 modname=subwrd(args,2)
 fhour=subwrd(args,3)
 sector=subwrd(args,4)
 runtime=subwrd(args,5)

'run /home/scripts/grads/prodscripts/500ecmwf.gs 'modinit' 'modname' 'fhour' 'sector' 'runtime
*'run /home/scripts/grads/prodscripts/850temp.gs 'modinit' 'modname' 'fhour' 'sector' 'runtime
*'run /home/scripts/grads/prodscripts/850wind.gs 'modinit' 'modname' 'fhour' 'sector' 'runtime
