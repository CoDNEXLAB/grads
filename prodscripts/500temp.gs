*Purpose: College of DuPage Models Product Shell
*Author: Gensini, Winter 2015
*************************************************************************
*always run this function to get model arguments and plotting defaults
function main(args)
 modinit=subwrd(args,1)
 modname=subwrd(args,2)
 fhour=subwrd(args,3)
 sector=subwrd(args,4)
 runtime=subwrd(args,5)
 'run /home/scripts/grads/functions/pltdefaults.gs'
*GLOBAL VARIABLES
filext = '.png'
txtext = '.txt'
basedir = '/home/apache/servername/data/forecast'
*************************************************************************
*open the GrADS .ctl file made in the prodrunner script
ctlext = '.ctl'
'open /home/scripts/grads/grads_ctl/'modname'/'modinit''modname%ctlext
if modname = NAMAK
 modname = NAM
endif
if modname = GFS | modname = NAM | modname = GEM
 'set t 'fhour/3+1
else
 'set t 'fhour+1
endif
*get some time parameters
'run /home/scripts/grads/functions/timelabel.gs 'modinit' 'modname' 'fhour
*set domain based on sector input argument
'run /home/scripts/grads/functions/sectors.gs 'sector' 'modname
'run /home/scripts/grads/colorbars/color.gs -44 0 2 -kind white->darkseagreen->silver->dimgray->lightsteelblue->magenta->mediumblue->cyan'
'set gxout shade2'
*START: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*give the image a product title
'draw string 0.1 8.3 `4500mb Temp (`3.`4C) | Wind (kts) | College of DuPage NEXLAB'
*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname sector _500_temp_ fhour
filename = basedir'/'modname'/'runtime'/'sector'/'prodname%filext
level = 500
'set lev 'level
'run /home/scripts/grads/functions/isotherms.gs 'level
'run /home/scripts/grads/functions/counties.gs 'sector
'set cint 30'
'run /home/scripts/grads/functions/isoheights.gs 'level' 'modname
'run /home/scripts/grads/functions/windbarb.gs 'sector' 'modname' 'level
'run /home/scripts/grads/functions/states.gs 'sector
*start_readout
if modname = GFS | modname = NAM | modname = RAP
 'set gxout print'
 'run /home/scripts/grads/functions/readout.gs 'modname' 'sector
 'd (TMPprs-273.16)'
 dummy=write(basedir'/'modname'/'runtime'/'sector'/readout/'prodname%txtext,result)
endif
*end_readout
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*plot the colorbar on the image
'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 2 -fh .1 -fw .1 -lc 99 -edge triangle -fc 99'
*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
