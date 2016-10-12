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
'set t 'fhour+1
*get some time parameters
'run /home/scripts/grads/functions/timelabel.gs 'modinit' 'modname' 'fhour
*set domain based on sector input argument
'run /home/scripts/grads/functions/sectors.gs 'sector

*START: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

*give the image a product title

'draw string 0.1 8.3 `nHourly-Max 2-5km Updraft Helicity (m`a2`n s`a-2`n) | College of DuPage NeXLaB'

*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname sector _con_uphly_ fhour
filename = basedir'/'modname'/'modinit'/'sector'/'prodname%filext
*pick a colorbar
'run /home/scripts/grads/colorbars/color.gs 0 400 10 -kind white-(0)->silver->green->yellow->orange->red->maroon->magenta->powderblue->aqua'
'set gxout shade2'
if modname = HRRR15
 'd var071975000_20'
else
 'd mxuphl5000_2000'
endif
'run /home/scripts/grads/functions/counties.gs 'sector
'run /home/scripts/grads/functions/states.gs 'sector
'run /home/scripts/grads/functions/interstates.gs 'sector
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

*plot the colorbar on the image
'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 4 -fh .1 -fw .1 -lc 99 -edge triangle -fc 99'

*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
