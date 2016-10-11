* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* basemap.gs
*
* This script overlays a land or ocean mask that exactly matches 
* the coastal outlines. 
* 
* Usage: 
*   basemap L(and)/O(cean) <fill_color> <outline_color> <L(owres)/M(res)/H(ires)>'
*
* Example:
*   ga-> set mpdset mres
*   ga-> display sst
*   ga-> basemap L 7 2 M
* 
* Usage Notes: 
*
* The default values for the optional arguments are: 
*   fill_color 15, outline_color 0, and lowres. 
*
* The land and ocean masks are composed of hundreds of 
* polygons that are specified in accompanying ascii files. 
* The ascii files can be downloaded from the GrADS script library:
*   ftp://grads.iges.org/grads/scripts/lpoly_lowres.asc
*   ftp://grads.iges.org/grads/scripts/lpoly_mres.asc
*   ftp://grads.iges.org/grads/scripts/lpoly_hires.asc
*   ftp://grads.iges.org/grads/scripts/opoly_lowres.asc
*   ftp://grads.iges.org/grads/scripts/opoly_mres.asc
*   ftp://grads.iges.org/grads/scripts/opoly_hires.asc
* If the polygon file cannot be found in the current directory it
* will downloaded from the URL above with wget, on the fly.
*
* For the low and medium resolution map files, coverage is global. 
* For the high resolution map, coverage is limited to North America 
* (0-90N, 170W-10W). 
*
* Basemap will work with any scaled or latlon map projection. 
* If you are using Grads version 1.8 or higher, this script
* will also work properly with the robinson projection and 
* polar stereographic projections from 0-90, 15-90, and 20-90 
* (North and South).  Other projections will work but are not 
* guaranteed because GrADS may not clip the basemap properly. 
* A solution to this  problem is to use "set mpvals" to override 
* the dimension environment limits. For example:
*    set mproj nps
*    set lon -180 180
*    set lat 0 90
*    set mpvals -180 180 60 90 
*    display <something>
*    basemap L
* The resulting plot will be a properly clipped square.
*
* Special Feature:
* An additional option is to mask out the Mexican and
* Canadian land regions surrounding the US, so that only the
* conterminous states are seen. To use this feature, change
* your land polygon file from lpoly_lowres.asc to lpoly_US.asc:
*   ftp://grads.iges.org/grads/scripts/lpoly_US.asc 
* Run basemap twice:
*    basemap o 0 0  (<- that's O zero zero) ;* mask out ocean
*    basemap L 0 0                          ;* mask out non-US land
* This will only work properly if your domain is within the
* boundaries 20N-50N, 130W-60W. Low-res maps only.
*
* Written by Jennifer M. Adams, jma@cola.iges.org
* Updated October 2003
*
* Special thanks to Andrew Schneider, Tom Schneider and Emily Straus 
* for their painstaking efforts to create the polygon files.
*
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
function main(args)

* There are defaults for the colors and resolution
* User must specify which mask
if (args='') 
  say 'Usage: basemap L(and)/O(cean) <fill_color> <outline_color> <L(owres)/M(res)/H(ires)>'
  return
else 
  type    = subwrd(args,1)
  color   = subwrd(args,2)
  outline = subwrd(args,3)
  res     = subwrd(args,4)
  if (color = '')   ; color = 15  ; endif
  if (outline = '') ; outline = 0 ; endif
  if (res = 'H' | res = 'h') ; hires=1 ; mres=0; lowres=0 ; endif
  if (res = 'M' | res = 'm') ; hires=0 ; mres=1; lowres=0 ; endif
  if (res = 'L' | res = 'l') ; hires=0 ; mres=0; lowres=1 ; endif
  if (res = '') ;              hires=0 ; mres=0; lowres=1 ; endif
endif 

* Set the polygon data files
if (type = 'L' | type = 'l') 
*  if (lowres); file = 'lpoly_US.asc'; endif
  if (lowres); file = 'lpoly_lowres.asc'; endif
  if (mres)  ; file = 'lpoly_mres.asc'  ; endif
  if (hires) ; file = 'lpoly_hires.asc' ; endif
endif
if (type = 'O' | type = 'o') 
  if (lowres); file = 'opoly_lowres.asc'; endif
  if (mres)  ; file = 'opoly_mres.asc'  ; endif
  if (hires) ; file = 'opoly_hires.asc' ; endif
endif

* Get the polygon file from COLA if we do not have it
wget_it = 'wget ftp://grads.iges.org/grads/scripts/'file' .'
scrp = 'if test -e ' file '; then true; else ' wget_it '; fi'
'! bash -c "'scrp'"'

* Make sure there's a plot already drawn
'q gxinfo'
line5 = sublin(result,5)
line6 = sublin(result,6)
xaxis = subwrd(line5,3)
yaxis = subwrd(line5,6)
proj  = subwrd(line6,3)
if (xaxis = 'None' | yaxis = 'None') 
  say 'You must display a variable before using basemap'
  return
endif

* See what version of Grads is running 
'q config'
line = sublin(result,1)
word = subwrd(line,2)
version = substr(word,2,3)
if (version >= 1.8) 
  newgrads = 1 
else 
  newgrads = 0
endif
   
* See if map projection will be supported
if (newgrads = 0) 
  if (proj != 1 & proj != 2)
    say 'Only scaled or latlon projections are supported with GrADS v'version
    return
  endif
endif

* Get the image edges for clipping
'q gxinfo'
line3 = sublin(result,3)
line4 = sublin(result,4)
x1 = subwrd(line3,4)
x2 = subwrd(line3,6)
y1 = subwrd(line4,4)
y2 = subwrd(line4,6)
'set clip 'x1' 'x2' 'y1' 'y2

* Read the first record from the polygon file
result = read(file)
rc = sublin(result,1)
rc = subwrd(rc,1)
if (rc!=0)
  say 'Error reading 'file
  return
endif
nwcmd = sublin(result,2)

* Read subsequent records, allowing for read input buffer overflow
flag = 1
while (flag)
  ignore = 0
  wcmd = nwcmd
  while(1)
    result = read(file)
    rc = sublin(result,1)
    rc = subwrd(rc,1)
    if (rc!=0)
      flag = 0
      break
    else 
      nwcmd = sublin(result,2)
    if (subwrd(nwcmd,5) != 'draw') 
        wcmd = wcmd % nwcmd
      else
        break
      endif
    endif
  endwhile

* Get the lat/lon range of the current dimension environment
  'q dims'
  line1 = sublin(result,2)
  line2 = sublin(result,3)
  minlon = subwrd(line1,6)
  maxlon = subwrd(line1,8)
  minlat = subwrd(line2,6)
  maxlat = subwrd(line2,8)

* The range of the polygon is specified in the first four words of the record
  minwx = subwrd(wcmd,1)
  maxwx = subwrd(wcmd,2)
  minwy = subwrd(wcmd,3)
  maxwy = subwrd(wcmd,4)

* If the polygon is outside the current dimension, ignore it
  if (minwx >= maxlon) ; ignore = 1 ; endif 
  if (maxwx <= minlon) ; ignore = 1 ; endif 
  if (minwy >= maxlat) ; ignore = 1 ; endif 
  if (maxwy <= minlat) ; ignore = 1 ; endif 
  if (!ignore)    
    count = 7
    nvert = 1
    if (newgrads)  
      cmd = 'draw mappoly ' 
    else 
      cmd = 'draw polyf '   
    endif 
    while (1)
      countx = count
      county = count + 1
      wx = subwrd(wcmd,countx)
      wy = subwrd(wcmd,county)
      if ((wx = '') | (wy = ''))
        break 
      endif

*     Convert world coordinates to screen coordinates if necessary
      if (newgrads)  
        sx = wx
        sy = wy
      else 
        'q w2xy 'wx' 'wy
        sx = subwrd(result,3)
        sy = subwrd(result,6)
      endif

*     Append the coordinates to the draw command
      cmd = cmd%sx' 'sy' '
      count = count + 2
    endwhile   

*   Draw the polygon
    'set line 'color
    cmd
  endif
endwhile

* Draw the continental outline in the specified color
'set map 'outline
'draw map'
'set map auto'

* Draw a new square frame around the plot
* If you have 'set frame off' or 'set frame circle' before running basemap, 
* you may want to comment out the next 2 lines
'set line 1 1 6'
'draw rec 'x1' 'y1' 'x2' 'y2

* Close the polygon file 
rc = close(file)
return

* THE END *
