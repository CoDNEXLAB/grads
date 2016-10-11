function isotachs(args)
 modname=subwrd(args,1)
 level=subwrd(args,2)
'set gxout shade2'
if modname = NAM | modname = GFS | modname = HRRR | modname = RAP | modname = GEM
 'define windspeed = mag(UGRDprs,VGRDprs)*2'
else
 'define windspeed = mag(UGRD 'level' mb,VGRD 'level' mb)*2'
endif
'd windspeed'
