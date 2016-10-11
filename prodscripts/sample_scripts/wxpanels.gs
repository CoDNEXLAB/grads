* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
* wxpanels.gs
*
* This script will draw six panels of weather forecast images:
* 1st panel: 500mb HEIGHTS & VORTICITY
* 2nd panel: SLP & 1000-500MB THICKNESS
* 3rd panel: 700MB VERTICAL VELOCITY & PRECIPITATION
* 4th panel: 850MB TEMPERATURE, HUMIDITY, & WIND
* 5th panel: 200MB STREAMLINES & ISOTACHS
* 6th panel: CAPE & PRECIPITABLE WATER
*
* Usage: wxpanels <model> <yyyymmddhh> <Tindex> <lon1> <lon2> <lat1> <lat2> <proj>
*
* Examples: 
* ga-> wxpanels eta 2003053000  a -120 -70  23 56 nps     
* ga-> wxpanels eta 2003053000  2 -137 -75  23 73 nps
* ga-> wxpanels gfs 2003053000  5  -25  75 -40 25
* ga-> wxpanels gfs 2003053000  9   63  97   5 35
* ga-> wxpanels gfs 2003053000 13   92 151  18 68 nps
* ga-> wxpanels gfs 2003053000 17  -17  46  28 70 nps
* ga-> wxpanels gfs 2003053000 21  118 170 -49 -9 sps     
* ga-> wxpanels gfs 2003053000 25 -120 -10 -58 13

* Notes:
* 0. You MUST be using a DODS-enabled version of GrADS.
* 1. If no arguments are given, the script will prompt you for values.
* 2. The date string (yyyymmddhh) is the initialization time.
* 3. Set <Tindex> to "A" or "a" to get the analysis at the time given.
*    The analysis time series begin on July 1st, 2002.
* 4. Set <Tindex> to an integer "n" to get the nth time step into the forecast.
*    The ETA forecast hour increment is 3hrs, for GFS it is 6hrs.
*    A <Tindex> of 1 gives the analysis. 
* 5. If no argument is given for <proj>, the default will be lat/lon. 
* 6. If you use polar stereographic projections, then the lon/lat
*    extremes you provide will be the arguments for 'set mpvals'
* 7. The data is available through the GrADS-DODS Server at COLA.
*    Check the GDS URL http://monsoondata.org:9090/dods 
*    for a complete listing of all available forecast times. 
*
* Originally written by Paul Dirmeyer
* Modified by J.M. Adams May 2003
*
function wxpanels (args)
'reinit'
* These are some customization flags 
pause = 1     ;* pause between drawing each panel
print = 0     ;* print a gif of each panel
_barbs=1      ;* Draw 850mb wind barbs
_stream=0     ;* Draw 850mb streamlines

if (args!='') 
  model = subwrd(args,1)
  date  = subwrd(args,2)
 _tindx = subwrd(args,3)
  lonw  = subwrd(args,4)
  lone  = subwrd(args,5)
  lats  = subwrd(args,6)
  latn  = subwrd(args,7)
  proj  = subwrd(args,8)
  if (model='eta' | model='ETA' | model='gfs' model='GFS'); gotmodel=1; endif
  if (lonw<lone); gotlons=1; endif
  if (lats<latn); gotlats=1; endif
  if (_tindx='a' | _tindx='A')
    _type = a; gottype=1;
  else 
    _type = f; gottype=1;
  endif
  gotdate=1
else 
  gotmodel=0
  gottype=0
  gotdate=0
  gotlons=0
  gotlats=0
endif

* GET THE FORECAST MODEL AND INITIALIZATION DATE
while (!gotmodel)
  say ''
  prompt 'Enter forecast model [eta|gfs] => '
  pull model
  if (model='eta' | model='ETA' | model='gfs' | model='GFS')
    if (model='ETA'); model='eta'; endif
    if (model='GFS'); model='gfs'; endif
    gotmodel=1
  endif
endwhile
if (!gottype)
  prompt 'Do you want an analysis or a forecast? [a|f] => '
  pull _type
  if (_type='f' | _type='F' | _type='a' | _type='A'); gottype=1; endif
endif
if (!gotdate)
  if (_type='f' | _type='F') 
    prompt 'Enter forecast initialization time [yyyymmddhh] => '
    pull date
  endif
endif

* OPEN THE DATA FILE
if (_type='f' | _type='F') 
  dataset = 'http://monsoondata.org:9090/dods/'model'/'model'.'date
endif
'sdfopen 'dataset
check1 = sublin(result,2)
check2 = subwrd(check1,1)
if (check2 != 'Found') 
  return
endif

* SET THE FORECAST HOUR VARIABLES
if (model='eta') 
  _mtype = 'ETA'
  _fhr = '00 03 06 09 12 15 18 21 24 27 30 33 36 39 42 '
  _fhr = _fhr%'45 48 51 54 57 60 3 66 69 72 75 78 81 84'
  _dt = 3
endif
if (model='gfs')
  _mtype = 'GFS'
  _fhr = '00 06 12 18 24 30 36 42 48 54 60 66 72 78 84 '
  _frh = _fhr%'90 96 102 108 114 120 126 132 138 144'
  _dt = 6
endif

* GET THE TIME INDEX
say ''
if (_type='f' | _type='F') 
  while (!gotdate) 
    'set t 1 last'
    'q dims'
    tdims = sublin(result,5)
    tlast = subwrd(tdims,13)
    'q time'
    time1 = subwrd(result,3)
    time2 = subwrd(result,5)
    prompt 'Valid times range from 'time1' (T=1) to 'time2' (T='tlast'). Enter a T value => '
    pull _tindx
    if (_tindx>0 & _tindx<= tlast)
      gotdate=1
    endif
  endwhile
  'set t '_tindx
endif
if (_type='a' | _type='a') 
  year = substr(date,1,4)
  mon  = substr(date,5,2)
  day  = substr(date,7,2)
  hr   = substr(date,9,2)
  months = 'jan feb mar apr may jun jul aug sep oct nov dec'
  month = subwrd(months,mon)
  'set time 'hr'Z'day%month%year
endif

* GET LONGITUDE RANGE
while (!gotlons) 
  'q file 1'
  dims = sublin(result,5)
  xlast = subwrd(dims,3)
  'set x 1 'xlast
  minlon = subwrd(result,4)
  maxlon = subwrd(result,5)
  prompt 'Enter a min and max longitude (between 'minlon' and 'maxlon') => '
  pull lonargs
  lonw = subwrd(lonargs,1)
  lone = subwrd(lonargs,2)
  if (lonw!='' & lone!='')
    if (lonw<lone & lonw>=minlon & lone<=maxlon)
      gotlons=1
    endif
  endif
endwhile

* GET LATITUDE RANGE
while (!gotlats) 
  'q file 1'
  dims = sublin(result,5)
  ylast = subwrd(dims,6)
  'set y 1 'ylast
  minlat = subwrd(result,4)
  maxlat = subwrd(result,5)
  prompt 'Enter a min and max latitude (between 'minlat' and 'maxlat') => '
  pull latargs
  lats = subwrd(latargs,1)
  latn = subwrd(latargs,2)
  if (lats!='' & latn!='')
    if (lats<latn & lats>=minlat & latn<=maxlat)
      gotlats=1
    endif
  endif
endwhile


* SET LAT/LON DOMAIN AND MAP PROJECTION
if (proj='nps' | proj='NPS' | proj='sps' | proj='SPS')
  'set lon 'lonw-55' 'lone+55
  'set lat 'lats-10' 'latn+10
  'set mpvals 'lonw' 'lone' 'lats' 'latn
  if (proj='sps' | proj='SPS'); 'set mproj sps'; endif
  if (proj='nps' | proj='NPS'); 'set mproj nps'; endif
else
  'set mproj latlon'
  'set lon 'lonw' 'lone
  'set lat 'lats' 'latn
endif

* UNIVERSAL GRAPHICS SETTINGS
setcolors()
'set csmooth on'
'set display color white'
'set grid off'
'set mpdset mres'
'set parea 0 10.98 0.37 8.5'
'set vpage off'
'set xlab off'
'set ylab off'
'clear'

* DRAW THE PANELS
* FIRST PANEL: 500mb HEIGHTS & VORTICITY
panel1()
  if (print); 'printim panel1.png'; endif
  if (pause)
    prompt "Hit <Return> for panel 2 "
    pull nothing
  endif
  'clear'
* SECOND PANEL: SLP & 1000-500MB THICKNESS
panel2()
  if (print); 'printim panel2.png'; endif
  if (pause)
    prompt "Hit <Return> for panel 3 "
    pull nothing
  endif
  'clear'
* THIRD PANEL: 700MB VERTICAL VELOCITY & PRECIPITATION
panel3()
  if (print); 'printim panel3.png'; endif
  if (pause)
    prompt "Hit <Return> for panel 4 "
    pull nothing
  endif
  'clear'
* FOURTH PANEL: 850MB TEMPERATURE, HUMIDITY, & WIND
panel4()
  if (print); 'printim panel4.png'; endif
  if (pause)
    prompt "Hit <Return> for panel 5 "
    pull nothing
  endif
  'clear'
* FIFTH PANEL: 200MB STREAMLINES & ISOTACHS
panel5()
  if (print); 'printim panel5.png'; endif
  if (pause)
    prompt "Hit <Return> for panel 6 "
    pull nothing
  endif
  'clear'
* SIXTH PANEL: CAPE & PRECIPITABLE WATER
panel6()
  if (print); 'printim panel6.png'; endif



******* END OF MAIN SCRIPT ************


* * * * * * * * * * * * * * * * * * * * * * * * * *
*  Function to reformat the GrADS date/time 
function mydate
  'query time'
  sres = subwrd(result,3)
  wday = subwrd(result,6)
  i = 1
  while (substr(sres,i,1)!='Z')
    i = i + 1
  endwhile
  hour = substr(sres,1,i)
  isav = i
  i = i + 1
  while (substr(sres,i,1)>='0' & substr(sres,i,1)<='9')
    i = i + 1
  endwhile
  day = substr(sres,isav+1,i-isav-1)
  month = substr(sres,i,3)
  year = substr(sres,i+3,4)
  return (hour' 'wday' 'day' 'month', 'year)

* * * * * * * * * * * * * * * * * * * * * * * * * *
function setcolors
'set rgb 31 42 0 85'
'set rgb 32 85 0 170'
'set rgb 33 85 42 170'
'set rgb 34 127 85 170'
'set rgb 35 170 127 255'
'set rgb 36 213 170 255'
'set rgb 37 255 213 255'

'set rgb 21 0 100 0'
'set rgb 22 0 125 0'
'set rgb 23 20 150 20'
'set rgb 24 70 175 70'
'set rgb 25 110 200 110'
'set rgb 26 150 225 150'
'set rgb 27 190 250 190'

'set rgb 24 61 152 152'
'set rgb 25 95 194 170'
'set rgb 26 139 222 181'
'set rgb 27 190 255 190'

'set rgb 24 44 112 112'
'set rgb 25 71 184 156'
'set rgb 26 150 225 180'
'set rgb 27 190 255 190'

* These are blue shades for the isotachs and vorticity
'set rgb 40   0   0 140'
'set rgb 41  20  20 170'
'set rgb 42  70  70 190'
'set rgb 43 110 110 210'
'set rgb 44 150 150 230'
'set rgb 45 190 190 250'

'set rgb 51 127 0 0 '
'set rgb 50 170 0 0'
'set rgb 49 213 42 0' 
'set rgb 48 213 127 85'
'set rgb 47 255 170 170'
'set rgb 46 255 213 170'

'set rgb 51 130 0 0 '
'set rgb 50 170 20 20 '
'set rgb 49 190 70 70'
'set rgb 48 210 110 110 '
'set rgb 47 230 150 150'
'set rgb 46 255 190 190'

* These are for RH shades
'set rgb 60 155 205 155'
'set rgb 52 165 210 165'
'set rgb 53 175 215 175'
'set rgb 54 185 220 185'
'set rgb 55 195 225 195'
'set rgb 56 205 230 205'
'set rgb 57 215 235 215'
'set rgb 58 225 240 225'
'set rgb 59 235 245 235'

* These are for CAPE shades
'set rgb 61 100  60   0'; 'set rgb 61 162 138 101'
'set rgb 62 125  95   0'; 'set rgb 62 185 161 104'
*'set rgb 63 160 140  20'; 'set rgb 63 192 168 105'
'set rgb 64 195 165  70'; 'set rgb 64 207 183 107'
'set rgb 65 230 200 110'; 'set rgb 65 235 211 139'
'set rgb 66 255 225 150'; 'set rgb 66 255 231 171'

* These are for bright precip shades (from NCEP)
'set rgb 67   0 236 236'
'set rgb 68   1 160 246'
'set rgb 69   0   0 246'
'set rgb 70   0 255   0'
'set rgb 71   0 200   0'
'set rgb 72   0 144   0'
'set rgb 73 255 255   0'
'set rgb 74 231 192   0'
'set rgb 75 255 144   0'
'set rgb 76 255   0   0'
'set rgb 77 214   0   0'
'set rgb 78 192   0   0'
'set rgb 79 255   0 255'
'set rgb 80 153  85 201'

'set rgb 90 213 213 213'
'set rgb 91 127 127 127'
'set rgb 92 213 255 255'
'set rgb 93 255 213 255'
'set rgb 94  80  80  80'

'set rgb 99 255 255 254'
'set rgb 98 1   1   1'


* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Draws a fan-shaped color bar in the upper right corner
function carc(xc,yc)
* aa = scaling factor for the color arc
* rt = radius for text
* ro = outer radius of colors
* ri = inner radius of colors
aa = 2.00
rt = 0.59 * aa
ro = 0.575 * aa
ri = 0.30 * aa
xa = xc + 0.05
ya = yc + 0.05

* read the shading and contour info from _shades
ll = 1
data = sublin(_shades,1)
ll = subwrd(data,5)
mm = 1
while (mm <= ll)
  mmp1 = mm + 1
  data = sublin(_shades,mmp1)
  col.mm = subwrd(data,1)
  if (col.mm = 0)
    col.mm = 99
  endif
  lim.mm = subwrd(data,3)
  if (lim.mm = '>')
    lim.mm = ' '
    break
  endif
  mm = mm + 1
endwhile

* dd = amount of arc for colors to subtend (90deg)
* id = position on unit circle at which to start (270deg or bottom)
dd = 3.1415926*0.5/ll
id = 3.1415926*1.50

* Chop off the corner
'set line 99 1 12'
x1 = xc - aa
xe = xc + 0.03
y1 = yc - aa
'draw polyf 'x1-0.01' 'yc+0.01' 'xe' 'yc+0.1' 'xe' 'y1
'set line 1 1 6'
'draw line 'x1' 'yc' 'xc' 'y1

* calculate starting points
'd 'ro'*cos('id')'
xfo = subwrd(result,4) + xa
'd 'ro'*sin('id')'
yfo = subwrd(result,4) + ya
'd 'ri'*cos('id')'
xfi = subwrd(result,4) + xa
'd 'ri'*sin('id')'
yfi = subwrd(result,4) + ya
mm = 1 


* For each color, calculate new points for 
* color fills and text
while(mm<=ll)    
  id = id - dd
  'd 'ro'*cos('id')'
  xlo = subwrd(result,4) + xa
  'd 'ro'*sin('id')'
  ylo = subwrd(result,4) + ya
  'd 'ri'*cos('id')'
  xli = subwrd(result,4) + xa
  'd 'ri'*sin('id')'
  yli = subwrd(result,4) + ya
  'd 'rt'*cos('id')'
  xft = subwrd(result,4) + xa
  'd 'rt'*sin('id')'
  yft = subwrd(result,4) + ya
 
  did = id * 180 / 3.14159 - 180

* Draw next color wedge and contour value
  'set line 'col.mm' 1 3'
  'draw polyf 'xfi' 'yfi' 'xfo' 'yfo' 'xlo' 'ylo' 'xli' 'yli
  'set line 99'
  'draw line 'xfi' 'yfi' 'xfo' 'yfo
  'set string 1 r 4 'did
  'set strsiz 0.08 0.11'
  if (subwrd(lim.mm,1) != '')
    'draw string 'xft' 'yft' 'lim.mm
  endif
  xfo = xlo
  yfo = ylo
  xfi = xli
  yfi = yli
  mm = mm + 1
endwhile
'set string 1 l 4 0'
return
  
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Finds the corners of each plot, used for annotations
function getcorners
'q gxinfo'
xlimits=sublin(result,3)
ylimits=sublin(result,4)
_xleft  = subwrd(xlimits,4)
_xright = subwrd(xlimits,6)
_ybot   = subwrd(ylimits,4)
_ytop   = subwrd(ylimits,6)

* * * * * * * * * * * * * * * * * * * * * * * * * *
* Draws grid lines at specified intervals
function gridlines(lonincr,latincr)
'set rgb 97 150 150 150'
'set gxout contour'
'set ccolor 97'
'set cint 'lonincr
'set cmin -175'
'set cmax 180'
'set clab off'
'set cstyle 5'
'set cthick 1'
'd lon'
'set ccolor 97'
'set clab off'
'set cmin -75'
'set cmax 75'
'set cint 'latincr
'set cstyle 5'
'set cthick 1'
'd lat'

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Draws the Valid time and title at the bottom of the panel
function titlebar (title)
'set background 0'
'set line 91' ; 'draw recf 0.075 0.025 10.975 0.325'
'set line 90' ; 'draw recf 0.050 0.050 10.950 0.350'
'set strsiz 0.11 0.18'
'set string 1 l 1'
if (_tindx = 1 | _type='a' | _type='A')
  'draw string 0.1 0.2 `5Analysis: 'mydate()
  'set string 1 r 1'
  'draw string 10.9 0.2 `5'title
else
  'draw string 0.1 0.2 `5'subwrd(_fhr,_tindx)'Hr '_mtype' Valid: 'mydate()
  'set string 1 r 1'
  'draw string 10.9 0.2 `5'title
endif
'set strsiz 0.08 0.10'
'set string 1 bl'
'draw string '_xleft+0.05' '_ybot+0.07' GrADS: COLA/IGES'


* * * * * * * * * * * * * * * * * * * * * * * * * *
* FIRST PANEL: 500mb HEIGHTS & VORTICITY
function panel1
* shaded contours of vorticity 
'set lev 500'
'define vort = hcurl(u,v)*1e5'
'set mpdraw on'
'set gxout shaded'
'set clevs -12 -10 -8 -6 -4 -2 2  4  6  8 10 12'
'set ccols 40 41 42  43  44 45 0 46 47 48 49 50 51'
'set grads off'
'set map 0 1 6'
'set map 15 1 1'
'd vort'
'q shades'
_shades = result
'set gxout contour'
'set cint 2'
'set background 91'
'set ccolor 99'
'set clab off'
'set black -1 1'
'set grads off'
'd vort'

* Draw the 500 mb heights
'set map 15 1 1'
'set rbcols auto'
'set background 99'
'set ccolor 1'
'set clab on'
'set clab `2%g'
'set grads off'
'd z(lev=500)/10'
'set map 94 1 1'; 'draw map'

* Annotate the plot with color bar and text labels
getcorners()
gridlines(10,5)
carc(_xright,_ytop)
titlebar('500mb Geopotential Heights `2(dam), `5Vorticity`2 (1e-5/sec)')

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
* SECOND PANEL: SLP & 1000-500MB THICKNESS
function panel2
'define myslp = slp/100'
* Draw the SLP contours
'set grads off'
'set ccolor 94'
'set gxout contour'
'set cint 4'
'set cthick 12'
'set clab off'
'd myslp-1000'
'set grads off'
'set ccolor rainbow'
'set background 1'
'set cint 2'
'set cthick 3'
'd myslp-1000'
'set clab on'
'set cint 4'
'set cmin 0'
'set ccolor rainbow'
'set clab %02.0f'
'd myslp-1000'
'set cint 4'
'set grads off'
'set ccolor rainbow'
'set cmax 99'
'set clab %02.0f'
'd myslp-900'

* Draw the thickness contours
'define thickness = (z(lev=500)-z(lev=1000))/10'
'set clab on'
'set background 99'
'set ccolor 1'
'set cstyle 1'
'set clab `2%g'
'set grads off'
'set cint 6'
'd thickness'
'set clevs 540'
'set ccolor 1'
'set cthick 9'
'set grads off'
'd thickness'
'set map 94 1 1'; 'draw map'

* Annotate the plot with text labels
getcorners()
gridlines(10,5)
titlebar('Sea Level Pressure `2(mb-1000), `51000-500mb Thickness`2 (dam)')

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
* THIRD PANEL: 700MB VERTICAL VELOCITY & PRECIPITATION
* Draw shaded precip for forecast plots only
function panel3
'set gxout shaded'
if (_tindx = 1 | _type='a' | _type='A')
  'set gxout contour'
else
  'define precip = p'
  'set gxout shaded'
  'set grads off'
  'set map 15 1 1 '
  pcols = '0 67 68 69 70 71 72 73 75 76 78 79 80'
  plevs = '1 2 5 10 15 20 30 40 50 60 75 100 '
  'set clevs 'plevs
  'set ccols 'pcols
  'd precip'
  'q shades'
  _shades = result
  'set gxout contour'
  'set clevs 'plevs
  'set background 1'
  'set ccolor 99'
  'set clab off'
  'set grads off'
  'd precip'
endif

* Draw the vertical velocity contours
'define vvel = vv*36'    ;* unit conversion: Pa/s -> mb/hr
'set lev 700'
'set gxout contour'
'set clab on'
'set background 99'
'set ccolor 8'
'set cmin 0.1'
'set grads off'
'set clab `0%g'
'd vvel'
'set ccolor 4'
'set cmax -0.1'
'set grads off'
'set clab `0%g'
'd vvel'
'set map 94 1 1'; 'draw map'

* Annotate the plot with color bar and text labels
getcorners()
gridlines(10,5)
if (_tindx = 1 | _type='a' | _type='A')
  titlebar('700mb Vertical Velocity `2(mb/hr)')
else
  carc(_xright,_ytop)
  titlebar('700mb Vertical Velocity `2(mb/hr), `5'_dt'hr Precipitation `2(mm)')
endif

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
* FOURTH PANEL: 850MB TEMPERATURE, HUMIDITY, & WIND
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
function panel4

* RH shaded contours
'set lev 850'
'define rh850 = rh'
'set mpdraw on'
'set grads off'
'set gxout shaded'
'set ccols 0  99  59  57  55  53  52  60'
'set clevs  65  70  75  80  85  90  95'
'd rh850'
'q shades'
_shades = result
'set gxout contour'
'set cthick 1'
'set clab on'
'set clevs  65  70  75  80  85  90  95'
'set ccolor 99'
'set clab off'
'd rh850'

* Wind barbs or streamlines
if (_barbs)
  'set gxout barb'
  'set digsize 0.05'
  'set cthick 1'
  'set ccolor 15'
  'd u;v'
endif
if (_stream)
  'set gxout stream'
  'set strmden 6'
  'set cthick 1'
  'set ccolor 15'
  'd u;v'
endif

* temperature contours
'define t850 = t-273.16'
outline=0
if (outline)
  'set gxout contour'
  'set ccolor 98'
  'set cint 2'
  'set clab off'
  'set cthick 12'
  'd t850'
endif
'set gxout contour'
'set ccolor rainbow'
'set cint 2'
'set cstyle 1'
'set cthick 6'
'set grads off'
'set clab on'
'set clab `0%g'
'd t850'
'set ccolor 98'
'set clevs 0'
'set grads off'
'd t850'
'set map 94 1 1'; 'draw map'

* Annotate the plot with color bar and text labels
getcorners()
gridlines(10,5)
carc(_xright,_ytop)
titlebar('850mb Temperature `2(C), `5RH `2(%), `5Wind `2(m/s)')

* * * * * * * * * * * * * * * * * * * * * * * * * * * 
* FIFTH PANEL: 200MB STREAMLINES & ISOTACHS
function panel5
'set lev 250'
'define mag = mag(u,v)'
'set gxout stat'
'd mag'
contour = sublin(result,9)
cmin = subwrd(contour,5)
cmax = subwrd(contour,6)
cint = subwrd(contour,7)
* Draw colorized streamlines
'set mpdraw on'
'set gxout stream'
test1 = cmax-4*cint
if (test1 < 20 & cmax < 30)
  'set ccols 16             44             43             42             41     40'
  'set clevs   'cmax-4*cint'  'cmax-3*cint'  'cmax-2*cint'  'cmax-1*cint'  'cmax
else
  'set ccols 16  44  43  42  41  40  98'
  'set clevs   20  25  30  35  40  50 '
endif
'set strmden 6'
'd u;v;mag'
'q shades'
_shades = result


* Overlay contours of wind speed 
'set gxout contour'
'set cthick 1'

* Get contour/color info
line1 = sublin(_shades,1)
numlevs = subwrd(line1,5)
lin1 = numlevs+1
lin2 = numlevs
lin3 = numlevs-1
lin4 = numlevs-2
lin5 = numlevs-3
lin6 = numlevs-4
* draw a contour highlighting top five color levels
nums = sublin(_shades,lin1) 
ccol = subwrd(nums,1)
clev = subwrd(nums,2)
'set grads off'
'set ccols 'ccol
'set clevs 'clev
'set clab on'
'd mag'
nums = sublin(_shades,lin2) 
ccol = subwrd(nums,1)
clev = subwrd(nums,2)
'set grads off'
'set ccols 'ccol
'set clevs 'clev
'set clab on'
'd mag'
nums = sublin(_shades,lin3) 
ccol = subwrd(nums,1)
clev = subwrd(nums,2)
'set grads off'
'set ccols 'ccol
'set clevs 'clev
'set clab on'
'd mag'
nums = sublin(_shades,lin4) 
ccol = subwrd(nums,1)
clev = subwrd(nums,2)
'set grads off'
'set ccols 'ccol
'set clevs 'clev
'set clab on'
'd mag'
nums = sublin(_shades,lin5) 
ccol = subwrd(nums,1)
clev = subwrd(nums,2)
'set grads off'
'set ccols 'ccol
'set clevs 'clev
'set clab on'
'd mag'
nums = sublin(_shades,lin6) 
ccol = subwrd(nums,1)
clev = subwrd(nums,2)
'set grads off'
'set ccols 'ccol
'set clevs 'clev
'set clab on'
'd mag'
'set map 94 1 1'; 'draw map'


* Annotate the plot with color bar and text labels
getcorners()
gridlines(10,5)
titlebar('200mb Streamlines and Isotachs `2(m/s)')

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
* SIXTH PANEL: CAPE & PRECIPITABLE WATER
function panel6
* Draw CAPE 
'set gxout shaded'
'set map 15 1 1 '
'set grads off'
'set background 1'
if (_mtype = 'ETA'); 'define cvar = capes'; endif
if (_mtype = 'GFS'); 'define cvar = cape' ; endif
'set clevs 100 250 750 1500 2500'
'set ccols 0 66 65 64 62 61'
'd cvar'
'q shades'
_shades = result
'set gxout contour'
'set clevs 100 250 750 1500 2500'
'set ccolor 99'
'set grads off'
'set clab `2%g'
'set clab off'
'd cvar'

* Draw precipitable water
'set background 99'
'set gxout contour'
'set ccolor revrain'
'set cint 5'
'set clab on'
'set clab `0%g'
'd pwat'
'set map 94 1 1'; 'draw map'


* Annotate the plot with color bar and text labels
getcorners()
gridlines(10,5)
carc(_xright,_ytop)
titlebar('Precipitable Water `2(mm), `5CAPE `2(J/kg)')
