 
radius=900
cint=100
'define term1 = maskout(prmslmsl/100,1000-prmslmsl/100)'
'define term2 = maskout(prmslmsl/100,prmslmsl/100-1001)'
*   ******************************DRAW L's******************************
'mfhilo term1 cl l 'radius', 'cint
Low_info=result
i=3        ;*Since the data starts on the 2nd line
minmax=sublin(Low_info,i)
while(subwrd(minmax,1) = 'L' & (subwrd(minmax,5) > 0)) 

  min_lat = subwrd(minmax, 2)
  min_lon = subwrd(minmax, 3)
  min_val = subwrd(minmax, 5)

  'q w2xy 'min_lon' 'min_lat      ;*Translate lat/lon to page coordinates
   x_min = subwrd(result,3)
   y_min = subwrd(result,6)


  'q gxinfo'                      ;*Get area boundaries
  xline=sublin(result,3)
  yline=sublin(result,4)
  xs=subwrd(xline,4)' 'subwrd(xline,6)
  ys=subwrd(yline,4)' 'subwrd(yline,6)

  if(y_min > subwrd(ys,1)+0.1 & y_min < subwrd(ys,2)-0.1 & x_min > subwrd(xs,1)+0.1 & x_min < subwrd(xs,2)-0.5)
    'set strsiz .28'
    'set string 2 c 9'
    'draw string 'x_min' 'y_min' L'
        
    'set strsiz 0.1'
    'set string 2 bl 2'
    'draw string 'x_min+0.1' 'y_min-0.15' 'math_nint(min_val)
  endif

  i=i+1
  minmax = sublin(Low_info,i)
endwhile
*   ******************************DRAW H's******************************

'mfhilo term2 CL h 'radius', 'cint

High_info=result
i=3        ;*Since the data starts on the 2nd line
minmax=sublin(High_info,i)

while(subwrd(minmax,1) = 'H' & (subwrd(minmax,5) > 0))  

  min_lat = subwrd(minmax, 2)
  min_lon = subwrd(minmax, 3)
  min_val = subwrd(minmax, 5)

  'q w2xy 'min_lon' 'min_lat      ;*Translate lat/lon to page coordinates
   x_min = subwrd(result,3)
   y_min = subwrd(result,6)


  'q gxinfo'                      ;*Get area boundaries
  xline=sublin(result,3)
  yline=sublin(result,4)
  xs=subwrd(xline,4)' 'subwrd(xline,6)
  ys=subwrd(yline,4)' 'subwrd(yline,6)

  if(y_min > subwrd(ys,1)+0.1 & y_min < subwrd(ys,2)-0.1 & x_min > subwrd(xs,1)+0.1 & x_min < subwrd(xs,2)-0.5)
    'set strsiz .28'
    'set string 4 c 9'
    'draw string 'x_min' 'y_min' H'
        
    'set strsiz 0.1'
    'set string 4 bl 2'
    'draw string 'x_min+0.1' 'y_min-0.15' 'math_nint(min_val)
  endif

  i=i+1
  minmax = sublin(High_info,i)
endwhile
