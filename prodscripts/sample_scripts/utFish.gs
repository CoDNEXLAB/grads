function main(fname)

if ( fname = '' )
     fname = '../data/model'
     has_zg = 1
     vars = '(ua,va)'
else
     vars = '(u200,v200)'
     has_zg = 0
endif

'reinit'
rc = openf(fname); if (rc); return(rc); endif
'set lev 300'
'set gxout shaded'

* Vorticity and divervenge: enlarge x-domain to avoid grid undefs
* ---------------------------------------------------------------
  xyrange()
  xmin = _xmin - 1;  xmax = _xmax + 1
  'set x ' xmin ' ' xmax  
  'vort = hcurl'vars
  'div  = hdivg'vars

* Reset x domain so that it is not x-wrapped
* ------------------------------------------
  xmin = _xmin;  xmax = _xmax 
  'set x ' xmin ' ' xmax  

* Display vorticity/divergence
* ----------------------------
  'd vort'; 'draw title Vorticity'
  clear()
  'd div';  'draw title Divergence'
  clear()

  
* Stream function
* ---------------
  'psi = fish(vort)'
  'd psi'
  'set gxout contour'
  if ( has_zg )
      'd zg'
      'draw title Stream Function and Geopotential Height'
  else
      'draw title Stream Function'
  endif
  clear()
*  'print psi.eps'

* Velocity Potential
* ------------------
  'chi = fish(div)'
  'set gxout shaded'
  'd chi'
  'draw title Velocity Potential'
*  'print chi.eps'

return

function xyrange()

      'q file'
      tmp = sublin ( result, 5 )
      _xmin = 1
      _xmax = subwrd(tmp,3)
      _ymin = 1
      _ymax = subwrd(tmp,6)

return

function clear()

  say 'Hit <CR> to continue...'; pull ans; 'clear'

return

function openf(fname,ftype)

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

      buf = read(filen)
      rc = sublin(buf,1)
      if ( rc != 0 )
           buf = read(filen'.ctl')
           rc = sublin(buf,1)
      endif
      if ( rc != 0 )
           say _myname 'cannot read file ' filen ' or ' filen '.ctl'
           return rc
      endif
      rec = sublin(buf,2)
      tok = subwrd(rec,1)
      if ( tok = 'dset' | tok='DSET' )
         is_xdf = 0
         i = 1
         tok = substr(filen,i,4)
         while ( tok != '' )
           if ( tok='.ddf' | tok='.DDF' ); is_xdr = 1; endif
           i = i + 1
           tok = substr(filen,i,4)
         endwhile
         if ( is_xdr = 1 )
              ftype = 'xdf'
         else
              ftype = 'ctl'
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
