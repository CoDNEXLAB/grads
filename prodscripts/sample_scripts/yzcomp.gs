function yzcomp ( args )

*  Parse arguments
*  ---------------
   _expr1 = subwrd(args,1)
   _expr2 = subwrd(args,2)
   _mode  = subwrd(args,3)
   if ( _expr1='' | _expr2='' )
      say '  Usage:   yzcomp  expr1   expr2    [gxout_mode]'
      say 'Example:   yzcomp  tmpu.1  tmpu.2      grfill'
      say '   Note:   GrADS must be in Portrait mode'
      return 1
   endif 

* This must be in portrait mode to work
* -------------------------------------
*  rc = portrait()
*  if ( rc=0 ) 
*      say 'yzcomp: portrait mode required'
*      return 1
*  endif

* Nice white page
* ---------------
  'set display color white'
  'clear'

* Second expr defines the control, plot it first
* ----------------------------------------------
  'set parea 1 7.4 3.92 7.08'
  'set grads off'
  'set xlab off'
   if ( _mode != '' );  'set gxout ' _mode ; endif
  'd ' _expr2
  'cbarn 1 1 7.65 7.25'
  rc = csave()
  'set gxout contour'
  'set ccolor 1'
  'set cstyle 1'
  'set clab off'
  'd ' _expr2
  'set gxout shaded'

* First expression defines the "new system"
* ------------------------------------------
*  'set parea 0 8.5 7.58 10.75'
  'set parea 1 7.4 7.58 10.75'
  'set cint '_contint
  'set rbrange '_contmin' '_contmax
  'set grads off'
  'set xlab on'
   if ( _mode != '' );  'set gxout ' _mode ; endif
  'd '_expr1
  'set gxout contour'
  'set ccolor 1'
  'set cstyle 1'
  'set clab off'
  'set cint '_contint
  'd ' _expr1
  'set gxout shaded'

*  Difference, New - Control
*  -------------------------
  'define diff = ' _expr1 ' - ' _expr2 
  'set parea 1 7.4 .40 3.57'
  'set grads off'
  'set xlab off'
*   rc = setdiff('diff')
   if ( _mode != '' );  'set gxout ' _mode ; endif
  'd diff'
  'cbarn .8 0 4.25 .2'
  'set gxout contour'
  'set ccolor 1'
  'set cstyle 1'
  'set clab off'
  'd diff'
  'set gxout shaded'

return


*
*   	 functions section
*

*.....................................................................
function portrait()
  'q gxinfo'
  tmp = sublin(result,3)
  width = subwrd(tmp,6)
  tmp = sublin(result,4)
  height = subwrd(tmp,6)
  if ( width > height )
       say 'Landscape mode'
       return 0
  else
       say 'Portrait mode'
       return 1
  endif
return

*........................................................................

function csave()

      'query shades'
      shdinfo = result
      if (subwrd(shdinfo,1)='None')
          say 'csave: no shading information'
          return 1
       endif

       rec1 = sublin(result,1)
       rec2 = sublin(result,2)
       rec3 = sublin(result,3)
       _collev = subwrd(rec1,5)
       
       _cont1 = subwrd(rec3,2)
       _cont2 = subwrd(rec3,3)
       _contint = _cont2 - _cont1
       _contmin = subwrd(rec2,3) 
       _contmax = ((_collev - 2.0) * _contint) + _contmin

return

*........................................................................

function setdiff(expr)

* 
* gather cmax, cmin, cint
*

      'set gxout stat'
      'd 'expr
      say result
      rec = sublin(result,9)
      say rec
      _cmin = subwrd(rec,5)
      _cmax = subwrd(rec,6)
      _cint = subwrd(rec,7)
*
* declare list of available color ranges
*
      rc = redblue()
      bluelst = "40 41 42 43 44 45 46 47 48 49 "
      redlst  = "60 61 62 63 64 65 66 67 68 69 "

*
* Un-set the gxout stat to grab additional calculated info
*

      'set gxout shaded'

*
* calculate number of blue colors used
*

      if ( _cmin < 0)
         'define blueval = abs( '_cmin' / '_cint' ) + 1'
         'd blueval'
         rec2 = sublin(result,1)
         bnum = subwrd(rec2,4)
      else
         bnum = 0
      endif

*
* calculate number of red colors used
*

      if ( _cmax > 0)
          'define redval = ('_cmax'/'_cint') + 1'
          'd redval'
          say result
          rec3 = sublin(result,1)
          rnum = subwrd(rec3,4)
       else
          rnum = 0
       endif

*
* build a red string of colors and a blue string of colors
* which will be combined to form the color string
* which is passed as an argument to "set ccols..."
*

*
* build red string
*

       redstr  = substr(redlst,1,rnum*3)

*
* build blue string
*

       bstr = ""
       bcnt = bnum
       while bcnt >0
           bstr= bstr % " "% subwrd(bluelst,bcnt)
           bcnt = bcnt-1
       endwhile
       bluestr = bstr

*
*  combine blue and red strings to form the color string
*

       colstr = bluestr%" "%redstr


*
* now build a string of levels
*
*

       levstr = ""
       levnum = bnum + rnum -1
       levval = _cmin
       
       while levval <=_cmax
          levstr = levstr % " " %levval
          levval = levval + _cint
       endwhile

*
* set contour levels and colors
*

       'set clevs 'levstr
       'set ccols 'colstr

return

*........................................................................

function redblue ()
*light blue to dark blue
'set rgb 40 190 190  255 '
'set rgb 41 150 150  250 '
'set rgb 42 110 110  245'
'set rgb 43 90 90  240'
'set rgb 44 70 70  235'
'set rgb 45 50 50  230'
'set rgb 46 35 35  220'
'set rgb 47 20 20 190'
'set rgb 48 10 10 170'
'set rgb 49 1 1 150'
*grey first, then light pink to dark rose  
'set rgb 60 165 165 165'
'set rgb 61 250 150 150'
'set rgb 62 245 120 120'
'set rgb 63 240 90 90'
'set rgb 64 235 70 70'
'set rgb 65 230 50 50'
'set rgb 66 220  35 35'   
'set rgb 67 190 25 25'   
'set rgb 68 170  10  10'
'set rgb 69 150  1 1'
return

