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
'set grads off'
filext = '.png'
txtext = '.txt'
basedir = '/home/apache/servername/data/forecast'
*************************************************************************
*open the GrADS .ctl file made in the prodrunner script
ctlext = '.ctl'
'open /home/scripts/grads/grads_ctl/'modname'/'modinit''modname%ctlext
'set datawarn off'
'set t 'fhour+1
*get some time parameters
'run /home/scripts/grads/functions/timelabel.gs 'modinit' 'modname' 'fhour
*set domain based on sector input argument
'run /home/scripts/grads/functions/sectors.gs 'sector' 'modname
*START: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*give the image a product title
'draw string 0.1 8.3 Precipitation Accumulation (in.) | College of DuPage NEXLAB'
*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname sector _prec_precacc_ fhour
filename = basedir'/'modname'/'runtime'/'sector'/'prodname%filext
'set gxout shade2'
'run /home/scripts/grads/colorbars/color.gs -1 2 1 -kind white->white'
'd TMP2m*0'
*pick a colorbar
'run /home/scripts/grads/colorbars/color.gs -levs 0 .01 .025 .05 .075 .1 .25 .5 .75 1 1.25 1.5 1.75 2 2.25 2.5 2.75 3 3.25 3.5 3.75 4 4.5 5 5.5 6 6.5 7 7.5 8 9 10 11 12 -kind white->gray->green->yellow->orange->red->maroon->magenta->cyan->gray->lightgray'
if fhour = 001 | fhour = 002 | fhour = 003
 'define paccum = APCPsfc/25.4'
endif
if fhour = 004 | fhour = 007 | fhour = 010 | fhour = 013 | fhour = 016 | fhour = 019 | fhour = 022 | fhour = 025 | fhour = 028 | fhour = 031 | fhour = 034
 'define paccum1 = sum((APCPsfc/25.4),t=1,t='fhour',3)'
 'define paccum2 = APCPsfc/25.4'
 'define paccum = paccum1+paccum2'
endif
if fhour = 005 | fhour = 008 | fhour = 011 | fhour = 014 | fhour = 017 | fhour = 020 | fhour = 023 | fhour = 026 | fhour = 029 | fhour = 032 | fhour = 035
 'define paccum1 = sum((APCPsfc/25.4),t=1,t='fhour-1',3)'
 'define paccum2 = APCPsfc/25.4'
 'define paccum = paccum1+paccum2'
endif
if fhour = 006 | fhour = 009 | fhour = 012 | fhour = 015 | fhour = 018 | fhour = 021 | fhour = 024 | fhour = 027 | fhour = 030 | fhour = 033 | fhour = 036 | fhour = 039 | fhour = 042 | fhour = 045 | fhour = 048 | fhour = 051 | fhour = 054 | fhour = 057 | fhour = 060
 'define paccum = sum((APCPsfc/25.4),t=1,t='fhour+1',3)'
endif
'd paccum'
'run /home/scripts/grads/functions/counties.gs 'sector
'run /home/scripts/grads/functions/states.gs 'sector
'run /home/scripts/grads/functions/precip_stations.gs 'sector' 'modname
*start_readout
if modname = NAM4KM
 'set gxout print'
 'run /home/scripts/grads/functions/readout2.gs 'modname' 'sector
 'd paccum'
 dummy=write(basedir'/'modname'/'runtime'/'sector'/readout/'prodname%txtext,result)
endif
*end_readout
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*plot the colorbar on the image
'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 3 -fh .1 -fw .1 -lc 99 -fc 99'
*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
