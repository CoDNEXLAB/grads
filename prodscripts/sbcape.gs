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
*START: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*give the image a product title
'draw string 0.1 8.3 `nSBCAPE/SBCIN (J kg`a-1`n) | 10m Wind (kts) | College of DuPage NeXLaB'
*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname sector _con_sbcape_ fhour
filename = basedir'/'modname'/'modinit'/'sector'/'prodname%filext
*'run /home/scripts/grads/colorbars/color.gs -levs 50 75 100 250 500 750 1000 1250 1500 1750 2000 2500 3000 4000 5000 6000 7000 8000 -kind white->indigo->magenta->mediumblue->green->yellow->orange->maroon->red->dimgray->powderblue'
'run /home/scripts/grads/colorbars/color.gs 0 6000 100 -kind white-(0)->white-(0)->indigo-(7)->magenta-(0)->mediumblue-(8)->aqua-(0)->springgreen-(8)->olive-(0)->yellow-(8)->orange-(0)->maroon-(8)->red-(0)->dimgray->powderblue'
'd CAPEsfc'
*plot the colorbar on the image
'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 5 -fh .1 -fw .1 -lc 199 -edge triangle -fc 199'
*pick a colorbar
'set rgb 89 255 255 255 255'
'set rgb 90 0 60 200 50'
'set rgb 91 0 150 200 150'
'set rgb 92 0 200 200 200'
'set rgb 93 0 200 200 250'
'set rgb 94 0 10 250 200'
'set rgb 150 230 230 230 170'
'set rgb 149 0 0 0 0'
'set tile 90 4 9 9 1 90 150'
'set tile 91 4 9 9 1 91 150'
'set tile 92 4 9 9 1 92 150'
'set tile 93 4 9 9 1 93 150'
'set tile 94 4 9 9 1 94 150'
'set rgb 95 tile 90'
'set rgb 96 tile 91'
'set rgb 97 tile 92'
'set rgb 98 tile 93'
'set rgb 99 tile 94'
'set gxout shade2'
'set clevs 0 10 25 50 75 100'
'set ccols 149 149 95 96 97 98 99'
'set rgb 199 0 0 0'
'd CINsfc*-1'
*'run /home/scripts/grads/colorbars/color.gs -levs 50 75 100 250 500 750 1000 1250 1500 1750 2000 2500 3000 4000 5000 6000 7000 8000 -kind indigo->magenta->mediumblue->green->yellow->orange->maroon->red->dimgray->powderblue'
*'set cthick 4'
*'set gxout contour'
*'d CAPEsfc'
*May have to get crafty here in the future if model is missing 0-6shear grib entry (e.g., 500 hPa wind - 10m wind)
level = surface
'run /home/scripts/grads/functions/windbarb.gs 'sector' 'modname' 'level
'run /home/scripts/grads/functions/states.gs 'sector
'run /home/scripts/grads/functions/interstates.gs 'sector
*start_readout
if modname = GFS | modname = NAM | modname = RAP
 'set gxout print'
 'run /home/scripts/grads/functions/readout.gs 'modname' 'sector
 'd CAPEsfc'
 dummy=write(basedir'/'modname'/'modinit'/'sector'/readout/'prodname%txtext,result)
endif
*end_readout
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
