function barcomp ( args )

*  Parse arguments
*  ---------------
   _expr1 = subwrd(args,1)
   _expr2 = subwrd(args,2)
   _tb = subwrd(args,3)

say _expr1' '_expr2' '_tb
   if ( _expr1='' | _expr2='' | _expr3='')
      say '  Usage:   barcomp  expr1   expr2 tb'
      say 'Example:   barcomp  tmpu.1  tmpu.2 (1 or 2)'
      say '   Note:   GrADS must be in Portrait mode'
      return 1
   endif 


* save dimen environment
* ----------------------
  rc = savedim()


******
* global averages (_expr1 and _expr2)

'd aave('_expr1',lon=-180,lon=180,lat=-90,lat=90)'
_barnum.1 = subwrd(result,4)
*_barnum.1.crop = substr(_barnum.gl,1,5)   (to crop unecessary digits (if # to be diplayed)

'd aave('_expr2',lon=-180,lon=180,lat=-90,lat=90)'
_barnum.2 = subwrd(result,4)

******
* NW quadrant (_expr1 and _expr2)

'd aave('_expr1',lon=-180,lon=0,lat=20,lat=90)'
_barnum.3 = subwrd(result,4)

'd aave('_expr2',lon=-180,lon=0,lat=20,lat=90)'
_barnum.4 = subwrd(result,4)

******
* NE quadrant (_expr1 and _expr2)

'd aave('_expr1',lon=0,lon=180,lat=20,lat=90)'
_barnum.5 = subwrd(result,4)

'd aave('_expr2',lon=0,lon=180,lat=20,lat=90)'
_barnum.6 = subwrd(result,4)

******
* tropics (_expr1 and _expr2)

'd aave('_expr1',lon=-180,lon=180,lat=-20,lat=20)'
_barnum.7 = subwrd(result,4)

'd aave('_expr2',lon=-180,lon=180,lat=-20,lat=20)'
_barnum.8 = subwrd(result,4)

******
* SW quadrant (_expr1 and _expr2)

'd aave('_expr1',lon=-180,lon=0,lat=-90,lat=-20)'
_barnum.9 = subwrd(result,4)

'd aave('_expr2',lon=-180,lon=0,lat=-90,lat=-20)'
_barnum.10 = subwrd(result,4)

******
* SE quadrant (_expr1 and _expr2)

'd aave('_expr1',lon=0,lon=360,lat=-90,lat=-20)'
_barnum.11 = subwrd(result,4)

'd aave('_expr2',lon=0,lon=360,lat=-90,lat=-20)'
_barnum.12 = subwrd(result,4)

* check for maximum and minimum values
_max =  0
_min =  0
maxmin ()

_counter = 1
loop = 1

while (loop<13)
  timeset ()
  'define plot'loop' = '_barnum.loop
  _counter=_counter+1; loop = loop +1

  timeset ()
  'define plot'loop' = '_barnum.loop
  _counter=_counter+2; loop = loop +1

endwhile

'set t 0 36'
'set x 1'
'set y 1'
'set gxout bar'
'set barbase 0'
'set vrange '_min' '_max
'set xlab off'


loop = 1

while (loop < 13)

'set ccolor 4'
  'd plot'loop
  loop = loop +1

 'set ccolor 2'
  'd plot'loop
  loop = loop + 1
endwhile

text ()

function timeset ()
   t1 = _counter *2 - 1
   t2 = _counter *2
   'set t 't1' 't2
return

function maxmin ()
loop = 1

while (loop<13)
  if (_barnum.loop < _min)
    _min = _barnum.loop
  endif

  if (_barnum.loop > _max)
    _max = _barnum.loop
  endif

  loop = loop +1
endwhile

_max = _max * 1.2
_min = _min * 1.2

return

function text ()

*ud = 10.25  may be more appropriate depending on the subplot program used... 
ud= 4.75


if (_tb = 2)
ud = 4.75
endif



'set string 1 tc'

*again strsiz may need to be adjusted depending on the subplot program used... 
'set strsiz 0.12'

'draw string 2.4 'ud' Global'
'draw string 3.4 'ud' NW'
'draw string 4.4 'ud' NE'
'draw string 5.4 'ud' Tropics'
'draw string 6.4 'ud' SW'
'draw string 7.4 'ud' SE'


* restore dim environment
* ----------------------
  rc = restdim()

return

*.................................................................


*
* savedim()  Save dimension environment
*
function savedim()

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

return


function getenv(arg)
_fname  = '.gradsenv.'subwrd(arg,1)
ret = read(_fname)
rc = sublin(ret,1)
if (rc>0)
  say 'Enviroment variable 'arg' not defined'
  _env=''
  return
endif
_env = sublin(ret,2)
ret=close(_fname)
return

