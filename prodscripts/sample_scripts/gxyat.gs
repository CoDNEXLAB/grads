*
*   Simple gxprint wrapper to emulate gxyat.
*
*
*   This script has been placed in the Public Domain.
*
*...........................................................................
*
* main(args)  Main driver checking config, handling error conditions, etc.
*
function main ( args )

      _myname = 'gxyat: '
      _version = '1.0.0'

*     Parse command line
*     ------------------
      rc = parsecmd(args)
      if ( rc != 0 )
           say '<RC> 'rc' </RC>'
           say '</IPC>'
           if ( _quit = 1 ) 
                say _myname 'exiting from GrADS...'
                'quit'
           endif
           return rc
      endif

*     Check GrADS configuration
*     -------------------------
      rc = chkcfg()
      if ( rc != 0 )
           say '<RC> 'rc' </RC>'
           say '</IPC>'
           if ( _quit = 1 ) 
                say _myname 'exiting from GrADS...'
                'quit'
           endif
           return rc
      endif

      
      cmd = 'gxprint ' _ofilen ' ' _x ' ' _y ' ' _r
      if ( _verb )
           say cmd
      endif
      cmd


return rc

*.........................................................................

function usage(flag)

      say ''
      say 'NAME'
      say ''
      say '     gxyat - compatible gxprint wrapper (Version ' _version ')'
      say ''
      say 'SYNOPSIS'
      say ''
      say '      gxyat OPTIONS [filename]'
      say ''
      say 'DESCRIPTION'
      say '      Simple wrapper for gxprint using a gxyat compatible syntax.'
      say '      Notice that file name can also be specified with -o option'
      say '      Please use gxprint directly if you can.'
      say ''
      say '      OPTIONS'
      say '     +a           (ignored)'
      say '     -f           (ignored)'
      say '     -h           prints this manual page'
      say '     -i fname     (ignored)'
      say '     -o fname     output file name/pipe command; the file name extension '
      say '                  determines the desired format, e.g.,'
      say '                  png     Portable Network Graphics    '    
      say '                  ps      Postscript'
      say '                  pdf     Portable Document Format (PDF)'
      say '                  svg     Scalable Vector Graphics'
      say '     -r           Black background (default is white, unlike gxprint)'
      say '     -v           Verbose.'
      say '     -x m         number of horizontal pixels'
      say '     -y n         number of vertical pixels'
      say '     -w s         (ignored)'

      if ( flag != 1 )
                say '     Enter "gxyat -h" for additional information'
                say ''
                return
      endif
return 1

*.........................................................................

*
* parsecmd() Parse command line arguments
*

function parsecmd(args)

      if ( args='' )
           rc = usage(1)
           return 1
      endif

*
*     Note: customize defaults for your site
*
      _x = ''
      _y = ''
      _r = 'white'
      _ofilen = ''

      _help = 0
      _verb = 0

      options = '+a -f -h -o -r -v -x -y -w +a'

      i = 1
      token = subwrd(args,i)
      while ( token != '' )

*        Handle each option separately ...

         if ( token = '-help' | token = '-h' )
              _help = 1
              i = i + 1
              token = subwrd(args,i)
         endif

         if ( token = '-v' )
              _verb = 1
              i = i + 1
              token = subwrd(args,i)
         endif

         if ( token = '-r' )
              _r = ''
              i = i + 1
              token = subwrd(args,i)
         endif

         if ( token='+a'|token='-f')
              i = i + 1
              token = subwrd(args,i)
         endif

         if ( token = '-o' )
              _ofilen = subwrd(args,i+1) 
              i = i + 2
              token = subwrd(args,i)
              if ( critique(1,1,'-x',_ofilen) = 1 ); return 1; endif
         endif

         if ( token = '-x' )
              _xsize = subwrd(args,i+1) 
              _x = 'x' _xsize
              i = i + 2
              token = subwrd(args,i)
              if ( critique(1,1,'-x',_xsize) = 1 ); return 1; endif
         endif

         if ( token = '-y' )
              _ysize = subwrd(args,i+1) 
              _y = 'y' _ysize
              i = i + 2
              token = subwrd(args,i)
              if ( critique(1,1,'-y',_ysize) = 1 ); return 1; endif
         endif

         if ( token = '-w' )
              _w = subwrd(args,i+1) 
              i = i + 2
              token = subwrd(args,i)
              if ( critique(1,1,'-y',_wsize) = 1 ); return 1; endif
         endif

*        Validate option
*        ---------------
         j = 1
         opt = subwrd(options,j)
         valid = 0
         while ( opt != '' )
            if ( token = opt ); valid = 1; endif
            j = j + 1
            opt = subwrd(options,j)
         endwhile

         if ( valid = 0 & token!='')
            if ( substr(token,1,1)='-' )
              rc = usage()
              say _myname 'invalid option "'token'"'
              return 1
            else
              _ofilen = token
              token = ''
            endif
          endif

      endwhile

      if ( _ofilen ='' )
           rc = usage(1)
           say ''
           say _myname 'missing output file name'
           return 1
      endif     

      if ( _help = 1 ) 
           rc = usage(1)
           return 1
      endif

return 0

*............................................................................
*
* Check whether an OpenGrADS Extension (udc or udf) is present
*
function check_udx(extension,name)
   has_it = 'no'
   'q ' extension
   if ( rc=0 )
     i = 2
     line = sublin(result,i)
     pline = line
     while ( line != '' | pline !='' )
       token = subwrd(line,1)
       if ( token = name ) 
         has_it = 'yes'
       endif
       i = i + 1
       pline = line
       line = sublin(result,i)
     endwhile
   endif

   return has_it

*............................................................................

*
* chkcfg()  Check whether you need this wrapper.
*

function chkcfg()

      'q config'
      if ( rc != 0 )
         say _myname 'GrADS version appears earlier than 1.7Beta'
         return 1
      endif

*     Check for cairo
*     ---------------
      _hasCairo = 0
      cfg = sublin(result,1)
      i = 1
      version = subwrd(cfg,2)
      token = subwrd(cfg,i)
      while ( token != '' )
         if ( token = 'cairo' ) 
               _hasCairo = 1
         endif
         i = i + 1
         token = subwrd(cfg,i)
      endwhile

*     Check for GXYAT extension (GrADS v2.0)
*     -------------------------------------
      _hasGXYAT = 0
      if ( _hasCairo=0 )
         has_it = check_udx('udc','gxyat')
         if ( has_it = 'yes' )
              _hasGXYAT = 1
         endif
      endif

      if ( _hasGXYAT=1 )
         say 'ERROR: This build of GrADS ' version ' includes the extension GXYAT'
         say 'ERROR: Please disable gxyat.gs'
         return 1
      endif

      if ( _hasCairo = 0 )
         say 'ERROR: This build of GrADS ' version ' has not been built with Cairo'
         say 'ERROR: Please disable gxyat.gs'
         return 1
      endif

return 0

*............................................................................

*
* crtique(nmin,nmax,opt,string)  Returns 0 if the number of words in "string" 
*                            is in between nmin and nmax, returns 1 otherwise.
*

function critique ( nmin, nmax, opt, string)

      n = 1
      while ( subwrd(string,n) != '' ); n = n + 1; endwhile
      n = n - 1

      if ( n < nmin )
          rc = usage()
          say _myname 'you specified "' opt ' ' string '"'
          say _myname 'option "' opt '" requires at least ' nmin ' argument(s)'
          return 1
      endif

      if ( n > nmax )
          rc = usage()
          say _myname 'you specified "' opt ' ' string '"'
          say _myname 'option "' opt '" requires at most ' nmax ' argument(s)'
          return 1
      endif
   

return 0

