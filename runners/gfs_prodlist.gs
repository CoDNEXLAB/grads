function gradsrunner(args)
 modinit=subwrd(args,1)
 modname=subwrd(args,2)
 fhour=subwrd(args,3)
 sector=subwrd(args,4)
if sector = WLD
 'run /home/scripts/grads/prodscripts/2pvupres.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/250wind.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/500wind.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/500vort.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/700rh.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/850temp.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/2mtemp.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/gfs_slprecip.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/pwat.gs 'modinit' 'modname' 'fhour' 'sector
 if fhour != 000
  'run /home/scripts/grads/prodscripts/gfs_precaccum.gs 'modinit' 'modname' 'fhour' 'sector
 endif
endif
if sector = NA
 'run /home/scripts/grads/prodscripts/2pvupres.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/250wind.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/250rh.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/500wind.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/500vort.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/500temp.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/500rh.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/700wind.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/700temp.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/700rh.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/850wind.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/700temp.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/850rh.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/850temp.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/925wind.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/925temp.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/925rh.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/925thte.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/2mtemp.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/2mthte.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/gfs_slprecip.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/pwat.gs 'modinit' 'modname' 'fhour' 'sector
endif
if sector = PO | sector = AO
 'run /home/scripts/grads/prodscripts/2pvupres.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/250wind.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/500wind.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/500vort.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/700rh.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/850temp.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/2mtemp.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/gfs_slprecip.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/pwat.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/mucape.gs 'modinit' 'modname' 'fhour' 'sector
 if fhour != 000
  'run /home/scripts/grads/prodscripts/gfs_precaccum.gs 'modinit' 'modname' 'fhour' 'sector
 endif
endif
if sector = US | sector = AK | sector = SW | sector = NW | sector = SGP | sector = CGP | sector = NGP | sector = MA | sector = MW | sector = SE | sector = NE | sector = FLT | sector = WCAN 
 'run /home/scripts/grads/prodscripts/2pvupres.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/250wind.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/250rh.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/500wind.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/500vort.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/500temp.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/500vvel.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/500rh.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/700wind.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/700vort.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/700temp.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/700vvel.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/700rh.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/700fronto.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/850wind.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/850rh.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/850temp.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/850thte.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/850vvel.gs 'modinit' 'modname' 'fhour' 'sector  
 'run /home/scripts/grads/prodscripts/850tadv.gs 'modinit' 'modname' 'fhour' 'sector 
 'run /home/scripts/grads/prodscripts/850dewp.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/850fronto.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/925wind.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/925temp.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/925rh.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/925thte.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/2mtemp.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/2mthte.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/2mwetbulb.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/30mbdewp.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/2mdewpt.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/pwat.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/sbcape.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/mucape.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/57lapse.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/1085lapse.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/scp.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/03ehi.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/03hlcy.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/clouds.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/crithick.gs 'modinit' 'modname' 'fhour' 'sector
 'run /home/scripts/grads/prodscripts/mdiverg.gs 'modinit' 'modname' 'fhour' 'sector
 if fhour != 000
  'run /home/scripts/grads/prodscripts/gfs_slprecip.gs 'modinit' 'modname' 'fhour' 'sector
  'run /home/scripts/grads/prodscripts/gfs_conprecip.gs 'modinit' 'modname' 'fhour' 'sector
  'run /home/scripts/grads/prodscripts/gfs_precaccum.gs 'modinit' 'modname' 'fhour' 'sector
  'run /home/scripts/grads/prodscripts/gfs_snowaccum.gs 'modinit' 'modname' 'fhour' 'sector
 endif
endif
if sector = FLT
 'run /home/scripts/grads/prodscripts/cooper.gs 'modinit' 'modname' 'fhour' 'sector
endif

