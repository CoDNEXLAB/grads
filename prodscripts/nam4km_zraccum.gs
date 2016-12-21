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
'run /home/scripts/grads/functions/sectors.gs 'sector
*START: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*give the image a product title
'draw string 0.1 8.3 Freezing Rain Accumulation | College of DuPage NeXLaB'
*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname sector _prec_frzra_ fhour
filename = basedir'/'modname'/'runtime'/'sector'/'prodname%filext
'set gxout shade2'
'run /home/scripts/grads/colorbars/color.gs -1 2 1 -kind white->white'
'd TMP2m*0'
*pick a colorbar
'run /home/scripts/grads/colorbars/color.gs -levs 0 .01 .05 .1 .25 .5 .75 1 1.25 1.5 1.75 2 -kind white->gray->orchid->mediumvioletred->orange->yellow'
count = 1
while count <= fhour
 'set t 'count+1
 if count = 1 | count = 4 | count = 7 | count = 10 | count = 13 | count = 16 | count = 19 | count = 22 | count = 25 | count = 28 | count = 31 | count = 34 | count = 39 | count = 42 | count = 45 | count = 48 | count = 51 | count = 54 | count = 57 | count = 60
  'define prec01 = APCPsfc'
  if count = 1
   'define fzraccum = prec01 * CFRZRsfc / 25.4'
  else
   'define fzraccum = fzraccum + (prec01 * CFRZRsfc / 25.4)'
  endif
 endif
 if count = 2 | count = 5 | count = 8 | count = 11 | count = 14 | count = 17 | count = 20 | count = 23 | count = 26 | count = 29 | count = 32 | count = 35
  'define prec02 = APCPsfc'
  'define pcurrent = prec02 - prec01'
  'define fzraccum = fzraccum + (pcurrent * CFRZRsfc / 25.4)'
 endif
 if count = 3 | count = 6 | count = 9 | count = 12 | count = 15 | count = 18 | count = 21 | count = 24 | count = 27 | count = 30 | count = 33 | count = 36
  'define prec03 = APCPsfc'
  'define pcurrent = prec03 - prec02'
  'define fzraccum = fzraccum + (pcurrent * CFRZRsfc / 25.4)'
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
 dummy=write(basedir'/'modname'/'runtime'/'sector'/readout/'prodname%txtext,result)
endif
*end_readout
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*plot the colorbar on the image
'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 1 -fh .1 -fw .1 -lc 99 -fc 99'
*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
