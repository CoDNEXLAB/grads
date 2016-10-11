function dist ( args )

*  Parse arguments
*  ---------------
   _expr = subwrd(args,1)
   if ( _expr='' )
      say ''
      say 'NAME'
      say '    hist - displays histogram of a 2D field'
      say ''
      say 'SYNOPSIS'
      say '    hist expr [%] [-clevs ...]|[cmin cmax cint]' 
      say ''
      say 'DESCRIPTION'
      say '    Fiven a 2D field and optionally a set of contour levels'
      say '    or contour ranges, it plots a histogram with the distribution'
      say '    of the values in the field. If % is specified, percent'
      say '    values are showed instead of numbers.'
      say ''
      say '    This is tricky: if you include the minimum of the field as'
      say '    a contour level, all gridpoints with value=minimum will be'
      say '    excluded. This is useful to study fields such as emissions'
      say '    or precipitation for which the zero value needs to be'
      say '    treated separately.'
      say ''
      say 'EXAMPLES'
      say '    hist uwnd'
      say '    hist tmpu 240 270 5'
      say '    hist aod  -clevs 0 .1 .2. .4 .8 1.6'
      say '    hist emis % -clevs 0.05 0.1 0.2 0.4 0.8 1.6 3.2 6.4 12.8'
      say ''
      say 'AUTHOR'
      say '    Arlindo.daSilva@nasa.gov'
      say ''
      return 1
   endif 

   i = 2
   next = subwrd(args,2)
   if ( next = '%' )
        doing_perc=1
        i = i + 1
   else
        doing_perc=0
   endif

   _cmin = subwrd(args,i)
   _cmax = subwrd(args,i+1)
   _cint = subwrd(args,i+2)

*  Mkae suer there is no funny wrapping
*  ------------------------------------
   rc = savedim()
   rc = xyrange()
   'set x ' _xmin ' ' _xmax
   'set y ' _ymin ' ' _ymax

*  Get number of undefs on expression
*  ----------------------------------
   'set gxout stat'
   'display '_expr

   rec = sublin(result,7)
   nu.x = subwrd(rec,4)
   nu.0   = subwrd(rec,8)

   rec = sublin(result,8)
   vmin = subwrd(rec,4)
   vmax = subwrd(rec,5)
   _clev.0 = vmin

   say 'vmin, vmax, nu.x, nu.0 = ' vmin ', ' vmax ', ' nu.x ', ' nu.0

   eps = 1e-20
   eps =0

*  General countour levels
*  -----------------------
   if ( _cmin ='-clevs' )

      i = i + 1
      k = 1
      _clev = subwrd(args,i)
      while ( _clev != '' )
         'display maskout('_expr','_clev'-'_expr'-'eps')'
         rec = sublin(result,7)
         nu = subwrd(rec,4)
         nu.k = nu - nu.x
         _clev.k = _clev
*         say 'Number of points > ' _clev ': ' nu.k
         k = k + 1
         i = i + 1
         _clev = subwrd(args,i)
      endwhile

*  Constant contour intervals
*  --------------------------
   else

*     Get ranges for counting values
*     ------------------------------
      rec = sublin(result,9)
      if ( _cmin='' ) 
        _cmin = subwrd(rec,5)
      endif
      if ( _cmax ='' )
        _cmax = subwrd(rec,6)
      endif
      if ( _cint='' )
        _cint = subwrd(rec,7)
      endif
      
      _clev = _cmin
      k = 1
      while ( _clev <= _cmax )
         'display maskout('_expr','_clev'-'_expr'-'eps')'
         rec = sublin(result,7)
         nu = subwrd(rec,4)
         nu.k = nu - nu.x 
         _clev.k = _clev
         say 'Number of points > ' _clev ': ' nu.k
         _clev = _clev + _cint
         k = k + 1
      endwhile

    endif

      kmax = k - 1
      if ( _clev.1 = _clev.0 ) 
           pfactor = 100. / nu.1 
           xmin = 1
      else
           pfactor = 100. / nu.0
           xmin = 0
      endif
      if ( doing_perc )
        scale = pfactor
      else
        scale = 1.
      endif

      dmax = 0
      dmin = nu.0

      say ' '
      say '  from         to     # points        %    '
      say '   >           <=                          ' 
      say '---------  ---------- ---------- -----------'
      k = 0
      while ( k < kmax )
        l = k+1
        _dist.k = nu.k - nu.l
*        say 'Range ' __clev.k ' ' _clev.l ' has ' _dist.k ' gridpoints'
        if ( k=0 & xmin=1 )
            _perc.k = '   n/a'
            kbeg = 0
        else       
            _perc.k = _dist.k * pfactor
            kbeg = -1
        endif
        lev1 = substr(_clev.k'             ',1,10)
        lev2 = substr(_clev.l'             ',1,10)
        dist = substr(_dist.k'             ',1,10)
        perc = substr(_perc.k'             ',1,10)
        say '  ' lev1 ' ' lev2 ' ' dist '' perc
        if ( k > kbeg )
        if ( _dist.k > dmax ) 
             dmax = _dist.k
        endif 
        if ( _dist.k < dmin ) 
             dmin = _dist.k
        endif 
        endif
        k = k + 1
      endwhile
      _dist.k = nu.k - 0
      _perc.k = _dist.k * pfactor
*     say 'Range ' _clev.k ' ' vmax ' has ' _dist.k ' gridpoints'
      lev1 = substr(_clev.k'             ',1,10)
      lev2 = substr(vmax'             ',1,10)
      dist = substr(_dist.k'             ',1,10)
      perc = substr(_perc.k'             ',1,10)
      say '  ' lev1 ' ' lev2 ' ' dist '' perc
      k = k + 1
      _clev.k = vmax


* Plot distribution as a bar plot
* -------------------------------
if ( xmin )
     k = 1
     tmin = 0.5
     tmax = kmax + 0.5
     _counter = 0
else
     _counter = -1
     tmin = -0.5
     tmax = kmax + 0.5
     k = 0
endif

_xlabs=_clev.0
while (k<=kmax)
  timeset()
  _val = scale * _dist.k
  'define plot'k' = '_val
  k = k +1
  _xlabs=_xlabs'|'_clev.k
  _counter = _counter + 1
endwhile

dmax = scale * dmax
'set t ' tmin ' ' tmax
'set x 1'
'set y 1'
'set gxout bar'
'set barbase bottom'
'set bargap 10'
'set vrange 0 'dmax

*'set xlabs 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 '
 'set xlabs '_xlabs

if ( xmin )
     k = 1
else
     k = 0
endif
while (k <= kmax)
  'set ccolor 1'
  'd plot'k
  k = k +1
endwhile

*   Restore dim env
*   ---------------
    rc = restdim()

return

*............................................................................

function xyrange()

      'q file'
      tmp = sublin ( result, 5 )
      _xmin = 1
      _xmax = subwrd(tmp,3)
      _ymin = 1
      _ymax = subwrd(tmp,6)

return

*
* savedim()  Save dimension environment
*
function savedim()

   'q gxout'
    tmp = sublin(result,4)
    _gxout = subwrd(tmp,6)

   'q dims'

   tmp = sublin(result,2)
   type = subwrd(tmp,3)
   if ( type = 'varying' )
      _x1save = subwrd(tmp,11)
      _x2save = subwrd(tmp,13)
      _lonmin = subwrd(tmp,6)
      _lonmax = subwrd(tmp,8)
   else
      _x1save = subwrd(tmp,9)
      _x2save = _x1save
      _lonmin = subwrd(tmp,6)
      _lonmax = _lonmin
   endif

   tmp = sublin(result,3)
   type = subwrd(tmp,3)
   if ( type = 'varying' )
      _y1save = subwrd(tmp,11)
      _y2save = subwrd(tmp,13)
      _latmin = subwrd(tmp,6)
      _latmax = subwrd(tmp,8)
   else
      _y1save = subwrd(tmp,9)
      _y2save = _y1save
      _latmin = subwrd(tmp,6)
      _latmax = _latmin
   endif

   tmp = sublin(result,4)
   type = subwrd(tmp,3)
   if ( type = 'varying' )
      _z1save = subwrd(tmp,11)
      _z2save = subwrd(tmp,13)
   else
      _z1save = subwrd(tmp,9)
      _z2save = _z1save
   endif

   tmp = sublin(result,5)
   type = subwrd(tmp,3)
   if ( type = 'varying' )
      _t1save = subwrd(tmp,11)
      _t2save = subwrd(tmp,13)
   else
      _t1save = subwrd(tmp,9)
      _t2save = _t1save
   endif

return

*
* restdim()  Restore saved dimension environment
*
function restdim()

     if ( _x1save = '_x1save' )
         say 'restdim: dimensions not saved'
         return 1
     endif

     'set x  ' _x1save ' ' _x2save
     'set y  ' _y1save ' ' _y2save
     'set z  ' _z1save ' ' _z2save
     'set t  ' _t1save ' ' _t2save
     'set gxout ' _gxout

return

*.......................................................................

function timeset ()
   t1 = _counter 
   t2 = _counter + 1
   'set t 't1' 't2
return

