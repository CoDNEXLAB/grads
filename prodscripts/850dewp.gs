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
'run /home/scripts/grads/colorbars/color.gs -30 22 1 -kind (141,103,74)-(14)->(73,65,54)-(10)->(244,242,215)-(0)->white-(5)->(95,196,95)-(0)->(48,174,48)-(3)->(8,78,8)-(0)->(97,163,175)-(3)->(19,44,43)-(0)->(102,102,154)-(3)->(49,35,104)-(0)->(121,72,114)-(3)->(152,102,125)'
'set gxout shade2'
*START: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*give the image a product title
'draw string 0.1 8.3 `4850mb Dewpoint (`3.`4C) | Wind | College of DuPage NeXLaB'
*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname sector _850_dewp_ fhour
filename = basedir'/'modname'/'modinit'/'sector'/'prodname%filext
level = 850
'set lev 'level
't = TMPprs'
'tc=(t-273.16)'
'rh = RHprs'
'td=tc-((14.55+0.114*tc)*(1-0.01*rh) + pow((2.5+0.007*tc)*(1-0.01*rh),3) + (15.9+0.117*tc)*pow((1-0.01*rh),14))'
'd td'
'run /home/scripts/grads/functions/counties.gs 'sector
'set cint 30'
'run /home/scripts/grads/functions/isoheights.gs 'level
'run /home/scripts/grads/functions/windvector.gs 'sector' 'modname' 'level
'run /home/scripts/grads/functions/states.gs 'sector
*start_readout
if modname = GFS | modname = NAM | modname = RAP
 'set gxout print'
 'run /home/scripts/grads/functions/readout.gs 'modname' 'sector
 'd td'
 dummy=write(basedir'/'modname'/'modinit'/'sector'/readout/'prodname%txtext,result)
endif
*end_readout
************************
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*plot the colorbar on the image
'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 2 -fh .1 -fw .1 -lc 99 -edge triangle -fc 99'
*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
