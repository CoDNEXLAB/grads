function plotXYcloud(args)
 lon=subwrd(args,1)
 lat=subwrd(args,2)
'q w2gr 'lon' 'lat
i=subwrd(result,3)
j=subwrd(result,6)
'q defval cldcov 'i' 'j
v2=subwrd(result,3)
'q w2xy 'lon' 'lat
xval=subwrd(result,3)
yval=subwrd(result,6)
fmt = '%-6.1f'
clr = 'CLR'
few = 'FEW'
sct = 'SCT'
bkn = 'BKN'
ovc = 'OVC'
'set string 2 c 2 0'
'set strsiz .09'
if v2 = 100
 'draw string 'xval' 'yval' 'ovc
endif
if v2 < 100 & v2 >= 62
 'draw string 'xval' 'yval' 'bkn
endif
if v2 < 62 & v2 >= 38
 'draw string 'xval' 'yval' 'sct
endif
if v2 < 38 & v2 > 0
 'draw string 'xval' 'yval' 'few
endif
if v2 = 0
 'draw string 'xval' 'yval' 'clr
endif
