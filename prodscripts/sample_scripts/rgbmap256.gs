r = 0
c = 16
y = 0.5
b0 = 80
while (r<256)
  x = 1.5
  g = 0
  b = b0
  while (g<256)
    b = b - 4
    if ( b<0 ); b=0; endif
    'set rgb 'c' 'r' 'g' 'b
    'set line 'c
    'draw recf 'x' 'y' '%(x+0.4)%' '%(y+0.4)
    g = g + 16
    c = c + 1
    x = x + 0.5
  endwhile
  y = y + 0.5
  r = r + 18
  b0 = b0 - 4
endwhile

