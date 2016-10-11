function plotXYprecip(args)
 lon=subwrd(args,1)
 lat=subwrd(args,2)
'q w2gr 'lon' 'lat
i=subwrd(result,3)
j=subwrd(result,6)
'q defval paccum 'i' 'j
v2=subwrd(result,3)
'q w2xy 'lon' 'lat
xval=subwrd(result,3)
yval=subwrd(result,6)
'set string 99 c 2 0'
'set strsiz .09'
fmt = '%-6.2f'
if v2 >= 0.01
 'draw string 'xval' 'yval' 'math_format(fmt,v2)
endif
trace = 'T'
if v2 > 0 & v2 < 0.01
 'draw string 'xval' 'yval' 'trace 
endif
