function zoom(var)
'query defval numzoom 1 1'
warning = subwrd(result,1)
if(warning="Warning:")
say  'zoomprep called'
'zoomprep'
'query defval numzoom 1 1'
nzm = subwrd(result,3)
else
nzm = subwrd(result,3)
endif
nzm=nzm+1
'define numzoom='nzm
'set rband 21 box .25 .25 10.75 7.75'
'q pos '
x1 = subwrd(result,3)
y1 = subwrd(result,4)
x2 = subwrd(result,8)
y2 = subwrd(result,9)
'query xy2w 'x1' 'y1
lat1 = subwrd(result,6)
lon1 = subwrd(result,3)
'query xy2w 'x2' 'y2
lat2 = subwrd(result,6)
lon2 = subwrd(result,3)
if(lon2<lon1);lon2=lon2+360;lon1=lon1+360;endif;
'set lon 'lon1' 'lon2
'set lat 'lat2' 'lat1
'define 'lonlo%nzm'='lon1
'define 'lonhi%nzm'='lon2
'define 'latlo%nzm'='lat2
'define 'lathi%nzm'='lat1
'clear'
if ( var!='' )
 'display ' var
endif
return
