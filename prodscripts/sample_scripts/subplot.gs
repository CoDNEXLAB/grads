*
* Subplot(m,n,frame) - Like Matlab function subplot().
*

function subplot(args)

   m     = subwrd(args,1)
   n     = subwrd(args,2)
   frame = subwrd(args,3)

*  find coordinates for this frame
*  -------------------------------
   ii = 0
    k = 0
   while ( ii < m )
      ii = ii + 1
      jj = 0
      while ( jj < n )
          jj = jj + 1
          k = k + 1
          if ( k = frame )
               i = ii
               j = jj
               break
          endif 
      endwhile
   endwhile

* Determine page size
* -------------------
  'q gxinfo'
  line = sublin(result,2)
  xsize = subwrd(line,4)
  ysize = subwrd(line,6)
 
  say xsize ' ' ysize

* Determine xy in page coordinates
* --------------------------------
  dx = xsize / n
  dy = ysize / m

  xoff = 0.125 * dx
  yoff = 0.125 * dy

  dy = dy - yoff/4

  xa = (j-1) * dx + xoff
  xb = xa + dx - 2 * xoff
  ya = (m-i) * dy + yoff
  yb = ya + dy - 2 * yoff

  say 'set parea ' xa ' ' xb ' ' ya ' ' yb
  'set parea ' xa ' ' xb ' ' ya ' ' yb

return
