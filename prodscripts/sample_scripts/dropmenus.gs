function main()
 'reinit'
 _quit=0
 'set xsize 640 480'
 rc=butncons()
 rc=colors()
 rc=menus()
 rc=menubar()
 rc=menus()
 rc=menubar()
 while (_quit=0)
   rc=qbutton()
   rc=domenu(_btn,_men,_pik)
 endwhile
'reinit'
return

function butncons()
* Set button parameters
 'q gxinfo'
  dum=sublin(result,2)
 _xpur=subwrd(dum,4)
 _ypur=subwrd(dum,6)
 _xpll=0.0
 _ypll=0.0
* border for all buttons
 _bord = 1/80
* size of menu areas
 _mwide=1.22
 _mhigh=1.5
* Size of menu buttons
 _mbh=0.4
 _mbw=1.0 
 _pbase=_mbh*1.2
* Size of submenu buttons
 _sbh=0.25
 _sbw=0.85
* height of and width of Graphic Output Boxes (inches)
 _gxbw=_mwide
 _gxbh=_mhigh/6
* width of time and dim bar and height of labels (inches)
 _barw=0.50
 _labh=0.2
* size of control buttons
 _cbw=_mwide
 _cbh=0.5
* size of print option buttons
 _pbw=1.8
 _pbh=0.6
* size of dimension buttons
 _dbw=_mwide
 _dbh=(_mhigh-_cbh)/3
* size of variables boxes
 _vbw=0.55
 _vbh=0.3
 _vbase=_ypur-_mbh*1.1-_dbh*3-_bord*2
* button centerlines
 _lcl = _xpll+_mwide/2.0
 _rcl = _xpur-_mwide/2.0-0.03
* Set border for frames and buttons
 _brd=0.02
 _twk=0.005
* set time bar parameters
 _tbxll=_xpur-_mwide-_bord*1
 _tbxur=_xpur-_bord*2
 _tbyll=_ypll+_mwide*0.75+_bord*2
 _tbyur=_ypur-_mbh*1.2-_dbh*3-_bord*3
* set dimension bar parameters
 _dbxll=_xpll+_bord*2
 _dbxur=_xpll+_mwide
 _dbyll=_ypll+_mwide*0.75+_bord*2
 _dbyur=_ypur-_mbh-_dbh*3-_bord*8
* Set line widths in pixels
 rc=getinfo()
  n=3
 _hw=n/_winH
 _vw=n/_winW
return

function colors()
* Set display colors
*  colors 0-15 are reserved
*  Background colors
 rc=setrgb(16,30,30,90)
 rc=setrgb(17,100,100,100)
 rc=setrgb(18,200,200,200)
 rc=setrgb(19,255,255,255)
*  Button colors: 20-center; 21-top,left; 22-bottom,right
 rc=setrgb(20,155,155,155) 
 rc=setrgb(21,128,128,128)
 rc=setrgb(22,182,182,182)
 rc=setrgb(23,205,205,205)
 rc=setrgb(24,105,105,105)
return

function domenu(btn,men,pik)
* Process menu selections
 if(pik=0); return; endif
 if (men=1)
   if (pik=6); _quit=1; return; endif
 endif
return

function getinfo()
* Retrieve window information
 'q xinfo'
 dum=sublin(result,1)
 _winid=subwrd(dum,4)
 dum=sublin(result,2)
 _winX=subwrd(dum,4)
 dum=sublin(result,3)
 _winY=subwrd(dum,4)
 dum=sublin(result,4)
 _winW=subwrd(dum,4)
 dum=sublin(result,5)
 _winH=subwrd(dum,4)
return 

function mbutton()
* Draw misc buttons
  x=0.07*_xpll+0.93*_xpur
  y=_ypur-_mbh*0.55
  bh=_mbh-_brd*4
  'set button 0 20 21 22 1 20 22 21 1'
  'clear button 0'
  'draw button 0 'x' 'y' 'bh*4.5' 'bh' 'Draw
return

function menubar(men)
* Draw menu bar
 if(men='men')
   rc=tile(_xpll,_ypur-_mbh*1.2,_xpur,_ypur,20,23,24,1)
   rc=mbutton()
   'set button 0 20 1 0 1 20 24 23 1'
   mby=_ypur-0.4625*_mbh*1.2
   mbh=_mbh*1.05
   i=1; mbr=0
   while (i <= _menus)
     len=wrdlen(_menu.i,1)
     mbw=(len+2)*0.14
     mbr=mbr+mbw
     mbx=mbr-mbw/2+0.1
     if((_objs=0 |_mode<3) &i=2)
       'set dropmenu 24 20 -1 -1 1 -1 -1 -1 24 -1 -1 -1 -1 -1 6'
     else
       'set dropmenu 0 20 -1 -1 1 20 24 23 0 20 24 23 24 23 6'
     endif
     if(_menu.i!='' &_menu.i!=' ' &men='men')
       'clear dropmenu 'i
       'draw dropmenu 'i' 'mbx' 'mby' 'mbw' 'mbh' '_menu.i
     endif
     i=i+1
   endwhile
   i=1
   while (i <= _subs)
     j=1
     while (j <= _sub.i)
       k=i*10+j
       if(_menu.k!='' &_menu.k!=' ' &men='men')
         'clear dropmenu 'k
         'draw dropmenu 'k' cascade '_menu.k
       endif
       j=j+1
     endwhile
     i=i+1
   endwhile
 else
   if(men<=_menus)
     mby=_ypur-0.4625*_mbh*1.2
     mbh=_mbh*1.05
     i=1; mbr=0
     while (i <= men)
       len=wrdlen(_menu.i,1)
       mbw=(len+2)*0.14
       mbr=mbr+mbw
       mbx=mbr-mbw/2+0.1
       i=i+1
     endwhile
     if((_objs=0 |_mode<3) &i=2)
       'set dropmenu 24 20 -1 -1 1 -1 -1 -1 24 -1 -1 -1 -1 -1 6'
     else
       'set dropmenu 0 20 -1 -1 1 20 24 23 0 20 24 23 24 23 6'
     endif
     'clear dropmenu 'men
     'draw dropmenu 'men' 'mbx' 'mby' 'mbw' 'mbh' '_menu.men
   else
     'clear dropmenu 'men
     'draw dropmenu 'men' cascade '_menu.men
   endif
 endif
return

function menus()
* Set menu names and submenus
  _menus=7
  _menu.1=' File |New Grid>17>|Open Grid|Save Image|Save Image As|Print|Quit'
  _menu.2=' Edit |Delete All |Move Points |Delete Points |Move Path |Delete Path |Insert Path Point'
  _menu.3=' Automate |Add to Web Page|Add to Web Page As|Delete from Web Page>59>|Open a Saved Product |Update Web Page'
  _menu.4=' Mode |* Same Level|   Mix Levels|   Sections |   Profiles'
  _menu.5=' View |Location >49>|Grid Lines >19>|Grid Pitch >11>|Political Bound. >41>|Projection >12>|Topography >33>|Labels >36>|'
  _menu.6=' Options |Data Settings >35>|Level Units >32>|Major Cities >42>|Edit Cities|Colors >16>|Fonts >13>|Text Size >15>|View Style >18>|'
  _menu.7=' Help |Help on 2-D Editor|About Charts'
  _subs=4
  _sub.1=9
  _menu.11='  1 Deg.| 2 Deg.| 5 Deg.|* 10 Deg.| 20 Deg.| 45 Deg.'
  _menu.12='  None |* Lat-Lon |  NPS |  SPS'
  _menu.13='* Normal |  Bold |  Normal Roman |  Bold Roman |  Italic'
  _menu.14=' 8|9|10|12|14|16|18|20|22|24|28|32|36|40'
  _menu.15=' Titles >14>|Labels >21>|Symbols >23>|'
  _menu.16=' Schemes >24>|Background >25>|Titles >26>|Axes >27>|Labels >34>|Map >29>|'
  _menu.17=" "_menulist
  _menu.18='* Inset | Full'
  _menu.19='* None |  Dotted|  Solid'
  _sub.2=9
  _menu.21=' 8|9|10|12|14|16|18|20|22|24|28|32|36|40'
  _menu.22=' 8|9|10|12|14|16|18|20|22|24|28|32|36|40'
  _menu.23=' 8|9|10|12|14|16|18|20|22|24|28|32|36|40'
  _menu.24='* Navy |  Black |  Medium Grey |  Light Grey |  White'
  _menu.25='* Navy |  Black |  Medium Grey |  Light Grey |  White'
  _menu.26='* White |  Yellow |  Red |  Blue |  Green |  Magenta |  Gray |  Black'
  _menu.27='* White |  Yellow |  Red |  Blue |  Green |  Magenta |  Gray |  Black'
  _menu.28='* White |  Yellow |  Red |  Blue |  Green |  Magenta |  Gray |  Black'
  _menu.29='* White |  Yellow |  Red |  Blue |  Green |  Magenta |  Gray |  Black'
  _sub.3=9
  _menu.32=_zmenu
  _menu.33='* None |  Solid |  Filled |  Shaded |  Colored'
  _menu.34='* Same as Plot|  Same as Axes'
*  _menu.35= set in getvar()
  _menu.36=' Title >43>|Forecast Time >44>|Valid Time >45>|Lat-Lon >46>|Legends >47>|Frame >48>|'
  _menu.37=_uprvars
  _menu.38=_sfcvars
  _menu.39=_otrvars
  _sub.4=9
  _menu.41='* On | Off'
  _menu.42=' On |* Off'
  _menu.43='* On | Off'
  _menu.44='* On | Off'
  _menu.45='* On | Off'
  _menu.46='* On | Off'
  _menu.47='* On | Off'
  _menu.48='* On | Off'
  _menu.49=' Over Land| Over Sea|* Both'
return

function qbutton()
* Query buttons
*** program waits here ***
 'q pos'
 _btn = subwrd(result,7)
 _wgt = subwrd(result,6)
 _mbt = subwrd(result,5)
 if (_wgt=0) 
   _btn = -999
 endif
 if(_wgt=3)
   _men=-1; _pik=-1
   i=1
   while (1)
     tmp=subwrd(result,i+6)
     if(tmp<0); break; endif
     _men=subwrd(result,i+6)
     _pik=subwrd(result,i+7)
     i=i+2
   endwhile
 endif
return

function strlen(str)
* get length of string
 i=1
 while (chr != "")
   chr=substr(str,i,1)
   i=i+1
   if(i>1024); break; endif
 endwhile
return i-2

function setrgb(clr,red,grn,blu)
* set and test rgb allocation
 'set rgb 'clr' 'red' 'grn' 'blu
 if(subwrd(result,3)='Error:' & _clrmsg=0)
   _clrmsg=1
   rc=report("Colors may not be accurate","due to the limited number","of hardware colors available.")
   rc=clear()
 endif
return

function tile(x1,y1,x2,y2,cn,tl,br,fl)
 'set line 'cn' 1'
 if(fl=1)
   'draw recf 'x1' 'y1' 'x2' 'y2
 endif
 a=_bord; b=0.005
 c=0
 'set line 'tl
 while (c<=a)
   'draw line 'x1+c' 'y1+c' 'x1+c' 'y2-c
   'draw line 'x1+c' 'y2-c' 'x2-c' 'y2-c
   c=c+b
 endwhile
 c=0
 'set line 'br
 while (c<=a)
   'draw line 'x1+c' 'y1+c' 'x2-c' 'y1+c
   'draw line 'x2-c' 'y1+c' 'x2-c' 'y2-c
   c=c+b
 endwhile
return

function wrdlen(list,k)
* get length of kth word in list
 str=subwrd(list,k)
 len=strlen(str)
return len

