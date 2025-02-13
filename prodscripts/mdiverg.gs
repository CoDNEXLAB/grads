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
if modname = NAMAK
 modname = NAM
endif
if modname = GFS | modname = NAM | modname = GEM
 'set t 'fhour/3+1
else
 'set t 'fhour+1
endif
*get some time parameters
'run /home/scripts/grads/functions/timelabel.gs 'modinit' 'modname' 'fhour
*set domain based on sector input argument
'run /home/scripts/grads/functions/sectors.gs 'sector' 'modname
'set gxout shade2'
'run /home/scripts/grads/colorbars/color.gs -20 60 2.5 -kind dimgray-(7)->white-(0)->(0,150,0,111)->yellow->orange->red->maroon->magenta->indigo->blue->darkturquoise'
*START: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*give the image a product title
'draw string 0.1 8.3 `4Sfc. Moisture Convergence (`ng kg`a-1`n s`a-1`n) | Wind (kts) | College of DuPage NEXLAB'
*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname sector _con_mconv_ fhour
filename = basedir'/'modname'/'runtime'/'sector'/'prodname%filext
level = 1000
'set lev 'level
'tc = (TMPprs-273.16)'
'td = tc-((14.55+0.114*tc)*(1-0.01*RHprs) + pow((2.5+0.007*tc)*(1-0.01*RHprs),3) + (15.9+0.117*tc)*pow((1-0.01*RHprs),14))'
'vapr = 6.112*exp((17.67*td)/(td+243.5))'
'e = vapr*1.001+(lev-100)/900*0.0034'
'mixr = 0.62197*(e/(lev-e))*1000'
'mconv = (-1)*hdivg(UGRDprs*mixr,VGRDprs*mixr)*1e4'
'd mconv'
'run /home/scripts/grads/functions/counties.gs 'sector
level = surface
'set cint 2'
if modname = RAP
  'set gxout contour'
  'set ccolor 99'
  'set cthick 4'
  'd MSLMAmsl /100'
else
  'run /home/scripts/grads/functions/isoheights.gs 'level
endif
'run /home/scripts/grads/functions/windbarb.gs 'sector' 'modname' 'level
'run /home/scripts/grads/functions/states.gs 'sector

*start_readout
if modname = GFS | modname = NAM | modname = RAP
 'set gxout print'
 'run /home/scripts/grads/functions/readout.gs 'modname' 'sector
 'd mconv'
 dummy=write(basedir'/'modname'/'runtime'/'sector'/readout/'prodname%txtext,result)
endif
*end_readout
************************
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*plot the colorbar on the image
'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 2 -fh .1 -fw .1 -lc 99 -edge triangle -fc 99'
*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
