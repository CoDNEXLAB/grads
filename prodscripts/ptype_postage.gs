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
'set t 'fhour/6+1
*get some time parameters
'run /home/scripts/grads/functions/timelabel.gs 'modinit' 'modname' 'fhour
*set domain based on sector input argument
'run /home/scripts/grads/functions/sectors_positive.gs 'sector
*START: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*give the image a product title
'draw string 0.1 8.3 Precip. Type | MSLP (mb) | College of DuPage NEXLAB'
*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname sector _prec_ptypens_ fhour
filename = basedir'/'modname'/'runtime'/'sector'/'prodname%filext
level = 500
'set lev 'level
rows=4
cols=5
i=1
j=1
e=1
'set gxout shade2'
while(e<=20)
 'set e 'e
 if(j>cols);i=i+1;j=1;endif
 'run /home/scripts/grads/functions/set_parea.gs 'rows' 'cols' 'i' 'j' -m 0.1'
 'run /home/scripts/grads/colorbars/color.gs -levs 0 .01 .025 .05 .075 .1 .25 .5 .75 1 1.25 1.5 1.75 2 2.25 2.5 2.75 3 3.25 3.5 3.75 4 4.5 5 5.5 6 6.5 7 7.5 8 9 10 11 12 -kind white->gray->green->yellow->orange->red->maroon->magenta->cyan->gray->lightgray'
 'set mpdraw on'
 'set mpdset mres'
 'set rgb 92 0 0 0 150'
 'set mpt 2 off'
 'set map 99 1 1'
 'draw map'
 'run /home/scripts/grads/colorbars/color.gs -levs .01 .02 .03 .04 .05 .06 .07 .08 .09 .1 .125 .15 .175 .2 .25 .3 .35 .4 .5 .6 -kind (111,111,111,0)-(0)->white-(0)->(148,227,141)-(10)->darkgreen-(0)->yellow->orange'
 'set gxout shade2'
 'd PRATEsfc*CRAINsfc*141.7323'
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
 'set rgb 92 0 0 0 150'
 'set cint 4'
 'set clab off'
 'set gxout contour'
 'set ccolor 92'
 'set cthick 3'
 'd PRMSLmsl/100'
 if sector = US | sector = NGP | sector = SGP | sector = MW
  'set rgb 92 0 0 0 100'
  'set line 92 1 1'
  'draw shp /home/scripts/grads/shapefiles/states.shp'
 endif
 j=j+1
 e=e+1
endwhile
'draw string 0.28 6.5 Ensemble Member: 1'
'draw string 0.28 4.4 Ensemble Member: 6'
'draw string 0.25 2.3 Ensemble Member: 11'
'draw string 0.25 0.25 Ensemble Member: 16'
'draw string 2.45 6.5 Ensemble Member: 2'
'draw string 2.45 4.4 Ensemble Member: 7'
'draw string 2.42 2.3 Ensemble Member: 12'
'draw string 2.42 0.25 Ensemble Member: 17'
'draw string 4.63 6.5 Ensemble Member: 3'
'draw string 4.63 4.4 Ensemble Member: 8'
'draw string 4.6 2.3 Ensemble Member: 13'
'draw string 4.6 0.25 Ensemble Member: 18'
'draw string 6.8 6.5 Ensemble Member: 4'
'draw string 6.8 4.4 Ensemble Member: 9'
'draw string 6.77 2.3 Ensemble Member: 14'
'draw string 6.77 0.25 Ensemble Member: 19'
'draw string 8.97 6.5 Ensemble Member: 5'
'draw string 8.97 4.4 Ensemble Member: 10'
'draw string 8.94 2.3 Ensemble Member: 15'
'draw string 8.94 0.25 Ensemble Member: 20'

*'run /home/scripts/grads/functions/states.gs 'sector
*'run /home/scripts/grads/functions/interstates.gs 'sector
'run /home/scripts/grads/functions/plt_enscolorbar.gs -ft 1 -fy 0.28 -line on -fskip 3 -fh .1 -fw .1 -lc 99 -edge triangle -fc 99'
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
