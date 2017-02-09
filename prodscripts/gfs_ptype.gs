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
'run /home/scripts/grads/functions/sectors.gs 'sector
*START: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*give the image a product title
'draw string 0.1 8.3 PType | 1000-500mb Thickness (dam) | College of DuPage NeXLaB'
*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname sector _prec_ptype_ fhour
filename = basedir'/'modname'/'runtime'/'sector'/'prodname%filext
'set gxout shade2'
'run /home/scripts/grads/colorbars/color.gs 1 2000 100 -kind white->white'
'd TMP2m'
'run /home/scripts/grads/colorbars/color.gs -levs .01 .02 .03 .04 .05 .06 .07 .08 .09 .1 .125 .15 .175 .2 .25 .3 .35 .4 .5 .6 -kind (111,111,111,0)-(0)->white-(0)->(148,227,141)-(10)->darkgreen-(0)->yellow->orange'
*'run /home/scripts/grads/colorbars/color.gs 0 .5 .05 -kind white->green->yellow->red'
'set gxout shade2'
'set ccolor 2'
'set cstyle 2'
'set black 0 540'
'd PRATEsfc*CRAINsfc*141.7323'
*plot the colorbar on the image
'run /home/scripts/grads/functions/pltraincolorbar.gs -ft 1 -fy 0.33 -line on -fskip 5 -fh .1 -fw .1 -lc 99 -fc 99'
'run /home/scripts/grads/colorbars/color.gs -levs .01 .02 .03 .04 .05 .06 .07 .08 .09 .1 .125 .15 .175 .2 .25 .3 .35 .4 .5 .6 -kind (111,111,111,0)-(0)->white-(0)->lightblue-(10)->darkslateblue-(0)->darkorchid->plum'
'd PRATEsfc*CSNOWsfc*141.7323'
'run /home/scripts/grads/functions/pltsnowcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 5 -fh .1 -fw .1 -lc 99 -fc 99'
'run /home/scripts/grads/colorbars/color.gs -levs .01 .02 .03 .04 .05 .06 .07 .08 .09 .1 .125 .15 .175 .2 .25 .3 .35 .4 .5 .6 -kind (111,111,111,0)-(0)->white-(0)->lightpink->maroon'
'd PRATEsfc*CICEPsfc*141.7323'
'run /home/scripts/grads/functions/pltipcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 5 -fh .1 -fw .1 -lc 99 -fc 99'
'run /home/scripts/grads/colorbars/color.gs -levs .01 .02 .03 .04 .05 .06 .07 .08 .09 .1 .125 .15 .175 .2 .25 .3 .35 .4 .5 .6 -kind (111,111,111,0)-(0)->white-(0)->lightpink->indigo'
'd PRATEsfc*CFRZRsfc*141.7323'
'run /home/scripts/grads/functions/pltzrcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 5 -fh .1 -fw .1 -lc 99 -fc 99'
if modname = HRRR
 'define thick15 = HGT500mb - HGT1000mb'
else
 'define thick15 = (HGTprs(lev=500) - HGTprs(lev=1000))'
endif
'set gxout contour'
'set cint 6'
'set ccolor 2'
'set cstyle 2'
'set black 0 540'
'd thick15/10'
'set cint 6'
'set ccolor 4'
'set cstyle 2'
'set black 546 1000'
'd thick15/10'
level=surface
*'run /home/scripts/grads/functions/windbarb.gs 'sector' 'modname' 'level
'set cint 2'
'run /home/scripts/grads/functions/isoheights.gs 'level' 'modname
'run /home/scripts/grads/functions/counties.gs 'sector
'run /home/scripts/grads/functions/states.gs 'sector
'set string 0 l 1 0'
'set strsiz 0.08'
'draw string .01 .08 RA'
'draw string 2.75 .08 SN'
'draw string 5.5 .08 IP'
'draw string 8.25 .08 ZR'
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*plot the colorbar on the image
*'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 2 -fh .1 -fw .1'
*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
