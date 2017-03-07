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
*set domain based on sector input argument
'run /home/scripts/grads/functions/sectors.gs 'sector' 'modname
*START: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*give the image a product title
'draw string 0.1 8.3 `nPrecip. Accumulation (Mean All Members) | College of DuPage NEXLAB'
*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname sector _prec_meanprec_ fhour
filename = basedir'/'modname'/'runtime'/'sector'/'prodname%filext
*pick a colorbar
'set gxout shade2'
*'run /home/scripts/grads/colorbars/color.gs -1 2 1 -kind white->white'
*'d TMP2m*0'
'run /home/scripts/grads/colorbars/color.gs -levs 0 .01 .025 .05 .075 .1 .25 .5 .75 1 1.25 1.5 1.75 2 2.25 2.5 2.75 3 3.25 3.5 3.75 4 4.5 5 5.5 6 6.5 7 7.5 8 9 10 11 12 -kind white->gray->green->yellow->orange->red->maroon->magenta->cyan->gray->lightgray'
if fhour = 006
 'define paccum = ave(APCPsfc/25.4, e=1, e=20)'
else
 'define paccum = sum(ave(APCPsfc/25.4, e=1, e=20),t=1,t='fhour/6+1',1)'
endif
'd paccum'
'run /home/scripts/grads/functions/states.gs 'sector
'run /home/scripts/grads/functions/interstates.gs 'sector
*start_readout
if modname = GEFS
 'set gxout print'
 'run /home/scripts/grads/functions/readout2.gs 'modname' 'sector
 'd paccum'
 dummy=write(basedir'/'modname'/'runtime'/'sector'/readout/'prodname%txtext,result)
endif
*end_readout
'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 3 -fh .1 -fw .1 -lc 99 -edge triangle -fc 99'
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
