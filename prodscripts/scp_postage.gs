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
'run /home/scripts/grads/functions/sectors.gs 'sector' 'modname
*START: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*give the image a product title
'draw string 0.1 8.3 Supercell Composite Parameter | College of DuPage NEXLAB'
*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname sector _con_scpens_ fhour
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
 'run /home/scripts/grads/colorbars/color.gs -levs .25 .5 1 2 4 7 10 15 20 25 30 35 -kind white->(210,210,210)->(50,255,31)->(151,253,23)->(252,245,15)->(251,128,7)->(249,5,0)->(249,0,80)->(249,0,167)->(245,0,249)->(158,0,249)->(180,100,225)->cyan'
 'set mpdraw on'
 'set mpdset mres'
 'set rgb 92 0 0 0 150'
 'set mpt 2 off'
 'set map 99 1 1'
 'draw map'
 'define scp = (CAPEsfc/1000)*(HLCY3000_0m/100)*(mag(UGRD500mb,VGRD500mb)*2/35)'
 'd scp'
 if sector = US | sector = NGP | sector = SGP | sector = MW | sector = CGP
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
'run /home/scripts/grads/functions/plt_enscolorbar.gs -ft 1 -fy 0.28 -line on -fskip 1 -fh .1 -fw .1 -lc 99 -edge triangle -fc 99'
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
