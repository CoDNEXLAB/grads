function plotHL(args)
 sector=subwrd(args,1)
if sector = US
 'd amin(msletmsl/100,lon=-127,lon=-96,lat=21,lat=48)'
  val=subwrd(result,10)
  if val < 1013
   'd aminlocx(msletmsl,lon=-127,lon=-96,lat=21,lat=48)'
   i=subwrd(result,10)
   'd aminlocy(msletmsl,lon=-127,lon=-96,lat=21,lat=48)'
   j=subwrd(result,10)
   'q gr2xy 'i' 'j
   xval=subwrd(result,3)
   yval=subwrd(result,6)
   'set string 2 c 12 0'
   'set strsiz .5'
   letter='L'
   'draw string 'xval' 'yval' 'letter
  endif
 'd amax(msletmsl/100,lon=-127,lon=-96,lat=21,lat=48)'
  val=subwrd(result,10)
  if val > 1013
   'd amaxlocx(msletmsl,lon=-127,lon=-96,lat=21,lat=48)'
   i=subwrd(result,10)
   'd amaxlocy(msletmsl,lon=-127,lon=-96,lat=21,lat=48)'
   j=subwrd(result,10)
   'q gr2xy 'i' 'j
   xval=subwrd(result,3)
   yval=subwrd(result,6)
   'set string 4 c 12 0'
   'set strsiz .5'
   letter='H'
   'draw string 'xval' 'yval' 'letter
  endif
*****************
 'd amin(msletmsl/100,lon=-96,lon=-65,lat=21,lat=48)'
  val=subwrd(result,10)
  if val < 1013
   'd aminlocx(msletmsl,lon=-96,lon=-65,lat=21,lat=48)'
   i=subwrd(result,10)
   'd aminlocy(msletmsl,lon=-96,lon=-65,lat=21,lat=48)'
   j=subwrd(result,10)
   'q gr2xy 'i' 'j
   xval=subwrd(result,3)
   yval=subwrd(result,6)
   'set string 2 c 12 0'
   'set strsiz .5'
   letter='L'
   'draw string 'xval' 'yval' 'letter
  endif
 'd amax(msletmsl/100,lon=-96,lon=-65,lat=21,lat=48)'
  val=subwrd(result,10)
  if val > 1013
   'd amaxlocx(msletmsl,lon=-96,lon=-65,lat=21,lat=48)'
   i=subwrd(result,10)
   'd amaxlocy(msletmsl,lon=-96,lon=-65,lat=21,lat=48)'
   j=subwrd(result,10)
   'q gr2xy 'i' 'j
   xval=subwrd(result,3)
   yval=subwrd(result,6)
   'set string 4 c 12 0'
   'set strsiz .5'
   letter='H'
   'draw string 'xval' 'yval' 'letter
  endif
**********************************
 'd amin(msletmsl/100,lon=-127,lon=-96,lat=48,lat=56)'
  val=subwrd(result,10)
  if val < 1013
   'd aminlocx(msletmsl,lon=-127,lon=-96,lat=48,lat=56)'
   i=subwrd(result,10)
   'd aminlocy(msletmsl,lon=-127,lon=-96,lat=48,lat=56)'
   j=subwrd(result,10)
   'q gr2xy 'i' 'j
   xval=subwrd(result,3)
   yval=subwrd(result,6)
   'set string 2 c 12 0'
   'set strsiz .5'
   letter='L'
   'draw string 'xval' 'yval' 'letter
  endif
 'd amax(msletmsl/100,lon=-127,lon=-96,lat=48,lat=56)'
  val=subwrd(result,10)
  if val > 1013
   'd amaxlocx(msletmsl,lon=-127,lon=-96,lat=48,lat=56)'
   i=subwrd(result,10)
   'd amaxlocy(msletmsl,lon=-127,lon=-96,lat=48,lat=56)'
   j=subwrd(result,10)
   'q gr2xy 'i' 'j
   xval=subwrd(result,3)
   yval=subwrd(result,6)
   'set string 4 c 12 0'
   'set strsiz .5'
   letter='H'
   'draw string 'xval' 'yval' 'letter
  endif
*************************************
 'd amin(msletmsl/100,lon=-96,lon=-65,lat=48,lat=56)'
  val=subwrd(result,10)
  if val < 1013
   'd aminlocx(msletmsl,lon=-96,lon=-65,lat=48,lat=56)'
   i=subwrd(result,10)
   'd aminlocy(msletmsl,lon=-96,lon=-65,lat=48,lat=56)'
   j=subwrd(result,10)
   'q gr2xy 'i' 'j
   xval=subwrd(result,3)
   yval=subwrd(result,6)
   'set string 2 c 12 0'
   'set strsiz .5'
   letter='L'
   'draw string 'xval' 'yval' 'letter
  endif
 'd amax(msletmsl/100,lon=-96,lon=-65,lat=48,lat=56)'
  val=subwrd(result,10)
  if val > 1013
   'd amaxlocx(msletmsl,lon=-96,lon=-65,lat=48,lat=56)'
   i=subwrd(result,10)
   'd amaxlocy(msletmsl,lon=-96,lon=-65,lat=48,lat=56)'
   j=subwrd(result,10)
   'q gr2xy 'i' 'j
   xval=subwrd(result,3)
   yval=subwrd(result,6)
   'set string 4 c 12 0'
   'set strsiz .5'
   letter='H'
   'draw string 'xval' 'yval' 'letter
  endif
endif
*********************************************
if sector = MW
 'd amin(msletmsl/100,lon=-100,lon=-81,lat=35,lat=46)'
  val=subwrd(result,10)
  if val < 1013
   'd aminlocx(msletmsl,lon=-100,lon=-81,lat=35,lat=46)'
   i=subwrd(result,10)
   'd aminlocy(msletmsl,lon=-100,lon=-81,lat=35,lat=46)'
   j=subwrd(result,10)
   'q gr2xy 'i' 'j
   xval=subwrd(result,3)
   yval=subwrd(result,6)
   'set string 2 c 12 0'
   'set strsiz .5'
   letter='L'
   'draw string 'xval' 'yval' 'letter
  endif
 'd amax(msletmsl/100,lon=-100,lon=-81,lat=35,lat=46)'
  val=subwrd(result,10)
  if val > 1013
   'd amaxlocx(msletmsl,lon=-100,lon=-81,lat=35,lat=46)'
   i=subwrd(result,10)
   'd amaxlocy(msletmsl,lon=-100,lon=-81,lat=35,lat=46)'
   j=subwrd(result,10)
   'q gr2xy 'i' 'j
   xval=subwrd(result,3)
   yval=subwrd(result,6)
   'set string 4 c 12 0'
   'set strsiz .5'
   letter='H'
   'draw string 'xval' 'yval' 'letter
  endif
endif
