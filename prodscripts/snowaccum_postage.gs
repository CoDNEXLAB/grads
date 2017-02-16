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
'draw string 0.1 8.3 Snowfall Accumulation (10:1 Ratio) | College of DuPage NEXLAB'
*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname sector _prec_snens_ fhour
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
 'run /home/scripts/grads/colorbars/color.gs -levs 0.1 0.5 1 1.5 2 2.5 3 3.5 4 4.5 5 5.5 6 6.5 7 7.5 8 8.5 9 9.5 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 27 29 31 33 35 37 39 -kind white-(4)->gray-(0)->paleturquoise-(6)->blue-(0)->indigo-(8)->mediumorchid-(0)->orchid->mediumvioletred->darksalmon->papayawhip'
 'set mpdraw on'
 'set mpdset mres'
 'set rgb 92 0 0 0 150'
 'set mpt 2 off'
 'set map 99 1 1'
 'draw map'
 if fhour = 006
  'define snaccum = APCPsfc/2.54*CSNOWsfc'
 else
  'define snaccum = sum(APCPsfc/2.54*CSNOWsfc,t=1,t='fhour/6+1',1)'
 endif
 'd snaccum'
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
'run /home/scripts/grads/functions/plt_enscolorbar.gs -ft 1 -fy 0.28 -line on -fskip 2 -fh .1 -fw .1 -lc 99 -edge triangle -fc 99'
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
