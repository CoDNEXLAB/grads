function plotXYgust(args)
 lon=subwrd(args,1)
 lat=subwrd(args,2)
'define temp = GUSTsfc*1.94384'
'q w2gr 'lon' 'lat
i=subwrd(result,3)
j=subwrd(result,6)
'q defval temp 'i' 'j
v2=subwrd(result,3)
'q w2xy 'lon' 'lat
xval=subwrd(result,3)
yval=subwrd(result,6)
'set string 99 c 2 0'
'set strsiz .09'
'draw string 'xval' 'yval' 'math_nint(v2)
