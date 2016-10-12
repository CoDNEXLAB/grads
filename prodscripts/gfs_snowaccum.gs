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
if modname = GFS
 'set t 'fhour/3+1
else
 'set t 'fhour+1
endif
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
if fhour = 003
 'define paccum = CSNOWsfc*APCPsfc/2.54'
endif
if fhour = 006 | fhour = 012 | fhour = 018 | fhour = 024 | fhour = 033 | fhour = 036 | fhour = 042 | fhour = 048 | fhour = 054 | fhour = 060 | fhour = 066 | fhour = 072 | fhour = 078 | fhour = 084 | fhour = 090 | fhour = 096 | fhour = 102 | fhour = 108 | fhour = 114 | fhour = 120 | fhour = 126 | fhour = 132 | fhour = 138 | fhour = 144 | fhour = 150 | fhour = 156 | fhour = 162 | fhour = 168 | fhour = 174 | fhour = 180 | fhour = 186 | fhour = 192 | fhour = 198 | fhour = 204 | fhour = 210 | fhour = 216 | fhour = 222 | fhour = 228 | fhour = 234 | fhour = 240
 'define paccum = sum((CSNOWsfc*APCPsfc/2.54),t=1,t='fhour/3+1',2)'
endif
if fhour = 009 | fhour = 015 | fhour = 021 | fhour = 027 | fhour = 033 | fhour = 039 | fhour = 045 | fhour = 051 | fhour = 057 | fhour = 063 | fhour = 069 | fhour = 075 | fhour = 081 | fhour = 087 | fhour = 093 | fhour = 099 | fhour = 105 | fhour = 111 | fhour = 117 | fhour = 123 | fhour = 129 | fhour = 135 | fhour = 141 | fhour = 147 | fhour = 153 | fhour = 159 | fhour = 165 | fhour = 171 | fhour = 177 | fhour = 183 | fhour = 189 | fhour = 195 | fhour = 201 | fhour = 207 | fhour = 213 | fhour = 219 | fhour = 225 | fhour = 231 | fhour = 237 
 'define paccum1 = sum((CSNOWsfc*APCPsfc/2.54),t=1,t='fhour/3',2)'
 'define paccum2 = CSNOWsfc*APCPsfc/2.54'
 'define paccum = paccum1+paccum2'
endif
if fhour = 252 | fhour = 264 | fhour = 276 | fhour = 288 | fhour = 300 | fhour = 312 | fhour = 324 | fhour = 336 | fhour = 348  | fhour = 360 | fhour = 372 | fhour = 384
 'define paccum1 = sum((CSNOWsfc*APCPsfc/2.54),t=1,t='81',2)'
 'define paccum2 = sum((CSNOWsfc*APCPsfc/2.54),t='82',t='fhour/3+1',1)'
 'define paccum = paccum1+paccum2'
endif
'd paccum'
'run /home/scripts/grads/functions/counties.gs 'sector
'run /home/scripts/grads/functions/states.gs 'sector
'run /home/scripts/grads/functions/precip_stations.gs 'sector
*start_readout
if modname = GFS
 'set gxout print'
 'run /home/scripts/grads/functions/readout.gs 'modname' 'sector
 'd paccum'
 dummy=write(basedir'/'modname'/'modinit'/'sector'/readout/'prodname%txtext,result)
endif
*end_readout
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*plot the colorbar on the image
'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 3 -fh .1 -fw .1 -lc 99 -edge triangle -fc 99'
*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
