function plotXYtemp(args)
 lon=subwrd(args,1)
 lat=subwrd(args,2)
'define temp = (TMP2m-273.16)*9/5+32'
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
