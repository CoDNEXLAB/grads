function gradsrunner(args)
 modinit=subwrd(args,1)
 modname=subwrd(args,2)
 fhour=subwrd(args,3)
 sector=subwrd(args,4)
'run /home/scripts/grads/prodscripts/250rh.gs 'modinit' 'modname' 'fhour' 'sector
'run /home/scripts/grads/prodscripts/250wind.gs 'modinit' 'modname' 'fhour' 'sector
'run /home/scripts/grads/prodscripts/500wind.gs 'modinit' 'modname' 'fhour' 'sector
'run /home/scripts/grads/prodscripts/500rh.gs 'modinit' 'modname' 'fhour' 'sector
'run /home/scripts/grads/prodscripts/500temp.gs 'modinit' 'modname' 'fhour' 'sector
'run /home/scripts/grads/prodscripts/500vvel.gs 'modinit' 'modname' 'fhour' 'sector
'run /home/scripts/grads/prodscripts/500vort.gs 'modinit' 'modname' 'fhour' 'sector
'run /home/scripts/grads/prodscripts/700wind.gs 'modinit' 'modname' 'fhour' 'sector
'run /home/scripts/grads/prodscripts/700rh.gs 'modinit' 'modname' 'fhour' 'sector
'run /home/scripts/grads/prodscripts/700temp.gs 'modinit' 'modname' 'fhour' 'sector
'run /home/scripts/grads/prodscripts/700vvel.gs 'modinit' 'modname' 'fhour' 'sector
'run /home/scripts/grads/prodscripts/700vort.gs 'modinit' 'modname' 'fhour' 'sector
'run /home/scripts/grads/prodscripts/850wind.gs 'modinit' 'modname' 'fhour' 'sector
'run /home/scripts/grads/prodscripts/850rh.gs 'modinit' 'modname' 'fhour' 'sector
'run /home/scripts/grads/prodscripts/850temp.gs 'modinit' 'modname' 'fhour' 'sector
'run /home/scripts/grads/prodscripts/850vvel.gs 'modinit' 'modname' 'fhour' 'sector
'run /home/scripts/grads/prodscripts/850tadv.gs 'modinit' 'modname' 'fhour' 'sector
'run /home/scripts/grads/prodscripts/850dewp.gs 'modinit' 'modname' 'fhour' 'sector
'run /home/scripts/grads/prodscripts/850thte.gs 'modinit' 'modname' 'fhour' 'sector
'run /home/scripts/grads/prodscripts/925wind.gs 'modinit' 'modname' 'fhour' 'sector
'run /home/scripts/grads/prodscripts/925rh.gs 'modinit' 'modname' 'fhour' 'sector
'run /home/scripts/grads/prodscripts/925temp.gs 'modinit' 'modname' 'fhour' 'sector
'run /home/scripts/grads/prodscripts/925thte.gs 'modinit' 'modname' 'fhour' 'sector
'run /home/scripts/grads/prodscripts/2mtemp.gs 'modinit' 'modname' 'fhour' 'sector
'run /home/scripts/grads/prodscripts/2mdewpt.gs 'modinit' 'modname' 'fhour' 'sector
'run /home/scripts/grads/prodscripts/30mbdewp.gs 'modinit' 'modname' 'fhour' 'sector
'run /home/scripts/grads/prodscripts/2mthte.gs 'modinit' 'modname' 'fhour' 'sector
'run /home/scripts/grads/prodscripts/crithick.gs 'modinit' 'modname' 'fhour' 'sector
'run /home/scripts/grads/prodscripts/pwat.gs 'modinit' 'modname' 'fhour' 'sector
'run /home/scripts/grads/prodscripts/sbcape.gs 'modinit' 'modname' 'fhour' 'sector
'run /home/scripts/grads/prodscripts/03hlcy.gs 'modinit' 'modname' 'fhour' 'sector
'run /home/scripts/grads/prodscripts/01hlcy.gs 'modinit' 'modname' 'fhour' 'sector
'run /home/scripts/grads/prodscripts/mucape.gs 'modinit' 'modname' 'fhour' 'sector
'run /home/scripts/grads/prodscripts/scp.gs 'modinit' 'modname' 'fhour' 'sector
'run /home/scripts/grads/prodscripts/stp.gs 'modinit' 'modname' 'fhour' 'sector
'run /home/scripts/grads/prodscripts/01ehi.gs 'modinit' 'modname' 'fhour' 'sector
'run /home/scripts/grads/prodscripts/03ehi.gs 'modinit' 'modname' 'fhour' 'sector
'run /home/scripts/grads/prodscripts/radarrefc.gs 'modinit' 'modname' 'fhour' 'sector
'run /home/scripts/grads/prodscripts/mdiverg.gs 'modinit' 'modname' 'fhour' 'sector
'run /home/scripts/grads/prodscripts/ptype.gs 'modinit' 'modname' 'fhour' 'sector
if fhour != 000
 'run /home/scripts/grads/prodscripts/rap_precaccum.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/rap_zraccum.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/rap_snowaccum.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/rap_slprecip.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/rap_conprecip.gs 'modinit' 'modname' 'fhour' 'sector
endif
