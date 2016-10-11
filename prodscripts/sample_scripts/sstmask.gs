* sstmask.gs
*
* This script demonstrates the analysis capabilities of the GDS.
* The data set used are Reynolds SST and NCEP/NCAR Reanalysis Data. 
* The SST anomaly time series is the areal average between 180 and 90w
* and 10N and 10S. The "ENSO" mask is defined for SST anomalies greater
* than 1 degree. Using this mask, we calculate a mean 500mb height
* anomaly associated with the warm SST anomalies. The displayed product
* is therefore the mean 500mb height anomalies associated with warm
* tropical SST anomalies.

* These are the expressions and commands to get the data from the GDS
'reinit'
baseURL = 'http://monsoondata.org:9090/dods/_expr_'
datasets = 'ssta,z5a'
nino = 'aave(ssta.1,lon=-180,lon=-90,lat=-10,lat=10)'
mask = 'const(maskout('nino','nino'-1.0),1)'
expr = 'tmave('mask',z5a.2(lev=500),t=1,t=600)'
xlim = '0:360'
ylim = '0:90'
zlim = '500:500'
tlim = 'jan1950:jan1950'
say ' '
say 'sdfopen 'baseURL'{'datasets'}{'expr'}{'xlim','ylim','zlim','tlim'}'
'sdfopen 'baseURL'{'datasets'}{'expr'}{'xlim','ylim','zlim','tlim'}'
say ' ' 
'define var = result.1'




* These are the commands to draw the final plot
'set rgb 90 150 150 150'
'set rgb 16   0   0 255'
'set rgb 17  55  55 255'
'set rgb 18 110 110 255'
'set rgb 19 165 165 255'
'set rgb 20 220 220 255'
'set rgb 21 255 220 220'
'set rgb 22 255 165 165'
'set rgb 23 255 110 110'
'set rgb 24 255  55  55'
'set rgb 25 255   0   0'


'set xsize 800 500'
'set lat 0 90'
'set display color white'
'clear'
'set grads off'
'set mproj scaled'
'set parea 0.5 10.5 1.5 7.5'
'set lat 0 90'
'set lon 0 360'
'set gxout shaded'
'set clevs  -30 -20 -15 -10 -5 5 10 15 20 30'
'set ccols 16 17 18 19 20 0 21 22 23 24 25'
'draw title 500mb Height Anomaly for Warm Tropical SST'
'd var'
'cbarn'
'set ccolor 90'
'set gxout contour'
'set clab off'
'set clevs  -30 -20 -15 -10 -5 '
'd var'
'set ccolor 90'
'set clevs  5 10 15 20 30'
'draw title 500mb Height Anomaly for Warm Tropical SST'
'd var'
