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
'draw string 0.1 8.3 `nCritical Thickness | 500mb - 850mb RH (%) | College of DuPage NeXLaB'
*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname sector _prec_cthk_ fhour
filename = basedir'/'modname'/'modinit'/'sector'/'prodname%filext
*pick a colorbar
'set gxout shade2'
'run /home/scripts/grads/colorbars/color.gs 0 95 2.5 -kind maroon->black->gray->white-(0)->lightcyan'
'define RHA = ave(RHprs,lev=850,lev=500)'
'd RHA' 
'define thick17 = (HGTprs(lev=700) - HGTprs(lev=1000))'
'define thick87 = (HGTprs(lev=700) - HGTprs(lev=850))'
'define thick18 = (HGTprs(lev=850) - HGTprs(lev=1000))'
'define thick75 = (HGTprs(lev=500) - HGTprs(lev=700))'
'define thick15 = (HGTprs(lev=500) - HGTprs(lev=1000))'
'define thick85 = (HGTprs(lev=500) - HGTprs(lev=850))'
'set gxout contour'
'set ccolor 2'
'set cstyle 1'
'set clevs 2840'
'd thick17'
'set cthick 4'
'set ccolor 5'
'set clevs 1540'
'd thick87'
'set ccolor 7'
'set clevs 1300'
'd thick18'
'set ccolor 9'
'set clevs 2560'
'd thick75'
'set ccolor 1'
'set clevs 5400'
'd thick15'
'set ccolor 3'
'set clevs 4100'
'd thick85'
'set lev 850'
'set ccolor 4'
'set clevs 0'
'd (TMPprs-273.15)'
'run /home/scripts/grads/functions/graycounties.gs 'sector
'run /home/scripts/grads/functions/graystates.gs 'sector
*start_readout
if modname = GFS | modname = NAM | modname = RAP
 'set gxout print'
 'run /home/scripts/grads/functions/readout.gs 'modname' 'sector
 'd RHA'
 dummy=write(basedir'/'modname'/'modinit'/'sector'/readout/'prodname%txtext,result)
endif
*end_readout
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*plot the colorbar on the image
'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 2 -fh .1 -fw .1 -lc 99 -edge triangle -fc 99'
*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
