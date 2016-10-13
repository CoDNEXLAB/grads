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
'draw string 0.1 8.3 500mb Absolute Vorticity (s`a-1`n) | Height (m) | College of DuPage NeXLaB'
*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname sector _500_avort_ fhour
filename = basedir'/'modname'/'modinit'/'sector'/'prodname%filext
'set gxout shade2'
*pick a colorbar
'run /home/scripts/grads/colorbars/color.gs -6 60 1 -kind lightslategray->silver->white->green->yellow->orange->red->maroon->magenta->indigo->blue->darkturquoise'
*set level (set both!)
level = 500
'set lev 'level
if modname = RAP
 'define coriol=2*7.29e-5*sin(lat*3.1415/180)'
 'define vort=hcurl(UGRDprs,VGRDprs)' 
 'd (coriol+vort)*100000'
else
 'd ABSVprs*100000'
endif
'run /home/scripts/grads/colorbars/color.gs -6 60 1 -kind lightslategray->silver->white->green->yellow->orange->red->maroon->magenta->indigo->blue->darkturquoise'
if modname = RAP
 'd maskout((coriol+vort)*-100000,lat*-1)'
else
 'd maskout(ABSVprs*-100000,lat*-1)'
endif 
'run /home/scripts/grads/functions/interstates.gs 'sector
'run /home/scripts/grads/functions/states.gs 'sector
'set cint 60'
'run /home/scripts/grads/functions/isoheights.gs 'modname' 'level
*start_readout
if modname = GFS | modname = NAM
 'set gxout print'
 'run /home/scripts/grads/functions/readout.gs 'modname' 'sector
 'd ABSVprs*100000'
 dummy=write(basedir'/'modname'/'modinit'/'sector'/readout/'prodname%txtext,result)
endif
if modname = RAP
 'set gxout print'
 'run /home/scripts/grads/functions/readout.gs 'modname' 'sector
 'd (coriol+vort)*100000'
 dummy=write(basedir'/'modname'/'modinit'/'sector'/readout/'prodname%txtext,result)
endif
*end_readout
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*plot the colorbar on the image
'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 4 -fh .1 -fw .1 -lc 99 -edge triangle -fc 99'
*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
