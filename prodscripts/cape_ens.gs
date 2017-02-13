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
'draw string 0.1 8.3 `nProb. SBCAPE>1000 J kg`a-1`n | Avg. 500mb Wind (kts.) | College of DuPage NeXLaB'
*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname sector _con_cape1000_ fhour
filename = basedir'/'modname'/'runtime'/'sector'/'prodname%filext
*'run /home/scripts/grads/colorbars/color.gs -levs 50 75 100 250 500 750 1000 1250 1500 1750 2000 2500 3000 4000 5000 6000 7000 8000 -kind white->indigo->magenta->mediumblue->green->yellow->orange->maroon->red->dimgray->powderblue'
*'run /home/scripts/grads/colorbars/color.gs 0 100 2 -kind white-(0)->indigo->magenta->mediumblue->aqua->springgreen->olive->yellow->orange->maroon->red->dimgray->powderblue'
*'run /home/scripts/grads/colorbars/color.gs 0 100 5 -kind white-(0)->(0,5,65)->(9,1,75)->(25,2,84)->(44,3,94)->(66,5,104)->(91,6,114)->(120,8,124)->(135,10,119)->(145,12,105)->(155,14,89)->(165,16,70)->(175,19,49)->(185,22,25)->(195,50,25)->(205,84,28)->(215,120,31)->(225,159,34)->(235,201,38)->(245,244,42)->(219,255,46)'
*'run /home/scripts/grads/colorbars/color.gs 0 100 5 -kind white-(0)->(66,5,104)->(91,6,114)->(120,8,124)->(135,10,119)->(145,12,105)->(155,14,89)->(165,16,70)->(175,19,49)->(185,22,25)->(195,50,25)->(205,84,28)->(215,120,31)->(225,159,34)->(235,201,38)->(245,244,42)->(219,255,46)'
'run /home/scripts/grads/colorbars/color.gs 0 100 2 -kind white-(0)->gainsboro->mediumpurple->aqua->royalblue->green->yellow->orange->maroon->silver'
'set gxout shade2'
'set e 1 20'
'define cape1000 = const( const( maskout( CAPEsfc, CAPEsfc - 1000), 1), 0.0, -u)'
'define prob1000 = 100*ave(cape1000, e=1, e=20)'
'set e 1'
'd prob1000'
'set gxout contour'
'set ccolor 99'
'set cthick 4'
'set cint 60'
'define avg500 = ave(HGT500mb, e=1, e=20)'
'd avg500'
'define u500 = ave(skip(UGRD500mb,2,2)*2, e=1, e=20)'
'define v500 = ave(skip(VGRD500mb,2,2)*2, e=1, e=20)'
'set gxout barb'
'set rgb 99 0 0 0'
'set ccolor 99'
'set cthick 1'
'set digsize 0.05'
'd u500;v500'
'run /home/scripts/grads/functions/states.gs 'sector
'run /home/scripts/grads/functions/interstates.gs 'sector
'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 5 -fh .1 -fw .1 -lc 0 -edge triangle -fc 99'
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
