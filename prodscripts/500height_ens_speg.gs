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
'draw string 0.1 8.3 `n500mb Height (gpm) Spaghetti Plot | College of DuPage NEXLAB'
*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname sector _500_hghtens_ fhour
filename = basedir'/'modname'/'runtime'/'sector'/'prodname%filext
'set e 1'
'set gxout shade2'
'run /home/scripts/grads/colorbars/color.gs -1 2 1 -kind white->white'
'd TMP2m*0'
'set gxout contour'
'set clab off'
e = 1
while (e<=20)
 'set e 'e
 'set cthick 4'
 'set ccolor 4'
 'set clevs 5520'
 'd HGT500mb'
 'set ccolor 3'
 'set clevs 5760'
 'd HGT500mb'
 'set ccolor 2'
 'set clevs 5880'
 'd HGT500mb'
 e=e+1
endwhile
'set clab on'
'set clopts -1 -1 0.15'
'set e 21'
'set ccolor 99'
'set cstyle 7'
'set cthick 12'
'set clevs 5520'
'd HGT500mb'
'set clevs 5760'
'set ccolor 99'
'set cstyle 7'
'set cthick 12'
'd HGT500mb'
'set clevs 5880'
'set ccolor 99'
'set cstyle 7'
'set cthick 12'
'd HGT500mb'

'run /home/scripts/grads/functions/states.gs 'sector
'run /home/scripts/grads/functions/interstates.gs 'sector
'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 5 -fh .1 -fw .1 -lc 0 -edge triangle -fc 0'
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
