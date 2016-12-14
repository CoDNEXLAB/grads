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
basedir = '/home/apache/servername/data/forecast'
*************************************************************************
*open the GrADS .ctl file made in the prodrunner script
ctlext = '.ctl'
'open /home/scripts/grads/grads_ctl/'modname'/'modinit''modname%ctlext
'set t 'fhour/3+1
*get some time parameters
'run /home/scripts/grads/functions/timelabel.gs 'modinit' 'modname' 'fhour
*set domain based on sector input argument
'run /home/scripts/grads/functions/sectors.gs 'sector
*START: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*give the image a product title
'draw string 0.1 8.3 Snowfall Accumulation (AF/Kuchera Method) | College of DuPage NeXLaB'
*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname sector _prec_kuchsnow_ fhour
filename = basedir'/'modname'/'modinit'/'sector'/'prodname%filext
'set gxout shade2'
'run /home/scripts/grads/colorbars/color.gs 1 555 100 -kind white->white'
'd TMP2m'
'run /home/scripts/grads/colorbars/color.gs -levs 0.1 0.5 1 1.5 2 2.5 3 3.5 4 4.5 5 5.5 6 6.5 7 7.5 8 8.5 9 9.5 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 27 29 31 33 35 37 39 -kind white-(4)->gray-(0)->paleturquoise-(6)->blue-(0)->indigo-(8)->mediumorchid-(0)->orchid->mediumvioletred->darksalmon->papayawhip'
count = 1
fmt = '%-6.2f'
while count <= fhour/3
 'set t 'count+1
 if count = 1 | count = 3 | count = 5 | count = 7 | count = 9 | count = 11 | count = 13 | count = 15 | count = 17 | count = 19 | count = 21 | count = 23 | count = 25 | count = 27 | count = 29 | count = 31 | count = 33 | count = 35 | count = 37 | count = 39 | count = 41 | count = 43 | count = 45 | count = 47 | count = 49 | count = 51 | count = 53 | count = 55 | count = 57 | count = 59 | count = 61 | count = 63 | count = 65 | count = 67 | count = 69 | count = 71 | count = 73 | count = 75 | count = 77 | count = 79
  'define maxT = max(TMPprs,lev=925,lev=500)'
  'run /home/scripts/grads/functions/max.gs maxT TMP2m finmaxT'
  if maxT > 271.16
   'define ratio = 12 + 2*(271.16-finmaxT)'
  else
   'define ratio = 12 + (271.16-finmaxT)'
  endif
  'define prec03 = APCPsfc'
  if count = 1
   'define snaccum = (prec03*CSNOWsfc*ratio)/25.4+0'
  else
   'define snaccum = snaccum + (prec03*CSNOWsfc*ratio/25.4)'
  endif
 endif
 if count = 2 | count = 4 | count = 6 | count = 8 | count = 10 | count = 12 | count = 14 | count = 16 | count = 18 | count = 20 | count = 22 | count = 24 | count = 26 | count = 28 | count = 30 | count = 32 | count = 34 | count = 36 | count = 38 | count = 40 | count = 42 | count = 44 | count = 46 | count = 48 | count = 50 | count = 52 | count = 54 | count = 56 | count = 58 | count = 60 | count = 62 | count = 64 | count = 66 | count = 68 | count = 70 | count = 72 | count = 74 | count = 76 | count = 78 | count = 80
  'define maxT = max(TMPprs,lev=925,lev=500)'
  'run /home/scripts/grads/functions/max.gs maxT TMP2m finmaxT'
  if maxT > 271.16
   'define ratio = 12 + 2*(271.16-finmaxT)'
  else
   'define ratio = 12 + (271.16-finmaxT)'
  endif
  'define pcurrent = APCPsfc - prec03'
  'define snaccum = snaccum + (pcurrent * CSNOWsfc*ratio/ 25.4)'
 endif
 if count = 84 | count = 88 | count = 92 | count = 96 | count = 100 | count = 104 | count = 108 | count = 112 | count = 116 | count = 120 | count = 124 | count = 128
  'define maxT = max(TMPprs,lev=925,lev=500)'
  'run /home/scripts/grads/functions/max.gs maxT TMP2m finmaxT'
  if maxT > 271.16
   'define ratio = 12 + 2*(271.16-finmaxT)'
  else
   'define ratio = 12 + (271.16-finmaxT)'
  endif
  'define snaccum = snaccum + (APCPsfc * CSNOWsfc * ratio / 25.4)'
 endif
 count = count + 1
endwhile
'd snaccum'
'run /home/scripts/grads/functions/counties.gs 'sector
'run /home/scripts/grads/functions/states.gs 'sector
'run /home/scripts/grads/functions/snow_stations.gs 'sector
*start_readout
if modname = GFS
 'set gxout print'
 'run /home/scripts/grads/functions/readout1.gs 'modname' 'sector
 'd snaccum'
 dummy=write(basedir'/'modname'/'modinit'/'sector'/readout/'prodname%txtext,result)
endif
*end_readout
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*plot the colorbar on the image
'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 3 -fh .1 -fw .1 -lc 99 -edge triangle -fc 99'
*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
