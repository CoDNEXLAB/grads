function gradsrunner(args)
 modinit=subwrd(args,1)
 modname=subwrd(args,2)
 fhour=subwrd(args,3)
 sector=subwrd(args,4)
 runtime=subwrd(args,5)
*'run /home/scripts/grads/prodscripts/cape_ens.gs 'modinit' 'modname' 'fhour' 'sector' 'runtime
*'run /home/scripts/grads/prodscripts/ehi_ens.gs 'modinit' 'modname' 'fhour' 'sector' 'runtime
*'run /home/scripts/grads/prodscripts/scp_ens.gs 'modinit' 'modname' 'fhour' 'sector' 'runtime
*'run /home/scripts/grads/prodscripts/scp_ens_max.gs 'modinit' 'modname' 'fhour' 'sector' 'runtime
*'run /home/scripts/grads/prodscripts/scp_ens_mean.gs 'modinit' 'modname' 'fhour' 'sector' 'runtime
*'run /home/scripts/grads/prodscripts/snowaccum_ens_mean.gs 'modinit' 'modname' 'fhour' 'sector' 'runtime
*'run /home/scripts/grads/prodscripts/850temp_ens_mean.gs 'modinit' 'modname' 'fhour' 'sector' 'runtime
*'run /home/scripts/grads/prodscripts/500height_ens_speg.gs 'modinit' 'modname' 'fhour' 'sector' 'runtime
'run /home/scripts/grads/prodscripts/precaccum_ens_mean.gs 'modinit' 'modname' 'fhour' 'sector' 'runtime
