function power(args)

   expr = subwrd(args,1)
   ymax = subwrd(args,2)
   dy   = subwrd(args,3)

   if ( expr='' )
      say 'usage:  power  expr  [ymax  [dy]]'
      return
   endif

*  Need a global domain
*  --------------------
   xyrange()
   'set x 1 ' _xmax
   'set y 1 ' _ymax

*  Calculate power spectra
*  -----------------------
   'p = sh_power('expr')'

*  Redefine x labels
*  -----------------
   if ( ymax = '' )
      ymax = _ymax
   endif
   if ( dy = '' )
        if ( ymax < 100 )
                 dy = 10
        else
            if ( ymax < 200 )
                 dy = 20
        else
            if ( ymax < 300 )
                 dy = 25
        else
            if ( ymax < 600 )
                 dy = 50
        else
                 dy = 100

        endif
        endif
        endif
        endif

        n = math_int(ymax / dy)
        ymax = n * dy

   endif

   xlab = '0 '
   y = 0 + dy
   while ( y <= ymax )
     xlab = xlab ' | ' y
     y = y + dy
   endwhile 

   'set xlabs ' xlab

*  Plotting
*  --------
   'set y 1 ' ymax
   'set cmark 0'
   'd log(p)'
   'set y 1 ' _ymax
   'set cmark 2'

return

function xyrange()

      'q file'
      tmp = sublin ( result, 5 )
      _xmin = 1
      _xmax = subwrd(tmp,3)
      _ymin = 1
      _ymax = subwrd(tmp,6)

return
