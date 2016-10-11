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
if modname = NAMAK
 modname = NAM
endif
'set datawarn off'
'set t 'fhour+1
*get some time parameters
'run /home/scripts/grads/functions/timelabel.gs 'modinit' 'modname' 'fhour
*set domain based on sector input argument
'run /home/scripts/grads/functions/sectors.gs 'sector
*START: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*give the image a product title
'draw string 0.1 8.3 Freezing Rain Accumulation | College of DuPage NeXLaB'
*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname sector _prec_frzra_ fhour
filename = basedir'/'modname'/'modinit'/'sector'/'prodname%filext
'set gxout shade2'
'run /home/scripts/grads/colorbars/color.gs -1 2 1 -kind white->white'
'd TMP2m*0'
*pick a colorbar
'run /home/scripts/grads/colorbars/color.gs -levs 0 .01 .05 .1 .25 .5 .75 1 1.25 1.5 1.75 2 2.25 2.5 2.75 3 -kind white->gray->indigo->mediumorchid-(0)->orchid->mediumvioletred->darksalmon->papayawhip'
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
  'define snowCurrent = paccumCurrent * CFRZRsfc / 25.4'
  if count = 1
   'define fzraccum = snowCurrent'
  else
   'define fzraccum = fzraccum + snowCurrent'
  endif
 endif
 count = count + 1
endwhile
'd fzraccum'
'run /home/scripts/grads/functions/counties.gs 'sector
'run /home/scripts/grads/functions/states.gs 'sector
'run /home/scripts/grads/functions/frzra_stations.gs 'sector
*start_readout
if modname = NAM4KM
 'set gxout print'
 'run /home/scripts/grads/functions/readout2.gs 'modname' 'sector
 'd fzraccum'
 dummy=write(basedir'/'modname'/'modinit'/'sector'/readout/'prodname%txtext,result)
endif
*end_readout
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*plot the colorbar on the image
'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 1 -fh .1 -fw .1 -lc 99 -edge triangle -fc 99'
*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
