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
if modname = GFS | modname = NAM | modname = GEM
 'set t 'fhour/3+1
else
 'set t 'fhour+1
endif
*set domain based on sector input argument
'set lat 20 57'
'set lon -128 -65'
*START: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*pick a colorbar
*'run /home/scripts/grads/colorbars/color.gs -85 55 2.5 -kind magenta-(3)->red-(2)->orange-(2)->green-(2)->cyan-(2)->blue-(0)->white->black-(0)->maroon->tomato'
*'set gxout shade2'
*'d BRTMPtoa-273.15'
* 'set gxout contour'
* 'set ccolor 99'
* 'set cthick 3'
* 'set cint 2'
* 'set gxout kml'
* 'set kml -ln test15.kml'
* 'd MSLETmsl/100'
* 'c'
'set grads off'
'set gxout shade2'
'run /home/scripts/grads/colorbars/color.gs -50 203 1 -kind black->white'
'd (TMP2m-273.16)*9/5+32'
*'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 2 -fh .1 -fw .1 -lc 99 -edge triangle -fc 99'
'printim test_rgb.png x3000 y1500'
*'run /home/scripts/grads/colorbars/color.gs 30 170 5 -kind darkgreen-(2)->lime-(0)->olive-(2)->yellow-(0)->maroon-(4)->red-(0)->darkmagenta-(4)->magenta-(0)->mediumblue-(4)->cyan-(0)->gray-(4)->white'
*'d windspeed'
*'printim 3.png x3000 y1500'
*'printim 3svg.svg'
*end_readout
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*plot the colorbar on the image
*'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 2 -fh .1 -fw .1 -lc 99 -edge triangle -fc 99'
*generate the image
*'run /home/scripts/grads/functions/make_image.gs 'filename
