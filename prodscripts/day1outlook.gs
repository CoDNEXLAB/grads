*Purpose: College of DuPage Models Product Shell
*Author: Gensini, Winter 2015
*************************************************************************
*always run this function to get model arguments and plotting defaults
function main(args)
 sector=subwrd(args,1)
 'run /home/scripts/grads/functions/pltdefaults.gs'
*************************************************************************
*'open /home/data/models/grads_ctl/outlooks/day1.ctl'
'open /home/data/spc/test.ctl'
*get some time parameters
*'run /home/scripts/grads/functions/timelabel.gs 'modinit' 'modname' 'fhour
*set domain based on sector input argument
'run /home/scripts/grads/functions/sectors.gs 'sector
*START: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*give the image a product title
'draw string 0.1 8.3 Current SPC SWODY1 |  College of DuPage NeXLaB'
*'filename = /home/apache/atlas/data/spc_dy1.png'
*pick a colorbar
*'run /home/scripts/grads/colorbars/color.gs -85 55 2.5 -kind magenta-(3)->red-(2)->orange-(2)->green-(2)->cyan-(2)->blue-(0)->white->black-(0)->maroon->tomato'
'set gxout shade2'
'd SRCONOsfc'
'run /home/scripts/grads/functions/counties.gs 'sector
'run /home/scripts/grads/functions/states.gs 'sector
'run /home/scripts/grads/functions/interstates.gs 'sector
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*generate the image
'printim /home/apache/servername/data/spc_dy1.png x800 y600'
