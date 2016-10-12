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
'run /home/scripts/grads/colorbars/color.gs -30 115 2.5 -kind darkseagreen->lightgray->lightsteelblue->magenta->mediumblue->cyan->green->yellow->orange->red->maroon->magenta->white'
'set gxout shade2'
*START: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*give the image a product title
'draw string 0.1 8.3 `42m Wetbulb Temperature | College of DuPage NeXLaB'
level=surface
*'set lev 'level
't = TMP2m'
'tc=(t-273.16)'
'rh = RH2m'
'p = PRMSLmsl/100'
'td=DPT2m-273.16'
'vare=(6.11*pow(10,(7.5*td/(237.7+td))))'
'wbc=(((0.00066*p)*td)+((4098*vare)/(pow((td+237.7),2)*td)/((0.00066*p)+(4098*vare)/(pow((td+237.7),2)))))'
'd wbc*9/5+32'
*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname sector _sfc_wetblb_ fhour
filename = basedir'/'modname'/'modinit'/'sector'/'prodname%filext
'run /home/scripts/grads/functions/counties.gs 'sector
'run /home/scripts/grads/functions/windbarb.gs 'sector' 'modname' 'level
'run /home/scripts/grads/functions/states.gs 'sector
'set cint 2'
'run /home/scripts/grads/functions/isoheights.gs 'level
'set gxout contour'
'set ccolor 100'
'set cthick 6'
'set cint 1'
'set cmax 32'
'set cmin 32'
'set cstyle 3'
'd wbc*9/5+32'
*start_readout
if modname = GFS | modname = NAM | modname = RAP
 'set gxout print'
 'run /home/scripts/grads/functions/readout.gs 'modname' 'sector
 'd wbc*9/5+32'
 dummy=write(basedir'/'modname'/'modinit'/'sector'/readout/'prodname%txtext,result)
endif
*end_readout
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*plot the colorbar on the image
'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 2 -fh .1 -fw .1 -lc 99 -edge triangle -fc 99'
*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
