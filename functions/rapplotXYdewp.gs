function plotXYdewp(args)
 lon=subwrd(args,1)
 lat=subwrd(args,2)
't = TMP2m'
'tc=(t-273.16)'
'rh = RH2m'
'td=tc-( (14.55+0.114*tc)*(1-0.01*rh) + pow((2.5+0.007*tc)*(1-0.01*rh),3) + (15.9+0.117*tc)*pow((1-0.01*rh),14) )'
'define dewp = td*9/5+32'
'q w2gr 'lon' 'lat
i=subwrd(result,3)
j=subwrd(result,6)
'q defval dewp 'i' 'j
v2=subwrd(result,3)
'q w2xy 'lon' 'lat
xval=subwrd(result,3)
yval=subwrd(result,6)
'set string 99 c 2 0'
'set strsiz .09'
'draw string 'xval' 'yval' 'math_nint(v2)
