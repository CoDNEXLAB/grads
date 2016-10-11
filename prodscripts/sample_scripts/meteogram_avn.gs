* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
* meteogram_avn.gs
*
* This script draws a meteogram based on AVN forecast data.
* The data is available through the GrADS-DODS Server at COLA.
* You MUST be using a DODS-enabled version of GrADS.
*
* Usage:   meteogram_avn <mmddhh> <lon> <lat> <e>
* Example: meteogram_avn  061500   -77    39   e
*
* The 'e' argument is for British units. Default is metric.
* Check the URL http://cola8.iges.org:9090/dods/ for a 
* complete listing of all available AVN forecasts. 
*
* Note: This script must be run in a directory in which 
* you have write permission because intermediate files 
* are written out to disk in order to speed up the display
* and minimize the number of hits to the data server. 
* If you don't have write permission, use the subroutines 
* "getgridslow" and "getseriesslow" instead of "getgrid"
* and "getseries".
*  
* Originally written by Paul Dirmeyer
* Modified by J.M. Adams Oct 2001
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
  say 'for a list of all available AVN forecasts.'
  say ' '
  prompt 'Enter forecast date (mmddhh) --> ' 
  pull date
  prompt 'Enter longitude --> '
  pull hilon
  prompt 'Enter latitude --> '
  pull hilat
  prompt 'Metric units? [y/n] --> '
  pull metric
  if (metric='n' | metric='N') ; units='e' ; endif
else 
  date  = subwrd(args,1)
  hilon = subwrd(args,2)
  hilat = subwrd(args,3)
  units = subwrd(args,4)
endif

* Open the AVN data file
'reinit'
_baseurl = 'http://cola8.iges.org:9090/dods/'
_dataset = 'avn'%date
'sdfopen '_baseurl%_dataset

* Get info from the descriptor file
'q ctlinfo'
_ctl = result
_undef = getctl(undef)
_tdef = getctl(tdef)
_zdef = getctl(zdef)

* Get the Time axis info
tsize = subwrd(_tdef,2)
'set t 1 'tsize
'q dims'
times  = sublin(result,5)
_t1 = subwrd(times,6)  
_t2 = subwrd(times,8)
_tdim = _t1':'_t2

* Get Vertical grid info
zsize = subwrd(_zdef,2)
z = 1
zlevs = ''
while (z <= zsize)
  'set z 'z
  lev = subwrd(result,4)
  zlevs = zlevs%lev%' '
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
'd ave(ps.1,t=1,t=19)*0.01-15.0'
data = sublin(result,2)
mmm = subwrd(data,4)
meanps = math_nint(mmm)
cnt = 1
while (cnt<5)
  el1 = subwrd(zlevs,cnt)
  el2 = subwrd(zlevs,cnt+1)
  if (meanps > el2)
    elb = el1
    elt = subwrd(zlevs,cnt+5)
    break
  endif
  cnt=cnt+1
endwhile
if (elt < 300) ; elt = 300 ; endif
_zbot = elb
_ztop = elt
_zgrd = _zbot':'_ztop
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

* Get the Z,T grids for the upper air variables
getgrid(rh,rhum)
getgrid(t,t)
getgrid(u,u)
getgrid(v,v) 
getgrid('z',hgt) 

* Set up a few preliminary characteristics
setcols(1)
'set display color white'
'c'

* Set the Plot Area for the Upper Air Panel
'set parea 1.2 8.15 7.2 10.0'
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
'set t 0.5 19.5'
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

* Define Thicknesses
'set lev 1000'
'set t 1 19'
getseries('z',hgt,1000)
getseries('z',z5,500)
getseries('z',z10,1000)
getseries('z',z7,700)
getseries('z',z8,850)
'define thk1 = (z5-z10)/10'
'define thk2 = (z7-z8)/10'

* Next Panel: 1000-500 thickness
'set parea 1.2 8.15 6.6 7.2'
'set gxout line'
'set vpage off'
'set grads off'
'set grid on'
'set xlab on'
'set ylab on'
vrng(thk1, thk1)
'set ccolor 5'
'set cmark 4'
'set t 0.5 19.5'
'd thk1'
'set line 0'
'draw recf 0.7 5.0 8.5 6.56'
'draw recf 0.5 10.52 1.95 11.0'

* Next Panel: 850-700 thickness
'set parea 1.2 8.15 6.0 6.6'
'set vpage off'
'set grads off'
'set grid on'
vrng(thk2, thk2)
'set ccolor 26'
'set cmark 7'
'set t 0.5 19.5'
'd thk2'
'draw recf 0.7 4.5 8.5 5.95'

* Next Panel: Stability Indices
'set t 1 19'
'set lev 1000'
'define rh8 = rhum(lev=850)'
'define t8 = t(lev=850)'
'define t5 = t(lev=500)'
'set parea 1.2 8.15 5.2 6.0'
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
'set t 0.5 19.5'
'd (toto-40+abs(toto-40))*0.5+40'
'set grid off'
'set ccolor 7'
'd (toto-40-abs(toto-40))*0.5+40'
'draw recf 0.7 5.1 1.18 5.96'

* Draw Total-Totals Y-axis Legend
'draw recf 0.7 4.0 8.5 5.2'
'set strsiz 0.08 0.12'
'set string 15 r 4 0'; 'draw string 1.1 5.6   40'
'set string 7 r 4 0' ; 'draw string 1.1 5.333 20'
'set string 7 r 4 0' ; 'draw string 1.1 5.467 30'
'set string 8 r 4 0' ; 'draw string 1.1 5.733 50'
'set string 8 r 4 0' ; 'draw string 1.1 5.867 60'

* Next Panel: SLP
getseries(slp,slp,1000)
'define slp = slp*0.01'
'set parea 1.2 8.15 4.6 5.2'
'set vpage off'
'set lon 'hilon
'set lat 'hilat
'set grid on'
'set gxout contour'
vrng(slp,slp)
'set ccolor 11'
'set cmark 0'
'set t 0.5 19.5'
'd slp'
'set line 0'
'draw recf 0.7 3.5 8.5 4.60'

* Next Panel: Wind Speed, 0-30mb 
getseries(bu,bu,1000)
getseries(bv,bv,1000)
'set parea 1.2 8.15 4.0 4.6'
'set vpage off'
'set grads off'
if (units = 'e')
  'define bu = 2.2374*bu'
  'define bv = 2.2374*bv'
endif
'define wind = mag(bu,bv)'
vrng(wind,wind)
'set ccolor 26'
'set cmark 7'
'set grid on'
'set t 0.5 19.5'
'set gxout contour'
'd wind'
'draw recf 0.7 2.8 8.5 4.0'

* Next Panel: Min & Max Temperatures and Indices
getseries(rh2,rh2m,1000)
getseries(t2max,t2max,1000)
getseries(t2min,t2min,1000)
getseries(t2,t2m,1000)
'set parea 1.2 8.15 3.0 4.0'
'set vpage off'
'set frame on'
'set grads off'
'set ylab on'
'set gxout line'
'set grid off'
if (units = 'e')
*  'define tmax = const((t2max-273.16)*9/5+32,0,-u)'
  'define tmax = (t2max-273.16)*9/5+32'
  'define tmin = (t2min-273.16)*9/5+32'
  'define t2m  = const((t2m-273.16)*9/5+32,0,-u)'
  'define chill = (0.0817*(3.71*(SQRT(wind))+5.81-0.25*wind)*(t2m-91.4))+91.4'
  'define hindx = 0.01*rh2m*pow(0.01918*t2m-1.124,2)+0.7628*t2m+11.26'
else
  'define tmax = t2max-273.16'
  'define tmin = t2min-273.16'
  'define t2m  = const((t2m-273.16),0,-u)'
  'define chill = (0.0817*(3.71*(SQRT(wind*2.2734))+5.81-0.25*wind)*((t2m*1.8+32)-91.4))+91.4'
  'define chill = (chill-32)*5/9'
  'define hindx = 0.01*rh2m*pow(0.01918*(t2m*1.8+32)-1.124,2)+0.7628*(t2m*1.8+32)+11.26'
  'define hindx = (hindx-32)*5/9'
endif
vrng(tmax,chill)
if (units = 'e')
  'define chill = const(maskout(chill,32-chill),-100,-u)'
  'define hindx = const(maskout(hindx,hindx-75),200,-u)'
else
  'define chill = const(maskout(chill,-chill),-100,-u)'
  'define hindx = const(maskout(hindx,hindx-25),200,-u)'
endif
'set t 0.5 19.5'
if (units = 'e')
  'set ylint 10'
  'set gxout linefill'
  'set lfcols  9 0' ; 'd maskout(tmax,1/(tmax-tmin));const(tmax,-60,-a)'
  'set lfcols  9 0' ; 'd maskout(tmax,1/(tmax-tmin));const(tmax,-60,-a)'
  'set lfcols 14 0' ; 'd maskout(tmax,1/(tmax-tmin));const(tmax,-10,-a)'
  'set lfcols  4 0' ; 'd maskout(tmax,1/(tmax-tmin));const(tmax,0,-a)'
  'set lfcols 11 0' ; 'd maskout(tmax,1/(tmax-tmin));const(tmax,10,-a)'
  'set lfcols  5 0' ; 'd maskout(tmax,1/(tmax-tmin));const(tmax,20,-a)'
  'set lfcols 13 0' ; 'd maskout(tmax,1/(tmax-tmin));const(tmax,30,-a)'
  'set lfcols  3 0' ; 'd maskout(tmax,1/(tmax-tmin));const(tmax,40,-a)'
  'set lfcols 10 0' ; 'd maskout(tmax,1/(tmax-tmin));const(tmax,50,-a)'
  'set lfcols  7 0' ; 'd maskout(tmax,1/(tmax-tmin));const(tmax,60,-a)'
  'set lfcols 12 0' ; 'd maskout(tmax,1/(tmax-tmin));const(tmax,70,-a)'
  'set lfcols  8 0' ; 'd maskout(tmax,1/(tmax-tmin));const(tmax,80,-a)'
  'set lfcols  2 0' ; 'd maskout(tmax,1/(tmax-tmin));const(tmax,90,-a)'
  'set lfcols  6 0' ; 'd maskout(tmax,1/(tmax-tmin));const(tmax,100,-a)'
  'set lfcols  0 0' ; 'd maskout(tmin,1/(tmax-tmin));const(tmax,-60,-a)'
  'set gxout line'
  'set ccolor 15'
  'set cstyle 3'
  'set cmark 0'
  'd maskout(tmax,1/(tmax-tmin))'
else
  'set ylint 5'
  'set gxout linefill'
  'set lfcols  9 0' ; 'd maskout(tmax,1/(tmax-tmin));const(tmax,-60,-a)'
  'set lfcols 14 0' ; 'd maskout(tmax,1/(tmax-tmin));const(tmax,-25,-a)'
  'set lfcols  4 0' ; 'd maskout(tmax,1/(tmax-tmin));const(tmax,-20,-a)'
  'set lfcols 11 0' ; 'd maskout(tmax,1/(tmax-tmin));const(tmax,-15,-a)'
  'set lfcols  5 0' ; 'd maskout(tmax,1/(tmax-tmin));const(tmax,-10,-a)'
  'set lfcols 13 0' ; 'd maskout(tmax,1/(tmax-tmin));const(tmax,-5,-a)'
  'set lfcols  3 0' ; 'd maskout(tmax,1/(tmax-tmin));const(tmax,0,-a)'
  'set lfcols 10 0' ; 'd maskout(tmax,1/(tmax-tmin));const(tmax,5,-a)'
  'set lfcols  7 0' ; 'd maskout(tmax,1/(tmax-tmin));const(tmax,10,-a)'
  'set lfcols 12 0' ; 'd maskout(tmax,1/(tmax-tmin));const(tmax,15,-a)'
  'set lfcols  8 0' ; 'd maskout(tmax,1/(tmax-tmin));const(tmax,20,-a)'
  'set lfcols  2 0' ; 'd maskout(tmax,1/(tmax-tmin));const(tmax,25,-a)'
  'set lfcols  6 0' ; 'd maskout(tmax,1/(tmax-tmin));const(tmax,30,-a)'
  'set lfcols  0 0' ; 'd maskout(tmin,1/(tmax-tmin));const(tmax,-60,-a)'
  'set gxout line'
  'set ccolor 15'
  'set cstyle 3'
  'set cmark 0'
  'd maskout(tmax,1/(tmax-tmin))'
endif
'set grid on'
'set cmark 8'
'set ccolor 2'
'd maskout(tmax,1/(tmax-tmin))'
'set grid off'
'set cmark 2'
'set ccolor 4'
'd maskout(tmin,1/(tmax-tmin))'
'set cstyle 0'
'set ccolor 30'
'set cmark 1'
'd hindx'
'set cstyle 0'
'set ccolor 31'
'set cmark 1'
'd chill'
'draw recf 0.7 1.8 8.5 3.0'
'draw recf 0.1 1.8 2.0 2.9'

* Back up to Previous Panel: Wind Barbs, 0-30mb
'set ccolor 1'
lap1 = hilat + 0.1
lam1 = hilat - 0.1
'set lat 'lam1' 'lap1
'set parea 1.2 8.15 3.8 4.8'
'set frame off'
'set grid off'
'set gxout barb'
'set xyrev on'
'set xlab off'
'set ylab off'
if (units = 'e')
  'd 2.2374*bu.1;2.2374*bv.1'
else
  'd bu.1;bv.1'
endif

'set lat 'hilat
'set lon 'hilon
'set vpage off'
'set frame on'
'set grads off'
'set ylab on'
'set xlab on'
'set gxout line'
'set grid off'

* Next Panel: 2m Relative Humidity
'set parea 1.2 8.15 2.2 3.0'
'set vpage off'
'set grads off'
rh2vrng(rh2m)
'set gxout linefill'
'set lfcols 20 0' ; 'd rh2m;const(rh2m,30.01,-a)'
'set lfcols 21 0' ; 'd rh2m;const(rh2m,40.01,-a)'
'set lfcols 22 0' ; 'd rh2m;const(rh2m,50.01,-a)'
'set lfcols 23 0' ; 'd rh2m;const(rh2m,60.01,-a)'
'set lfcols 24 0' ; 'd rh2m;const(rh2m,70.01,-a)'
'set lfcols 25 0' ; 'd rh2m;const(rh2m,80.01,-a)'
'set lfcols 26 0' ; 'd rh2m;const(rh2m,90.01,-a)'
'set ccolor 26'
'set gxout line'
'set grid on'
'set cmark 2'
'd rh2m'
'draw recf 1.1 0.8 8.5 2.2'
'draw recf 0.1 0.8 2.0 2.18'

* Final Panel: Precipitation
getseries(p,p,1000)
getseries(pc,pc,1000)
'set parea 1.2 8.15 0.8 2.2'
'set vpage off'
'set grid on'
'set grads off'
'define ptot  = 0.5*(p+abs(p))'
'define pconv = 0.5*(pc+abs(pc))'
if (units = 'e')
  'define ptot  = const(ptot,0,-u)/25.4'
  'define pconv = const(pconv,0,-u)/25.4'
else
  'define ptot  = const(ptot,0,-u)'
  'define pconv = const(pconv,0,-u)'
endif

* Total Precipitation
'set gxout stat'
'd ptot'
data = sublin(result,8)
pmx = subwrd(data,5)
pmx = pmx + (0.03*pmx)
if (pmx = 0) ; pmx = 1 ; endif
'set vrange 0 'pmx
incr = 0.01 * (math_nint(100*pmx/5))
'set ylint 'incr
'set gxout bar'
'set barbase 0'
'set bargap 50'
'set ccolor 42'
'set t 0.5 19.5'
'd ptot'

* Convective Precipitation
'set gxout bar'
'set bargap 80'
'set ccolor 2'
'd pconv'

* Draw all the Y-axis labels
'set string 8 c 4 90' ; 'draw string 0.4 5.6 Total-totals'
'set string 8 c 4 90' ; 'draw string 0.6 5.6 Index'
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
  'set string 1 c 4 90'
  'draw string 0.5 9.53 Wind (mph)'
  'draw string 0.75 4.3 (mph)'
  'draw string 0.75 3.50 (F)'
  'draw string 0.55 1.50 (inches liquid)'
else
  'set string 2 l 4 90' ; 'draw string 0.5 8.79 (C)'
  'set string 1 c 4 90'
  'draw string 0.5 9.53 Wind (m/s)'
  'draw string 0.75 4.3 (m/s)'
  'draw string 0.75 3.50 (C)'
  'draw string 0.55 1.50 (mm liquid)'
endif
'draw string 0.75 8.63 `1m i l l i b a r s'
'set strsiz 0.08 0.12'
'set string 1 c 4 90'
'draw string 0.3 4.9 SLP'
'draw string 0.65 4.9 (mb)'
'set string  1 c 4 90' ; 'draw string 0.3 6.6 Thickness'
'draw string 0.74 6.9 (dm)'
'draw string 0.74 6.3 (dm)'
'set string  5 c 4 90' ; 'draw string 0.5 7.0 1000-500'
'set string 26 c 4 90' ; 'draw string 0.5 6.3 700-850'
'set string 26 c 4 90' ; 'draw string 0.15 4.3 0-30mb'
'set string 26 c 4 90' ; 'draw string 0.35 4.3 Wind Spd'
'set string  1 c 4 90' ; 'draw string 0.55 4.3 & Barbs'
'set string  4 c 4 90' ; 'draw string 0.15 3.75 Tmin, '
'set string  2 c 4 90' ; 'draw string 0.15 3.3 Tmax, '
'set string 31 c 4 90' ; 'draw string 0.35 3.5 Wind Chill &'
'set string 30 c 4 90' ; 'draw string 0.55 3.5 Heat Index'
'set string 26 c 4 90' ; 'draw string 0.35 2.6 2m RH'
'set string  1 c 4 90' ; 'draw string 0.75 2.6 (%)'
'set string  1 c 4 90' ; 'draw string 0.15 1.5 6-hr Precipitation'
'set string 42 l 4 90' ; 'draw string 0.35 0.9 Total'
'set string  1 c 4 90' ; 'draw string 0.35 1.3 &'
'set string  2 r 4 90' ; 'draw string 0.35 2.1 Convective'


* Draw Labels at the top of the page
'set string 1 c 6 0'
'set strsiz 0.18 0.20'
label = 'AVN Forecast Meteogram for '
label = label%'('hilat
if (hilat < 0) ; label = label%S ; endif
if (hilat > 0) ; label = label%N ; endif
if (hilon < 0)  ; label = label%', 'hilon*(-1.0)'W)' ; endif
if (hilon >= 0) ; label = label%', 'hilon'E)' ; endif
'draw string 4.675 10.75 'label

'set line 0'
'draw recf 0.5 0 1.95 0.28'

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
'set rgb 26   0 190   0'
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
incr = math_nint((ymx-ymn)/2.2)
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
if (ymn < 30) 
  miny = 20 
  'set ylevs 30 50 70 90'
endif
if (ymn >= 30 & ymn < 40) 
  miny = 30 
  'set ylevs 50  70  90'
endif
if (ymn >= 40 & ymn < 50) 
  miny = 40 
  'set ylevs 50 60 70 80 90'
endif
if (ymn >= 50) 
  miny = 50
  'set ylevs 60 70 80 90'
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
'set lon 1'
'set lat 1'
'set lev '_zbot' '_ztop
'set time '_t1' '_t2

* Write the variable to a file
'set gxout fwrite'
'set fwrite dummy.dat'
'd result.'file
'disable fwrite'
'close 'file

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
function getseries(dodsvar,myvar,level)
'sdfopen '_baseurl'_expr_{'_dataset'}{'dodsvar'}{'_xdim','_ydim','level':'level','_tdim'}'
line = sublin(result,4)
file = subwrd(line,8)
'set lon 1'
'set lat 1'
'set lev 'level
'set time '_t1' '_t2

* Write the variable to a file
'disable fwrite'
'set fwrite dummy.dat'
'set gxout fwrite'
'd result.'file
'disable fwrite'
'close 'file

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
rc = close (dummy.ctl)

* Open the dummy file, define variable, close dummy file
'open dummy.ctl'
line = sublin(result,2)
dummyfile = subwrd(line,8)
'define 'myvar' = dummy.'dummyfile
'close 'dummyfile
'set gxout contour'
return

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
function getseriesslow(dodsvar,myvar,level)
'sdfopen '_baseurl'_expr_{'_dataset'}{'dodsvar'}{'_xdim','_ydim','level':'level','_tdim'}'
line = sublin(result,4)
file = subwrd(line,8)
'set lon 1'
'set lat 1'
'set lev 1'
'set time '_t1' '_t2
'define 'myvar' = result.'file
return

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
function getgridslow(dodsvar,myvar)
'sdfopen '_baseurl'_expr_{'_dataset'}{'dodsvar'}{'_xdim','_ydim','_zgrd','_tdim'}'
line = sublin(result,4)
file = subwrd(line,8)
'set lon 1'
'set lat 1'
'set lev '_zbot' '_ztop
'set time '_t1' '_t2
'define 'myvar' = result.'file
return

