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
basedir = '/home/apache/atlas/data/forecast'
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

'draw string 0.1 8.3 10m Wind Gust (kts) | College of DuPage NeXLaB'

*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname sector _sfc_gust_ fhour
filename = basedir'/'modname'/'modinit'/'sector'/'prodname%filext

*pick a colorbar
'run /home/scripts/grads/colorbars/color.gs 0 75 2.5 -kind white->(200,200,200)->steelblue->thistle->purple->crimson->khaki->darkgoldenrod'

'set gxout shade2'
'd GUSTsfc*1.94384'
'set gxout vector'
'set rgb 94 0 0 0 60'
'set ccolor 94'
 'set line 94 1 1'
if sector = OKC | sector = CHI | sector = DEN
 'define iskip = skip(UGRD10m,4,4)*1.94384'
 'define jskip = skip(VGRD10m,4,4)*1.94384'
'd iskip;jskip'
else
 'define iskip = skip(UGRD10m,14,14)*1.94384'
 'define jskip = skip(VGRD10m,14,14)*1.94384'
 'd iskip;jskip'
endif
'run /home/scripts/grads/functions/counties.gs 'sector
'run /home/scripts/grads/functions/states.gs 'sector
'run /home/scripts/grads/functions/gust_stations.gs 'sector
*start_readout
if modname = NAM4KM
 'set gxout print'
 'run /home/scripts/grads/functions/readout.gs 'modname' 'sector
 'd GUSTsfc*1.94384'
 dummy=write(basedir'/'modname'/'modinit'/'sector'/readout/'prodname%txtext,result)
endif
*end_readout
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

*plot the colorbar on the image
'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 2 -fh .1 -fw .1 -lc 99 -edge triangle -fc 99'

*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
