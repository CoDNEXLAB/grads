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
if modname = GFS | modname = NAM
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
'draw string 0.1 8.3 `n1h Conv. Precip (in.) | MSLP (mb) | 1000-500mb Thickness (m) | weather.cod.edu'
*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname sector _prec_cprec_ fhour
filename = basedir'/'modname'/'modinit'/'sector'/'prodname%filext
*pick a colorbar
'set gxout shade2'
'run /home/scripts/grads/colorbars/color.gs -levs .01 .05 .1 .15 .25 .35 .5 .75 1 1.5 2 3 4 -kind black->dodgerblue->blue->lime->forestgreen->darkgreen->yellow->orange->orangered->red->deeppink->magenta->orchid->plum'
'd ACPCPsfc/25.4'
'define thick15 = (HGTprs(lev=500) - HGTprs(lev=1000))'
'set gxout contour'
if sector != WLD
 'set cthick 4'
 'set cint 2'
 'set ccolor 5'
 'd MSLMAmsl/100'
 'set cthick 2'
 'set lev 500'
 'set cint 60'
 'set ccolor 7'
 'set cstyle 5'
 'd thick15'
endif
'set clevs 5100 5400 5700'
'set ccolor 7'
'set cstyle 1'
'd thick15'
'run /home/scripts/grads/functions/redcounties.gs 'sector
'run /home/scripts/grads/functions/redstates.gs 'sector
*start_readout
if modname = RAP
 'set gxout print'
 'run /home/scripts/grads/functions/readout2.gs 'modname' 'sector
 'd ACPCPsfc/25.4'
 dummy=write(basedir'/'modname'/'modinit'/'sector'/readout/'prodname%txtext,result)
endif
*end_readout
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*plot the colorbar on the image
'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 1 -fh .1 -fw .1 -lc 99 -edge triangle -fc 99'
*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
