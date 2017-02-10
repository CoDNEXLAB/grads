function plotHL(args)
 sector=subwrd(args,1)
if sector = US
 'd amin(msletmsl/100,lon=-127,lon=-110,lat=22,lat=55)'
  val=subwrd(result,10)
  if val < 1013
   'd aminlocx(msletmsl,lon=-127,lon=-110,lat=22,lat=55)'
   i=subwrd(result,10)
   'd aminlocy(msletmsl,lon=-127,lon=-110,lat=22,lat=55)'
   j=subwrd(result,10)
   'q gr2xy 'i' 'j
   xval=subwrd(result,3)
   yval=subwrd(result,6)
   'set string 2 c 12 0'
   'set strsiz .3'
   letter='L'
   'draw string 'xval' 'yval' 'letter
  endif
 'd amax(msletmsl/100,lon=-127,lon=-110,lat=22,lat=55)'
  val=subwrd(result,10)
  if val > 1013
   'd amaxlocx(msletmsl,lon=-127,lon=-110,lat=22,lat=55)'
   i=subwrd(result,10)
   'd amaxlocy(msletmsl,lon=-127,lon=-110,lat=22,lat=55)'
   j=subwrd(result,10)
   'q gr2xy 'i' 'j
   xval=subwrd(result,3)
   yval=subwrd(result,6)
   'set string 4 c 12 0'
   'set strsiz .3'
   letter='H'
   'draw string 'xval' 'yval' 'letter
  endif
*****************
 'd amin(msletmsl/100,lon=-110,lon=-66,lat=22,lat=55)'
  val=subwrd(result,10)
  if val < 1013
   'd aminlocx(msletmsl,lon=-110,lon=-66,lat=22,lat=55)'
   i=subwrd(result,10)
   'd aminlocy(msletmsl,lon=-110,lon=-66,lat=22,lat=55)'
   j=subwrd(result,10)
   'q gr2xy 'i' 'j
   xval=subwrd(result,3)
   yval=subwrd(result,6)
   'set string 2 c 12 0'
   'set strsiz .3'
   letter='L'
   'draw string 'xval' 'yval' 'letter
  endif
 'd amax(msletmsl/100,lon=-110,lon=-66,lat=22,lat=55)'
  val=subwrd(result,10)
  if val > 1013
   'd amaxlocx(msletmsl,lon=-110,lon=-66,lat=22,lat=55)'
   i=subwrd(result,10)
   'd amaxlocy(msletmsl,lon=-110,lon=-66,lat=22,lat=55)'
   j=subwrd(result,10)
   'q gr2xy 'i' 'j
   xval=subwrd(result,3)
   yval=subwrd(result,6)
   'set string 4 c 12 0'
   'set strsiz .3'
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
   'set strsiz .3'
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
   'set strsiz .3'
   letter='H'
   'draw string 'xval' 'yval' 'letter
  endif
endif
