*Purpose: College of DuPage Models Product Shell
*Author: Gensini, Winter 2015
*************************************************************************
*always run this function to get model arguments and plotting defaults
function main(args)
 modinit=subwrd(args,1)
 modname=subwrd(args,2)
 fhour=subwrd(args,3)
 sector=subwrd(args,4)
 'run /home/scripts/grads/functions/pltdefaults.gs'
*GLOBAL VARIABLES
filext = '.png'
txtext = '.txt'
basedir = '/home/apache/climate/data/forecast'
*************************************************************************
*open the GrADS .ctl file made in the prodrunner script
ctlext = '.ctl'
'open /home/data/models/grads_ctl/'modname'/'modinit''modname%ctlext
'set datawarn off'
'set t 'fhour+1
*get some time parameters
'run /home/scripts/grads/functions/timelabel.gs 'modinit' 'modname' 'fhour
*set domain based on sector input argument
'run /home/scripts/grads/functions/sectors.gs 'sector
*START: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

*give the image a product title

'draw string 0.1 8.3 Snowfall Accumulation (10:1 Ratio) | College of DuPage NeXLaB'

*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname sector _prec_snow_ fhour
filename = basedir'/'modname'/'modinit'/'sector'/'prodname%filext
'set gxout shade2'
'run /home/scripts/grads/colorbars/color.gs -1 2 1 -kind white->white'
'd TMP2m*0'
'run /home/scripts/grads/colorbars/color.gs -levs 0 0.1 0.5 1 1.5 2 2.5 3 3.5 4 4.5 5 5.5 6 6.5 7 7.5 8 8.5 9 9.5 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 27 29 31 33 35 37 39 -kind white-(4)->gray-(0)->paleturquoise-(6)->blue-(0)->indigo-(8)->mediumorchid-(0)->orchid->mediumvioletred->darksalmon->papayawhip'
*'define snaccum = sum((APCPsfc*CSNOWsfc),t=1,t='fhour+1')/2.54'
* Accumulate all the snow.
* This is tricky due to how QPF is stored in the grib data...
* FH1 is 0-1, FH2 is 0-2, FH3 is 0-3, FH4 is 3-4, FH5 is 3-5, etc.
* So, for FHs 1, 4, 7..., I already have the current hour and no adjustment is needed.
* But, for the others, I need to subtract the previous "hour's" QPF to attain the current hour's real QPF.
* Once I have the current hour, take only the snow and add it to the run's total accumulations.
count = 1
while count <= fhour
 'set t 'count+1
 'define paccumCurrent = APCPsfc' 
 if count = 2 | count = 3 | count = 5 | count = 6 | count = 8 | count = 9 |  count = 11 |  count = 12 |  count = 14 |  count = 15 |  count = 17 |  count = 18 |  count = 20 |  count = 21 |  count = 23 |  count = 24 |  count = 26 |  count = 27 |  count = 29 |  count = 30 |  count = 32 |  count = 33 |  count = 35 |  count = 36
  'set t 'count
  'define paccumLast = APCPsfc'
  'define paccumCurrent = paccumCurrent - paccumLast'
  'set t 'count+1
 endif 
 if count != 37 & count != 38 & count != 40 & count != 41 & count != 43 & count != 44 & count != 46 & count != 47 & count != 49 & count != 50 & count != 52 & count != 53 & count != 55 & count != 56 & count != 58 & count != 59
  'define snowCurrent = paccumCurrent * CSNOWsfc / 2.54'
  if count = 1
   'define snaccum = snowCurrent'
  else
   'define snaccum = snaccum + snowCurrent'
  endif
 endif
 count = count + 1
endwhile
'd snaccum'
'run /home/scripts/grads/functions/counties.gs 'sector
'run /home/scripts/grads/functions/states.gs 'sector
'run /home/scripts/grads/functions/snow_stations.gs 'sector
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

*plot the colorbar on the image
'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 2 -fh .1 -fw .1 -lc 99 -edge triangle -fc 99'

*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
