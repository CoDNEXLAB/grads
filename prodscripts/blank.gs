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
basedir = '/home/apache/climate/data/forecast'
*************************************************************************
*open the GrADS .ctl file made in the prodrunner script
ctlext = '.ctl'
'open /home/data/models/grads_ctl/'modname'/'modinit''modname%ctlext
if modname = NAMAK
 modname = NAM
endif
if modname = GFS
 'set t 'fhour/3+1
else
 'set t 'fhour+1
endif
*get some time parameters
*'run /home/scripts/grads/functions/timelabel.gs 'modinit' 'modname' 'fhour
*set domain based on sector input argument
'run /home/scripts/grads/functions/sectors.gs 'sector
*START: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*give the image a product title
'draw string 3.5 8.3 `nFLT Map Select | College of DuPage NeXLaB'
*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname sector _blank_ fhour
filename = basedir'/'modname'/'modinit'/'sector'/'prodname%filext
*pick a colorbar
'run /home/scripts/grads/colorbars/color.gs 0 2000 100 -kind white->white'
'set gxout shade2'
'set lev 500'
'd TMPprs'
*May have to get crafty here in the future if model is missing 0-6shear grib entry (e.g., 500 hPa wind - 10m wind)
'set mpdraw off'
'set line 99 1 1'
'draw shp /home/scripts/grads/shapefiles/states.shp'
'set rgb 94 0 0 255 150'
'set line 94 1 1'
'draw shp /home/scripts/grads/shapefiles/interstates.shp'
'set rgb 98 0 0 0 40'
'set line 98 1 1'
'draw shp /home/scripts/grads/shapefiles/counties.shp'
'set mpdraw on'
'set mpdset hires'
'set rgb 99 0 0 0'
'set mpt 2 99 1 2'
'set map 99'
'set poli on'
'draw map'
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*plot the colorbar on the image
*'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 2 -fh .1 -fw .1 -lc 99 -edge triangle -fc 99'
*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
