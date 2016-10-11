*.......................................................................

*
* openf(fname,ftype)  Opens a file according to the file type (ftype).
*                     If ftype is not specified it attempts to determine it
*                     by a heuristic algorithm;
*                     ftype can be 'ctl', 'sdf' or 'xdf'
*

function openf(fname,ftype)

   _myname = 'openf: '

   if ( fname = '' | fname = 'fname' )
      say 'Usage:     openf   filename   [ctl|sdf|xdf]'
      return 
   endif
 

*  Determine file type
*  -------------------
   if ( ftype = '' | ftype ='ftype' )
*                                       fname may be a template...
*                                       filen is always a file name
      filen = subwrd(fname,1)
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
