*Purpose: College of DuPage Models Product Shell
*Author: Gensini, Winter 2015
*************************************************************************
*always run this function to get model arguments and plotting defaults
function main(args)
 modinit=subwrd(args,1)
 modname=subwrd(args,2)
 fhour=subwrd(args,3)
 sector=subwrd(args,4)
 'run /home/scripts/grads/functions/pltdefaults.gs'
*GLOBAL VARIABLES
filext = '.png'
txtext = '.txt'
basedir = '/home/apache/servername/data/forecast'
*************************************************************************
*open the GrADS .ctl file made in the prodrunner script
ctlext = '.ctl'
'open /home/scripts/grads/grads_ctl/'modname'/'modinit''modname%ctlext
if modname = GFS | modname = NAM | modname = GEM
 'set t 'fhour/3+1
else
 'set t 'fhour+1
endif
*get some time parameters
'run /home/scripts/grads/functions/timelabel.gs 'modinit' 'modname' 'fhour
*set domain based on sector input argument
'run /home/scripts/grads/functions/sectors.gs 'sector
'run /home/scripts/grads/colorbars/color.gs -20 85 2 -kind (141,103,74)-(16)->(73,65,54)-(10)->(244,242,215)-(0)->white-(5)->(95,196,95)-(0)->(48,174,48)-(3)->(8,78,8)-(0)->(97,163,175)-(3)->(19,44,43)-(0)->(102,102,154)-(3)->(49,35,104)-(0)->(121,72,114)-(3)->(152,102,125)'
'set gxout shade2'
*START: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*give the image a product title
'draw string 0.1 8.3 `42m Dewpoint (`3.`4F) | Lifted Index (`3.`4C) | College of DuPage NeXLaB'

*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname sector _sfc_dewp_ fhour
filename = basedir'/'modname'/'modinit'/'sector'/'prodname%filext
level = surface
if modname != RAP
 'run /home/scripts/grads/functions/isodrosotherms.gs 'level
else
 't = TMP2m'
 'tc=(t-273.16)'
 'rh = RH2m'
 'td=tc-( (14.55+0.114*tc)*(1-0.01*rh) + pow((2.5+0.007*tc)*(1-0.01*rh),3) + (15.9+0.117*tc)*pow((1-0.01*rh),14) )'
 'd td*9/5+32'
endif
'set gxout contour'
'set ccolor 4'
'set cthick 2'
'set cmin 1'
'set cmax 100'
'set cint 1'
'set cstyle 3'
if modname = HRRR
 'd smth9(lftxl100_100)'
endif
if modname = NAM4KM
 'd no4LFTX180_0mb-273.16'
endif
if modname = RAP
 'd no4LFTX180_0mb'
endif
if modname = NAM
 'd PLI30_0mb'
endif
'set cstyle 1'
'set cthick 2'
'set ccolor 2'
'set cmin -100'
'set cmax -1'
'set cint 1'
if modname = HRRR
 'd smth9(lftxl100_100)'
endif
if modname = NAM4KM
 'd no4LFTX180_0mb-273.16'
endif
if modname = RAP
 'd no4LFTX180_0mb'
endif
if modname = NAM
 'd PLI30_0mb'
endif
'run /home/scripts/grads/functions/counties.gs 'sector
'run /home/scripts/grads/functions/states.gs 'sector
if modname != RAP
 'run /home/scripts/grads/functions/dewp_stations.gs 'sector
else
 'run /home/scripts/grads/functions/rap_dewp_stations.gs 'sector
endif
*start_readout
if modname = GFS | modname = NAM | modname = NAM4KM
 'set gxout print'
 'run /home/scripts/grads/functions/readout.gs 'modname' 'sector
 'd (DPT2m-273.16)*9/5+32'
 dummy=write(basedir'/'modname'/'modinit'/'sector'/readout/'prodname%txtext,result)
endif
if modname = RAP
 'set gxout print'
 'run /home/scripts/grads/functions/readout.gs 'modname' 'sector
 'd td*9/5+32'
 dummy=write(basedir'/'modname'/'modinit'/'sector'/readout/'prodname%txtext,result)
endif
*end_readout
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*plot the colorbar on the image
'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 5 -fh .1 -fw .1 -lc 99 -edge triangle -fc 99'
*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
