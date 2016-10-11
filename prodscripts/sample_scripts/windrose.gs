* Script to draw wind rose
* Written by Warren Tennant (tennant@weathersa.co.za) - 11 February 2004

function windrose (args)

* USAGE: windrose <grads-expr for u-comp> <grads-expr for v-comp> <threshold 1>
*        <color 1> .... <threshold 5> <color 5>

u=subwrd(args,1)
v=subwrd(args,2)
b.1=subwrd(args,3)
c.1=subwrd(args,4)
b.2=subwrd(args,5)
c.2=subwrd(args,6)
b.3=subwrd(args,7)
c.3=subwrd(args,8)
b.4=subwrd(args,9)
c.4=subwrd(args,10)
b.5=subwrd(args,11)
c.5=subwrd(args,12)

* Test for arguments
if(u=''); say "* USAGE: windrose <grads-expr for u-comp> <grads-expr for v-comp> <threshold 1> <color 1> .... <threshold 5> <color 5>"; exit; endif
if(v=''); say "* USAGE: windrose <grads-expr for u-comp> <grads-expr for v-comp> <threshold 1> <color 1> .... <threshold 5> <color 5>"; exit; endif

* T must vary, X,Y should be fixed
'q dims'
var=result
var1=sublin(var,2)
xdim=subwrd(var1,3)
var1=sublin(var,3)
ydim=subwrd(var1,3)
var1=sublin(var,5)
tdim=subwrd(var1,3)
t1=subwrd(var1,11)
t2=subwrd(var1,13)
if(xdim!='fixed'); say "ERROR: X-dimension must be fixed"; exit; endif
if(ydim!='fixed'); say "ERROR: Y-dimension must be fixed"; exit; endif
if(tdim!='varying'); say "ERROR: T-dimension must be varying"; exit; endif

* Test for number of categories entered
mxcat=6
if(b.1='' | b.2=''); say "ERROR: Enter at least TWO categories"; exit; endif
if(b.5=''); mxcat=5; endif
if(b.4=''); mxcat=4; endif
if(b.3=''); mxcat=3; endif
if(b.2!='' & c.2=''); say "ERROR: Enter a color for boundary="b.2; exit; endif
if(b.3!='' & c.3=''); say "ERROR: Enter a color for boundary="b.3; exit; endif
if(b.4!='' & c.4=''); say "ERROR: Enter a color for boundary="b.4; exit; endif
if(b.5!='' & c.5=''); say "ERROR: Enter a color for boundary="b.5; exit; endif
* Maximum User-defined categories
mucat=mxcat-1
c.mxcat=15

* Set some constants
* Root Two plus/minus one
r2=1.414213562
r2m1=0.414213562
r2p1=2.414213562

* Initialize frequencies
cat=1
while(cat<=mxcat)
 n.cat=0
 s.cat=0
 w.cat=0
 e.cat=0
 nw.cat=0
 ne.cat=0
 sw.cat=0
 se.cat=0
 cat=cat+1
endwhile

* Loop thru times
tim=t1
while(tim<=t2)
*say tim
 'set t 'tim
 dir=err

* Get u and v value
 'd 'u
 var=sublin(result,1)
 uu=subwrd(var,4)
 'd 'v
 var=sublin(result,1)
 vv=subwrd(var,4)
 'd abs('u')'
 var=sublin(result,1)
 au=subwrd(var,4)
 'd abs('v')'
 var=sublin(result,1)
 av=subwrd(var,4)
*say "u-comp="uu
*say "v-comp="vv
*say "abs(u-comp)="au
*say "abs(v-comp)="av

* Find wind magnitude
 'd mag('u','v')'
 var=sublin(result,1)
 speed=subwrd(var,4)
 if(speed<b.1); icat=1; endif
 ii=2
 while(ii<=mucat)
  im=ii-1
  if(speed>=b.im & speed<b.ii); icat=ii; endif
  ii=ii+1
 endwhile
 if(speed>b.mucat); icat=mxcat; endif
*say "speed="speed

* Find cardinal wind direction
 if(vv>0 & av>(r2p1*au)); dir=s; s.icat=s.icat+1; endif
 if(vv<0 & av>(r2p1*au)); dir=n; n.icat=n.icat+1; endif
 if(uu>0 & av<(r2m1*au)); dir=w; w.icat=w.icat+1; endif
 if(uu<0 & av<(r2m1*au)); dir=e; e.icat=e.icat+1; endif
 if(vv>0 & uu>0 & av>(r2m1*au) & av<(r2p1*au)); dir=sw; sw.icat=sw.icat+1; endif
 if(uu>0 & vv<0 & av>(r2m1*au) & av<(r2p1*au)); dir=nw; nw.icat=nw.icat+1; endif
 if(uu<0 & vv<0 & av>(r2m1*au) & av<(r2p1*au)); dir=ne; ne.icat=ne.icat+1; endif
 if(vv>0 & uu<0 & av>(r2m1*au) & av<(r2p1*au)); dir=se; se.icat=se.icat+1; endif
 if(dir="err"); say "ERROR: Unallocated Wind Direction"; exit; endif
*say "dir="dir
*say "icat="icat

 tim=tim+1
endwhile

* Calculate frequencies as percentages
maxf=0
cat=1
n.cat=100*n.cat/(t2-t1+1)
s.cat=100*s.cat/(t2-t1+1)
w.cat=100*w.cat/(t2-t1+1)
e.cat=100*e.cat/(t2-t1+1)
nw.cat=100*nw.cat/(t2-t1+1)
ne.cat=100*ne.cat/(t2-t1+1)
sw.cat=100*sw.cat/(t2-t1+1)
se.cat=100*se.cat/(t2-t1+1)
cat=2
while(cat<=mxcat)
 catm=cat-1
 n.cat=100*n.cat/(t2-t1+1)+n.catm
 s.cat=100*s.cat/(t2-t1+1)+s.catm
 w.cat=100*w.cat/(t2-t1+1)+w.catm
 e.cat=100*e.cat/(t2-t1+1)+e.catm
 nw.cat=100*nw.cat/(t2-t1+1)+nw.catm
 ne.cat=100*ne.cat/(t2-t1+1)+ne.catm
 sw.cat=100*sw.cat/(t2-t1+1)+sw.catm
 se.cat=100*se.cat/(t2-t1+1)+se.catm
* Find maximum frequency to scale graphic
 if(n.cat>maxf); maxf=n.cat; endif
 if(s.cat>maxf); maxf=s.cat; endif
 if(w.cat>maxf); maxf=w.cat; endif
 if(e.cat>maxf); maxf=e.cat; endif
 if(nw.cat>maxf); maxf=nw.cat; endif
 if(ne.cat>maxf); maxf=ne.cat; endif
 if(sw.cat>maxf); maxf=sw.cat; endif
 if(se.cat>maxf); maxf=se.cat; endif
 cat=cat+1
endwhile

* Get Virtual Page info and set graph to middle of page
'q gxinfo'
var=sublin(result,2)
XLEN=subwrd(var,4)
YLEN=subwrd(var,6)
X0=0.4*XLEN
Y0=YLEN/2

* Draw ROSE
* Set graph size to fit virtual window
SIZ=6
width=0.25
if(XLEN>1.29*YLEN); SIZ=6*YLEN/8.5; width=width*YLEN/8.5; endif
if(XLEN<YLEN); SIZ=6*XLEN/11; width=width*XLEN/11; endif
SIZH=SIZ/2
SIZ1=0.2*SIZ
SIZ2=0.4*SIZ
SIZ3=0.6*SIZ
SIZ4=0.8*SIZ
'set line 1 5 3'
'draw mark 1 'X0' 'Y0' 'SIZ
'draw mark 2 'X0' 'Y0' 'SIZ1
'draw mark 2 'X0' 'Y0' 'SIZ2
'draw mark 2 'X0' 'Y0' 'SIZ3
'draw mark 2 'X0' 'Y0' 'SIZ4
'draw mark 2 'X0' 'Y0' 'SIZ

'set string 1 c 3'
'set strsiz 0.12'
cat=mxcat
while(cat>0)
'set line 1 1 5'
'draw line 'X0' 'Y0' 'X0-width*n.cat/maxf' 'Y0+SIZH*n.cat/maxf
'draw line 'X0-width*n.cat/maxf' 'Y0+SIZH*n.cat/maxf' 'X0+width*n.cat/maxf' 'Y0+SIZH*n.cat/maxf
'draw line 'X0+width*n.cat/maxf' 'Y0+SIZH*n.cat/maxf' 'X0' 'Y0

'draw line 'X0' 'Y0' 'X0-width*s.cat/maxf' 'Y0-SIZH*s.cat/maxf
'draw line 'X0-width*s.cat/maxf' 'Y0-SIZH*s.cat/maxf' 'X0+width*s.cat/maxf' 'Y0-SIZH*s.cat/maxf
'draw line 'X0+width*s.cat/maxf' 'Y0-SIZH*s.cat/maxf' 'X0' 'Y0

'draw line 'X0' 'Y0' 'X0-SIZH*w.cat/maxf' 'Y0-width*w.cat/maxf
'draw line 'X0-SIZH*w.cat/maxf' 'Y0-width*w.cat/maxf' 'X0-SIZH*w.cat/maxf' 'Y0+width*w.cat/maxf
'draw line 'X0-SIZH*w.cat/maxf' 'Y0+width*w.cat/maxf' 'X0' 'Y0

'draw line 'X0' 'Y0' 'X0+SIZH*e.cat/maxf' 'Y0-width*e.cat/maxf
'draw line 'X0+SIZH*e.cat/maxf' 'Y0-width*e.cat/maxf' 'X0+SIZH*e.cat/maxf' 'Y0+width*e.cat/maxf
'draw line 'X0+SIZH*e.cat/maxf' 'Y0+width*e.cat/maxf' 'X0' 'Y0

'draw line 'X0' 'Y0' 'X0+ne.cat*(SIZH-width)/(maxf*r2)' 'Y0+ne.cat*(SIZH+width)/(maxf*r2)
'draw line 'X0+ne.cat*(SIZH-width)/(maxf*r2)' 'Y0+ne.cat*(SIZH+width)/(maxf*r2)' 'X0+ne.cat*(SIZH+width)/(maxf*r2)' 'Y0+ne.cat*(SIZH-width)/(maxf*r2)
'draw line 'X0+ne.cat*(SIZH+width)/(maxf*r2)' 'Y0+ne.cat*(SIZH-width)/(maxf*r2)' 'X0' 'Y0

'draw line 'X0' 'Y0' 'X0+se.cat*(SIZH-width)/(maxf*r2)' 'Y0-se.cat*(SIZH+width)/(maxf*r2)
'draw line 'X0+se.cat*(SIZH-width)/(maxf*r2)' 'Y0-se.cat*(SIZH+width)/(maxf*r2)' 'X0+se.cat*(SIZH+width)/(maxf*r2)' 'Y0-se.cat*(SIZH-width)/(maxf*r2)
'draw line 'X0+se.cat*(SIZH+width)/(maxf*r2)' 'Y0-se.cat*(SIZH-width)/(maxf*r2)' 'X0' 'Y0

'draw line 'X0' 'Y0' 'X0-sw.cat*(SIZH-width)/(maxf*r2)' 'Y0-sw.cat*(SIZH+width)/(maxf*r2)
'draw line 'X0-sw.cat*(SIZH-width)/(maxf*r2)' 'Y0-sw.cat*(SIZH+width)/(maxf*r2)' 'X0-sw.cat*(SIZH+width)/(maxf*r2)' 'Y0-sw.cat*(SIZH-width)/(maxf*r2)
'draw line 'X0-sw.cat*(SIZH+width)/(maxf*r2)' 'Y0-sw.cat*(SIZH-width)/(maxf*r2)' 'X0' 'Y0

'draw line 'X0' 'Y0' 'X0-nw.cat*(SIZH-width)/(maxf*r2)' 'Y0+nw.cat*(SIZH+width)/(maxf*r2)
'draw line 'X0-nw.cat*(SIZH-width)/(maxf*r2)' 'Y0+nw.cat*(SIZH+width)/(maxf*r2)' 'X0-nw.cat*(SIZH+width)/(maxf*r2)' 'Y0+nw.cat*(SIZH-width)/(maxf*r2)
'draw line 'X0-nw.cat*(SIZH+width)/(maxf*r2)' 'Y0+nw.cat*(SIZH-width)/(maxf*r2)' 'X0' 'Y0

'set line 'c.cat' 1 3'
'draw polyf 'X0' 'Y0' 'X0-width*n.cat/maxf' 'Y0+SIZH*n.cat/maxf' 'X0+width*n.cat/maxf' 'Y0+SIZH*n.cat/maxf' 'X0' 'Y0
'draw polyf 'X0' 'Y0' 'X0-width*s.cat/maxf' 'Y0-SIZH*s.cat/maxf' 'X0+width*s.cat/maxf' 'Y0-SIZH*s.cat/maxf' 'X0' 'Y0
'draw polyf 'X0' 'Y0' 'X0-SIZH*w.cat/maxf' 'Y0-width*w.cat/maxf' 'X0-SIZH*w.cat/maxf' 'Y0+width*w.cat/maxf' 'X0' 'Y0
'draw polyf 'X0' 'Y0' 'X0+SIZH*e.cat/maxf' 'Y0-width*e.cat/maxf' 'X0+SIZH*e.cat/maxf' 'Y0+width*e.cat/maxf' 'X0' 'Y0
'draw polyf 'X0' 'Y0' 'X0+ne.cat*(SIZH-width)/(maxf*r2)' 'Y0+ne.cat*(SIZH+width)/(maxf*r2)' 'X0+ne.cat*(SIZH+width)/(maxf*r2)' 'Y0+ne.cat*(SIZH-width)/(maxf*r2)' 'X0' 'Y0
'draw polyf 'X0' 'Y0' 'X0+se.cat*(SIZH-width)/(maxf*r2)' 'Y0-se.cat*(SIZH+width)/(maxf*r2)' 'X0+se.cat*(SIZH+width)/(maxf*r2)' 'Y0-se.cat*(SIZH-width)/(maxf*r2)' 'X0' 'Y0
'draw polyf 'X0' 'Y0' 'X0-sw.cat*(SIZH-width)/(maxf*r2)' 'Y0-sw.cat*(SIZH+width)/(maxf*r2)' 'X0-sw.cat*(SIZH+width)/(maxf*r2)' 'Y0-sw.cat*(SIZH-width)/(maxf*r2)' 'X0' 'Y0
'draw polyf 'X0' 'Y0' 'X0-nw.cat*(SIZH-width)/(maxf*r2)' 'Y0+nw.cat*(SIZH+width)/(maxf*r2)' 'X0-nw.cat*(SIZH+width)/(maxf*r2)' 'Y0+nw.cat*(SIZH-width)/(maxf*r2)' 'X0' 'Y0
 cat=cat-1
endwhile

* Draw labels on each of the 5 (mlcat) concentric circles
mlcat=5
cat=mlcat
while(cat>0)
 var=cat*maxf/mlcat
 if(var>=10); lab=substr(var,1,2); endif
 if(var<10); lab=substr(var,1,1); endif
 lbx=X0+cat*SIZH*0.38268/mlcat
 lby=Y0+cat*SIZH*0.92387/mlcat
 'set line 0 1 3'
 'draw recf 'lbx-0.2' 'lby-0.1' 'lbx+0.2' 'lby+0.1
 'set line 1 1 3'
 'draw rec 'lbx-0.2' 'lby-0.1' 'lbx+0.2' 'lby+0.1
 'draw string 'lbx' 'lby' 'lab'%'
 cat=cat-1
endwhile

* Draw legend for each user-define category
cat=mucat
while(cat>0)
 'set line 'c.cat
 'draw recf 'X0+SIZH+0.75' 'Y0+(cat-1-mucat/2)*0.5' 'X0+SIZH+1.25' 'Y0+(cat-mucat/2)*0.5
 'set line 1 1 9'
 'draw rec 'X0+SIZH+0.75' 'Y0+(cat-1-mucat/2)*0.5' 'X0+SIZH+1.25' 'Y0+(cat-mucat/2)*0.5
 'draw string 'X0+SIZH+1.5' 'Y0+(cat-mucat/2)*0.5' 'b.cat
 'draw string 'X0' 'Y0+SIZH+0.2' N'
 'draw string 'X0' 'Y0-SIZH-0.2' S'
 'draw string 'X0-SIZH-0.2' 'Y0' W'
 'draw string 'X0+SIZH+0.2' 'Y0' E'
 cat=cat-1
endwhile

* Cap on legend (if values exceed maximum boundary set by user)
if(n.mxcat>n.mucat | s.mxcat>s.mucat | w.mxcat>w.mucat | e.mxcat>e.mucat | nw.mxcat>nw.mucat | ne.mxcat>ne.mucat | sw.mxcat>sw.mucat | se.mxcat>se.mucat)
 'set line 15'
 'draw polyf 'X0+SIZH+0.75' 'Y0+(mucat/2)*0.5' 'X0+SIZH+1.00' 'Y0+(1+mucat/2)*0.5' 'X0+SIZH+1.25' 'Y0+(mucat/2)*0.5
 'set line 1 1 9'
 'draw line 'X0+SIZH+0.75' 'Y0+(mucat/2)*0.5' 'X0+SIZH+1.00' 'Y0+(1+mucat/2)*0.5
 'draw line 'X0+SIZH+1.00' 'Y0+(1+mucat/2)*0.5' 'X0+SIZH+1.25' 'Y0+(mucat/2)*0.5
endif
