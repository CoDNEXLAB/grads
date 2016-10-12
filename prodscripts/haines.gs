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
if modname = GFS
 'set t 'fhour/3+1
else
 'set t 'fhour+1
endif
*get some time parameters
'run /home/scripts/grads/functions/timelabel.gs 'modinit' 'modname' 'fhour
*set domain based on sector input argument
'run /home/scripts/grads/functions/sectors.gs 'sector
'run /home/scripts/grads/colorbars/color.gs -1 6 1 -kind white->green->yellow->orange->red->magenta'
'set gxout shade2'
*START: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*give the image a product title

'draw string 0.1 8.3 Surface Haines Index | 10m Wind (kts) | College of DuPage NeXLaB'
'd HINDEXsfc'
*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname sector _sfc_haines_ fhour
filename = basedir'/'modname'/'modinit'/'sector'/'prodname%filext
level = surface
'run /home/scripts/grads/functions/counties.gs 'sector
'set cint 2'
'run /home/scripts/grads/functions/isoheights.gs 'level
'run /home/scripts/grads/functions/windbarb.gs 'sector' 'modname' 'level
'run /home/scripts/grads/functions/states.gs 'sector

************************
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

*plot the colorbar on the image
'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 2 -fh .1 -fw .1'
*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
