#
# Creates ctl for MERRA; requires GrADS v2.
#

function main(args)

* Must be ru nder grads v2
* ------------------------
  'q config'
  cfg = subwrd(result,2)
  ver = substr(cfg,2,1)
  if ( ver!=2 )
     say ''
     say 'ERROR: make_ctl requires GrADS version 2'
     say ''
     'quit'
  endif

* Parse arguments
* ---------------
  ia = 1
  url = subwrd(args,ia)
  upper = 0
  if ( url='-upper' )
     upper = 1
     ia = ia + 1
     url = subwrd(args,ia)
  endif     

  ia = ia + 1
  filename = subwrd(args,ia)

  if (url!='' & url!='-h')
     rc = openf(url)
     if ( rc != 0 )
           say _myname 'cannot make CTL for file ' url
           return rc
     endif
  else
     say ''
     say 'make_ctl - creates GrADS control files"'
     say ''
     say 'Usage:'
     say ''
     say '   make_ctl [-h] [-upper] in_url [out_filename]'
     say ''
     say 'where'
     say ''
     say '   in_url         input SDF file name or URL'
     say '   out_filaname   output file name; default: firs word in title'
     say ''
     say 'If -upper specified, variable names on file will be assumed'
     say 'to be all upper case'
     say ''
     'quit'
  endif

* Query the ctl info for this file/url
* ------------------------------------
  'q ctlinfo'
  buffer = result

* Output file name
* ----------------
  if (filename='')
    title = sublin(buffer,2)
    title = tokenize(title,':')
    basename = subwrd(title,2) 
    filename = basename '.ctl'
  endif

* Modify result of 'q ctlinfo' as to produce alid ctl
* ---------------------------------------------------
  i=1
  n = 999
  edef = 0
  enum = 0
  vdef = 0
  while( i < n )

*   next line
*   ---------
    line = sublin(buffer,i)
    keyw = subwrd(line,1)

*   Inside variable block: create proper units entry
*   ------------------------------------------------
    if ( vdef )
      edef = 0 
      vname = subwrd(line,1)
      vname = tokenize(vname,'=')
      vname = subwrd(vname,1)
      if ( upper=1 )
           ucvar = uppercase(vname)
           vname = ucvar '=>' vname
      endif
      vlev  = subwrd(line,2)
      vdim  = subwrd(line,3)
      vlong = ''
      j = 4
      w = subwrd(line,j)
      while(w!='')
         vlong = vlong ' ' w
         j = j + 1
         w = subwrd(line,j)
       endwhile
       dims = tokenize(vdim,',')
       k = 1
       vdim = ''
       ndims = 1
       while(k<5)
         dim = subwrd(dims,k)
         if ( dim!='0' )
           if ( dim = '-100' ); dim='x'; endif
           if ( dim = '-101' ); dim='y'; endif
           if ( dim = '-102' ); dim='z'; endif
           if ( dim = '-103' ); dim='t'; endif
           if ( dim = '-104' ); dim='e'; endif
           if ( vdim='' ) 
             if ( dim!='e' | (dim='e' & enum>1) )
               vdim = dim
             endif 
           else
             if ( dim!='' )
                vdim = vdim ',' dim
                ndims = ndims + 1
             endif
          endif
        endif
        k = k + 1
      endwhile
      line = vname ' ' vlev ' ' vdim '' vlong 
#      if ( ndims<2 )
#        line = '* ' line
#      endif
      ndims = 1
    endif

*   Handle multi edef block
*   -----------------------
    if ( keyw='edef' )
         edef=1
         enum = subwrd(line,2)
    endif

*   Entering variable definition: determine number "n" of
*   remaining lines
*   -----------------------------------------------------
    if ( keyw='vars' ) 
       n=i+subwrd(line,2)+1
       vdef = 1
    endif

*   zdef fix: GrADS does not like negative increments although
*   'q ctlinfo' does produce it
*   ----------------------------------------------------------
    if ( keyw='zdef' )
        znum = subwrd(line,2)
        map = subwrd(line,3)
        z0  = subwrd(line,4)
        dz  = subwrd(line,5)
        if ( map = 'linear' & dz<0 )
           k = 1
           zlevs = z0 ' '
           z = z0
           while (k<znum) 
             z = z + dz
             zlevs = zlevs % z ' '
             k = k + 1
           endwhile
           line = 'zdef ' znum ' levels ' zlevs
        endif 
      endif

*   echo/writ the filtered line
*   ---------------------------
    if ( edef=0 )
       say line
       if ( keyw='dset' )
          rc = write(filename,line)
          fn = subwrd(line,2)
          ic = 0
          ch = 'x'
          is_tmpl = 0
          while ( ch != '' )
             ic = ic + 1
             ch = substr(fn,ic,1)
             if ( ch = '%' )
                  is_tmpl = 1
             endif
          endwhile
          if ( is_templ )
               line = 'OPTIONS template'
               say line
               rc = write(filename,line,append)
          endif
       else
          rc = write(filename,line,append)
       endif
    endif
    if ( keyw='endedef' );  edef=0;   endif

*   Bump line number for next iteration
*   -----------------------------------
    i = i + 1

  endwhile

* Add endvars
* -----------
  say 'endvars'

  rc = write(filename,'endvars',append)
  rc = close(filename)
  'quit'

* All done
* --------
  return

***
*
* Make a CSV a space separated value so that one can
* use subwrd() on it.
*
function tokenize(str,del)
      new = ''
      i = 1
      ch = substr(str,i,1)
      while( ch != '' )
           if ( ch = del )
                new = new ' '
           else
                new = new '' ch
           endif
           i = i + 1
           ch = substr(str,i,1)
      endwhile
      return new

***
*
* Return upper case letter
*

function uppercase(str)
      i = 1
      ch = substr(str,i,1)
      new = ''
      while(ch!='')
        ch = uc(ch)
        new = new % ch
        i = i+1
        ch = substr(str,i,1)
      endwhile
      return new

function uc (ch_)
      ch = ch_
      if ( ch='a'); ch='A'; endif
      if ( ch='b'); ch='B'; endif
      if ( ch='c'); ch='C'; endif
      if ( ch='d'); ch='D'; endif
      if ( ch='e'); ch='E'; endif
      if ( ch='f'); ch='F'; endif
      if ( ch='g'); ch='G'; endif
      if ( ch='h'); ch='H'; endif
      if ( ch='i'); ch='I'; endif
      if ( ch='j'); ch='J'; endif
      if ( ch='k'); ch='K'; endif
      if ( ch='l'); ch='L'; endif
      if ( ch='m'); ch='M'; endif
      if ( ch='n'); ch='N'; endif
      if ( ch='m'); ch='M'; endif
      if ( ch='o'); ch='O'; endif
      if ( ch='p'); ch='P'; endif
      if ( ch='q'); ch='Q'; endif
      if ( ch='r'); ch='R'; endif
      if ( ch='s'); ch='S'; endif
      if ( ch='t'); ch='T'; endif
      if ( ch='u'); ch='U'; endif
      if ( ch='v'); ch='V'; endif
      if ( ch='w'); ch='W'; endif
      if ( ch='x'); ch='X'; endif
      if ( ch='Y'); ch='Y'; endif
      if ( ch='z'); ch='Z'; endif
return ch

*
* openf(fname,ftype)  Opens a file according to the file type (ftype).
*                     If ftype is not specified it attempts to determine it
*                     by a heuristic algorithm;
*                     ftype can be 'ctl', 'sdf' or 'xdf'
*

function openf(fname,ftype)

   ctl = ''

*  Determine file type
*  -------------------
   if ( ftype = '' | ftype ='ftype' )
*                                       fname may be a template...
*                                       filen is always a file name
    filen = subwrd(fname,1)
    http = substr(filen,1,7)
     if ( http = 'http://' )
        ftype = 'sdf'
    else

      ctl = filen
      buf = read(ctl)
      rc = sublin(buf,1)
      if ( rc != 0 )
           ctl = filen'.ctl'
           buf = read(ctl)
           rc = sublin(buf,1)
      endif
      if ( rc != 0 )
           say _myname 'cannot read file ' filen ' or ' filen '.ctl'
           return rc
      endif
      rc = close(ctl)
      rec = sublin(buf,2)
      tok = subwrd(rec,1)
      if ( tok = 'dset' | tok='DSET' )
         is_ctl = 0
         i = 1
         tok = substr(filen,i,4)
         while ( tok != '' )
           if ( tok='.ctl' | tok='.CTL' ); is_ctl = 1; endif
           i = i + 1
           tok = substr(filen,i,4)
         endwhile
         if ( is_ctl = 1 )
              ftype = 'ctl'
         else
              ftype = 'xdf'
         endif
      else
         ftype = 'sdf'
      endif
   
    endif

   endif   

*  Open according to file type
*  ---------------------------
   if ( ftype = 'ctl' )
        'open ' fname
        _result = result
        return rc
   endif
   if ( ftype = 'sdf' ) 
        'sdfopen ' fname
        _result = result
        return rc
   endif
   if ( ftype = 'xdf' ) 
        'xdfopen ' fname
        _result = result
        return rc
   endif

   say _myname 'cannot handle file type "' ftype '"'

return 1
