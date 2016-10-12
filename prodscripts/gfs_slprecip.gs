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
*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname sector _prec_prec_ fhour
filename = basedir'/'modname'/'modinit'/'sector'/'prodname%filext
*pick a colorbar
'set gxout shade2'
'run /home/scripts/grads/colorbars/color.gs -levs .01 .05 .1 .15 .25 .35 .5 .75 1 1.5 2 3 4 -kind black->dodgerblue->blue->lime->forestgreen->darkgreen->yellow->orange->orangered->red->deeppink->magenta->orchid->plum'
if fhour = 3 | fhour = 9 | fhour = 15 | fhour = 21 | fhour = 27 | fhour = 33 | fhour = 39 | fhour = 45 | fhour = 51 | fhour = 57 | fhour = 63 | fhour = 69 | fhour = 75 | fhour = 81 | fhour = 87 | fhour = 93 | fhour = 99 | fhour = 105 | fhour = 111 | fhour = 117 | fhour = 123 | fhour = 129 | fhour = 135 | fhour = 141 | fhour = 147 | fhour = 153 | fhour = 159 | fhour = 165 | fhour = 171 | fhour = 177 | fhour = 183 | fhour = 189 | fhour = 195 | fhour = 201 | fhour = 207 | fhour = 213 | fhour = 219 | fhour = 225 | fhour = 231 | fhour = 237 | fhour = 252 | fhour = 264 | fhour = 276 | fhour = 288 | fhour = 300 | fhour = 312 | fhour = 324 | fhour = 336 | fhour = 348  | fhour = 360 | fhour = 372 | fhour = 384 
 'define paccumCurrent = APCPsfc'
 if fhour = 252 | fhour = 264 | fhour = 276 | fhour = 288 | fhour = 300 | fhour = 312 | fhour = 324 | fhour = 336 | fhour = 348  | fhour = 360 | fhour = 372 | fhour = 384   
  'draw string 0.1 8.3 `n12h Precip (in.) | MSLP (mb) | 1000-500mb Thickness (m) | weather.cod.edu'
 else  
  'draw string 0.1 8.3 `n3h Precip (in.) | MSLP (mb) | 1000-500mb Thickness (m) | weather.cod.edu'
 endif
else
 'define paccumCurrent = APCPsfc'
 'set t 'fhour/3
 'define paccumLast = APCPsfc'
 'define paccumCurrent = paccumCurrent - paccumLast'
 'draw string 0.1 8.3 `n3h Precip (in.) | MSLP (mb) | 1000-500mb Thickness (m) | weather.cod.edu'
 'set t 'fhour/3+1
endif 
'd paccumCurrent/25.4'
'define thick15 = (HGTprs(lev=500) - HGTprs(lev=1000))'
'set gxout contour'
if sector != WLD
 'set cthick 4'
 'set cint 2'
 'set ccolor 5'
 'd PRMSLmsl/100'
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
if modname = GFS
 'set gxout print'
 'run /home/scripts/grads/functions/readout2.gs 'modname' 'sector
 'd paccumCurrent/25.4'
 dummy=write(basedir'/'modname'/'modinit'/'sector'/readout/'prodname%txtext,result)
endif
*end_readout
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*plot the colorbar on the image
'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 1 -fh .1 -fw .1 -lc 99 -edge triangle -fc 99'
*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
