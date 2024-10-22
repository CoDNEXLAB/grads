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
if modname = GFS | modname = NAM
 'set t 'fhour/3+1
else
 'set t 'fhour+1
endif
*get some time parameters
'run /home/scripts/grads/functions/timelabel.gs 'modinit' 'modname' 'fhour
*set domain based on sector input argument
'run /home/scripts/grads/functions/sectors.gs 'sector' 'modname
*START: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*give the image a product title
'draw string 0.1 8.3 Composite RADAR Reflectivity Factor (dBZ) | College of DuPage NEXLAB'
*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname sector _prec_radar_ fhour
filename = basedir'/'modname'/'runtime'/'sector'/'prodname%filext
'set gxout shade2'
*'run /home/scripts/grads/colorbars/color.gs 0 80 2.5 -kind white-(0)->white-(0)->lightgray-(5)->(4,70,28)-(5)->(4,234,28)-(0)->(252,238,4)-(4)->(236,130,4)-(0)->(244,46,4)-(4)->maroon-(0)->magenta->gray->lightgray'
'run /home/scripts/grads/colorbars/color.gs 0 80 2 -kind white-(0)->white-(0)->lightgray-(6)->(4,70,28)-(6)->(4,234,28)-(0)->(252,238,4)-(6)->(236,130,4)-(0)->(244,46,4)-(4)->maroon-(0)->magenta->gray->lightgray'
if modname = HRRR15
 'd var016196clm'
else
 'd REFCclm'
endif
'set gxout contour'
'set rgb 88 0 0 0'
'set clevs 45'
'set ccols 88'
'd mxuphl5000_2000'
level = surface
'run /home/scripts/grads/functions/windvector.gs 'sector' 'modname' 'level
'run /home/scripts/grads/functions/counties.gs 'sector
'run /home/scripts/grads/functions/states.gs 'sector
'run /home/scripts/grads/functions/interstates.gs 'sector
*start_readout
if modname = GFS | modname = NAM | modname = NAMNST | modname = RAP | modname = HRRR
 'set gxout print'
 'run /home/scripts/grads/functions/readout.gs 'modname' 'sector
 if modname = HRRR15
  'd var016196clm'
 else
  'd REFCclm'
 endif
 dummy=write(basedir'/'modname'/'runtime'/'sector'/readout/'prodname%txtext,result)
endif
*end_readout
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*plot the colorbar on the image
'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 3 -fh .1 -fw .1 -lc 99 -edge triangle -fc 99'
*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
