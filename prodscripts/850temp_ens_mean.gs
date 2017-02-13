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
'set t 'fhour/6+1
*get some time parameters
'run /home/scripts/grads/functions/timelabel.gs 'modinit' 'modname' 'fhour
*set domain based on sector input argument GEFS!!!!
'run /home/scripts/grads/functions/sectors_positive.gs 'sector
*START: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*give the image a product title
'draw string 0.1 8.3 `n850mb Temp (`3.`4C | Mean All Members) | College of DuPage NeXLaB'
*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname sector _850_meantemp_ fhour
filename = basedir'/'modname'/'runtime'/'sector'/'prodname%filext
'run /home/scripts/grads/colorbars/color.gs -30 42 2 -kind darkseagreen->dimgray->lightsteelblue->magenta->mediumblue->cyan->green->yellow->orange->red->maroon->magenta->white'
'set gxout shade2'
'd ave(TMP850mb-273.16, e=1, e=20)'
'set gxout contour'
'set ccolor 99'
'set cthick 4'
'set cint 30'
'd ave(HGT850mb, e=1, e=20)'
'define u10 = ave(skip(UGRD850mb,2,2)*2, e=1, e=20)'
'define v10 = ave(skip(VGRD850mb,2,2)*2, e=1, e=20)'
'set gxout barb'
'set rgb 99 0 0 0'
'set ccolor 99'
'set cthick 1'
'set digsize 0.05'
'd u10;v10'
*begin readout
if modname = GEFS
 'set gxout print'
 'run /home/scripts/grads/functions/readout.gs 'modname' 'sector
 'd ave(TMP850mb-273.16, e=1, e=20)'
 dummy=write(basedir'/'modname'/'runtime'/'sector'/readout/'prodname%txtext,result)
endif
*end_readout
'run /home/scripts/grads/functions/states.gs 'sector
'run /home/scripts/grads/functions/interstates.gs 'sector
'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 1 -fh .1 -fw .1 -lc 99 -edge triangle -fc 99'
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
