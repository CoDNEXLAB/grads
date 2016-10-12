*Purpose: College of DuPage Models Product Shell
*Author: Gensini, Winter 2015
*************************************************************************
*always run this function to get model arguments and plotting defaults
function main(args)
 modinit=subwrd(args,1)
 modname=subwrd(args,2)
 lon=subwrd(args,3)
 lat=subwrd(args,4)
 'run /home/scripts/grads/functions/meteodefaults.gs'
*GLOBAL VARIABLES
filext = '.png'
basedir = '/home/apache/servername/data/forecast/GEFS/meteograms'
*************************************************************************
*open the GrADS .ctl file made in the prodrunner script
ctlext = '.ctl'
'open /home/scripts/grads/grads_ctl/'modname'/'modinit''modname%ctlext
*say 'open /home/data/models/grads_ctl/GEFS/'modinit''modname%ctlext
'set t .5 65.5'
*get some time parameters
*'run /home/scripts/grads/functions/timelabel.gs 'modinit' 'modname' 'fhour
*set domain based on sector input argument
*'run /home/scripts/grads/functions/sectors.gs 'sector
'set lon 'lon
'set lat 'lat
*START: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*give the image a product title
'set string 99 l 1 0'
'draw string 0.1 8.3 `42m Temp (`3.`4F) | GFS Ensemble Forecast for Glen Ellyn, IL | College of DuPage NeXLaB'

*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname meteo lon lat
*filename = basedir'/'modname'/'modinit'/'prodname%filext
filename = basedir'/'prodname%filext
'set e 1'
'define ensmean=ave(TMP2m,e=1,e=20)'
diffsq = 'pow(TMP2m-ensmean,2)'
variance = 'ave('diffsq',e=1,e=20)'
'define stddev=sqrt('variance')'
'define ensmin=tloop(min(TMP2m,e=1,e=20))'
'define ensmax=tloop(max(TMP2m,e=1,e=20))'
'set vrange -15 80'
'set ylint 5'
'set tlsupp year'
'set grads off'
'set gxout errbar'
'set ccolor 4'
'd (ensmin-273.16)*9/5+32;(ensmax-273.16)*9/5+32'
plus  = '(ensmean+stddev-273.16)*9/5+32'
minus = '(ensmean-stddev-273.16)*9/5+32'
'set gxout bar'
'set bargap 50'
'set baropts outline'
'set ccolor 3'
'd 'minus';'plus
'set gxout line'
'set cmark 0'
'set cthick 6'
'set digsiz 0.05'
'set ccolor 2'
'd (ensmean-273.16)*9/5+32'
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

*generate the image
'run /home/scripts/grads/functions/make_meteo.gs 'filename
