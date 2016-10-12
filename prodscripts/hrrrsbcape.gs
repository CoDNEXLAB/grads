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

'draw string 0.1 8.3 `nSBCAPE (J kg`a-1`n) | 0-6km Bulk Wind Diff. (kts) | College of DuPage NeXLaB'

*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname sector _con_sbcape_ fhour
filename = basedir'/'modname'/'modinit'/'sector'/'prodname%filext

*pick a colorbar
*'run /home/scripts/grads/colorbars/color.gs 0 6000 100 -kind white-(0)->white-(0)->indigo->magenta->mediumblue->aqua->springgreen->olive->yellow->orange->maroon->red->dimgray->powderblue'
'run /home/scripts/grads/colorbars/color.gs 0 6000 100 -kind white-(0)->white-(0)->indigo-(7)->magenta-(0)->mediumblue-(8)->aqua-(0)->springgreen-(8)->olive-(0)->yellow-(8)->orange-(0)->maroon-(8)->red-(0)->dimgray->powderblue'
'set gxout shade2'
'd CAPEsfc'
*May have to get crafty here in the future if model is missing 0-6shear grib entry (e.g., 500 hPa wind - 10m wind)
level = shear06
'set lev 0'
'run /home/scripts/grads/functions/counties.gs 'sector
'run /home/scripts/grads/functions/windbarb.gs 'sector' 'modname' 'level

'run /home/scripts/grads/functions/states.gs 'sector
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

*plot the colorbar on the image
'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 5 -fh .1 -fw .1 -lc 99 -edge triangle -fc 99'

*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
