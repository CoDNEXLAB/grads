* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
* meteogram.gs
*
* This script draws a meteogram based on NCEP forecast data.
* The data is available through the GrADS-DODS Server at COLA.
* You MUST be using a DODS-enabled version of GrADS.
*
* Usage:   meteogram <title> <model> <mmddhh> <lon> <lat> <e> <s>
* Example: meteogram  Boston   avn    111512   -71    42   e   n
*
* The 'model' argument may be: avn, eta, mrf, mrfb
* The AVN and MRF forecasts are global, ETA forecasts cover
* North America and its environs. Check the GDS URL 
* http://cola8.iges.org:9090/dods/ for a complete listing 
* of all available forecasts. 
*
* The 'e' argument is for British units. Default is metric.
*
* The 's' argument (y/n) is for the stability indices.
* Default is 'y', in which case the indices are drawn. 
*
* Note: This script must be run in a directory in which 
* you have write permission because intermediate files 
* are written out to disk in order to speed up the display
* and minimize the number of hits to the data server. 
*  
* Originally written by Paul Dirmeyer
* Modified by J.M. Adams Oct 2001
* Modified by Jim Kinter Oct 2001
* Modified by J.M. Adams Nov 2001
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
function main(args)

* Make sure GrADS is in portrait mode
'q gxinfo'
pagesize = sublin(result,2)
xsize = subwrd(pagesize,4)
ysize = subwrd(pagesize,6)
if (xsize != 8.5 & ysize != 11)
  say 'You must be in PORTRAIT MODE to draw a meteogram'
  return
endif

* Parse the arguments: date, longitude, latitude, units
if (args = '')
  say ' '
  say 'Check the URL http://cola8.iges.org:9090/dods/' 
  say 'for a list of all available forecasts.'
  say ' '
  prompt 'Enter forecast model (avn, eta, mrf, or mrfb) --> ' 
  pull model
  prompt 'Enter forecast date (mmddhh) --> ' 
  pull date
  prompt 'Enter longitude --> '
  pull hilon
  prompt 'Enter latitude --> '
  pull hilat
  prompt 'Enter location name --> ' 
  pull name
  prompt 'Metric units? [y/n] --> '
  pull metric
  if (metric='n' | metric='N') ; units='e' ; endif
  prompt 'Include stability indices? [y/n] --> '
  pull stab
  if (stab='Y' | stab='y') ; toto='y' ; endif
else 
  name  = subwrd(args,1)
  model = subwrd(args,2)
  date  = subwrd(args,3)
  hilon = subwrd(args,4)
  hilat = subwrd(args,5)
  units = subwrd(args,6)
  toto  = subwrd(args,7)
endif
if (toto = '') ; toto = 'y' ; endif

* Open the data file
'reinit'
_baseurl = 'http://cola8.iges.org:9090/dods/'
if (model = avn | model = eta | model = mrf)
  _dataset = model%date
else
  if (model = mrfb)
  _dataset = 'mrf'%date%'b'
  endif
endif
'sdfopen '_baseurl%_dataset

* Get info from the descriptor file
'q ctlinfo'
_ctl = result
_undef = getctl(undef)
_tdef = getctl(tdef)
_zdef = getctl(zdef)

* Get the Time axis info
tsize = subwrd(_tdef,2)
if (model = avn | model = eta )
  _t1 = 1
  _t2 = tsize
else
  if (model = mrf)
    _t1 = 1
    _t2 = (tsize-1)/2
    tsize = _t2 - _t1 + 1
  endif
  if (model = mrfb) 
    _t1 = (tsize+1)/2
    _t2 = tsize
    tsize = _t2 - _t1 + 1
  endif
endif
'set t '_t1' '_t2
'q dims'
times  = sublin(result,5)
_time1 = subwrd(times,6)  
_time2 = subwrd(times,8)
_tdim = _time1':'_time2

tincr = subwrd(_tdef,5)
_tdef = 'tdef 'tsize' linear '_time1' 'tincr

* Get Vertical grid info 
zsize = subwrd(_zdef,2)
z = 1
zlevs = ''
rhzlevs = ''
while (z <= zsize)
  'set z 'z
  lev = subwrd(result,4)
  if lev = 500 ; z500 = z ; endif
  zlevs = zlevs%lev%' '
* ETA relative humidity grid values are every 50 mb
  if (model = 'eta')
    rem = math_fmod(lev,50)
    if (rem = 0)
     rhzlevs = rhzlevs%lev%' '  
    endif
  endif 
  z = z + 1
endwhile

* Find the grid point closest to requsted location
'set lon 'hilon
hilon = subwrd(result,4)
'set lat 'hilat
hilat = subwrd(result,4)
_xdim = hilon':'hilon
_ydim = hilat':'hilat

* Determine pressure range for hovmoellers
'set z 1'
'set t 1'
'd ave(ps.1,t='_t1',t='_t2')*0.01-15.0'
data = sublin(result,2)
mmm = subwrd(data,4)
meanps = math_nint(mmm)
psfc = math_nint(mmm+15)
cnt = 1
while (cnt<zsize)
  el1 = subwrd(zlevs,cnt)
  el2 = subwrd(zlevs,cnt+1)
  if (meanps > el2)
    elb = el1
    elt = subwrd(zlevs,z500+cnt-1)
    break
  endif
  cnt=cnt+1
endwhile
if (elt < 500) ; elt = 500 ; endif
_zbot = elb
_ztop = elt
_zgrd = _zbot':'_ztop

* Get pressure range for ETA relative humidity grid
if (model = 'eta')
  rem = math_fmod(_zbot,50)
  if (rem != 0)
    _rhzbot = _zbot - 25
  else 
    _rhzbot = _zbot
  endif
  rem = math_fmod(_ztop,50)
  if (rem != 0)
    _rhztop = _ztop + 25
  else 
    _rhztop = _ztop
  endif
  _rhzgrd = _rhzbot':'_rhztop
endif

* Get number of pressure levels between _zbot and _ztop
n = 1
p = subwrd(zlevs,n)
while (p != _zbot)
  n = n + 1
  p = subwrd(zlevs,n)
endwhile
levs = p
nlevs = 1
while (p > _ztop)
  n = n + 1
  p = subwrd(zlevs,n)
  levs = levs%' 'p
  nlevs = nlevs + 1
endwhile
_newzsize = nlevs
_zdef = 'zdef '_newzsize' levels 'levs

* Get number of pressure levels for ETA relative humidity grid
if (model = 'eta')
  n = 1
  p = subwrd(rhzlevs,n)
  while (p != _rhzbot)
    n = n + 1
    p = subwrd(rhzlevs,n)
  endwhile
  _rhlevs = p
  nlevs = 1
  while (p > _rhztop)
    n = n + 1
    p = subwrd(rhzlevs,n)
    _rhlevs = _rhlevs%' 'p
    nlevs = nlevs + 1
  endwhile
  _newrhzsize = nlevs
  _rhzdef = 'zdef '_newrhzsize' levels '_rhlevs
endif

* Get the Z,T grids for the upper air variables
if (model = 'eta')
  getetarh(rh,rhum)
else
  getgrid(rh,rhum)
endif
getgrid(t,t)
getgrid(u,u)
getgrid(v,v) 
getgrid('z',hgt) 

* Set up a few preliminary characteristics
setcols(1)
'set display color white'
'c'

* Determine the plot areas for each panel
if (toto = 'y')
  npanels = 8
else
  npanels = 7
endif
x1 =  1.20
x2 =  8.15
y1 =  7.20
y2 = 10.00
panel.npanels = x1' 'x2' 'y1' 'y2
ytop = 7.2
ybot = 2.2
int = (ytop-ybot)/(npanels-2)
int = 0.01 * (math_nint(100*int))
n=npanels-1
y2 = ytop
while (n >= 2)
  y2 = ytop - (npanels-n-1)*int
  y1 = ytop - (npanels-n)*int
  panel.n = x1' 'x2' 'y1' 'y2
  n = n - 1
endwhile
xincr = (8.15 - 1.2)/tsize
xincr = 0.01 * math_nint(100*xincr)
panel.1 = x1+xincr' 'x2' 0.8 'y1

* Set the Plot Area for the Upper Air Panel
p = npanels
'set parea 'panel.p
'set vpage off'
'set grads off'
'set grid on'

* Draw the Relative Humidity Shading
'set gxout shaded'
'set csmooth on'
'set clevs  30 50 70 90 100'
'set ccols 0 20 21 23 25 26'
'set xlopts 1 4 0.16'
'set xlpos 0 t'
'set ylab `1%g'
'set ylint 100'
if (units = 'e')
  'define temp = (t-273.16)*1.8+32'
  'define uwnd = u*2.2374'
  'define vwnd = v*2.2374'
else
  'define temp = (t-273.16)'
  'define uwnd = u'
  'define vwnd = v'
endif
'set t '_t1-0.5' '_t2+0.5
'set lev '_zbot+50' '_ztop-50
'd rhum'
'set gxout contour'
'set grid off'
'set ccolor 15'
'set clab off'
'set clevs 10 30 50 70 90'
'd rhum'
'set ccolor 0'
'set clab on'
'set cstyle 5'
'set clopts 15'
'set clevs 10 30 50 70 90'
'd rhum'

* Draw the Temperature Contours
'set clopts -1'
'set cstyle 1'
'set ccolor rainbow'
'set rbcols 9 14 4 11 5 13 12 8 2 6'
if (units = 'e')
  'set cint 10'
  'd temp'
  'set clevs 32'
  'set cthick 12'
  'set ccolor 1'
  'set clab off'
  'd temp'
  'set background 1'
  'set ccolor 20'
  'set clevs 32'
  'set cthick 4'
  'set clab on'
  'set clab `4FR'
else
  'set cint 5'
  'd temp'
  'set clevs 0'
  'set cthick 12'
  'set ccolor 1'
  'set clab off'
  'd temp'
  'set background 1'
  'set ccolor 20'
  'set clevs 0'
  'set cthick 4'
  'set clab on'
endif
'd temp'

* Draw the Wind Barbs
'set background 0'
'set gxout barb'
'set ccolor 1'
'set xlab off'
'set ylab off'
'd uwnd;vwnd'

* Draw a rectangle over the year to clear the area for a title
'set line 0'
'draw recf 0.5 10.52 1.95 11.0'

* Define Thickness
'set lev 1000'
'set t '_t1' '_t2
*getseries('z',hgt,1000)
getseries('z',z5,500)
getseries('z',z10,1000)
'define thk1 = (z5-z10)/10'

* Next Panel: 1000-500 thickness
p = p - 1
'set parea 'panel.p
'set gxout line'
'set vpage off'
'set grads off'
'set grid on'
'set xlab on'
'set ylab on'
vrng(thk1, thk1)
'set ccolor 5'
'set cmark 4'
'set t '_t1-0.5' '_t2+0.5
'd thk1'

* Draw a rectangle over the x-axis labels
xlo = subwrd(panel.p,1)
xhi = subwrd(panel.p,2)
ylo = subwrd(panel.p,3)
yhi = subwrd(panel.p,4)
'set line 0'
'draw recf 'xlo-0.4' 'ylo-0.8' 'xhi+0.4' 'ylo-0.02

* Next Panel: Stability Indices
if (toto = 'y')
  p = p - 1
  'set parea 'panel.p
  ylo = subwrd(panel.p,3)
  yhi = subwrd(panel.p,4)
  ymid = ylo + (yhi-ylo)/2

  'set t '_t1' '_t2
  'set lev 1000'
  'define rh8 = rhum(lev=850)'
  'define t8 = t(lev=850)'
  'define t5 = t(lev=500)'
  'set vpage off'
  'set grads off'
  'set grid on'
  'set xlab on'
  'set gxout bar'
  'set barbase 40'
  'set bargap 50'
  'define toto = 1/(1/t8-log(rh8*0.01)*461/2.5e6)-t5*2+t8'
  'set axlim 11 69'
  'set yaxis 11 69 10'
  'set ccolor 8'
  'set t '_t1-0.5' '_t2+0.5
  'set grid on'
  'd (toto-40+abs(toto-40))*0.5+40'
  'set grid off'
  'set ccolor 7'
  'd (toto-40-abs(toto-40))*0.5+40'

* draw a rectangle over 'toto' yaxis labels
  'set line 0'
  'draw recf 0.2 'ylo' 1.175 'yhi-0.07

* Lifted Index
  if (model = 'eta')
    getseries(sli,li,1000)
  else
    getseries(li,li,1000)
  endif
  'set gxout line'
  'set grid off'
  'set vrange 5.9 -5.9'
  'set yaxis 5.9 -5.9 2'
  'set ccolor 2'
  'set cstyle 3'
  'set cmark 7'
  'set cmax 0'
  'set datawarn off'
  'd li'

* draw a zero line
  'set ccolor 15'
  'set cmark 0'
  'set cstyle 3'
  'd const(li,0)'

* Draw a rectangle over the x-axis labels
  xlo = subwrd(panel.p,1)
  xhi = subwrd(panel.p,2)
  ylo = subwrd(panel.p,3)
  yhi = subwrd(panel.p,4)
  'set line 0'
  'draw recf 'xlo-0.4' 'ylo-0.8' 'xhi+0.4' 'ylo-0.02
   

endif

* Next Panel: SLP
if (model = 'eta')
  getseries(slpe,slp,1000)
else
  getseries(slp,slp,1000)
endif
'define slp = slp*0.01'
p = p - 1
'set parea 'panel.p
'set vpage off'
'set lon 'hilon
'set lat 'hilat
'set grid on'
'set gxout contour'
vrng(slp,slp)
'set ccolor 11'
'set cmark 0'
'set t '_t1-0.5' '_t2+0.5
'd slp'

* Draw a rectangle over the x-axis labels
xlo = subwrd(panel.p,1)
xhi = subwrd(panel.p,2)
ylo = subwrd(panel.p,3)
yhi = subwrd(panel.p,4)
'set line 0'
'draw recf 'xlo-0.4' 'ylo-0.8' 'xhi+0.4' 'ylo-0.02

* Next Panel: Surface Wind Speed
if (model = 'eta')
  getseries(u10,ubot,1000)
  getseries(v10,vbot,1000)
else
  getseries(ub,ubot,1000)
  getseries(vb,vbot,1000)
endif
p = p - 1
'set parea 'panel.p
'set vpage off'
'set grads off'
if (units = 'e')
  'define ubot = 2.2374*ubot'
  'define vbot = 2.2374*vbot'
endif
'define wind = mag(ubot,vbot)'
vrng(wind,wind)
'set ccolor 26'
'set cmark 7'
'set grid on'
'set t '_t1-0.5' '_t2+0.5
'set gxout contour'
'd wind'

* Draw a rectangle over the x-axis labels
xlo = subwrd(panel.p,1)
xhi = subwrd(panel.p,2)
ylo = subwrd(panel.p,3)
yhi = subwrd(panel.p,4)
'set line 0'
'draw recf 'xlo-0.4' 'ylo-0.8' 'xhi+0.4' 'ylo-0.02

* Next Panel: Min & Max Temperatures and Indices
getseries(t2,t2m,1000)
if (model = 'eta')
  getseries(qs,qs,1000)
  getseries(ps,ps,1000)
  'define rh2m = (qs*ps/0.622)/(622*exp(5423*(1/273-1/t2m)))*100'
  'define t2max = t2m'
  'define t2min = t2m'
else
  getseries(rh2,rh2m,1000)
  getseries(t2max,t2max,1000)
  getseries(t2min,t2min,1000)
endif
p = p - 1
'set parea 'panel.p
'set vpage off'
'set frame on'
'set grads off'
'set ylab on'
'set gxout line'
'set grid off'
if (units = 'e')
  'define tmax = (t2max-273.16)*9/5+32'
  'define tmin = (t2min-273.16)*9/5+32'
  'define t2m  = const((t2m-273.16)*9/5+32,0,-u)'
  'define chill = 35.74+0.6215*t2m-35.75*pow(wind,0.16)+0.4275*t2m*pow(wind,0.16)'
  'define hindx = 0.01*rh2m*pow(0.01918*t2m-1.124,2)+0.7628*t2m+11.26'
else
  'define tmax = t2max-273.16'
  'define tmin = t2min-273.16'
  'define t2m  = const((t2m-273.16),0,-u)'
  'define chill = 35.74+0.6215*(t2m*1.8+32)-35.75*pow(wind,0.16)+0.4275*(t2m*1.8+32)*pow(wind,0.16)'
  'define chill = (chill-32)*5/9'
  'define hindx = 0.01*rh2m*pow(0.01918*(t2m*1.8+32)-1.124,2)+0.7628*(t2m*1.8+32)+11.26'
  'define hindx = (hindx-32)*5/9'
endif
vrng(tmax,chill)
*vrng(tmax,tmin)
if (units = 'e')
  'define chill = const(maskout(chill,32-chill),-100,-u)'
  'define hindx = const(maskout(hindx,hindx-75),200,-u)'
else
  'define chill = const(maskout(chill,-chill),-100,-u)'
  'define hindx = const(maskout(hindx,hindx-25),200,-u)'
endif
'set t '_t1-0.5' '_t2+0.5
if (units = 'e')
  'set ylint 10'
  'set gxout linefill'
  if (model = 'eta')
    expr = 't2m;const(t2m'
  else
    expr = 'maskout(tmax,1/(tmax-tmin));const(tmax'
  endif
  'set lfcols  9 0' ; 'd 'expr',-60,-a)'
  'set lfcols  9 0' ; 'd 'expr',-60,-a)'
  'set lfcols 14 0' ; 'd 'expr',-10,-a)'
  'set lfcols  4 0' ; 'd 'expr',0,-a)'
  'set lfcols 11 0' ; 'd 'expr',10,-a)'
  'set lfcols  5 0' ; 'd 'expr',20,-a)'
  'set lfcols 13 0' ; 'd 'expr',30,-a)'
  'set lfcols  3 0' ; 'd 'expr',40,-a)'
  'set lfcols 10 0' ; 'd 'expr',50,-a)'
  'set lfcols  7 0' ; 'd 'expr',60,-a)'
  'set lfcols 12 0' ; 'd 'expr',70,-a)'
  'set lfcols  8 0' ; 'd 'expr',80,-a)'
  'set lfcols  2 0' ; 'd 'expr',90,-a)'
  'set lfcols  6 0' ; 'd 'expr',100,-a)'
  if (model != 'eta')
    'set lfcols  0 0' ; 'd maskout(tmin,1/(tmax-tmin));const(tmax,-60,-a)'
  endif
  'set gxout line'
  'set ccolor 15'
  'set cstyle 3'
  'set cmark 0'
  if (model = 'eta')
    'd t2m'
  else
    'd maskout(tmax,1/(tmax-tmin))'
  endif
else
  'set ylint 5'
  'set gxout linefill'
  if (model = 'eta')
    expr = 't2m;const(t2m'
  else
    expr = 'maskout(tmax,1/(tmax-tmin));const(tmax'
  endif
  'set lfcols  9 0' ; 'd 'expr',-60,-a)'
  'set lfcols 14 0' ; 'd 'expr',-25,-a)'
  'set lfcols  4 0' ; 'd 'expr',-20,-a)'
  'set lfcols 11 0' ; 'd 'expr',-15,-a)'
  'set lfcols  5 0' ; 'd 'expr',-10,-a)'
  'set lfcols 13 0' ; 'd 'expr',-5,-a)'
  'set lfcols  3 0' ; 'd 'expr',0,-a)'
  'set lfcols 10 0' ; 'd 'expr',5,-a)'
  'set lfcols  7 0' ; 'd 'expr',10,-a)'
  'set lfcols 12 0' ; 'd 'expr',15,-a)'
  'set lfcols  8 0' ; 'd 'expr',20,-a)'
  'set lfcols  2 0' ; 'd 'expr',25,-a)'
  'set lfcols  6 0' ; 'd 'expr',30,-a)'
  if (model != 'eta')
    'set lfcols  0 0' ; 'd maskout(tmin,1/(tmax-tmin));const(tmax,-60,-a)'
  endif
  'set gxout line'
  'set ccolor 15'
  'set cstyle 3'
  'set cmark 0'
  if (model = 'eta')
    'd t2m'
  else
    'd maskout(tmax,1/(tmax-tmin))'
  endif
endif
'set grid on'
'set cmark 8'
'set ccolor 2'
if (model = 'eta')
  'd t2m'
else
  'd maskout(tmax,1/(tmax-tmin))'
  'set grid off'
  'set cmark 2'
  'set ccolor 4'
  'd maskout(tmin,1/(tmax-tmin))'
endif

'set cstyle 0'
'set ccolor 30'
'set cmark 1'
'd hindx'
'set cstyle 0'
'set ccolor 31'
'set cmark 1'
'd chill'

* Draw a rectangle over the x-axis labels
xlo = subwrd(panel.p,1)
xhi = subwrd(panel.p,2)
ylo = subwrd(panel.p,3)
yhi = subwrd(panel.p,4)
'set line 0'
'draw recf 'xlo-0.4' 'ylo-0.8' 'xhi+0.4' 'ylo-0.02

* Back up to Previous Panel: Wind Barbs, 0-30mb
p = p + 1
'set parea 'panel.p
'set ccolor 1'
lap1 = hilat + 0.1
lam1 = hilat - 0.1
'set lon 'hilon ;* ??
'set lat 'lam1' 'lap1
'set frame off'
'set grid off'
'set gxout barb'
'set xyrev on'
'set xlab off'
'set ylab off'
if (units = 'e')
  if (model = 'eta')
    'd 2.2374*u10.1;2.2374*v10.1'
  else
    'd 2.2374*ub.1;2.2374*vb.1'
  endif
else
  if (model = 'eta')
    'd u10.1;v10.1'
  else
    'd ub.1;vb.1'
  endif
endif

* Reset dimension and graphics parameters
'set lat 'hilat
'set lon 'hilon
'set vpage off'
'set frame on'
'set grads off'
'set ylab on'
'set xlab on'
'set gxout line'
'set grid off'

* Skip to Next Panel: 2m Relative Humidity
p = p - 2
'set parea 'panel.p
'set vpage off'
'set grads off'
rh2vrng(rh2m)
'set gxout linefill'
'set lfcols 20 0' ; 'd rh2m;const(rh2m,00.01,-a)'
'set lfcols 21 0' ; 'd rh2m;const(rh2m,20.01,-a)'
'set lfcols 22 0' ; 'd rh2m;const(rh2m,30.01,-a)'
'set lfcols 23 0' ; 'd rh2m;const(rh2m,40.01,-a)'
'set lfcols 24 0' ; 'd rh2m;const(rh2m,50.01,-a)'
'set lfcols 25 0' ; 'd rh2m;const(rh2m,60.01,-a)'
'set lfcols 26 0' ; 'd rh2m;const(rh2m,70.01,-a)'
'set lfcols 27 0' ; 'd rh2m;const(rh2m,80.01,-a)'
'set lfcols 28 0' ; 'd rh2m;const(rh2m,90.01,-a)'
'set ccolor 28'
'set gxout line'
'set grid on'
'set cmark 2'
'd rh2m'

* Draw a rectangle over the x-axis labels
xlo = subwrd(panel.p,1)
xhi = subwrd(panel.p,2)
ylo = subwrd(panel.p,3)
yhi = subwrd(panel.p,4)
'set line 0'
'draw recf 'xlo-0.4' 'ylo-0.8' 'xhi+0.4' 'ylo-0.02

* Final Panel: Precipitation
getseries('p',pt,1000)
getseries(pc,pc,1000)
p = p - 1
'set parea 'panel.p
'set vpage off'
'set grid on'
'set grads off'
'define ptot  = 0.5*(pt+abs(pt))'
'define pconv = 0.5*(pc+abs(pc))'
if (units = 'e')
  'define ptot  = const(ptot,0,-u)/25.4'
  'define pconv = const(pconv,0,-u)/25.4'
else
  'define ptot  = const(ptot,0,-u)'
  'define pconv = const(pconv,0,-u)'
endif

* Calculate other precipitation types
if (model = 'eta')
* Define a temperature for the lowest 30 mb
  ptarget = psfc-30
  z = 1
  mindelta = 1000
  while (z <= _newzsize)
    pres = subwrd(zlevs,z)
    delta = pres - ptarget
    if (delta < 0) ; delta = ptarget - pres ; endif
    if (delta < mindelta) 
      mindelta = delta 
      bestlev = pres
    endif
    z = z + 1
  endwhile
  getseries(t,t30mb,bestlev)
  if (units = 'e')
    'define t2m = ((t2m-32)*5/9) + 273.16'
  else
    'define t2m = t2m + 273.16'
  endif
  'define tbot = 0.5*(t30mb + t2m)'
else
  getseries(bt,tbot,1000)
endif
getseries('z',z7,700)
getseries('z',z8,850)

'set t '_t1+1' '_t2
*'set t '_t1' '_t2
'define ccc = 0.5*((tbot+tbot(t-1)-2*273.16)/abs(tbot-tbot(t-1))+1)'
'define ddd = 0.5*(abs(ccc)+ccc)'
'define cs1 = -0.5*((ddd-1)-abs(ddd-1))'

'define th0 = (z7(t-1)-z8(t-1)-1554)'
'define th1 = (z7-z8-1554.01)'
'define ccc = 0.5*((th0+th1)/abs(th0-th1)+1)'
'define ddd = 0.5*(abs(ccc)+ccc)'
'define ch1 = -0.5*((ddd-1)-abs(ddd-1))'

'define sfrac = cs1'
'define hfrac = ch1'

'define math7 = (hfrac-0.74)'
'define math1 = (hfrac-0.11)'
'define mats7 = (sfrac-0.74)'
'define mats1 = (sfrac-0.11)'

* Get Total Precipitation Range
'set gxout stat'
'd ptot'
data = sublin(result,8)
pmx = subwrd(data,5)
if (units = 'e')
  if (pmx < 0.05) 
    pmx = 0.0499
  else
    pmx = pmx + (0.05*pmx)
  endif
else
  if (pmx < 1.0) 
    pmx = 0.99
  else
    pmx = pmx + (0.05*pmx)
  endif
endif
*if (pmx = 0) ; pmx = 0.98 ; endif
'set vrange 0 'pmx
incr = 0.01 * (math_nint(100*pmx/5))
'set ylint 'incr
'set t '_t1+0.5' '_t2+0.5

* Rain (Total Precipitation)
'set gxout bar'
'set barbase 0'
'set bargap 50'
'set ccolor 42'
'd ptot'

* Mixed
'set gxout stat'
'd maskout(ptot,mats1)'
tmp = sublin(result,7)
val = subwrd(tmp,8)
if (val != 0)
  'set gxout bar'
  'set ccolor 43'
  'd maskout(ptot,mats1)'
endif

* Rain/Snow
'set gxout stat'
'd maskout(ptot,math7)'
tmp = sublin(result,7)
val = subwrd(tmp,8)
if (val != 0)
  'set gxout bar'
  'set ccolor 46'
  'd maskout(ptot,math7)'
endif

* Rain/Sleet
'set gxout stat'
'd maskout(maskout(ptot,-math1),mats1)'
tmp = sublin(result,7)
val = subwrd(tmp,8)
if (val != 0)
  'set gxout bar'
  'set ccolor 47'
  'd maskout(maskout(ptot,-math1),mats1)'
endif

* Snow
'set gxout stat'
'd maskout(maskout(ptot,math7),mats7)'
tmp = sublin(result,7)
val = subwrd(tmp,8)
if (val != 0)
  'set gxout bar'
  'set ccolor 44'
  'd maskout(maskout(ptot,math7),mats7)'
endif

* Sleet
'set gxout stat'
'd maskout(maskout(ptot,mats7),-math1)'
tmp = sublin(result,7)
val = subwrd(tmp,8)
if (val != 0)
  'set gxout bar'
  'set ccolor 45'
  'd maskout(maskout(ptot,mats7),-math1)'
endif

* Convective Precipitation
'set gxout bar'
'set bargap 80'
'set ccolor 2'
'd pconv'

* Draw all the Y-axis labels

* First panel
'set line 21' ; 'draw recf 0.4 7.65 0.62  8.18'
'set line 22' ; 'draw recf 0.4 7.65 0.58  8.18'
'set line 23' ; 'draw recf 0.4 7.65 0.535 8.18'
'set line 25' ; 'draw recf 0.4 7.65 0.49  8.18'
'set line 26' ; 'draw recf 0.4 7.65 0.445 8.18'
'set string 0 c 4 90' ; 'draw string 0.5 7.93 RH (%)'
'set string 2 l 4 90' ; 'draw string 0.5 8.36 T'
'set string 8 l 4 90' ; 'draw string 0.5 8.43 e'
'set string 5 l 4 90' ; 'draw string 0.5 8.50 m'
'set string 4 l 4 90' ; 'draw string 0.5 8.62 p'
'set string 9 l 4 90' ; 'draw string 0.5 8.69 .'
if (units = 'e')
  'set string 2 l 4 90' ; 'draw string 0.5 8.79 (F)'
  'set string 1 c 4 90' ; 'draw string 0.5 9.53 Wind (mph)'
else
  'set string 2 l 4 90' ; 'draw string 0.5 8.79 (C)'
  'set string 1 c 4 90' ; 'draw string 0.5 9.53 Wind (m/s)'
endif
'draw string 0.75 8.63 `1m i l l i b a r s'

* Next Panel
'set strsiz 0.08 0.12'
p = npanels - 1 
ylo = subwrd(panel.p,3)
yhi = subwrd(panel.p,4)
ymid = ylo + (yhi-ylo)/2
'set string  5 c 4 90'  
'draw string 0.5 'ymid' Thickness'
'draw string 0.3 'ymid' 1000-500mb'
'set string  1 c 4 90'  
'draw string 0.74 'ymid' (dm)'

* Next Panel
if (toto = 'y')
  p = p - 1 
  ylo = subwrd(panel.p,3)
  yhi = subwrd(panel.p,4)
  ymid = ylo + (yhi-ylo)/2
  'set string 8 c 4 90' ; 'draw string 0.15 'ymid' Total-totals'

* Total-Totals Y-axis Legend
  'set strsiz 0.08 0.11'
  'set string 15 r 4 0' ; 'draw string 0.45 'ymid' 40'
  'set string  7 r 4 0' ; 'draw string 0.45 'ymid-0.133' 30'
  'set string  7 r 4 0' ; 'draw string 0.45 'ymid-0.266' 20'
  'set string  8 r 4 0' ; 'draw string 0.45 'ymid+0.133' 50'
  'set string  8 r 4 0' ; 'draw string 0.45 'ymid+0.266' 60'
  'set strsiz 0.08 0.12'
  'set string 2 c 4 90' ; 'draw string 0.69 'ymid' Lifted Index'

endif

* Next Panel
p = p - 1 
ylo = subwrd(panel.p,3)
yhi = subwrd(panel.p,4)
ymid = ylo + (yhi-ylo)/2
'set string 11 c 4 90' ; 'draw string 0.3 'ymid' SLP'
'set string  1 c 4 90' ; 'draw string 0.6 'ymid' (mb)'

* Next Panel
p = p - 1 
ylo = subwrd(panel.p,3)
yhi = subwrd(panel.p,4)
ymid = ylo + (yhi-ylo)/2
if (model = 'eta')
  'set string 26 c 4 90' ; 'draw string 0.15 'ymid' 10m'
else
  'set string 26 c 4 90' ; 'draw string 0.15 'ymid' 0-30mb'
endif
'set string 26 c 4 90' ; 'draw string 0.35 'ymid' Wind Spd'
'set string  1 c 4 90' ; 'draw string 0.55 'ymid' & Barbs'
if (units = 'e')
  'draw string 0.75 'ymid' (mph)'
else
  'draw string 0.75 'ymid' (m/s)'
endif

* Next Panel
p = p - 1 
ylo = subwrd(panel.p,3)
yhi = subwrd(panel.p,4)
ymid = ylo + (yhi-ylo)/2
if (model != 'eta')
  'set string  4 c 4 90' ; 'draw string 0.15 'ymid+0.2' Tmin, '
  'set string  2 c 4 90' ; 'draw string 0.15 'ymid-0.2' Tmax, '
else
  'set string  2 c 4 90' ; 'draw string 0.15 'ymid' 2m Temp, '
endif
'set string 31 c 4 90' ; 'draw string 0.35 'ymid' Wind Chill'
'set string 30 c 4 90' ; 'draw string 0.55 'ymid' Heat Index'
if (units = 'e')
  'set string 1 c 4 90'
  'draw string 0.75 'ymid' (F)'
else
  'set string 1 c 4 90'
  'draw string 0.75 'ymid' (C)'
endif

* Next Panel
p = p - 1 
ylo = subwrd(panel.p,3)
yhi = subwrd(panel.p,4)
ymid = ylo + (yhi-ylo)/2
'set string 26 c 4 90' ; 'draw string 0.35 'ymid' 2m RH'
'set string  1 c 4 90' ; 'draw string 0.75 'ymid' (%)'

* Bottom Panel
if (model = avn) ; dt = 6 ; endif
if (model = eta) ; dt = '6/12' ; endif
if (model = mrf | model=mrfb) ; dt = 12 ; endif
'set string  1 c 4 90'; 'draw string .85 1.50 'dt'-hr Precipitation'
'set string  2 r 4 0' ; 'draw string 0.7 2.1 Convective'
'set string 42 r 4 0' ; 'draw string 0.7 1.9 Rain'
'set string 44 r 4 0' ; 'draw string 0.7 1.7 Snow'
'set string 45 r 4 0' ; 'draw string 0.7 1.5 Sleet'
'set string 46 r 4 0' ; 'draw string 0.7 1.3 Rain/Snow'
'set string 47 r 4 0' ; 'draw string 0.7 1.1 Rain/Sleet'
'set string 43 r 4 0' ; 'draw string 0.7 0.9 Mixed'
if (units = 'e')
  'set string 1 c 4 90'
  'draw string 1.05 1.50 (inches liquid)'
else
  'set string 1 c 4 90'
  'draw string 1.05 1.50 (mm liquid)'
endif

* Draw Labels at the top of the page
'set string 1 r 1 0'
'set strsiz 0.14 .17'
if (model = avn) ; label = AVN ; endif
if (model = eta) ; label = ETA ; endif
if (model = mrf | model = mrfb) ; label = MRF ; endif
label = label%' Forecast Meteogram for '
label = label%'('hilat
if (hilat < 0) ; label = label%S ; endif
if (hilat > 0) ; label = label%N ; endif
if (hilon < 0)  ; label = label%', 'hilon*(-1.0)'W)' ; endif
if (hilon >= 0) ; label = label%', 'hilon'E)' ; endif
'draw string 8.15 10.75 'label

'set line 0'
'draw recf 0.5 0 3.95 0.28'

* Draw the station label
'set strsiz 0.18 0.22'
'set string 21 l 12 0'
'draw string 0.12 10.75 `1'name
'set string 1 l 8 0'
'draw string 0.1 10.77 `1'name

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
* END OF MAIN SCRIPT
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 

function setcols(args)
'set rgb 20 234 245 234'
'set rgb 21 200 215 200'
'set rgb 22 160 205 160'
'set rgb 23 120 215 120'
'set rgb 24  80 235  80'
'set rgb 25   0 255   0'
'set rgb 26   0 195   0'
'set rgb 27   0 160   0'
'set rgb 28   0 125   0'

'set rgb 30 255 160 120'
'set rgb 31 160 120 255'
'set rgb 32 160 180 205'

'set rgb 42  32 208  32'
'set rgb 43 208  32 208'
'set rgb 44  64  64 255'
'set rgb 45 255 120  32'
'set rgb 46  32 208 208'
'set rgb 47 240 240   0'

'set rgb 98  64  64  96'
'set rgb 99 254 254 254'
return

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
function vrng(f1,f2)
'set gxout stat'
'd 'f1
data = sublin(result,8)
ymx = subwrd(data,5)
ymn = subwrd(data,4)
'd 'f2
data = sublin(result,8)
zmx = subwrd(data,5)
zmn = subwrd(data,4)
if (zmx > ymx) ; ymx = zmx ; endif
if (zmn < ymn) ; ymn = zmn ; endif
dy = ymx-ymn
ymx = ymx + 0.08 * dy
ymn = ymn - 0.08 * dy
'set vrange 'ymn' 'ymx
incr = math_nint((ymx-ymn)/4)
'set ylint 'incr
'set gxout line'
return

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
function rh2vrng(f1)
'set gxout stat'
'd 'f1
data = sublin(result,8)
ymn = subwrd(data,4)
ymx = subwrd(data,5)
if (ymn < 20) 
  miny = 0 
  'set ylevs 20 40 60 80'
endif
if (ymn >= 20 & ymn < 30) 
  miny = 20 
  'set ylevs 30 50 70 90'
endif
if (ymn >= 30 & ymn < 40) 
  miny = 30 
  'set ylevs 40 50 60 70 80 90'
endif
if (ymn >= 40 & ymn < 50) 
  miny = 40 
  'set ylevs 50 60 70 80 90'
endif
if (ymn >= 50 & ymn < 60) 
  miny = 50
  'set ylevs 60 70 80 90'
endif
if (ymn >= 60) 
  miny = 60
  'set ylevs 70 80 90'
endif
'set vrange 'miny' 'ymx+3
return

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
function getctl(handle)
line = 1
found = 0
while (!found)
  info = sublin(_ctl,line)
  if (subwrd(info,1)=handle)
    _handle = info
    found = 1
  endif
  line = line + 1
endwhile
return _handle

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
function getgrid(dodsvar,myvar)
'sdfopen '_baseurl'_expr_{'_dataset'}{'dodsvar'}{'_xdim','_ydim','_zgrd','_tdim'}'
line = sublin(result,4)
file = subwrd(line,8)
'set dfile 'file
'set lon 1'
'set lat 1'
'set lev '_zbot' '_ztop
'set time '_time1' '_time2

* Write the variable to a file
'set gxout fwrite'
'set fwrite dummy.dat'
'd result.'file
'disable fwrite'
'close 'file
'set dfile 1'

* Write a descriptor file 
rc = write(dummy.ctl,'dset ^dummy.dat')
rc = write(dummy.ctl,_undef,append)
rc = write(dummy.ctl,'xdef 1 linear 1 1',append)
rc = write(dummy.ctl,'ydef 1 linear 1 1',append)
rc = write(dummy.ctl,_zdef,append)
rc = write(dummy.ctl,_tdef,append)
rc = write(dummy.ctl,'vars 1',append)
rc = write(dummy.ctl,'dummy '_newzsize' -999 dummy',append)
rc = write(dummy.ctl,'endvars',append)
rc = close (dummy.ctl)

* Open the dummy file, define variable, close dummy file
'open dummy.ctl'
line = sublin(result,2)
dummyfile = subwrd(line,8)
'define 'myvar' = dummy.'dummyfile
'close 'dummyfile
return

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
function getetarh(dodsvar,myvar)
'sdfopen '_baseurl'_expr_{'_dataset'}{'dodsvar'}{'_xdim','_ydim','_rhzgrd','_tdim'}'
line = sublin(result,4)
file = subwrd(line,8)
'set dfile 'file
'set lon 1'
'set lat 1'

* Write the variable to a file
'set gxout fwrite'
'set fwrite dummy.dat'
t = _t1
while (t <= _t2)
  'set t 't
  z = 1
  while (z <= _newrhzsize)
    level = subwrd(_rhlevs,z) 
    'set lev 'level
    'd result.'file
    z = z + 1
  endwhile
  t = t + 1
endwhile
'disable fwrite'
'close 'file
'set dfile 1'

* Write a descriptor file 
rc = write(dummy.ctl,'dset ^dummy.dat')
rc = write(dummy.ctl,_undef,append)
rc = write(dummy.ctl,'xdef 1 linear 1 1',append)
rc = write(dummy.ctl,'ydef 1 linear 1 1',append)
rc = write(dummy.ctl,_rhzdef,append)
rc = write(dummy.ctl,_tdef,append)
rc = write(dummy.ctl,'vars 1',append)
rc = write(dummy.ctl,'dummy '_newrhzsize' -999 dummy',append)
rc = write(dummy.ctl,'endvars',append)
rc = close (dummy.ctl)

* Open the dummy file, define variable, close dummy file
'open dummy.ctl'
line = sublin(result,2)
dummyfile = subwrd(line,8)
'set dfile 'dummyfile
'set lev '_rhzbot' '_rhztop
'set time '_time1' '_time2
'q dims'
'define 'myvar' = dummy.'dummyfile
'close 'dummyfile
'set dfile 1'
return

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
function getseries(dodsvar,myvar,level)
'sdfopen '_baseurl'_expr_{'_dataset'}{'dodsvar'}{'_xdim','_ydim','level':'level','_tdim'}'
line = sublin(result,4)
file = subwrd(line,8)
'set dfile 'file
'set lon 1'
'set lat 1'
'set lev 'level
'set time '_time1' '_time2

* Write the variable to a file
'set fwrite dummy.dat'
'set gxout fwrite'
'd result.'file
'disable fwrite'
'close 'file
'set dfile 1'

* Write a descriptor file 
rc = write(dummy.ctl,'dset ^dummy.dat')
rc = write(dummy.ctl,_undef,append)
rc = write(dummy.ctl,'xdef 1 linear 1 1',append)
rc = write(dummy.ctl,'ydef 1 linear 1 1',append)
rc = write(dummy.ctl,'zdef 1 linear 1 1',append)
rc = write(dummy.ctl,_tdef,append)
rc = write(dummy.ctl,'vars 1',append)
rc = write(dummy.ctl,'dummy 0 -999 dummy',append)
rc = write(dummy.ctl,'endvars',append)
rc = close(dummy.ctl)

* Open the dummy file, define variable, close dummy file
'open dummy.ctl'
line = sublin(result,2)
dummyfile = subwrd(line,8)
'define 'myvar' = dummy.'dummyfile
'close 'dummyfile
'set gxout contour'
return

