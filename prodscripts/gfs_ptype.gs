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
'draw string 0.1 8.3 `nPRate (in. hr`a-1`n) | PType | 1000-500mb Thickness | College of DuPage NEXLAB'
*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname sector _prec_ptype_ fhour
filename = basedir'/'modname'/'runtime'/'sector'/'prodname%filext
'set gxout shade2'
'run /home/scripts/grads/colorbars/color.gs -levs .01 .02 .03 .04 .05 .1 .15 .25 .5 .75 1 1.25 1.5 2 3 -kind (111,111,111,0)-(0)->(148,227,141)-(8)->darkgreen-(0)->yellow->orange'
'd TMP2m*0.00001'
'run /home/scripts/grads/functions/pltraincolorbar.gs -ft 1 -fy 0.33 -line on -fskip 5 -fh .1 -fw .1 -lc 99 -fc 99'
'run /home/scripts/grads/colorbars/color.gs -levs .01 .02 .03 .04 .05 .1 .15 .25 .5 .75 1 1.25 1.5 2 3 -kind (111,111,111,0)-(0)->lightblue-(8)->darkslateblue-(0)->darkorchid->plum'
'd TMP2m*0.00001'
'run /home/scripts/grads/functions/pltsnowcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 5 -fh .1 -fw .1 -lc 99 -fc 99'
'run /home/scripts/grads/colorbars/color.gs -levs .01 .02 .03 .04 .05 .1 .15 .25 .5 .75 1 1.25 1.5 2 3 -kind (111,111,111,0)-(0)->lightpink->maroon'
'd TMP2m*0.00001'
'run /home/scripts/grads/functions/pltipcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 5 -fh .1 -fw .1 -lc 99 -fc 99'
'run /home/scripts/grads/colorbars/color.gs -levs .01 .02 .03 .04 .05 .1 .15 .25 .5 .75 1 1.25 1.5 2 3 -kind (111,111,111,0)-(0)->lightpink->indigo'
'd TMP2m*0.00001'
'run /home/scripts/grads/functions/pltzrcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 5 -fh .1 -fw .1 -lc 99 -fc 99'
****************
'run /home/scripts/grads/colorbars/color.gs -levs .01 .02 .03 .04 .05 .1 .15 .25 .5 .75 1 1.25 1.5 2 3 -kind (111,111,111,0)-(0)->(148,227,141)-(8)->darkgreen-(0)->yellow->orange'
'd PRATEsfc*CRAINsfc*141.7323*6'
*'run /home/scripts/grads/functions/pltraincolorbar.gs -ft 1 -fy 0.33 -line on -fskip 4 -fh .1 -fw .1 -lc 99 -fc 99'
'run /home/scripts/grads/colorbars/color.gs -levs .01 .02 .03 .04 .05 .1 .15 .25 .5 .75 1 1.25 1.5 2 3 -kind (111,111,111,0)-(0)->lightblue-(8)->darkslateblue-(0)->darkorchid->plum'
'd PRATEsfc*CSNOWsfc*141.7323*6'
*'run /home/scripts/grads/functions/pltsnowcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 4 -fh .1 -fw .1 -lc 99 -fc 99'
'run /home/scripts/grads/colorbars/color.gs -levs .01 .02 .03 .04 .05 .1 .15 .25 .5 .75 1 1.25 1.5 2 3 -kind (111,111,111,0)-(0)->lightpink->maroon'
'd PRATEsfc*CICEPsfc*141.7323*6'
*'run /home/scripts/grads/functions/pltipcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 4 -fh .1 -fw .1 -lc 99 -fc 99'
'run /home/scripts/grads/colorbars/color.gs -levs .01 .02 .03 .04 .05 .1 .15 .25 .5 .75 1 1.25 1.5 2 3 -kind (111,111,111,0)-(0)->lightpink->indigo'
'd PRATEsfc*CFRZRsfc*141.7323*6'
*'run /home/scripts/grads/functions/pltzrcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 4 -fh .1 -fw .1 -lc 99 -fc 99'
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
'set string 99 l 1 0'
'set strsiz 0.08'
'draw string .01 .08 RA'
'draw string 2.75 .08 SN'
'draw string 5.53 .08 IP'
'draw string 8.25 .08 ZR'
*start_readout
if modname = GFS
 'set gxout print'
 'run /home/scripts/grads/functions/readout2.gs 'modname' 'sector
 'd PRATEsfc*141.7323*6'
 dummy=write(basedir'/'modname'/'runtime'/'sector'/readout/'prodname%txtext,result)
endif
*end_readout
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*plot the colorbar on the image
*'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 2 -fh .1 -fw .1'
*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
