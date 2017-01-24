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
*set domain based on sector input argument GEFS!!!!
'run /home/scripts/grads/functions/sectors_positive.gs 'sector
*START: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*give the image a product title
'draw string 0.1 8.3 `nSupercell Composite Parameter (Mean All Members) | College of DuPage NeXLaB'
*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname sector _con_meanscp_ fhour
filename = basedir'/'modname'/'runtime'/'sector'/'prodname%filext
'run /home/scripts/grads/colorbars/color.gs -levs .25 .5 1 2 4 7 10 15 20 25 30 35 -kind white->(210,210,210)->(50,255,31)->(151,253,23)->(252,245,15)->(251,128,7)->(249,5,0)->(249,0,80)->(249,0,167)->(245,0,249)->(158,0,249)->(180,100,225)->cyan'
'set gxout shade2'
'set e 1 20'
'define scp = (CAPEsfc/1000)*(HLCY3000_0m/100)*(mag(UGRD500mb,VGRD500mb)*2/35)'
'define scp1 = const( const( maskout( scp, scp - 1), 1), 0.0, -u)'
'define maxscp = ave(scp1, e=1, e=20)'
'set e 1'
'd maxscp'
'define u10 = ave(skip(UGRD10m,2,2)*2, e=1, e=20)'
'define v10 = ave(skip(VGRD10m,2,2)*2, e=1, e=20)'
'set gxout barb'
'set rgb 99 0 0 0'
'set ccolor 99'
'set cthick 1'
'set digsize 0.05'
'd u10;v10'
'run /home/scripts/grads/functions/states.gs 'sector
'run /home/scripts/grads/functions/interstates.gs 'sector
'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 1 -fh .1 -fw .1 -lc 0 -edge triangle -fc 0'
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
