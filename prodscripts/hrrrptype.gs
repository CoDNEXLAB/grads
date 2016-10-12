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

'draw string 0.1 8.3 P Type | 1-km AGL RADAR (dBZ) | 10m Wind (kts) | College of DuPage NeXLaB'

*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname sector _prec_ptype_ fhour
filename = basedir'/'modname'/'modinit'/'sector'/'prodname%filext

'set gxout shade2'
'run /home/scripts/grads/colorbars/color.gs -100 200 100 -kind white->white'
'd REFD1000m'
'run /home/scripts/grads/colorbars/color.gs 0 40 5 -kind white-(0)->(148,227,141)->darkgreen'
'd maskout(REFD1000m,CRAINsfc)'
*plot the colorbar on the image
'run /home/scripts/grads/functions/pltraincolorbar.gs -ft 1 -fy 0.33 -line on -fskip 2 -fh .1 -fw .1 -lc 99 -fc 99'
'run /home/scripts/grads/colorbars/color.gs 0 40 5 -kind white-(0)->lightblue->navy'
'd maskout(REFD1000m,CSNOWsfc-0.5)'
'run /home/scripts/grads/functions/pltsnowcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 2 -fh .1 -fw .1 -lc 99 -fc 99'
'run /home/scripts/grads/colorbars/color.gs 0 40 5 -kind white-(0)->lightpink->maroon'
'd maskout(REFD1000m,CICEPsfc-0.5)'
'run /home/scripts/grads/functions/pltipcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 2 -fh .1 -fw .1 -lc 99 -fc 99'
'run /home/scripts/grads/colorbars/color.gs 0 40 5 -kind white-(0)->lightpink->indigo'
'd maskout(REFD1000m,CFRZRsfc-0.5)'
'run /home/scripts/grads/functions/pltzrcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 2 -fh .1 -fw .1 -lc 99 -fc 99'
level=surface
'run /home/scripts/grads/functions/windbarb.gs 'sector' 'modname' 'level
'set cint 2'
'run /home/scripts/grads/functions/isoheights.gs 'level
'run /home/scripts/grads/functions/counties.gs 'sector
'run /home/scripts/grads/functions/states.gs 'sector
'set string 0 l 1 0'
'set strsiz 0.08'
'draw string .25 .08 RA'
'draw string 2.7 .08 SN'
'draw string 5.35 .08 IP'
'draw string 8 .08 ZR'
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

*plot the colorbar on the image
*'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 2 -fh .1 -fw .1 -lc 99 -edge triangle -fc 99'

*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
