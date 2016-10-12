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
*START: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*give the image a product title
'draw string 0.1 8.3 `n2 PVU Pressure (mb) | 2 PVU Streamlines | College of DuPage NeXLaB'
*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname sector _2pvu_pres_ fhour
filename = basedir'/'modname'/'modinit'/'sector'/'prodname%filext
*pick a colorbar
'run /home/scripts/grads/colorbars/color.gs 200 650 25 -kind white-(0)->aqua->green->yellow->orange->red->maroon'
'set gxout shade2'
'd PRES2pv/100'
'run /home/scripts/grads/colorbars/color.gs 200 650 25 -kind white-(0)->aqua->green->yellow->orange->red->maroon'
'd PRESneg2pv/100'
'set gxout stream'
if sector != WLD
 'set rgb 180 0 0 0 110'
 'set ccolor 180'
 'd UGRD2pv;VGRD2pv'
 'set ccolor 180'
 'd UGRDneg2pv;VGRDneg2pv'
endif
'run /home/scripts/grads/functions/counties.gs 'sector
'run /home/scripts/grads/functions/states.gs 'sector
*start_readout
if modname = GFS
 'set gxout print'
 'run /home/scripts/grads/functions/readout.gs 'modname' 'sector
 'd PRES2pv/100'
 dummy=write(basedir'/'modname'/'modinit'/'sector'/readout/'prodname%txtext,result)
endif
*end_readout
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*plot the colorbar on the image
'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 2 -fh .1 -fw .1 -lc 99 -edge triangle -fc 99'
*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
