*
*   Lats4d is a minimum fuss script for writing NetCDF, HDF-SDS or GRIB
*   files from GrADS using the PCMDI (http://www-pcmdi.llnl.gov) LATS
*   interface. This script requires GrADS Version 1.7.beta.9 or later.
*
*   See usage() for documentation; from GrADS enter "lats4d -h"
*
*   This script has been placed in the Public Domain.
*
*...........................................................................
*
* main(args)  Main driver checking config, handling error conditions, etc.
*
function main ( args )

      _myname = 'lats4d: '
      _version = '2.1.5 of 28 June 2010'

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

*     Consistency check
*     -----------------
      if ( _needLATS=0 ); _hasLATS=0; endif
      if ( _needLATS=1 & _hasLATS=0 )
           rc = 1
           say '<RC> 'rc' </RC>'
           say '</IPC>'
           say 'ERROR: cannot proceed without LATS; try specifying a different -format'
           if ( _quit = 1 ) 
                say _myname 'exiting from GrADS...'
                'quit'
           endif
           return rc
      endif


*     Output file message
*     -------------------
      _fmsg = 'unknown'
      _vmsg = 'creat'
      if ( _format = 'stream' | _format = 'sequential' )
           _fmsg = _format ' file ' _ofname '.bin'
           _fwrite = 1 
     else
         _fwrite = 0
         if ( _format = 'coards' | _format = 'netcdf' | _format = 'nc3')
           if ( _shave>0 | _gzip>=0 )
                _format = 'netcdf4'
          else
                _fmsg = _format ' file ' _ofname '.nc'
                _format = 'netcdf'
          endif
         endif
         if ( _format = 'netcdf4' | _format = 'nc4')
           _fmsg = _format ' file ' _ofname '.nc4'
           _format = 'netcdf4'
         endif
         if ( _format = 'hdf' | _format = 'hdf4')
           _fmsg = _format ' file ' _ofname '.hdf'
           _format = 'hdf4'
         endif
         if ( _format = 'grib' )
              _format = 'grib_only'
         endif
         if ( _format = 'grib_only' | _format = 'grads_grib' )
           _fmsg = _format ' file ' _ofname '.grb'
         endif
         if ( _format = 'stats' )
          _fmsg = 'statistics'
         endif
         n = lenstr(_format)-2
         ext = substr(_format,n,3)
         if ( ext='.gs' | ext='.GS' ) 
              _gsfile = _format
              _fmsg = 'script ' _gsfile
              _vmsg = 'execut'
              _format = 'script'
         endif
         n = lenstr(_format)-3
         ext = substr(_format,n,4)
         if ( ext='.gsf' ) 
              _gsfile = _format
              _fmsg = 'script ' _gsfile
              _vmsg = 'call'
              _format = 'gsfunc'
              rc = gsfallow("on")
             '!rm -rf lats4d_user.gsf'
             '!ln -s ' _gsfile ' lats4d_user.gsf'
         endif
         if ( _fmsg = 'unknown' )
              say _myname 'invalid format "'_format'", exiting GrADS...'
              'quit'
         endif
      endif


*     OK, ready for the real work
*     ---------------------------
      rc = lats4d ( args )
      if ( rc != 0 )
         say _myname 'error '_vmsg'ing ' _fmsg
         say '<RC> 'rc' </RC>'
         say '</IPC>'
      else
         say _myname '' _vmsg 'ed ' _fmsg
      endif

      if ( _quit = 1 ) 
         say _myname 'exiting from GrADS...'
         'quit'
      endif


return rc


*............................................................................

*
* lats4d(args)  The main lats4d entry point.
*

function lats4d ( args )

  if ( _verb = 1 )
      say _myname 'Version ' _version 
  endif

* Open input file and reset dimension environment if desired...
* Assumes global grid, i.e., longitudinal wrapping
* -------------------------------------------------------------
  if ( _ifname != '' )
      'reinit'
      rc=openf(_ifname,_ftype)
      if ( rc != 0 )
         say _myname 'cannot open file "'_ifname'"'
         return rc
      endif
      if ( _ctlinfo )
         say '<ctlinfo>'
         'query ctlinfo'
         say result
         say '</ctlinfo>'
         return 0
      endif
      rc = xyrange()
      'set x ' _xmin ' ' _xmax
      'set y ' _ymin ' ' _ymax
  endif

* Get file number
* ---------------
  'q file'
   if ( rc != 0 )
       say _myname 'no files open; specify "-i" option or open a file'
       return rc
   endif
   _datf = subwrd(result,2)

* Open alternate input file name; must be conformant with
*  main input file name 
* -------------------------------------------------------
  if ( _afname != '' )
      rc=openf(_afname,_ftype)
      if ( rc != 0 )
         say _myname 'cannot open alternate file "'_afname'"'
         return rc
      endif
      _altf = _datf + 1 
  endif

*  Open dimension environment file if so desired,
*  otherwise let dim env file be the same as the current data file
*  ---------------------------------------------------------------
   rc = setdimf()
   if ( rc != 0 )
       say _myname 'could not open dimension env file: ' _dimenv
       return rc
   endif


* File information
* ----------------
   if ( _verb = 1 )
        'q file ' _datf
        say _myname 'Data file is ' 
        say result
        if ( _datf != _dimf )
           'q file ' _dimf
           say _myname 'Dimension environment file is '
           say result
        else
           say _myname 'Dimension environment file same as data file' 
        endif
        if ( _afname != '' )
          'q file ' _altf
           say _myname 'Alternate Data file is ' 
           say result
        endif
   endif


* Metadata describing origin of the dataset
*------------------------------------------
  rc=LATScmd(_setLATS ' model       ' _model)
  rc=LATScmd(_setLATS ' center      ' _center)

* Parameter table
* ---------------
  rc = getvars()
  ch = substr(_table,1,1)
*                                     generate parameter table
  if ( ch = '@' )
       _table = substr(_table,2,256)
       rc = mkptab()
       if ( rc != 0 ); return 1; endif
  endif
*                                     use internal table
  if ( ch = '=' )
       _table = ''
  endif
  if ( _table != '' )
      rc=LATScmd(_setLATS ' parmtab     ' _table)
      id = subwrd(_result,5)
      if ( id = 0 ); return 1; endif
  endif

* LATS comments (Title for GRIB files)
* ------------------------------------
  if ( _title = '' )
     if ( _func = '' )
       comment = 'File created by GrADS using LATS4D available from '
     else
       comment = 'File created by GrADS using LATS4D '
       comment = comment '(-func ' _func ') available from '
     endif
     url = 'http://opengrads.org/wiki/index.php?title=Lats4D'
     rc=LATScmd(_setLATS ' comment ' comment url)
  else
     rc=LATScmd(_setLATS ' comment ' _title)
  endif


* Metadata describing conventions/format
* --------------------------------------
  if ( _needLATS )
     rc=LATScmd(_setLATS ' convention ' _format)
     if ( rc != 0 )
       say _myname 'not really, we stop right here'
       return 1
     endif
  endif

* Get (z,t) range on file
* -----------------------
  rc = ztrange()

* Metadata describing time frequency of grids
* -------------------------------------------
  if ( _freq = '' )
       rc = getfreq()
       if ( rc != 0 )
          say _myname 'could not determine time frequency; specify -freq option'
          return rc
       endif
  endif

  rc=LATScmd(_setLATS ' calendar  '  _cal)
  if ( rc != 0 ); return rc; endif
  if (_gzip>=0)
     rc=LATScmd(_setLATS ' gzip  ' _gzip)
     if ( rc != 0 ); return rc; endif
     if ( _verb = 1 )
         say _myname 'compressing with GZIP level ' _gzip
     endif
  endif
  if (_shave>0)
     rc=LATScmd(_setLATS ' shave  ' _shave)
     if ( rc != 0 ); return rc; endif
     if ( _verb = 1 )
         say _myname 'shaving ' _shave ' bits from mantissa and compressing'
     endif
  endif
  rc=LATScmd(_setLATS ' frequency '  _freq)
  if ( rc != 0 ); return rc; endif
  if ( _tinc='' ); _tinc=1; endif
  odeltat = _tinc * _deltat
  rc=LATScmd(_setLATS ' deltat    '  odeltat)
  if ( rc != 0 ); return rc; endif

* Redefine time range (_tmin,_tmax) if user wants to
* --------------------------------------------------
  rc = gettim()
  if ( rc = 1 )
       say _myname 'invalid time range ' _time
       return 
  endif

* If -ntimes specified, limit tmax
* --------------------------------
  if ( _ntimes > 0 )
       _tmax = _tmin + _ntimes - 1
  endif

  if ( _verb = 1 )
      'set t ' _tmin ' ' _tmax
      'q time'
      t1 = subwrd(result,3)
      t2 = subwrd(result,5)
      say _myname 'time range: ' t1 ' ' t2 ' by ' _tinc ', delta t: ' _deltat ' ' _freq
      'set t ' _tmin
  endif
        
* If -nlevels specified, limit _zmax
* --------------------------------
  if ( _nlevels > 0 )
       _zmax = _zmin + _nlevels - 1
  endif

  if ( _verb = 1 )
      'set z ' _zmin ' ' _zmax
  endif
        
* Define the vertical dimension
* -----------------------------
  if ( _levels = '' )
      rc = getlevs()
  endif
  if ( _verb = 1 )
      say _myname 'vertical levels: ' _levels
  endif
  rc = setlevs()
  if ( rc = 1 ); return 1; endif

* Set LATS grid type
* ------------------
  rc=LATScmd(_setLATS ' gridtype ' _gridtype)
  if ( rc != 0 ); return rc; endif

* Instruct LATS to use the dimension environment to set the LATS time
* -------------------------------------------------------------------
  rc=LATScmd(_setLATS ' timeoption dim_env')
  if ( rc != 0 ); return rc; endif

* Define the horizontal grid (based on dim env file)
* --------------------------------------------------
  'set dfile ' _dimf
  rc = setgrid()
  if ( rc != 0 ); return rc; endif
  if ( _verb = 1 )
      say _myname 'latitudinal  range: ' _lat
      say _myname 'longitudinal range: ' _lon
  endif
  _gid = getgid()
   if ( _gid < 1 ); return 1; endif
  'set dfile ' _datf

* Define the output file name
* ---------------------------
  if ( _fwrite = 1 )
       if ( _format = 'stream' )
             'set fwrite ' _endianess ' -st '_ofname'.bin'
       else
             'set fwrite ' _endianess ' -sq '_ofname'.bin'
       endif
  else
      if ( _needLATS )
         rc=LATScmd(_setLATS ' create ' _ofname)
         _fid = subwrd(_result,5)
          if ( _fid < 1 ); return 1; endif
     endif
  endif

* Define all the variables to be written to the LATS file
* -------------------------------------------------------
  rc = defvars()
  if ( rc != 0 ) 
       say _myname 'fatal error defining variables'
       return rc 
  endif
  if ( _verb = 1 )
      if ( _func  !='' ); say _myname 'Function expression: ' _func; endif
      if ( _svars !='' ); say _myname 'surface   variables: ' _svars ; endif
      if ( _uvars !='' ); say _myname 'upper air variables: ' _uvars ; endif
  endif
  if ( _svars='' & _uvars='' )
	say _myname 'All invalid sfc/upper variables: ' _vars
	return 1
  endif

*  Put GrADS in LATS output mode
*  -----------------------------
   if ( _fwrite = 1 )
      'set gxout fwrite'
   else
      if ( _needLATS )
         if ( _udxLATS=0 )
              rc=LATScmd('set gxout latsdata')
              if ( rc != 0 ); return rc; endif
         endif
      else
         'set gxout stat'
      endif
   endif

*  Now, if user wants time mean then redefine time environment
*  -----------------------------------------------------------
   if ( _mean = 1 )
      _tbeg = _tmin
      _tend = _tmax
      if ( _tinc = '' ); _tinc = 1; endif
      _tmid = ( _tmin + _tmax ) / 2
      if ( _tmean != '' ); _tmid = _tmean; endif
      _tmin = _tmid
      _tmax = _tmid
      if ( _verb = 1 )
         'set t ' _tmid
         'q time'
         t1 = subwrd(result,3)
         say _myname 'time average grid valid at ' t1
         say _myname 'averaging increment: ' _tinc ', delta t: ' _deltat ' ' _freq
      endif
   endif

* The LATS interface only allows one horizontal slice of data
* to be written at a time (z and t dimensions must be fixed),
* so we setup 2 loops
* --------------------------------------------------------------
   if ( _format = 'stats' )
      say ''
      say '<stats>'
   endif

* Check number of time steps
* --------------------------
  ntimes = _tmax - _tmin + 1
  if ( ntimes>_mxtimes )
       say ''
       say 'ERROR: number of time steps larger than current maximum ' _mxtimes
       say 'ERROR: if you really intended to write out that many timesteps, specify'
       say _myname '    -mxtimes ' ntimes
       say 'ERROR: or else verify your -time option'
       say ''
       return 1
  endif

* Loop over time...
* -----------------
  _t = _tmin
  while ( _t <= _tmax )

     'set t ' _t
    if ( rc != 0 ); return rc; endif
    'set z ' _zmin
    if ( rc != 0 ); return rc; endif

      if ( _verb = 1 & _format != 'stats' )
        'q time'
        time = subwrd(result,3)
        if ( _format = 'script' )
           say _myname 'running ' _fmsg ' on ' time
        else
        if ( _format = 'gsfunc' )
           say _myname 'calling ' _fmsg ' on ' time
        else
        if ( _format != 'stats' )
           say _myname 'writing to ' _fmsg ' on ' time
        endif
        endif
        endif

      endif

     if ( _format = 'stats' )
        'q time'
        time = subwrd(result,3)
        filen = subwrd(_ifname,1)
        say '+'
        say '+ <> Statistics on ' time ' for "' basename(filen) '"'
        if ( _afname != '' )
           filen = subwrd(_afname,1)
           say '+ <> Secondary input file is        "' basename(filen) '"'
           if ( _func = '' )
                _func = '@.1-@.2'
           endif
        endif
        if ( _func != '' )
             say ' >>> Applying function "' _func '"'
        endif
        _pad = '+ '
     endif

*    Write surface variables
*    -----------------------
     n = 1

     if ( _format = 'stats' & _nsvar>0 );  pstat('HEADER'); endif
     while ( n <= _nsvar )
        var = subwrd(_svars,n)
        name = var
        if ( _dimenv != '' )
           var = var '.' _datf '(t=' _t ')'
        endif 
        var = subst(var,_func)
        if ( _mean = 1 )
           var = 'ave('var',t='_tbeg',t='_tend','_tinc')'
        endif
        vid = subwrd(_svids,n)
        if ( _needLATS )
            rc=LATScmd(_setLATS ' write  ' _fid ' ' vid)
            if ( rc != 0 ); return rc; endif
        endif
        'set dfile ' _dimf
        if ( _format = 'stats' ) 
             rc = pstat(name,var,'sfc')
        else
        if ( _format = 'script' ) 
        'run ' _gsfile ' ' var
        else
        if ( _format = 'gsfunc' ) 
           rc = lats4d_user(var)
           if ( rc='' ); rc=0; endif
        else
            if ( _udxLATS=1 & _fwrite!=1)
                  rc=LATScmd('lats_data ' var)
            else
                 'display ' var
            endif
        endif
        endif
        endif

        if ( rc !=0 ); return rc; endif
        'set dfile ' _datf
        n = n + 1

     endwhile


*
*    Loop over upper air variables...
*    --------------------------------
     n = 1
     while ( n <= _nuvar )

         var = subwrd(_uvars,n)
         name = var
         if ( _dimenv           != '' )
             var = var '.' _datf '(t=' _t ')'
         endif 
         var = subst(var,_func)
         if ( _mean = 1 )
              var = 'ave('var',t='_tbeg',t='_tend','_tinc')'
         endif
         vid = subwrd(_uvids,n)


*        Loop over levels...
*        -------------------
         k = 1
         _level = subwrd(_levels,k)
         if ( _format = 'stats' );  pstat('HEADER'); endif
         while ( _level != '' )

              _latlevel = subwrd(_latlevels,k)

              'set lev ' _level

              if ( _needLATS )
                   rc=LATScmd(_setLATS ' write  ' _fid ' ' vid ' ' _latlevel)
                   if ( rc != 0 ); return rc; endif
              endif

              'set dfile ' _dimf
              if ( _format = 'stats' ) 
                 rc = pstat(name,var,_level)
              else
              if ( _format = 'script' ) 
                 'run ' _gsfile ' ' var
              else
              if ( _format = 'gsfunc' ) 
                 rc = lats4d_user(var)
                 if ( rc = '' ); rc=0; endif
              else 
                 if ( _udxLATS=1 & _fwrite!=1)
                      rc=LATScmd('lats_data ' var)
                 else
                      'display ' var
                 endif
              endif
              endif
              endif
              if ( rc != 0 ); return rc; endif
              'set dfile ' _datf

              k = k + 1
              _level = subwrd(_levels,k)

         endwhile
         if ( _format = 'stats' );  pstat('TOTAL',name); endif

         n = n + 1

     endwhile

     _t = _t + _tinc

   endwhile

   if ( _format = 'stats' )
      say ''
      say '</stats>'
   endif

   rc = restdim()

*  Close LATS file
*  ---------------
  if ( _fwrite = 1 )
     'disable fwrite'
  else
     if ( _needLATS )
        rc=LATScmd(_setLATS ' close ' _fid)
        if ( rc != 0 ); return rc; endif
     endif
  endif

* All done
* --------
  return 0

*.........................................................................

function usage(flag)

      say ''
      say 'NAME'
      say ''
      say '     lats4d - LATS for Dummies (Version ' _version ')'
      say ''
      say 'SYNOPSIS'
      say ''
      say '     lats4d  [-i fn] [-o fn] [-cal calendar] [-center ctr] [-de fn]'
      say '             [-format fmt] [-ftype ctl|sdf|xdf] [-freq ...] '
      say '             [-func expr] [-h] [-grid type]'
      say '             [-lat y1 y2] [-levs ...] [-lon x1 x2] '
      say '             [-model mod] [-mean] [-precision nbits] [-table tab] '
      say '             [-time t1 t2 [tincr]] [-title ...]'
      say '             [-v] [-vars ...] [-xvars] [-zrev] [-q] '
      say ''

      if ( flag != 1 )
                say '     Enter "lats4d -h" for additional information'
                say ''
                return
      endif

      say 'DESCRIPTION'
      say ''
      say '     A minimum fuss gs script for writing NetCDF, HDF-SDS or '
      say '     GRIB files from GrADS using the PCMDI LATS interface '
      say '     (http://www-pcmdi.llnl.gov).  This script can serve as a'
      say '     general purpose file conversion and subsetting utility.'
      say '     Any GrADS readable file (GrADS IEEE, GSFC Phoenix, GRIB, '
      say '     NetCDF or HDF-SDS) can be subset and converted to GRIB, '
      say '     NetCDF, HDF-SDS, flat binary (direct access) or sequential'
      say '     (FORTRAN) binary using a single command line. When writing'
      say '     binary files, the user can request the files to be little '
      say '     or big endian, regardless of the endianess of the hardware.'
      say '     '
      say '     When invoked without arguments this script will create a' 
      say '     COARDS compliant NetCDF or HDF-SDS file named '
      say '     "grads.lats.nc", with all the contents of the default '
      say '     file (all variables, levels, times). The file name and '
      say '     several other attributes can be customized at the command' 
      say '     line, see OPTIONS below.'
      say '     '
      say '     IN GrADS v1.x, NetCDF files are obtained by running this script under the'
      say '     executable "gradsnc".  HDF-SDS files can be produced with'
      say '     the "gradshdf" executable. Notice that the classic version'
      say '     of grads, "gradsc", does not include support for LATS and'
      say '     therefore cannot be used with lats4d. This script requires'
      say '     GrADS Version 1.7.beta.9 or later.' 
      say ''
      say 'OPTIONS'
      say ''
      say '     -i      fn              input file name; it can be any'
      say '                             of the following:'
      say '                             - an ASCII control (ctl) file'
      say '                               used for GRIB, IEEE files, and'
      say '                               as of GrADS v1.9, for NetCDF/HDF'
      say '                               files as well.'
      say '                             - a binary NetCDF file/template' 
      say '                             - a binary HDF-SDS file/template'
      say '                             - an ASCII data descriptor file (ddf)'
      say '                               used for non-COARDS compliant'
      say '                               NetCDF/HDF-SDS files through'
      say '                               the "xdfopen" command'
      say '                             If the option "-ftype" is not'
      say '                             specified lats4d attempts to'
      say '                             determine the file type using'
      say '                             a heuristic algorithm.'
      say '                             NOTE:  When the option "-i" is '
      say '                             specified a GrADS "reinit" is '
      say '                             issued before the file is opened.'
      say '                             For NetCDF/HDF-SDS templates in'
      say '                             GrADS consult the SDFopen home'
      say '                             page listed under SEE ALSO'
      say ''
      say '     -j      fn              secondary input file name with same'
      say '                             structure as the the primary input'
      say '                             file (same variables, grid, times).'
      say '                             This is useful for comparing files.'
      say '                             You can also specify -func for'
      say '                             controling how the 2 files are compared.'
      say '                             By default, -func is set to "@.1-@.2"'
      say '                             for the difference of the 2 files.'
      say '                             The default is no secondary file.'
      say ''
      say '     -o      fn              output (base) file name; default: '
      say '                             "grads.lats"'
      say ''
      say '     -be                     when format is "stream" or "sequential"'
      say '                             this option forces the file to be'
      say '                             BIG ENDIAN, regardless of the native'
      say '                             endianess'
      say ''
      say '     -cal    calendar        calendar type: "standard", "noleap", '
      say '                             "clim", or "climleap"; default: '
      say '                             "standard"'
      say ''
      say '     -center ctr             center, e.g., PCMDI, GSFC, NCEP, etc'
      say ''
      say '     -ctlinfo                performs a "q ctlinfo" and writes it'
      say '                             to the screen. '
      say ''
      say '     -de     fn              Dimension environment file name;'
      say '                             defaut: same as "-i" argument.'
      say '                             This option is useful for using'
      say '                             lats4d with the regridding, e.g.,'
      say '                             the re() function. See REGRIDDING below'
      say '                             for more information.'
      say ''
      say '     -format fmt             LATS file format; fmt can be one of the'
      say '                             following:'
      say '                                 coards'
      say '                                 netcdf        (*)'
      say '                                 netcdf4       (*)'
      say '                                 hdf4          (*)'
      say '                                 grib'
      say '                                 grads_grib'
      say '                                 sequential'
      say '                                 stream'
      say '                                 stats'
      say '                                 $script.gs'
      say '                                 $script.gsf'
      say '                             where $script is a generic script name. '
      say '                             Specify "grads_grib" instead of "grib" for'
      say '                             getting ctl and gribmap files as well.'
      say '                             See FORMAT OPTIONS below for more information.'
      say '                             NOTE: Formats netcdf, netcdf4 and hdf4 requires'
      say '                                   GrADS Version v2.0.a7.oga.3 or later.'
      say '                                   In GrADS v1.x, NetCDF/HDF output is'
      say '                                   obtained with format "coards", and the actual'
      say '                                   output format is determined by the name of'
      say '                                   GrADS binary (either gradsnc or gradshdf.)'
      say ''
      say '    -ftype ctl|sdf|xdf       Specifies the input file type:'
      say '                             ctl  standard GrADS control (ctl)'
      say '                                  file used for IEEE and GRIB '
      say '                                  files'
      say '                             sdf  COARDS compliant NetCDF/HDF-SDS'
      say '                                  binary data file'
      say '                             xdf  data descriptor file (ddf)'
      say '                                  used for non-COARDS compliant'
      say '                                  NetCDF/HDF-SDS files through'
      say '                                  the "xdfopen" command'
      say '                             By default lats4d attempts to '
      say '                             determine the file type using a'
      say '                             heuristic algorithm; use this'
      say '                             option if lats4d fails to properly'
      say '                             detect the input file type'
      say '                             '
      say '     -freq  [n] unit         Time frequency of the input file.'
      say '                             LATS4D usually detects this from'
      say '                             the GrADS metadata, but sometimes'
      say '                             it fails with an error message.'
      say '                             In such cases use this option.'
      say '                             Example: -freq 6 hourly '
      say '                             NOTE: unlike GrADS, LATS does not'
      say '                             support time frequency in minutes'
      say '                             Default: n=1, e.g., -freq daily'
      say '                             '
      say '    -func expr               Evaluates the expression "expr"'
      say '                             before writing  to the output'
      say '                             file. The character "@" is used'
      say '                             to denote the variable name in'
      say '                             "expr". Example:'
      say '                             '
      say '                               -func ave(@,t-1,t+1)'
      say '                             '
      say '                             will replace "@" with each '
      say '                             variable name and produce a file'
      say '                             with running means. Default:'
      say '                             expr = @'
      say '                             '
      say '     -grid type              Grid type: linear, gaussian or'
      say '                             generic; default: linear'
      say '                             '
      say '     -gzip level             Specifies the gzip compression level.'
      say '                             This option applies to NetCDF4 output.'
      say '                             The "level" parameter must be in the'
      say '                             range [0,9], where the higher the level'
      say '                             the hearder it will work to compress.'
      say '                             NOTE: This option requires GrADS Version'
      say '                                   v2.0.a7.oga.3 or later.'
      say '                             '
      say '     -h                      displays this man page'
      say ''
      say '     -halo left [right]      Specify the halo width for the satellite'
      say '                             mask. This option is ignored unless option -mask'
      say '                             is specified.'
      say ''
      say '     -lat    y1 y2           latitude range, e.g., "-30 30" for '
      say '                             30S thru 30N;  default: latitude '
      say '                             dimension environment'
      say ''
      say '     -le                     when format is "stream" or "sequential"'
      say '                             this option forces the file to be'
      say '                             LITTLE ENDIAN, regardless of the'
      say '                             native endianess'
      say ''
      say '     -levs   lev1 ... levN   list of levels; default: all levels'
      say ''
      say '     -lon    x1 x2           longitude range, e.g., "-50 20" for '
      say '                             50W thru 20E; default: longitude '
      say '                             dimension environment'
      say ''
      say '     -mask sat               Mask the output variables according to the'
      say '                             orbits of the satellite "sat". This is '
      say '                             accomplished with function orb_mask() '
      say '                             provided by the ORB extension. Currently, '
      say '                             the following values of "sat" are supported:'
      say ''
      say '                                    Sat              Swath (km)'
      say '                              ---------------      -------------'
      say '                               airs                    1650'
      say '                               amsu_a                  1650'
      say '                               amsr_e                  1445'
      say '                               aqua                       0'
      say '                               aster                     60'
      say '                               aura                       0'
      say '                               calipso                    0'
      say '                               cloudsat                   0'
      say '                               hirdls                  3000'
      say '                               hsb                     1650'
      say '                               misr                     380'
      say '                               modis_terra             2330'
      say '                               modis_terra_day         2330  (day_time only)'
      say '                               modis_aqua              2330'
      say '                               modis_aqua_day          2330  (day_time only)'
      say '                               mopitt                   616'
      say '                               omi                     2600'
      say '                               omi_day                 2600  (day time only)'
      say '                               terra                      0'
      say '                               tes                      180'
      say '                              '
      say '                             You can slo specify option -halo to '
      say '                             specify gridpoints around the mask.'
      say '                             Consult the ORB documentation for more details:'
      say '                                   http://opengrads.org/doc/udxt/orb/'
      say ''
      say '     -mxtimes n              Maximum number of timesteps to be written to file;'
      say '                             default is 744'
      say ''
      say '     -mean                   saves time mean to file; the actual'
      say '                             averaging period is specified with'
      say '                             the "-time" option; the "tincr" '
      say '                             parameter is the time increment'
      say '                             for the average (see GrADS ave()'
      say '                             function)'
      say ''
      say '     -tmean                  specify output "t" for the time mean;'
      say '                             default is the mid time of the'
      say '                             averaging interval. Noice that "t"'
      say '                             is an integer'
      say ''
      say '     -model  mod             model name, e.g., GEOS/DAS'
      say ''
      say '     -nlevels n              Specify number of level steps to be written'
      say '                             to file'
      say ''
      say '     -ntimes n               Specify number of time steps to be written'
      say '                             to file; it superseeds the -time option'
      say ''
      say '     -precision nbits        specify the number of bits of'
      say '                             precision when storing in GRIB.'
      say '                             This option is only used when'
      say '                             lats4d automatically generates'
      say '                             a parameter table file (see option'
      say '                             -table below), and the output'
      say '                             format is "grib" or "grads_grib".'
      say '                             Default: nbits = 16'
      say ''
      say '     -shave [nbits]          Specify number of mantissa bits to shave'
      say '                             before compression. Default is nbits=12;'
      say '                             nbits must be in the range [1,23]. '
      say '                             This feature requires netcdf4 output and'
      say '                             will automatically trigger gzip level 2'
      say '                             compression (see -zip option).'
      say '                             NOTE: This option requires GrADS Version'
      say '                                   v2.0.a7.oga.3 or later.'
      say ''
      say '     -table  tab             LATS parameter table file, e.g., '
      say '                             "dao.lats.table". If the table name'
      say '                             starts with "@" (e.g., @my.table)'
      say '                             then lats4d automatically generates'
      say '                             a LATS parameter table appropriate'
      say '                             for the current file and saves it '
      say '                             to a file; the file name in this'
      say '                             case is the same as "tab" with the'
      say '                             @ character removed (e.g., my.table).'
      say '                             Specify tab as "=" for using the'
      say '                             internal LATS parameter table.'
      say '                             See below for additional info on'
      say '                             parameter tables.'
      say '                             Default: @.grads.lats.table'
      say ''
      say ''
      say '     -time   t1 t2 [tincr]   time range and time increment in '
      say '                             units of the "delta t" in the'
      say '                             input file; "tincr" is optional;'
      say '                             Example: "0z1dec91 18z31dec91 2"'
      say '                                       to write every other '
      say '                                       time step' 
      say '                             Defaults: (t1,t2) is taken from '
      say '                             the time dimension environment,' 
      say '                             and tincr=1. Note: enter "= ="'
      say '                             for keeping the default values'
      say '                             for (t1,t2) while specifying tincr'
      say ''
      say '     -title text             output dataset TITLE for GRIB files,'
      say '                             COMMENTS for NetCDF/HDF files'
      say ''
      say '     -v                      verbose mode'
      say ''
      say '     -vars   var1 ... varN   list of variables; default: all '
      say '                             variables on the current file will'
      say '                             be written to the output file'
      say ''
      say '     -xsfc                   exclude all surface variables'
      say ''
      say '     -xvars  var1 ... varN   list of variables to exclude;'
      say '                             default: none'
      say ''
      say '     -xupper                 exclude all upper air variables'
      say ''
      say '     -zrev                   reverse order of vertical levels'
      say ''
      say '     -q                      quits GrADS upon return'
      say '     '
      say 'FORMAT OPTIONS'
      say '     '
      say '     Although Lats4d was originally designed as a frontend to'
      say '     the LATS interface, it has grown to become somewhat of a generic'
      say '     "iterator" for GrADS redable files. In fact, some "-format" options'
      say '     do not involve LATS at all. In particular,'
      say '     '
      say '     1) The options "-format stream" and "-format sequential" create'
      say '        binary files using the GrADS command "set gxout fwrite".'
      say '        A useful feature not implemented yet is the ability of '
      say '        automatically creating a ctl file.'
      say '     2) The option "-format stats" does not write any file. Instead,'
      say '        it just prints statistics about the variables on file, for'
      say '        each time and level. When used in conjunction with "-j"'
      say '        it provides a convenient way of comparing two conformant files.'
      say '     3) The option "-format $script.gs" executes the GrADS command'
      say '        "run $script.gs" for each variable, time and level. You could'
      say '        use this feature to plot each variable on your file, for'
      say '        example. This works with older version of GrADS that do not'
      say '        support script libraries.'
      say '     4) Likewise, the option "-format $script.gsf" calls the function'
      say '        "lats4d_user" (the function must be called this) in the'
      say '        script library $script.gsf. In fact, lats4d executes the '
      say '        command:'
      say '                     rc = lats4d_user(var)'
      say '        whether "var" is the variable being worked on. Recall that when'
      say '        running a function from a script library you have access to all'
      say '        the global variables in lats4d.gs. This feature requires write '
      say '        access to the directory where you run lats4d from, and does not'
      say '        work with older versions og GrADS (say, v1.7beta9)'
      say '                             '
      say 'LATS PARAMETER TABLES'
      say '     '
      say '     LATS maintains an internal parameter table that prescribes'
      say '     variable names, description, units, datatype, basic'
      say '     structure (e.g., upper air or surface), and compression'
      say '     (GRIB options). These descriptors are inferred from the'
      say '     parameter name only, and thus most of the metadata needed'
      say '     to write GRIB and/or netCDF data are located in the'
      say '     parameter table and need not be specified at the command'
      say '     line. The option "-table" is provided to override the '
      say '     internal table with an external parameter file. For'
      say '     additional information on LATS parameter tables'
      say '     consult http://www-pcmdi.llnl.gov/software/lats/.'
      say ''
      say '     The only inconvenience of this approach is that variables'
      say '     names being written to file must match those defined in '
      say '     this internal parameter table (which is essentially the '
      say '     same as the "AMIPS2" LATS table, see URL above).'
      say '     To circumvent this problem lats4d can automatically'
      say '     generate a parameter table based on the current file'
      say '     metadata. Since GrADS keeps no units or GRIB packing'
      say '     information, this parameter file sets the units entry'
      say '     to blank and uses defaults for the GRIB packing parameters.'
      say '     The default GRIB packing algorithm is "16-bit fixed width '
      say '     compression" and produces GRIB files which are about half'
      say '     the size of NetCDF/HDF-SDS files. The option "-precision"'
      say '     allows the user to define the number of bits of precision'
      say '     at the command line; see EXAMPLES ex2a,b,c below.' 
      say '     If you care about having proper metadata written to'
      say '     your file or need more efficient GRIB packing then you can '
      say '     either change your variable names to match those in the '
      say '     internal LATS table, or customize an existing LATS parameter'
      say '     table; see URL above for sample parameter tables.'
      say '     '
      say 'LATS QUALITY CONTROL WARNINGS'
      say '     '
      say '     Quality control (QC) information is included in some '
      say '     LATS parameter tables to help the user ensure that their'
      say '     data is being written properly. In such cases, if LATS'
      say '     detects suspect data it writes a warning message to the'
      say '     screen and saves additional information in a log file.'
      say '     Consult the LATS home page for additional information.'
      say '     '
      say 'REGRIDDING'
      say '     '
      say '     This script can be used with generic regridding functions'
      say '     such as re() of Mike Fiorino`s classic user'
      say '     defined function (UDF) regrid2(). This combination'
      say '     allows you to convert any GrADS redable file to any'
      say '     other horizontal resolution/domain of your choice. '
      say '     Here is a quick roadmap:'
      say '     '
      say '     1. In GrADS v1.9beta and earlier, it was required to '
      say '        install the UDF regrid2(). Starting with 1.9-rc1, '
      say '        the re() function became available as a dynaically '
      say '        linked user defined extension. As of this writing, '
      say '        re() has been built-in in GrADS v1.10 and it is being'
      say '        considered for inclusion  in GrADS v2, possibily with'
      say '        a different name.'
      say '     '
      say '     2. If you already have a sample file at the desired new'
      say '        resolution, great! Otherwise you can get one by creating '
      say '        a fake GrADS control file. There are a few samples'
      say '        on the last4d home page: geos1x1.ctl, geos4x5.ctl and'
      say '        geos2x25.ctl. This file is used to define the dimension'
      say '        environment at the new desired resolution through the'
      say '        "-de" option.'
      say '     '
      say '     3. Here is an example which converts the sample model.???'
      say '        data file from 4x5 (latxlon) resolution to 1x1:'
      say '     '
      say '        lats4d -i model -de geos1x1 \ '
      say '               -func re(@,360,linear,-180,1,181,linear,-90,1,bl)'
      say '     '
      say '        The resulting "grads.lats.nc" file is at 1x1 degree'
      say '        resolution.'
      say '     '
      say '     4. To facilitate regridding operations to well known (well,'
      say '        at least to the developers) grids, a few ad-hoc options'
      say '        have been introduced, e.g.,'
      say '     '
      say '        -ncept62    NCEP T62 gaussian grid   '
      say '        -ncept126   NCEP T126 gaussian grid   '
      say '        -ncep2.5    NCEP 2.5x2.5 global grid used for surface'
      say '                    fields (Reanalysis 2): [90S,90N], [0,360) '
      say '     '
      say '        -era2.5     Same as NCEP 2.5'
      say '     '
      say '        -gpcp2.5    GPCP 2.5x2.5 lat/lon grid: [88.75S,875N], [1.25E,358.75]'
      say '                    Notice that this grid differs from NCEP/ERA 2.5 grid.'
      say '     '
      say '        -jrat106    Japanese re-analysis'
      say '     '
      say '        -20cr2x2    2x2 lat/lon grid: [90S,90N],[0,360)'
      say '     '
      say '        -osset511   ECMFF OSSE Nature Run (T511)'
      say '     '
      say '        -merra1.25  NASA MERRA Reananlysis reduced grid:'
      say '                    [89.375S,89.375N], [179.375W,179.375E]'
      say '        -merra0.5   NASA MERRA Re-analysis full grids: '
      say '                    [90S,90N], [180W,180E), same as -geos0.5_'
      say '     '
      say '        -geos0.25  '
      say '        -geos0.5  '
      say '        -geos1x125   NASA GEOS grids: [90S,90N], [180W,180E)'
      say '        -geos1x1     All these options use the 4x5 aspect ratio' 
      say '        -geos4x5'  
      say '        -geos2x25   '
      say '     '
      say '        -geos0.25_  Old GEOS-5 1/3x1/4 grid: [90S,90N], [180W,180E)'
      say '        -geos0.5_   Old GEOS-5 2/3x1/2 grid:'
      say '     '
      say '        -fv1x125'
      say '        -fv2x25     NASA Finite-volume GCM (a.k.a. GEOS-4):'
      say '        -fv4x5      [90S,90N], [0,360)'
      say '     '
      say '        -lw2x25    Same as geos2x25 + spectral filter (waves 0-3)'
      say '        -iw2x25    Same as geos2x25 + spectral filter (waves 4-9)'
      say '        -sw2x25    Same as geos2x25 + spectral filter (waves 10-20)'
      say '                   (requires sh_filt() extension)'
      say '     '
      say '     For each of these options there are variants "a" for box-'
      say '     averagig, "s" for bessel interpolation, and "v" for the'
      say '     voting method (assuming vmin=vmax=0.5). The default is'
      say '     linear interpolation. For example, use -ncep2.5 for linear'
      say '     interpolation, -ncep2.5a for box-averaging and -ncep2.5s'
      say '     for bessel interpolation.'
      say '     '
      say 'EXAMPLES'
      say ''
      say '     Download files "model.ctl", "model.gmp" and "model.grb"'
      say '     from http://dao.gsfc.nasa.gov/software/grads/lats4d/.'
      say '     Then start "gradsnc" or "gradshdf" and try these,'
      say '     carefully examining the files produced:'
      say '     '
      say '     lats4d -h'
      say '     lats4d -v -q -i model -o ex1 '
      say '     lats4d -v -q -i model -o ex2a -format grads_grib'
      say '     lats4d -v -q -i model -o ex2b -format grads_grib -precision 8'
*     say '     lats4d -v -q -i model -o ex2c -format grads_grib -precision 32'
      say '     lats4d -v -q -i model -o ex3 -levs 700 500 -vars ua va'
      say '     lats4d -v -q -i model -o ex4 -time 1jan1987 3jan1987'
      say '     lats4d -v -q -i model -o ex5 -time = = 2'
      say '     lats4d -v -q -i model -o ex6 -mean'
      say '     lats4d -v -q -i model -o ex7 -mean -time = = 2'
      say '     lats4d -v -q -i model -o ex8 -lat 20 70 -lon -140 -60'
      say ''
      say '     The following examples may not produce any output file:'
      say ''
      say '     lats4d -v -q -i model -format stats'
      say '     lats4d -v -q -i model -format user.gs'
      say '     lats4d -v -q -i model -format user.gsf'
      say ''
      say '     Here is how you can use lats4d to compare 2 structurally'
      say '     similar files:'
      say ''
      say '     lats4d -v -q -i model1 -j model2 -format stats'
      say '     lats4d -v -q -i model1 -j model2 -format stats \'
      say '            -func "200*abs((@.1-@.2))/(abs(@.1)+abs(@.2))"'
      say ''
      say '     Note: the "-q" option above is to make sure you'
      say '           restart GrADS; see BUGS below. You may want to'
      say '           enter these from your OS shell, e.g.,'
      say ''
      say '     % gradsnc -blc "lats4d -v -q -i model -o ex1"'
      say ''
      say '    The sh(1) script "lats4d" allows you to enter lats4d'
      say '    options directly from the Unix command line, e.g.,'
      say ''
      say '    % lats4d -v -i model -o ex1 '
      say ''
      say 'BUGS'
      say ''
      say '     Sometimes lats4d will only work if you exit and'
      say '     restart GrADS.'
      say ''
      say '     The option "-precision 32" does not quite work. This'
      say '     appears to be a LATS bug.'
      say ''
      say '     Because of a limitation in the GRIB format, "grib" or '
      say '     "grads_grib" output cannot have levels where p<1.'
      say '     To circumvent this problem, a hybrid level number is'
      say '     is used in such cases.'
      say ''
      say '     When using LATS, the initial time in the output file'
      say '     have the minutes set to zero.'
      say ''
      say 'SEE ALSO    '
      say ''
      say '     GrADS   http://grads.iges.org/grads/   '
      say '     LATS    http://opengrads.org/doc/udxt/lats/'
      say '     LATS4D  http://opengrads.org/wiki/index.php?title=LATS4D'
      say '     SDFopen http://www.cdc.noaa.gov/~hoop/grads.html'
      say '     XDFopen http://www.cdc.noaa.gov/~hoop/xdfopen.shtml'
      say '     NetCDF  http://www.unidata.ucar.edu/packages/netcdf/'
      say '     HDF     http://hdf.ncsa.uiuc.edu/'
      say '     GRIB    ftp://ncardata.ucar.edu/docs/grib/prev-vers/guide.txt'
      say '             http://www.wmo.ch/web/www/reports/Guide-binary-2.html'
      say '     ORB     http://opengrads.org/doc/udxt/orb/'
      say '     '
      say 'LICENSING'
      say ''
      say '     This sript has ben placed in the public domain.'
      say ''
      say 'NO WARRANTY'
      say '     '
      say '     Because lats4d is provided free of charge, it is provided'
      say '     "as is" WITHOUT WARRANTY OF ANY KIND, either expressed or'
      say '     implied, including, but not limited to, the implied'
      say '     warranties of merchantability and fitness for a particular'
      say '     purpose. USE AT YOUR OWN RISK.'
      say '     '
      say 'CREDITS'
      say ''
      say '    Arlindo da Silva (NASA/GSFC) wrote the lats4d.gs script. '
      say '    Mike Fiorino (PCMDI/LLNL) wrote the LATS interface to'
      say '    GrADS. Robert Drach, Mike Fiorino and Peter Gleckler'
      say '    (PCMDI/LLNL) wrote the LATS library.'
      say ''

return 1

*.........................................................................

*
* parsecmd() Parse command line arguments
*

function parsecmd(args)

*
*     Note: customize defaults for your site
*
      _ifname = ''
      _afname = ''
      _ofname = 'grads.lats'
      _format = 'coards'
      _fwrite = 0
      _endianess = ''
      _model  = 'geos/das'
      _center = 'gsfc'
      _table  = '@.grads.lats.table'
      _precision = 16
      _vars = ''
      _xvars = ''
      _xsfc = ''
      _xupper = ''
      _func = ''
      _dimenv = ''
      _title = ''

      _lat = ''
      _lon = ''
      _levels = ''
      _time = ''
      _halo = ''
      _mask = ''
      _ntimes = -1
      _nlevels = -1
      _mxtimes = 744
      _tmean = ''
      _tinc = ''
      _freq = ''
      _ftype  = ''

      _gridtype = 'linear'

      _help = 0
      _verb = 0
      _ctlinfo = 0
      _quit = 0
      _mean = 0
      _zrev = 0

      _cal  = 'standard'

      _gzip = -1
      _shave = -1

      _regrid2 = 0

      options = '-model -center -table -v -q -i -j -o -format -vars -levs -time -ntimes -nlevels -mxtimes'
      options = options ' -h -help -lat -lon -cal -gzip -shave -mean -precision -ftype -tmean'
      options = options ' -grid -func -zrev -de -title -xvars -xsfc -xupper'
      options = options ' -be -le -ctlinfo -mask -halo'

      options = options ' -regrid2'
      options = options ' -geos0.25  -geos0.25_  -geos0.5  -geos0.5_  -geos1x125 -geos1x1  -geos4x5  -geos2x25'
      options = options ' -geos0.25a -geos0.25_a -geos0.5a -geos0.5_a -geos1x125a -geos1x1a -geos4x5a -geos2x25a'
      options = options ' -geos0.25s -geos0.25_s -geos0.5s -geos0.5_s -geos1x125s -geos1x1s -geos4x5s -geos2x25s'
      options = options ' -geos0.25v -geos0.25_v -geos0.5v -geos0.5_v -geos1x125v -geos1x1v -geos4x5v -geos2x25v'

      options = options ' -sw2x25 -iw2x25 -lw2x25 '

      options = options ' -fv1x125  -fv4x5  -fv2x25'
      options = options ' -fv1x125a -fv4x5a -fv2x25a'
      options = options ' -fv1x125s -fv4x5s -fv2x25s'
      options = options ' -fv1x125v -fv4x5v -fv2x25v'

      options = options ' -merra1.25  -merra0.5'
      options = options ' -merra1.25a -merra0.5a'
      options = options ' -merra1.25s -merra0.5s'
      options = options ' -merra1.25v -merra0.5v'

      options = options ' -ncept62  -ncept126  -ncep2.5  -20cr2x2'
      options = options ' -ncept62a -ncept126a -ncep2.5a -20cr2x2a'
      options = options ' -ncept62s -ncept126s -ncep2.5s -20cr2x2s'
      options = options ' -ncept62v -ncept126v -ncep2.5v -20cr2x2v'

      options = options ' -era2.5   -jrat106  -osset511 -gpcp2.5'
      options = options ' -era2.5a  -jrat106a -osset511a -gpcp2.5a'
      options = options ' -era2.5s  -jrat106s -osset511s -gpcp2.5s'
      options = options ' -era2.5v  -jrat106v -osset511v -gpcp2.5v'

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

         if ( token = '-ctlinfo' )
              _ctlinfo = 1
              i = i + 1
              token = subwrd(args,i)
         endif

         if ( token = '-be' )
              _endianess = '-be'
              i = i + 1
              token = subwrd(args,i)
         endif

         if ( token = '-le' )
              _endianess = '-le'
              i = i + 1
              token = subwrd(args,i)
         endif

         if ( token = '-q' )
              _quit = 1
              i = i + 1
              token = subwrd(args,i)
         endif

         if ( token = '-mean' )
              _mean = 1
              i = i + 1
              token = subwrd(args,i)
         endif

         if ( token = '-tmean' )
              _tmean =  subwrd(args,i+1)
              i = i + 2
              token = subwrd(args,i)
              if ( critique(1,1,'-tmean',_tmean) = 1 ); return 1; endif
         endif

         if ( token = '-xsfc' )
              _xsfc = 1
              i = i + 1
              token = subwrd(args,i)
         endif

         if ( token = '-xupper' )
              _xupper = 1
              i = i + 1
              token = subwrd(args,i)
         endif

         if ( token = '-zrev' )
              _zrev = 1
              i = i + 1
              token = subwrd(args,i)
         endif

         if ( token = '-i' )
              i = i + 1
              token = subwrd(args,i)
              first = x '' substr(token,1,1)
              while ( first != 'x-' & first != 'x' )
                _ifname= _ifname ' ' token
                 i = i + 1
                 token = subwrd(args,i)
                 first = x '' substr(token,1,1)
              endwhile
*                                 allows sdfopen templates
              if ( critique(1,3,'-i',_ifname) = 1 ); return 1; endif
         endif

         if ( token = '-j' )
              i = i + 1
              token = subwrd(args,i)
              first = x '' substr(token,1,1)
              while ( first != 'x-' & first != 'x' )
                _afname= _afname ' ' token
                 i = i + 1
                 token = subwrd(args,i)
                 first = x '' substr(token,1,1)
              endwhile
*                                 allows sdfopen templates
              if ( critique(1,3,'-j',_afname) = 1 ); return 1; endif
         endif

         if ( token = '-o' )
              _ofname = subwrd(args,i+1) 
              i = i + 2
              token = subwrd(args,i)
              if ( critique(1,1,'-o',_ofname) = 1 ); return 1; endif
         endif

         if ( token = '-cal' )
              _cal = subwrd(args,i+1) 
              i = i + 2
              token = subwrd(args,i)
              if ( critique(1,1,'-cal',_cal) = 1 ); return 1; endif
         endif

         if ( token = '-gzip' )
              _gzip = subwrd(args,i+1) 
              i = i + 2
              token = subwrd(args,i)
              if ( critique(1,1,'-gzip',_gzip) = 1 ); return 1; endif
         endif

         if ( token = '-shave' )
              _shave = subwrd(args,i+1) 
              if ( critique(0,1,'-shave',_shave) = 1 ); return 1; endif
              first = substr(_shave,1,1)
              if ( first = '-' | first = '' )
                   _shave = 12
                   i = i + 1
              else 
                   i = i + 2
              endif
              token = subwrd(args,i)
         endif

         if ( token = '-format' )
              _format = subwrd(args,i+1) 
              i = i + 2
              token = subwrd(args,i)
              if ( critique(1,1,'-format',_format) = 1 ); return 1; endif
              if ( _format = 'fwrite' ); _format = 'stream'; endif
              if ( _format = 'stat'   ); _format = 'stats'; endif
         endif

         if ( token = '-grid' )
              _gridtype = subwrd(args,i+1) 
              i = i + 2
              token = subwrd(args,i)
              if ( critique(1,1,'-grid',_gridtype) = 1 ); return 1; endif
         endif

         if ( token = '-ftype' )
              _ftype= subwrd(args,i+1) 
              i = i + 2
              token = subwrd(args,i)
              if ( critique(1,1,'-ftype',_format) = 1 ); return 1; endif
              if ( _ftype='nc'|_ftype='netcdf'|_ftype='hdf'|_ftype='hdf-sds'|_ftype='gfio' )
                   _ftype = 'sdf'
              endif
              if ( _ftype='grib'|_ftype='grads_grib'|_ftype='ieee'|_ftype='sequential')
                   _ftype = 'ctl'
              endif
         endif

         if ( token = '-model' )
              _model = subwrd(args,i+1) 
              i = i + 2
              token = subwrd(args,i)
              if ( critique(1,1,'-model',_model) = 1 ); return 1; endif
         endif

         if ( token = '-center' )
              _center = subwrd(args,i+1) 
              i = i + 2
              token = subwrd(args,i)
              if ( critique(1,1,'-center',_center) = 1 ); return 1; endif
         endif

         if ( token = '-de' )
              _dimenv = subwrd(args,i+1) 
              i = i + 2
              token = subwrd(args,i)
              if ( critique(1,1,'-de',_dimenv) = 1 ); return 1; endif
         endif

         if ( token = '-table' )
              _table = subwrd(args,i+1) 
              i = i + 2
              token = subwrd(args,i)
              if ( critique(1,1,'-table',_table) = 1 ); return 1; endif
         endif

         if ( token = '-precision' )
              _precision = subwrd(args,i+1) 
              i = i + 2
              token = subwrd(args,i)
              if ( critique(1,1,'-precision',_precision) = 1 ); return 1; endif
         endif

         if ( token = '-func' )
              _func= subwrd(args,i+1) 
              i = i + 2
              token = subwrd(args,i)
              if ( critique(1,1,'-func',_func) = 1 ); return 1; endif
         endif

         if ( token = '-vars' )
              i = i + 1
              token = subwrd(args,i)
              first = x '' substr(token,1,1)
              while ( first != 'x-' & first != 'x' )
                _vars = _vars ' ' token
                 i = i + 1
                 token = subwrd(args,i)
                 first = x '' substr(token,1,1)
              endwhile
              if ( critique(1,999,'-vars',_vars) = 1 ); return 1; endif
         endif

         if ( token = '-xvars' )
              i = i + 1
              token = subwrd(args,i)
              first = x '' substr(token,1,1)
              while ( first != 'x-' & first != 'x' )
                _xvars = _xvars ' ' token
                 i = i + 1
                 token = subwrd(args,i)
                 first = x '' substr(token,1,1)
              endwhile
              if ( critique(1,999,'-xvars',_xvars) = 1 ); return 1; endif
         endif

         if ( token = '-title' )
              i = i + 1
              token = subwrd(args,i)
              first = x '' substr(token,1,1)
              while ( first != 'x-' & first != 'x' )
                _title = _title ' ' token
                 i = i + 1
                 token = subwrd(args,i)
                 first = x '' substr(token,1,1)
              endwhile
              if ( critique(1,999,'-title',_title) = 1 ); return 1; endif
         endif

*
*        Note: we force -lon/-lat to have 2 args because lats do
*              not allow single point grids. 
*
         if ( token = '-lat' )
              tok1 = subwrd(args,i+1)
              tok2 = subwrd(args,i+2)
              _lat = tok1 ' ' tok2
              i = i + 3
              token = subwrd(args,i)
              if ( critique(2,2,'-lat',_lat) = 1 ); return 1; endif
         endif

         if ( token = '-lon' )
              tok1 = subwrd(args,i+1)
              tok2 = subwrd(args,i+2)
              _lon = tok1 ' ' tok2
              i = i + 3
              token = subwrd(args,i)
              if ( critique(2,2,'-lon',_lon) = 1 ); return 1; endif
         endif

         if ( token = '-levs' )
              i = i + 1
              token = subwrd(args,i)
              first = x '' substr(token,1,1)
              while ( first != 'x-' & first != 'x' )
                _levels = _levels ' ' token
                 i = i + 1
                 token = subwrd(args,i)
                 first = x '' substr(token,1,1)
              endwhile
         endif

         if ( token = '-mask' )
              _mask = subwrd(args,i+1) 
              i = i + 2
              token = subwrd(args,i)
              if ( critique(1,1,'-mask',_ntimes) = 1 ); return 1; endif
         endif

         if ( token = '-halo' )
              i = i + 1
              token = subwrd(args,i)
              first = x '' substr(token,1,1)
              while ( first != 'x-' & first != 'x' )
                _halo = _halo ' ' token
                 i = i + 1
                 token = subwrd(args,i)
                 first = x '' substr(token,1,1)
              endwhile
              if ( critique(1,2,'-halo',_halo) = 1 ); return 1; endif
         endif

         if ( token = '-time' )
              i = i + 1
              token = subwrd(args,i)
              first = x '' substr(token,1,1)
              while ( first != 'x-' & first != 'x' )
                _time = _time ' ' token
                 i = i + 1
                 token = subwrd(args,i)
                 first = x '' substr(token,1,1)
              endwhile
              if ( critique(1,3,'-time',_time) = 1 ); return 1; endif
              _tinc = subwrd(_time,3)
              t1 = subwrd(_time,1)
              t2 = subwrd(_time,2)
              if ( _tinc != '' )
                   _time = t1 ' ' t2
              else
                   _tinc = 1
              endif
              if ( t1 = '=' | t2 = '=' ); _time = ''; endif
              if ( _tinc < 1 )
                   rc = usage()
                   say _myname 'invalid time increment ' _tinc
                   return 1
              endif
         endif

         if ( token = '-ntimes' )
              _ntimes = subwrd(args,i+1) 
              i = i + 2
              token = subwrd(args,i)
              if ( critique(1,1,'-ntimes',_ntimes) = 1 ); return 1; endif
         endif

         if ( token = '-nlevels' )
              _nlevels = subwrd(args,i+1) 
              i = i + 2
              token = subwrd(args,i)
         endif

         if ( token = '-mxtimes' )
              _mxtimes = subwrd(args,i+1) 
              i = i + 2
              token = subwrd(args,i)
              if ( critique(1,1,'-mxtimes',_mxtimes) = 1 ); return 1; endif
         endif

         if ( token = '-freq' )
              _deltat = subwrd(args,i+1)
              _freq   = subwrd(args,i+2)
              token = _freq ' ' _deltat
              if ( critique(1,2,'-freq',token) = 1 ); return 1; endif
              first = substr(_freq,1,1)
              if ( first = '-' | first = '' )
                   _freq = _deltat
                   _deltat = 1
                   i = i + 2
              else 
                   i = i + 3
              endif
              token = subwrd(args,i)
         endif

*        GEOS Interpolation options
*        --------------------------
         if ( token = '-regrid2' )
              _regrid2 = 1
              i = i + 1
              token = subwrd(args,i)
         endif

*        Old GEOS-5 1/3 x 1/4 deg
*        ------------------------
         if ( token = '-geos0.25_' )
              rc = mkgeosf('geos0.25.ctl',0.333333,0.25,1080,721,'bl_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-geos0.25_a' )
              rc = mkgeosf('geos0.25.ctl',0.333333,0.25,1080,721,'ba_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-geos0.25_s' )
              rc = mkgeosf('geos0.25.ctl',0.333333,0.25,1080,721,'bs_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-geos0.25_v' )
              rc = mkgeosf('geos0.25.ctl',0.333333,0.25,1080,721,'vt_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif

*        Old GEOS-5 2/3 x 1/2 deg
*        ------------------------
         if ( token = '-geos0.5_' | token = '-merra0.5' )
              rc = mkgeosf('geos0.5.ctl',0.666666,0.5,540,361,'bl_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-geos0.5_a' | token = '-merra0.5a'  )
              rc = mkgeosf('geos0.5.ctl',0.666666,0.5,540,361,'ba_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-geos0.5_s' | token = '-merra0.5s'  )
              rc = mkgeosf('geos0.5.ctl',0.666666,0.5,540,361,'bs_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-geos0.5_v' | token = '-merra0.5v'  )
              rc = mkgeosf('geos0.5.ctl',0.666666,0.5,540,361,'vt_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif

*        GEOS-5 1/4 deg, 4x5 aspect ratio
*        --------------------------------
         if ( token = '-geos0.25' )
              rc = mkgeosf('geos0.25.ctl',0.3125,0.25,1152,721,'bl_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-geos0.25a' )
              rc = mkgeosf('geos0.25.ctl',0.3125,0.25,1152,721,'ba_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-geos0.25s' )
              rc = mkgeosf('geos0.25.ctl',0.3125,0.25,1152,721,'bs_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-geos0.25v' )
              rc = mkgeosf('geos0.25.ctl',0.3125,0.25,1152,721,'vt_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif

*        GEOS-5 1/2 deg, 4x5 aspect ratio
*        --------------------------------
         if ( token = '-geos0.5' )
              rc = mkgeosf('geos0.5.ctl',0.625,0.5,576,361,'bl_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-geos0.5a' )
              rc = mkgeosf('geos0.5.ctl',0.625,0.5,576,361,'ba_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-geos0.5s' )
              rc = mkgeosf('geos0.5.ctl',0.625,0.5,576,361,'bs_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-geos0.5v' )
              rc = mkgeosf('geos0.5.ctl',0.666666,0.5,576,361,'vt_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif

*        Old GEOS-3 settings: model was 1x1 not 1x125
*        --------------------------------------------
         if ( token = '-geos1x1' )
              rc = mkgeosf('geos1x1.ctl',1,1,360,181,'bl_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-geos1x1a' )
              rc = mkgeosf('geos1x1.ctl',1,1,360,181,'ba_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-geos1x1s' )
              rc = mkgeosf('geos1x1.ctl',1,1,360,181,'bs_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif

*        Like GEOS-4, GEOS-5 and beyond uses 1x1.25 for "c" resolution
*        -------------------------------------------------------------
         if ( token = '-geos1x125' )
              rc = mkgeosf('geos1x1.ctl',1.25,1,288,181,'bl_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-geos1x125a' )
              rc = mkgeosf('geos1x1.ctl',1.25,1,288,181,'ba_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-geos1x125s' )
              rc = mkgeosf('geos1x1.ctl',1.25,1,288,181,'bs_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-geos1x125v' )
              rc = mkgeosf('geos1x1.ctl',1.25,1,288,181,'vt_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif

         if ( token = '-lw2x25' )
              rc = mkwaves('geos2x25.ctl',2.5,2,144,91,1,4)
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-iw2x25' )
              rc = mkwaves('geos2x25.ctl',2.5,2,144,91,5,10)
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-sw2x25' )
              rc = mkwaves('geos2x25.ctl',2.5,2,144,91,11,21)
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif

         if ( token = '-geos2x25' )
              rc = mkgeosf('geos2x25.ctl',2.5,2,144,91,'bl_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-geos2x25a' )
              rc = mkgeosf('geos2x25.ctl',2.5,2,144,91,'ba_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-geos2x25s' )
              rc = mkgeosf('geos2x25.ctl',2.5,2,144,91,'bs_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-geos2x25v' )
              rc = mkgeosf('geos2x25.ctl',2.5,2,144,91,'vt_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif

         if ( token = '-geos4x5' )
              rc = mkgeosf('geos4x5.ctl',5,4,72,46,'bl_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-geos4x5a' )
              rc = mkgeosf('geos4x5.ctl',5,4,72,46,'ba_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-geos4x5s' )
              rc = mkgeosf('geos4x5.ctl',5,4,72,46,'bs_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-geos4x5v' )
              rc = mkgeosf('geos4x5.ctl',5,4,72,46,'vt_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif

         if ( token = '-merra1.25' )
              rc = mkmrf('merra1.25.ctl',1.25,1.25,288,144,'bl_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-merra1.25a' )
              rc = mkmrf('merra1.25a.ctl',1.25,1.25,288,144,'ba_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-merra1.25s' )
              rc = mkmrf('merra1.25s.ctl',1.25,1.25,288,144,'bs_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-merra1.25v' )
              rc = mkmrf('merra1.25s.ctl',1.25,1.25,288,144,'vt_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif

*        Undocumented options (fvDAS interpolation)
*        -----------------------------------------
         if ( token = '-fv1x125' )
              rc = mkfvf('fv1x125.ctl',1.25,1,288,181,'bl_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-fv1x125a' )
              rc = mkfvf('fv1x125.ctl',1.25,1,288,181,'ba_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-fv1x125s' )
              rc = mkfvf('fv1x125.ctl',1.25,1,288,181,'bs_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-fv1x125v' )
              rc = mkfvf('fv1x125.ctl',1.25,1,288,181,'vt_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif

         if ( token = '-fv2x25' )
              rc = mkfvf('fv2x25.ctl',2.5,2,144,91,'bl_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-fv2x25a' )
              rc = mkfvf('fv2x25.ctl',2.5,2,144,91,'ba_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-fv2x25s' )
              rc = mkfvf('fv2x25.ctl',2.5,2,144,91,'bs_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-fv2x25v' )
              rc = mkfvf('fv2x25.ctl',2.5,2,144,91,'vt_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif

         if ( token = '-fv4x5' )
              rc = mkfvf('fv4x5.ctl',5,4,72,46,'bl_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-fv4x5a' )
              rc = mkfvf('fv4x5.ctl',5,4,72,46,'ba_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-fv4x5s' )
              rc = mkfvf('fv4x5.ctl',5,4,72,46,'bs_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-fv4x5v' )
              rc = mkfvf('fv4x5.ctl',5,4,72,46,'vt_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif

*        NCEP T126 interpolation
*        -----------------------
         if ( token = '-ncept126' )
              rc = mkt126f('ncept126.ctl','bl_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-ncept126a' )
              rc = mkt126f('ncept126a.ctl','ba_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-ncept126s' )
              rc = mkt126f('ncept126s.ctl','bs_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-ncept126v' )
              rc = mkt126f('ncept126s.ctl','vt_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif

*        NCEP Reanalysis-2 interpolation
*        -------------------------------
         if ( token = '-ncept62' )
              rc = mkt62f('ncept62.ctl','bl_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-ncept62a' )
              rc = mkt62f('ncept62a.ctl','ba_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-ncept62s' )
              rc = mkt62f('ncept62s.ctl','bs_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-ncept62v' )
              rc = mkt62f('ncept62s.ctl','vt_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif

         if ( token = '-ncep2.5' | token='-era2.5' )
              rc = mkfvf('ncep2.5.ctl',2.5,2.5,144,73,'bl_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-ncep2.5a' | token='-era2.5a')
              rc = mkfvf('ncep2.5a.ctl',2.5,2.5,144,73,'ba_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-ncep2.5s' | token='-era2.5s')
              rc = mkfvf('ncep2.5s.ctl',2.5,2.5,144,73,'bs_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-ncep2.5v' | token='-era2.5v')
              rc = mkfvf('ncep2.5v.ctl',2.5,2.5,144,73,'vt_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif

*        20th Centure Reanalysis
*        -----------------------
         if ( token = '-20cr2x2' )
              rc = mkfvf('20cr2x2.ctl',2,2,180,91,'bl_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-20cr2x2a' )
              rc = mkfvf('20cr2x2a.ctl',2,2,180,91,'ba_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-20cr2x2s' )
              rc = mkfvf('20cr2x2s.ctl',2,2,180,91,'bs_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-20cr2x2v' )
              rc = mkfvf('20cr2x2v.ctl',2,2,180,91,'vt_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif

*        Japanese Reanalysis (JRA) interpolation
*        ---------------------------------------
         if ( token = '-jrat106' )
              rc = mkt106f('jrat106.ctl','bl_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-jrat106a' )
              rc = mkt106f('jrat106a.ctl','ba_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-jrat106s' )
              rc = mkt106f('jrat106s.ctl','bs_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-jrat106v' )
              rc = mkt106f('jrat106s.ctl','vt_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif

*        ECMWF OSSE Natrure Run (T511)
*        -----------------------------
         if ( token = '-osset511' )
              rc = mkt511f('osset511.ctl','bl_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-osset511a' )
              rc = mkt511f('osset511a.ctl','ba_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-osset511s' )
              rc = mkt511f('osset511s.ctl','bs_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-osset511v' )
              rc = mkt511f('osset511s.ctl','vt_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif

*        GPCP (pole edge) interpolation
*        ------------------------------
         if ( token = '-gpcp2.5' )
              rc = mkgpf('gpcp2.5.ctl',2.5,2.5,144,72,'bl_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-gpcp2.5a' )
              rc = mkgpf('gpcp2.5a.ctl',2.5,2.5,144,72,'ba_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-gpcp2.5s' )
              rc = mkgpf('gpcp2.5s.ctl',2.5,2.5,144,72,'bs_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
         endif
         if ( token = '-gpcp2.5v' )
              rc = mkgpf('gpcp2.5s.ctl',2.5,2.5,144,72,'vt_p1')
              if ( rc != 0 ); return 1; endif
              i = i + 1
              token = subwrd(args,i)
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

         if ( valid = 0 & token != '' )
            rc = usage()
            say _myname 'invalid option "'token'"'
            return 1
         endif

      endwhile

*     Handle masking options
*     -----------------------
      if ( _mask != '' )
         rc = setmask()
         if (rc); return 1; endif
      endif

      _needLATS = 0
      if ( _format='coards' | _format='netcdf' | _format='netcdf4' | _format='nc3'| _format='nc4'| _format='hdf' | _format='hdf4'| _format = 'grib' | _format = 'grads_grib' )
        _needLATS = 1
      endif

      if ( _help = 1 ) 
           rc = usage(1)
           return 1
      endif

return 0

function printopt()

  say '   Input  fname: ' _ifname
  say '   Output fname: ' _ofname
  say '         Format: ' _format
  say '      Variables: ' _vars
  say '     Time Range: ' _time
  say '         Levels: ' _levels

return

*.......................................................................

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

*
* setdimf - Open dimension env file 
* 

function setdimf()

   _dimf = 0
   if ( _dimenv != '' )
      rc=openf(_dimenv,'')
      if ( rc != 0 )
         say _myname 'cannot open file "'_dimenv'"'
         return rc
      endif
      result = _result
      i = 0
      while ( token != '' )
          i = i + 1
          lin = sublin(result,i)
          token = subwrd(lin,1)
          word  = subwrd(lin,2)
          if ( token = 'Data' & word = 'file' )
               _dimf = subwrd(lin,8)
          endif
      endwhile
      if ( _dimf = 0 ); return 1; endif
      'set dfile ' _dimf
      rc = xyrange()
      'set x ' _xmin ' ' _xmax
      'set y ' _ymin ' ' _ymax
      'set dfile ' _datf
   else
     _dimf = _datf
   endif

return 0


*
* gettim()  Redefines time range according to user defined _time
*
function gettim()

      if ( _time = '' ); return 0; endif

      tbeg = subwrd(_time,1)
      tend = subwrd(_time,2)

      'set time ' tbeg ' ' tend
      if ( rc = 1 ); return 1; endif

      rc = savedim()

      if ( _t1save < _tmin | _t2save > _tmax )
           return 1
      else
           _tmin = _t1save
           _tmax = _t2save
      endif

return 0
  



*
* getfreq() Uses 'q ctlinfo' to determine data set frequency
*

function getfreq()

      'q ctlinfo'
      i = 1
      done = 0
      line = sublin(result,i)
      while ( line!='' & done=0 )
        kw = subwrd(line,1)
        if ( kw='tdef' | kw='TDEF' )
             str = subwrd(line,5)
             n = lenstr(str)
             dt = substr(str,1,n-2)
             unit = substr(str,n-1,2)
             done = 1
        endif
        i = i + 1
        line = sublin(result,i)
      endwhile

      if ( unit='mn' )
         unit = minutes
         if ( dt > 60 )
              dt = dt / 60
              unit = hourly
         endif
         if ( dt > 59 )
              dt = dt / 60
              unit = hourly
              if ( dt > 23 )
                 dt = dt / 24
                 unit = daily
              endif
         endif
      endif

      if ( unit='mo' )
         unit = monthly
         if ( dt > 11 )
            dt = dt / 12
            unit = yearly
         endif
      endif

      _freq = unit
      _deltat = dt

return 0

*
* split()  Returns year, month, day & hour from date of the form
* 00Z02JAN1987
*
function split ( t )

   ch  = substr(t,3,1)
   if ( ch = ':' )
        off = 3
   else
        off = 0
   endif
   _h  = substr(t,1,2)
   _d  = substr(t,4+off,2)
   m3  = substr(t,6+off,3)
   _y  = substr(t,9+off,4)
   mons = 'JAN FEB MAR APR MAY JUN JUL AUG SEP OCT NOV DEC'
   i = 1
   while(i<=12)
      mon = subwrd(mons,i)
      if ( m3 = mon ) 
           _m = i
           return
      endif
      i = i + 1
   endwhile

return

*
* ztrange() Get (z,t) range on file
*
function ztrange()

      'q file'
      tmp = sublin ( result, 5 )
      _zmin = 1
      _zmax = subwrd(tmp,9)
      _tmin = 1
      _tmax = subwrd(tmp,12)

return

function xyrange()

      'q file'
      tmp = sublin ( result, 5 )
      _xmin = 1
      _xmax = subwrd(tmp,3)
      _ymin = 1
      _ymax = subwrd(tmp,6)

return


*
* getlevs() Get all levels from dimension environment
*
function getlevs()

      _levels = ''
      if ( _zrev = 1 )

         z = _zmax
         while ( z >= _zmin )
            'set z ' z
            lev = subwrd(result,4)
            _levels = _levels ' ' lev
             z = z - 1
         endwhile

      else

         z = _zmin
         while ( z <= _zmax )
            'set z ' z
            lev = subwrd(result,4)
            _levels = _levels ' ' lev
             z = z + 1
         endwhile

     endif

return

*
* setlevs() Set LATS vertical dimension. 
*
function setlevs()


* GRIB does not allow pressure < 1 hPa
* ------------------------------------
  plev = 1
  zlevs = ''
  if ( _format = 'grads_grib' | _format = 'grib_only' )

     k = 1
     lev = subwrd(_levels,k)
     while ( lev != '' )

         if  ( lev < 1 )
               say _myname 'invalid plev ' lev ' for GRIB output'
               plev = 0
         endif

         'set lev ' lev
         'q dims'
         tmp   = sublin(result,4)
         zlevs = zlevs ' ' subwrd(tmp,9)

         k = k + 1
        lev = subwrd(_levels,k)

     endwhile

   endif


*  Set pressure levels
*  -------------------
if ( _hasLATS )
   if ( plev = 1 )

        if ( _verb = 1 )
             say _myname 'using PRESSURE for vertical coordinate'
        endif
        _latlevels = _levels
       rc=LATScmd(_setLATS ' vertdim plev ' _latlevels)
       _lid = subwrd(_result,5)
       if ( _lid < 1 ); return 1; endif
       _sid = 0

*  Set hybrid levels
*  -----------------
   else

        if ( _verb = 1 )
             say _myname 'using HYBRID level number for vertical coordinate'
        endif
        _latlevels = zlevs
       rc=LATScmd(_setLATS ' vertdim hybrid ' _latlevels)
       _lid = subwrd(_result,5)
       if ( _lid < 1 ); return 1; endif
       _sid = 0

   endif       
endif

return 0


*
* setgrid()   Sets the horizontal grid if user specified 
*              -lat or -lon at the command line
*

function setgrid()

   rc = savedim()
   if ( _lon != '' )
      'set lon ' _lon
      if ( rc!=0 ); return rc; endif
   else
      _lon = _lonmin ' ' _lonmax
   endif

   if ( _lat != '' )
      'set lat ' _lat
      if ( rc!=0 ); return rc; endif
   else
      _lat = _latmin ' ' _latmax
   endif

return 0

*
* getgid()  Get horizontal grid id
*
function getgid()

  if ( _hasLATS=0 )
      return 1
  endif

  'q file'
  tmp = sublin(result,7)
  var = subwrd(tmp,1)

  rc = savedim()
  'set z 1'
  'set t 1'
  if ( _udxLATS )
      'lats_grid ' var
  else
      rc=LATScmd('set gxout latsgrid') 
      'd ' var
  endif
  bufr = sublin(result,1)
  grid = subwrd(bufr,2)
  if ( grid != 'GRID' )
       bufr = sublin(result,2)
       grid = subwrd(bufr,2)
       if ( grid != 'GRID' ); return -1; endif
  endif

* If not running LATS report error, but set gid=1 anyway
* ------------------------------------------------------
  if ( _needLATS )
     gid = subwrd(bufr,5)
  else
     gid = 1
  endif       

  rc = restdim()

return gid

*
* savedim()  Save dimension environment
*
function savedim()

   'q dims'

   tmp = sublin(result,2)
   type = subwrd(tmp,3)
   if ( type = 'varying' )
      _x1save = subwrd(tmp,11)
      _x2save = subwrd(tmp,13)
      _lonmin = subwrd(tmp,6)
      _lonmax = subwrd(tmp,8)
   else
      _x1save = subwrd(tmp,9)
      _x2save = _x1save
      _lonmin = subwrd(tmp,6)
      _lonmax = _lonmin
   endif

   tmp = sublin(result,3)
   type = subwrd(tmp,3)
   if ( type = 'varying' )
      _y1save = subwrd(tmp,11)
      _y2save = subwrd(tmp,13)
      _latmin = subwrd(tmp,6)
      _latmax = subwrd(tmp,8)
   else
      _y1save = subwrd(tmp,9)
      _y2save = _y1save
      _latmin = subwrd(tmp,6)
      _latmax = _latmin
   endif

   if ( _latmin < -90 ); _latmin = -90; endif
   if ( _latmax >  90 ); _latmax =  90; endif

   tmp = sublin(result,4)
   type = subwrd(tmp,3)
   if ( type = 'varying' )
      _z1save = subwrd(tmp,11)
      _z2save = subwrd(tmp,13)
   else
      _z1save = subwrd(tmp,9)
      _z2save = _z1save
   endif

   tmp = sublin(result,5)
   type = subwrd(tmp,3)
   if ( type = 'varying' )
      _t1save = subwrd(tmp,11)
      _t2save = subwrd(tmp,13)
   else
      _t1save = subwrd(tmp,9)
      _t2save = _t1save
   endif

return

*
* restdim()  Restore saved dimension environment
*
function restdim()

     if ( _x1save = '_x1save' )
         say 'restdim: dimensions not saved'
         return 1
     endif

     'set x  ' _x1save ' ' _x2save
     'set y  ' _y1save ' ' _y2save
     'set z  ' _z1save ' ' _z2save
     'set t  ' _t1save ' ' _t2save

return

*
* getvars()  Get all variables from current file
*
function getvars()

  'q file'
  tmp = sublin(result,6)
  nvars = subwrd(tmp,5)

  n = 1
  _svars = ''; _slong=''; _nsvar = 0
  _uvars = ''; _ulong=''; _nuvar = 0
  while ( n <= nvars )

     tmp = sublin(result,6+n)
     var = subwrd(tmp,1)
     long = ''
     i = 4
     token = subwrd(tmp,i)
     while ( token != '' )
         long = long ' ' token
         i = i + 1
         token = subwrd(tmp,i)
     endwhile
     nlevs = subwrd(tmp,2)
     rc = validate(var,_vars)
     if ( rc = 1 )
          rc = xvalidat(var,_xvars)
          if ( rc = 0 )
             if ( _verb = 1 )
                  say _myname 'excluding variable ' var
             endif
          endif
     endif
     if ( rc = 1 )
      if ( nlevs < 2 )
        _nsvar = _nsvar + 1
        _svars = _svars ' ' var
        j = _nsvar; _slong.j = long
        if ( _verb = 1 )
***        say _myname 'selecting sfc var ' var ': ' _slong.j
        endif
      else
        _nuvar = _nuvar + 1
        _uvars = _uvars ' ' var
        j = _nuvar; _ulong.j = long
        if ( _verb = 1 )
***        say _myname 'selecting up   var ' var ': ' _ulong.j
        endif
      endif
     endif

     n = n + 1

  endwhile

* Exclude all surface variables if user so chooses
* ------------------------------------------------
  if ( _xsfc = 1 )
      _nsvar = 0
      _svars = ''
  endif

* Exclude all upper air variables if user so chooses
* --------------------------------------------------
  if ( _xupper = 1 )
      _nuvar = 0
      _uvars = ''
  endif

return

*
* mkptab()  Creates a LATS parameter table from variable list.
*

function mkptab()

*
* Temporary file
*

if ( _hasLATS=0 )
      return 0
endif

fname = _table

if ( _verb = 1 )
      say _myname 'creating LATS PARAMETER TABLE file ' fname
endif

*
* Identify ourselves...
*

rc=write(fname,'# LATS PARAMETER TABLE automatically generated by lats4d')
rc=subwrd(rc,1)
if ( rc > 0 )
   say rc
   say _myname 'cannot create LATS table file ' fname ' on current directory'
   return rc
endif

rc=write(fname,'# Note: This table lacks the UNITS and GRIB decimal_scale_factor columns.', append)
rc=write(fname,'#       It also does not include QC information. For additional', append)
rc=write(fname,'#       information on LATS parameter tables consult:'      , append)
rc=write(fname,'#           http://www-pcmdi.llnl.gov/software/lats/'       , append)

*
* General info
*

rc=write(fname,'#---------------------------------------------------------------------------------------------------',append)
rc=write(fname,'#',append)
#rc=write(fname,'# A parameter file is divided into sections, indicated by #! comments.',append) 
rc=write(fname,'# The sections may appear in any order. The 'center' section is only required for GRIB output.',append)
rc=write(fname,'#',append)
rc=write(fname,'# #!variable',append)
rc=write(fname,'#',append)
rc=write(fname,'#   Variable table: defines variable-specific parameters',append)
rc=write(fname,'#',append)
rc=write(fname,'# #!vert',append)
rc=write(fname,'#',append)
rc=write(fname,'#   Vertical dimension type table: defines categories of vertical dimensions',append)
rc=write(fname,'#',append)
rc=write(fname,'# #!center',append)
rc=write(fname,'#',append)
rc=write(fname,'#   Center table: defines GRIB parameters which identify the originating process, center, and subcenter.',append)
rc=write(fname,'#',append)
rc=write(fname,'# #!qc',append)
rc=write(fname,'#',append)
rc=write(fname,'#   Quality control marks table: defines the values controlling the quality control routines.',append)
rc=write(fname,'# ',append)
rc=write(fname,'#---------------------------------------------------------------------------------------------------',append)

*
* Variable list
* 

rc=write(fname,'#!variable',append)
rc=write(fname,'#',append)
rc=write(fname,'# Variables',append)
rc=write(fname,'#   (max number of entries = LATS_MAX_PARMS in lats.h)',append)
rc=write(fname,'#',append)
rc=write(fname,'# The format of each record is:',append)
rc=write(fname,'#   name | id | title | units | datatype | surface | decimal_scale_factor | precision | comments_1 | comments_2',append)
rc=write(fname,'#',append)
rc=write(fname,'# name = variable name (no blanks)',append)
rc=write(fname,'# id = GRIB parameter number (>127 => AMIP-2 specific)',append)
rc=write(fname,'# title = long name (description)',append)
rc=write(fname,'# units = variable units',append)
rc=write(fname,'# datatype = 'float' or 'int'',append)
rc=write(fname,'# level_type = level_type in vertical dimension table, or blank if values must be defined via lats_vert_dim',append)
rc=write(fname,'# decimal_scale_factor = GRIB decimal scale factor, or -999 if no decimal scaling',append)
rc=write(fname,'# precision = number of bits of precision if stored in GRIB,',append)
rc=write(fname,'#             or -999 for level-dependent bit length (ignored if decimal_scale_factor is set)',append)
rc=write(fname,'# comments_1 = comments, ignored by LATS',append)
rc=write(fname,'# comments_2 = comments, ignored by LATS',append)
rc=write(fname,'#',append)
rc=write(fname,'#---------------------------------------------------------------------------------------------------',append)


* Fake these for now
units = '    '
scale_factor = -999
precision = _precision
dattype = 'float'

* Sfc variables
id = 1
i = 1
levtype = 'sfc'
while(i <= _nsvar )
      name   = subwrd(_svars,i) '        '
      title  = _slong.i '                                                                     '
      name   = substr(name,1,15)
      title  = substr(title,1,70) 
      idc = substr(id' ',1,2)
      record = name '| ' idc ' |' title ' | ' units ' | ' dattype ' | ' levtype ' | ' scale_factor ' | ' precision ' |   |   |' 
      rc = write(fname,record,append)
      i = i + 1
      id = id + 1
endwhile

* Upper air variables
i = 1
levtype = '   '
while(i <= _nuvar )
      name   = subwrd(_uvars,i) '        '
      title  = _ulong.i '                                                                     '
      name   = substr(name,1,15)
      title  = substr(title,1,70) 
      idc = substr(id' ',1,2)
      record = name '| ' idc ' |' title ' | ' units ' | ' dattype ' | ' levtype ' | ' scale_factor ' | ' precision ' |   |   |' 
      rc = write(fname,record,append)
      i = i + 1
      id = id + 1
endwhile

*
* Vertical dimension
*
rc=write(fname,'#---------------------------------------------------------------------------------------------------',append)
rc=write(fname,'#!  vert',append)
rc=write(fname,'# Vertical dimension types',append)
rc=write(fname,'#   (max number of entries = LATS_MAX_VERT_TYPES in lats.h)',append)
rc=write(fname,'#',append)
rc=write(fname,'# The format of each record is:',append)
rc=write(fname,'#   level_type | description | units | verticality | positive | default | GRIB_id | GRIB_p1 | GRIB_p2 | GRIB_p3',append)
rc=write(fname,'#',append)
rc=write(fname,'# level_type = level type',append)
rc=write(fname,'# description = level description',append)
rc=write(fname,'# units = units for this level type',append)
rc=write(fname,'# verticality = 'single' (single surface) or 'multi' (variable can have multiple levels of this type)',append)
rc=write(fname,'# positive = 'up' (increasing values point up) or 'down' (increasing values point down)',append)
rc=write(fname,'# GRIB_id = GRIB level type indicator (PDS octet 10)',append)
rc=write(fname,'# GRIB_p1 = GRIB PDS octet 11',append)
rc=write(fname,'# GRIB_p2 = GRIB PDS octet 12',append)
rc=write(fname,'# GRIB_p3 = combined GRIB octets 11, 12 - overrides values of GRIB_p1, GRIB_p2 if specified',append)
rc=write(fname,'',append)
rc=write(fname,'0degiso	 | 0 deg isotherm    	     | hPa	| single |   up	|    4 | 0 |  0 | 0',append)
rc=write(fname,'atm	 | Atmosphere (entire)	     |          | single |   up |  200 | 0 |  0 | 0 ',append)
rc=write(fname,'ocn	 | Ocean (entire depth)	     |          | single |   up |  201 | 0 |  0 | 0 ',append)
rc=write(fname,'clhbot	 | High Cloud Bottom Level   | hPa      | single |   up	|  232 | 0 |  0 | 0',append)
rc=write(fname,'clhlay	 | High Cloud Top Layer      |          | single |   up	|  234 | 0 |  0 | 0',append)
rc=write(fname,'clhtop	 | High Cloud Top Level      | hPa      | single |   up	|  233 | 0 |  0 | 0',append)
rc=write(fname,'cllbot	 | Low Cloud Bottom Level    | hPa      | single |   up	|  212 | 0 |  0 | 0',append)
rc=write(fname,'clllay	 | Low Cloud Top Layer       |          | single |   up	|  214 | 0 |  0 | 0',append)
rc=write(fname,'clltop	 | Low Cloud Top Level       | hPa      | single |   up	|  213 | 0 |  0 | 0',append)
rc=write(fname,'clmbot	 | Mid Cloud Bottom Level    | hPa      | single |   up	|  222 | 0 |  0 | 0',append)
rc=write(fname,'clmlay	 | Mid Cloud Top Layer       |          | single |   up	|  224 | 0 |  0 | 0',append)
rc=write(fname,'clmtop	 | Mid Cloud Top Level       | hPa      | single |   up	|  223 | 0 |  0 | 0',append)
rc=write(fname,'cltbot	 | Cloud base level 	     | hPa	| single |   up	|    2 | 0 |  0 | 0',append)
rc=write(fname,'cltlay	 | Total Cloud layer 	     |		| single |   up	|    3 | 0 |  0 | 0',append)
rc=write(fname,'cltmax	 | Highest Cloud height      | m        | single |   up	|  105 | 0 |  0 | 0',append)
rc=write(fname,'landd	 | Below ground, 10 to 200 cm|		| single |   up |  112 |10 |200 | 0',append)
rc=write(fname,'lands	 | Below ground, 0 to 10 cm  |		| single |   up |  112 | 0 | 10 | 0',append)
rc=write(fname,'landt	 | Below ground, 0  to 200 cm|		| single |   up |  112 | 0 |200 | 0',append)
rc=write(fname,'lcl      | Adiabatic cond level      | hPa	| single |   up	|    5 | 0 |  0 | 0',append)
rc=write(fname,'maxwnd   | Maximum wind speed level  | hPa 	| single |   up	|    6 | 0 |  0 | 0',append)
rc=write(fname,'msl	 | Mean Sea Level 	     |		| single |   up	|  102 | 0 |  0 | 0',append)
rc=write(fname,'ocnbot	 | Ocean bottom      	     |		| single |   up	|    9 | 0 |  0 | 0',append)
rc=write(fname,'plev	 | Pressure level	     | hPa	| multi  | down |  100 | 0 |  0 | 0',append)
rc=write(fname,'pbltop	 | Top of PBL       	     |		| single |   up	|   21 | 0 |  0 | 0',append)
rc=write(fname,'sfc      | Earth surface             |          | single |   up |    1 | 0 |  0 | 0',append)
rc=write(fname,'sfclo    | Sfc Layer Ocean           |          | single |   up |  112 | 0 |300 | 0',append)
rc=write(fname,'sfc10m	 | 10 meters above earth surface| m	| single |   up	|  105 | 0 |  0 | 10',append)
rc=write(fname,'sfc2m	 | 2 meters above earth surface| m	| single |   up	|  105 | 0 |  0 | 2',append)
rc=write(fname,'toa	 | Top of atmosphere	     |		| single |   up	|    8 | 0 |  0 | 0',append)
rc=write(fname,'modtop	 | Top of Model     	     |		| single |   up	|   20 | 0 |  0 | 0',append)
rc=write(fname,'toasat   | TOA satellite             |     	| single |   up	|   22 | 0 |  0 | 0',append)
rc=write(fname,'troplev  | Tropopause level          | hPa 	| single |   up	|    7 | 0 |  0 | 0',append)
rc=write(fname,'theta    | Isentropic Level          | K        | multi  |   up	|  113 | 0 |  0 | 0',append)
rc=write(fname,'sigma	 | Sigma level               |          | multi  | down	|  107 | 0 |  0 | 0',append)
rc=write(fname,'hybrid   | Hybrid Model level number |          | multi  |   up	|  109 | 0 |  0 | 0',append)
rc=write(fname,'zocean   | Depth below sea level     | m        | multi  | down	|  160 | 0 |  0 | 0',append)
rc=write(fname,'',append)
rc=write(fname,'#---------------------------------------------------------------------------------------------------',append)
rc=write(fname,'#!	Center',append)
rc=write(fname,'# Modeling centers (GRIB only)',append)
rc=write(fname,'#   (max number of entries = LATS_MAX_CENTERS in lats.h)',append)
rc=write(fname,'#',append)
rc=write(fname,'# The format of each record is:',append)
rc=write(fname,'#   center | GRIB_id | GRIB_center | GRIB_subcenter',append)
rc=write(fname,'#',append)
rc=write(fname,'# center = mnemonic for the center',append)
rc=write(fname,'# GRIB_id = GRIB generating process id (PDS octet 6)',append)
rc=write(fname,'# GRIB_center = the id of center managing the data (for AMIP II this is PCMDI) - see GRIB Table 0',append)
rc=write(fname,'# GRIB_subcenter = the id of the subcenter',append)
rc=write(fname,'# ',append)
rc=write(fname,'#',append)
rc=write(fname,'#  Acronym           AMIP Group                                                    Location',append)
rc=write(fname,'#  -------           ----------                                                    --------',append)
rc=write(fname,'#',append)
rc=write(fname,'#  bmrc              Bureau of Meteorology Research Centre                         Melbourne, Australia',append)
rc=write(fname,'#  ccc               Canadian Centre for Climate Modelling and Analysis            Victoria, Canada',append)
rc=write(fname,'#  ccsr              Center for Climate System Research                            Tokyo, Japan',append)
rc=write(fname,'#  cnrm              Centre National de Recherches Meteorologiques                 Toulouse, France',append)
rc=write(fname,'#  cola              Center for Ocean-Land-Atmosphere Studies                      Calverton, Maryland',append)
rc=write(fname,'#  csiro             Commonwealth Scientific & Industrial Research Organization    Mordialloc, Australia',append)
rc=write(fname,'#  csu               Colorado State University                                     Fort Collins, Colorado',append)
rc=write(fname,'#  derf              Dynamical Extended Range Forecasting (at GFDL)                Princeton, New Jersey',append)
rc=write(fname,'#  dnm               Department of Numerical Mathematics                           Moscow, Russia',append)
rc=write(fname,'#  ecmwf             European Centre for Medium-Range Weather Forecasts            Reading, England',append)
rc=write(fname,'#  gfdl              Geophysical Fluid Dynamics Laboratory                         Princeton, New Jersey',append)
rc=write(fname,'#  giss              Goddard Institute for Space Studies                           New York, New York',append)
rc=write(fname,'#  gla               Goddard Laboratory for Atmospheres                            Greenbelt, Maryland',append)
rc=write(fname,'#  gsfc              Goddard Space Flight Center                                   Greenbelt, Maryland',append)
rc=write(fname,'#  iap               Institute of Atmospheric Physics                              Beijing, China',append)
rc=write(fname,'#  jma               Japan Meteorological Agency                                   Tokyo, Japan',append)
rc=write(fname,'#  llnl              Lawrence Livermore National Laboratory                        Livermore, California',append)
rc=write(fname,'#  lmd               Laboratoire de Meteorologie Dynamique                         Paris, France',append)
rc=write(fname,'#  mgo               Main Geophysical Observatory                                  St. Petersburg, Russia',append)
rc=write(fname,'#  mpi               Max-Planck-Institut fur Meteorologie                          Hamburg, Germany',append)
rc=write(fname,'#  mri               Meteorological Research Institute                             Ibaraki-ken, Japan',append)
rc=write(fname,'#  ncar              National Center for Atmospheric Research                      Boulder, Colorado',append)
rc=write(fname,'#  nmc               National Meteorological Center                                Suitland, Maryland',append)
rc=write(fname,'#  nrl               Naval Research Laboratory                                     Monterey, California',append)
rc=write(fname,'#  ntu               National Taiwan University                                    Taipei, Taiwan',append)
rc=write(fname,'#  pcmdi             Program for Climate Model Diagnosis and Intercomparison, LLNL Livermore, California',append)
rc=write(fname,'#  rpn               Recherche en Privision Numerique                              Dorval, Canada',append)
rc=write(fname,'#  sunya             State University of New York at Albany                        Albany, New York',append)
rc=write(fname,'#  sunya/ncar        State University of New York at Albany/NCAR                   Albany, New York/Boulder, Colorado',append)
rc=write(fname,'#  ucla              University of California at Los Angeles                       Los Angeles, California',append)
rc=write(fname,'#  ugamp             The UK Universities Global Atmospheric Modelling Programme   Reading, England',append)
rc=write(fname,'#  uiuc              University of Illinois at Urbana-Champaign                    Urbana, Illinois',append)
rc=write(fname,'#  ukmo              United Kingdom Meteorological Office                          Bracknell, UK',append)
rc=write(fname,'#  yonu              Yonsei University                                             Seoul, Korea',append)
rc=write(fname,'#',append)
rc=write(fname,'',append)
rc=write(fname,'bmrc	  |  1  | 100 | 2',append)
rc=write(fname,'ccc	  |  2  | 100 | 2',append)
rc=write(fname,'cnrm	  |  3  | 100 | 2',append)
rc=write(fname,'cola	  |  4  | 100 | 2',append)
rc=write(fname,'csiro	  |  5  | 100 | 2',append)
rc=write(fname,'csu	  |  6  | 100 | 2',append)
rc=write(fname,'dnm	  |  7  | 100 | 2',append)
rc=write(fname,'ecmwf	  |  8  | 100 | 2',append)
rc=write(fname,'gfdl	  |  9  | 100 | 2',append)
rc=write(fname,'derf      | 10  | 100 | 2',append)
rc=write(fname,'giss	  | 11  | 100 | 2',append)
rc=write(fname,'gla	  | 12  | 100 | 2',append)
rc=write(fname,'gsfc	  | 13  | 100 | 2',append)
rc=write(fname,'iap	  | 14  | 100 | 2',append)
rc=write(fname,'jma	  | 15  | 100 | 2',append)
rc=write(fname,'lmd	  | 16  | 100 | 2',append)
rc=write(fname,'mgo	  | 17  | 100 | 2',append)
rc=write(fname,'mpi	  | 18  | 100 | 2',append)
rc=write(fname,'mri	  | 19  | 100 | 2',append)
rc=write(fname,'ncar	  | 20  | 100 | 2',append)
rc=write(fname,'ncep	  | 21  | 100 | 2',append)
rc=write(fname,'nrl	  | 22  | 100 | 2',append)
rc=write(fname,'rpn	  | 23  | 100 | 2',append)
rc=write(fname,'sunya	  | 24  | 100 | 2',append)
rc=write(fname,'sunya/ncar| 25  | 100 | 2',append)
rc=write(fname,'ucla	  | 26  | 100 | 2',append)
rc=write(fname,'ugamp	  | 27  | 100 | 2',append)
rc=write(fname,'uiuc	  | 28  | 100 | 2',append)
rc=write(fname,'ukmo	  | 29  | 100 | 2',append)
rc=write(fname,'yonu	  | 30  | 100 | 2',append)
rc=write(fname,'ccsr      | 31  | 100 | 2',append)
rc=write(fname,'llnl      | 32  | 100 | 2',append)
rc=write(fname,'ntu       | 33  | 100 | 2',append)
rc=write(fname,'cptec     | 46  | 100 | 2',append)
rc=write(fname,'pcmdi	  | 100 | 100 | 2',append)
rc=write(fname,'#---------------------------------------------------------------------------------------------------',append)
rc=write(fname,'#!qc',append)
rc=write(fname,'# Quality control marks',append)
rc=write(fname,'#   (no limit on number of entries)',append)
rc=write(fname,'#',append)
rc=write(fname,'# The format of each record is:',append)
rc=write(fname,'#   variable | level_type | level | mean | std | tolerance | range | rangetol',append)
rc=write(fname,'#',append)
rc=write(fname,'# variable = variable name',append)
rc=write(fname,'# level_type = type of level, as defined in the leveltypes section, or blank if no associated level',append)
rc=write(fname,'# level = level value, or blank if no specified level',append)
rc=write(fname,'# mean = observed mean at specified level',append)
rc=write(fname,'# std = observed standard deviation at specified level',append)
rc=write(fname,'# tolerance = number of standard deviations about mean',append)
rc=write(fname,'#     (if abs(calculated_mean - mean) > (std * tolerance), flag the value as 'mean out of range')',append)
rc=write(fname,'# range = observed (maximum - minimum)',append)
rc=write(fname,'# rangetol = range tolerance:',append)
rc=write(fname,'#     (if calculated_range > (rangetol * range), flag as 'range is too large')',append)
rc=write(fname,'',append)
rc=write(fname,'# NOTE: no QC table yet',append)
rc=write(fname,'#',append)
rc=subwrd(rc,1)
if(rc!=0)
   say _myname 'problems creating LATS table file ' fname 
   return rc
endif

rc=close(fname)
rc=subwrd(rc,1)
if(rc>0)
   say _myname 'problems closing LATS table file ' fname 
   return rc
endif

return 0


****
* mkgeosf()  Creates a template GEOS ctl for regridding;
*            also sets _dimenv, _func
*

function mkgeosf(fname,dlon,dlat,nlon,nlat,algo)

if ( _verb = 1 )
      say _myname 'creating GEOS template file ' fname
endif

rc=write(fname,'DSET nofile')
rc=subwrd(rc,1)
if ( rc > 0 )
   say rc
   say _myname 'cannot create GEOS template file ' fname ' on current directory'
   return rc
endif

xdef = 'xdef ' nlon ' linear -180 ' dlon 
ydef = 'ydef ' nlat ' linear -90  ' dlat
rc=write(fname,'title Template GrADS for regridding',append)
rc=write(fname,'options template',append)
rc=write(fname,'undef 1e+20',append)
rc=write(fname,xdef,append)
rc=write(fname,ydef,append)
rc=write(fname,'zdef   1 levels  1000 ',append)
rc=write(fname,'tdef 1 linear 0Z1jan1900 1dy',append)
rc=write(fname,'vars 1',append)
rc=write(fname,'var       0 0        generic sfc variable',append)
rc=write(fname,'endvars',append)

rc=close(fname)
rc=subwrd(rc,1)
if(rc>0)
   say _myname 'problems closing GEOS template file ' fname 
   return rc
endif

   _dimenv = fname

* Classic regrid2 (slow)
* ----------------------
  if ( _regrid2 = 1 )

   _func = 'regrid2(@,' dlon ',' dlat ',' algo ',-180,-90)'

* New .so regrid (much faster)
* ----------------------------
  else

    algo = substr(algo,1,2)
    if ( algo='vt' )
       algo = 'vt,0.5,0.5'
    endif
   _func = 're(@,' nlon ',linear,-180,' dlon ','nlat ',linear,-90,' dlat ',' algo ')'

  endif

return 0

****
* mkwaves()  Creates a template GEOS ctl for regridding;
*            also sets _dimenv, _func --- includes spectral filtering
*

function mkwaves(fname,dlon,dlat,nlon,nlat,n1,n2)

if ( _verb = 1 )
      say _myname 'creating GEOS template file ' fname
endif

rc=write(fname,'DSET nofile')
rc=subwrd(rc,1)
if ( rc > 0 )
   say rc
   say _myname 'cannot create GEOS template file ' fname ' on current directory'
   return rc
endif

xdef = 'xdef ' nlon ' linear -180 ' dlon 
ydef = 'ydef ' nlat ' linear -90  ' dlat
rc=write(fname,'title Template GrADS for regridding',append)
rc=write(fname,'options template',append)
rc=write(fname,'undef 1e+20',append)
rc=write(fname,xdef,append)
rc=write(fname,ydef,append)
rc=write(fname,'zdef   1 levels  1000 ',append)
rc=write(fname,'tdef 1 linear 0Z1jan1900 1dy',append)
rc=write(fname,'vars 1',append)
rc=write(fname,'var       0 0        generic sfc variable',append)
rc=write(fname,'endvars',append)

rc=close(fname)
rc=subwrd(rc,1)
if(rc>0)
   say _myname 'problems closing GEOS template file ' fname 
   return rc
endif

   _dimenv = fname

* New .so regrid (much faster)
* ----------------------------
  _func = 'sh_filt(re(@,' nlon ',linear,-180,' dlon ','nlat ',linear,-90,' dlat '),'n1','n2')'

return 0


***
* mkfvf()  Creates a template fvDAS ctl for regridding;
*          also sets _dimenv, _func
*

function mkfvf(fname,dlon,dlat,nlon,nlat,algo)

if ( _verb = 1 )
      say _myname 'creating FV template file ' fname
endif

rc=write(fname,'DSET nofile')
rc=subwrd(rc,1)
if ( rc > 0 )
   say rc
   say _myname 'cannot create FV template file ' fname ' on current directory'
   return rc
endif

xdef = 'xdef ' nlon ' linear   0 ' dlon 
ydef = 'ydef ' nlat ' linear -90  ' dlat
rc=write(fname,'title Template GrADS for regridding',append)
rc=write(fname,'options template',append)
rc=write(fname,'undef 1e+20',append)
rc=write(fname,xdef,append)
rc=write(fname,ydef,append)
rc=write(fname,'zdef   1 levels  1000 ',append)
rc=write(fname,'tdef 1 linear 0Z1jan1900 1dy',append)
rc=write(fname,'vars 1',append)
rc=write(fname,'var       0 0        generic sfc variable',append)
rc=write(fname,'endvars',append)

rc=close(fname)
rc=subwrd(rc,1)
if(rc>0)
   say _myname 'problems closing fvDAS template file ' fname 
   return rc
endif

_dimenv = fname

* Classic regrid2 (slow)
* ----------------------
  if ( _regrid2 = 1 )

  _func = 'regrid2(@,' dlon ',' dlat ',' algo ',0,-90)'

* New .so regrid (much faster)
* ----------------------------
  else

    algo = substr(algo,1,2)
    if ( algo='vt' )
       algo = 'vt,0.5,0.5'
    endif
   _func = 're(@,' nlon ',linear,0,' dlon ','nlat ',linear,-90,' dlat ',' algo ')'

  endif

return 0

***
* mkgpf()  Creates a template fvDAS ctl for regridding;
*          also sets _dimenv, _func
*

function mkgpf(fname,dlon,dlat,nlon,nlat,algo)

if ( _verb = 1 )
      say _myname 'creating GPCP template file ' fname
endif

rc=write(fname,'DSET nofile')
rc=subwrd(rc,1)
if ( rc > 0 )
   say rc
   say _myname 'cannot create GPCP template file ' fname ' on current directory'
   return rc
endif

x0 = dlon/2.0
y0 = -90. + dlat/2.0

xdef = 'xdef ' nlon ' linear ' x0 ' ' dlon 
ydef = 'ydef ' nlat ' linear ' y0 ' ' dlat

rc=write(fname,'title Template GrADS for regridding',append)
rc=write(fname,'options template',append)
rc=write(fname,'undef 1e+20',append)
rc=write(fname,xdef,append)
rc=write(fname,ydef,append)
rc=write(fname,'zdef   1 levels  1000 ',append)
rc=write(fname,'tdef 1 linear 0Z1jan1900 1dy',append)
rc=write(fname,'vars 1',append)
rc=write(fname,'var       0 0        generic sfc variable',append)
rc=write(fname,'endvars',append)

rc=close(fname)
rc=subwrd(rc,1)
if(rc>0)
   say _myname 'problems closing GPCP template file ' fname 
   return rc
endif

_dimenv = fname

* Classic regrid2 (slow)
* ----------------------
  if ( _regrid2 = 1 )

  _func = 'regrid2(@,' dlon ',' dlat ',' algo ',' x0 ',' y0 ')'

* New .so regrid (much faster)
* ----------------------------
  else

    algo = substr(algo,1,2)
    if ( algo='vt' )
       algo = 'vt,0.5,0.5'
    endif
   _func = 're(@,' nlon ',linear,' x0 ',' dlon ','nlat ',linear,' y0 ',' dlat ',' algo ')'

  endif

return 0

***
* mkmrf()  Creates a template MERRA-reduced ctl for regridding;
*          also sets _dimenv, _func
*

function mkmrf(fname,dlon,dlat,nlon,nlat,algo)

if ( _verb = 1 )
      say _myname 'creating MERRA-reduced template file ' fname
endif

rc=write(fname,'DSET nofile')
rc=subwrd(rc,1)
if ( rc > 0 )
   say rc
   say _myname 'cannot create MERRA-reduced template file ' fname ' on current directory'
   return rc
endif

x0 = -180 + dlon/2.0
y0 = -90. + dlat/2.0

xdef = 'xdef ' nlon ' linear ' x0 ' ' dlon 
ydef = 'ydef ' nlat ' linear ' y0 ' ' dlat

rc=write(fname,'title Template GrADS for regridding',append)
rc=write(fname,'options template',append)
rc=write(fname,'undef 1e+20',append)
rc=write(fname,xdef,append)
rc=write(fname,ydef,append)
rc=write(fname,'zdef   1 levels  1000 ',append)
rc=write(fname,'tdef 1 linear 0Z1jan1900 1dy',append)
rc=write(fname,'vars 1',append)
rc=write(fname,'var       0 0        generic sfc variable',append)
rc=write(fname,'endvars',append)

rc=close(fname)
rc=subwrd(rc,1)
if(rc>0)
   say _myname 'problems closing MERRA-reduced template file ' fname 
   return rc
endif

_dimenv = fname

* Classic regrid2 (slow)
* ----------------------
  if ( _regrid2 = 1 )

  _func = 'regrid2(@,' dlon ',' dlat ',' algo ',' x0 ',' y0 ')'

* New .so regrid (much faster)
* ----------------------------
  else

    algo = substr(algo,1,2)
    if ( algo='vt' )
       algo = 'vt,0.5,0.5'
    endif
   _func = 're(@,' nlon ',linear,' x0 ',' dlon ','nlat ',linear,' y0 ',' dlat ',' algo ')'

  endif

return 0


***
* mkt62f()  Creates a template ctl for regridding to a Gaussian T62 grid;
*          also sets _dimenv, _func
*

function mkt62f(fname,algo)

if ( _verb = 1 )
      say _myname 'creating T62 template file ' fname
endif

rc=write(fname,'DSET nofile')
rc=subwrd(rc,1)
if ( rc > 0 )
   say rc
   say _myname 'cannot create T62 template file ' fname ' on current directory'
   return rc
endif

xdef = 'xdef 192 linear 0.000000 1.875000'
ydef = 'ydef  94 gaust62 1'
rc=write(fname,'title Template GrADS for regridding',append)
rc=write(fname,'options template',append)
rc=write(fname,'undef 1e+20',append)
rc=write(fname,xdef,append)
rc=write(fname,ydef,append)
rc=write(fname,'zdef   1 levels  1000 ',append)
rc=write(fname,'tdef 1 linear 0Z1jan1900 1dy',append)
rc=write(fname,'vars 1',append)
rc=write(fname,'var       0 0        generic sfc variable',append)
rc=write(fname,'endvars',append)

rc=close(fname)
rc=subwrd(rc,1)
if(rc>0)
   say _myname 'problems closing T62 template file ' fname 
   return rc
endif

_dimenv = fname

* Classic regrid2 (slow)
* ----------------------
  if ( _regrid2 = 1 )

     say _myname 'regrid2 no longer supported for T62 (can be fixed)'
     return 1

* New .so regrid (much faster)
* ----------------------------
  else

    algo = substr(algo,1,2)
    if ( algo='vt' )
       algo = 'vt,0.5,0.5'
    endif
   _func = 're(@,192,linear,0.0,1.875,94,gaus,1,94,ig,94,' algo ')'

  endif

return 0

***
* mkt106f()  Creates a template ctl for regridding to a Gaussian T106 grid;
*            also sets _dimenv, _func
***

function mkt106f(fname,algo)

if ( _verb = 1 )
      say _myname 'creating T106 template file ' fname
endif

rc=write(fname,'DSET nofile')
rc=subwrd(rc,1)
if ( rc > 0 )
   say rc
   say _myname 'cannot create T106 template file ' fname ' on current directory'
   return rc
endif

xdef = 'xdef 320 linear 0.000000 1.125'
ydef = 'ydef 160 levels'

rc=write(fname,'title Template GrADS for regridding',append)
rc=write(fname,'options template',append)
rc=write(fname,'undef 1e+20',append)
rc=write(fname,xdef,append)
rc=write(fname,ydef,append)
rc=write(fname,' -89.142 -88.029 -86.911 -85.791 -84.67 -83.549 -82.428 -81.307',append)
rc=write(fname,' -80.185 -79.064 -77.943 -76.821 -75.7 -74.578 -73.457 -72.336 -71.214 -70.093',append)
rc=write(fname,' -68.971 -67.85 -66.728 -65.607 -64.485 -63.364 -62.242 -61.121 -60 -58.878',append)
rc=write(fname,' -57.757 -56.635 -55.514 -54.392 -53.271 -52.149 -51.028 -49.906 -48.785 -47.663',append)
rc=write(fname,' -46.542 -45.42 -44.299 -43.177 -42.056 -40.934 -39.813 -38.691 -37.57 -36.448',append)
rc=write(fname,' -35.327 -34.205 -33.084 -31.962 -30.841 -29.719 -28.598 -27.476 -26.355 -25.234',append)
rc=write(fname,' -24.112 -22.991 -21.869 -20.748 -19.626 -18.505 -17.383 -16.262 -15.14 -14.019',append)
rc=write(fname,' -12.897 -11.776 -10.654 -9.533 -8.411 -7.29 -6.168 -5.047 -3.925 -2.804',append)
rc=write(fname,' -1.682 -0.561 0.561 1.682 2.804 3.925 5.047 6.168 7.29 8.411',append)
rc=write(fname,' 9.533 10.654 11.776 12.897 14.019 15.14 16.262 17.383 18.505 19.626',append)
rc=write(fname,' 20.748 21.869 22.991 24.112 25.234 26.355 27.476 28.598 29.719 30.841',append)
rc=write(fname,' 31.962 33.084 34.205 35.327 36.448 37.57 38.691 39.813 40.934 42.056',append)
rc=write(fname,' 43.177 44.299 45.42 46.542 47.663 48.785 49.906 51.028 52.149 53.271',append)
rc=write(fname,' 54.392 55.514 56.635 57.757 58.878 60 61.121 62.242 63.364 64.485',append)
rc=write(fname,' 65.607 66.728 67.85 68.971 70.093 71.214 72.336 73.457 74.578 75.7',append)
rc=write(fname,' 76.821 77.943 79.064 80.185 81.307 82.428 83.549 84.67 85.791 86.911',append)
rc=write(fname,' 88.029 89.142',append)
rc=write(fname,'zdef   1 levels  1000 ',append)
rc=write(fname,'tdef 1 linear 0Z1jan1900 1dy',append)
rc=write(fname,'vars 1',append)
rc=write(fname,'var       0 0        generic sfc variable',append)
rc=write(fname,'endvars',append)

rc=close(fname)
rc=subwrd(rc,1)
if(rc>0)
   say _myname 'problems closing T106 template file ' fname 
   return rc
endif

_dimenv = fname

* Classic regrid2 (slow)
* ----------------------
  if ( _regrid2 = 1 )

     say _myname 'regrid2 no longer supported for T106 (can be fixed)'
     return 1

* New .so regrid (much faster)
* ----------------------------
  else

    algo = substr(algo,1,2)
    if ( algo='vt' )
       algo = 'vt,0.5,0.5'
    endif
   _func = 're(@,320,linear,0.0,1.125,160,gaus,1,160,ig,160,' algo ')'

  endif

return 0

***
* mkt106f()  Creates a template ctl for regridding to a Gaussian T106 grid;
*            also sets _dimenv, _func
*

function mkt106f(fname,algo)

if ( _verb = 1 )
      say _myname 'creating T106 template file ' fname
endif

rc=write(fname,'DSET nofile')
rc=subwrd(rc,1)
if ( rc > 0 )
   say rc
   say _myname 'cannot create T106 template file ' fname ' on current directory'
   return rc
endif

xdef = 'xdef 320 linear 0.000000 1.125'
ydef = 'ydef 160 levels'

rc=write(fname,'title Template GrADS for regridding',append)
rc=write(fname,'options template',append)
rc=write(fname,'undef 1e+20',append)
rc=write(fname,xdef,append)
rc=write(fname,ydef,append)
rc=write(fname,' -89.142 -88.029 -86.911 -85.791 -84.67 -83.549 -82.428 -81.307',append)
rc=write(fname,' -80.185 -79.064 -77.943 -76.821 -75.7 -74.578 -73.457 -72.336 -71.214 -70.093',append)
rc=write(fname,' -68.971 -67.85 -66.728 -65.607 -64.485 -63.364 -62.242 -61.121 -60 -58.878',append)
rc=write(fname,' -57.757 -56.635 -55.514 -54.392 -53.271 -52.149 -51.028 -49.906 -48.785 -47.663',append)
rc=write(fname,' -46.542 -45.42 -44.299 -43.177 -42.056 -40.934 -39.813 -38.691 -37.57 -36.448',append)
rc=write(fname,' -35.327 -34.205 -33.084 -31.962 -30.841 -29.719 -28.598 -27.476 -26.355 -25.234',append)
rc=write(fname,' -24.112 -22.991 -21.869 -20.748 -19.626 -18.505 -17.383 -16.262 -15.14 -14.019',append)
rc=write(fname,' -12.897 -11.776 -10.654 -9.533 -8.411 -7.29 -6.168 -5.047 -3.925 -2.804',append)
rc=write(fname,' -1.682 -0.561 0.561 1.682 2.804 3.925 5.047 6.168 7.29 8.411',append)
rc=write(fname,' 9.533 10.654 11.776 12.897 14.019 15.14 16.262 17.383 18.505 19.626',append)
rc=write(fname,' 20.748 21.869 22.991 24.112 25.234 26.355 27.476 28.598 29.719 30.841',append)
rc=write(fname,' 31.962 33.084 34.205 35.327 36.448 37.57 38.691 39.813 40.934 42.056',append)
rc=write(fname,' 43.177 44.299 45.42 46.542 47.663 48.785 49.906 51.028 52.149 53.271',append)
rc=write(fname,' 54.392 55.514 56.635 57.757 58.878 60 61.121 62.242 63.364 64.485',append)
rc=write(fname,' 65.607 66.728 67.85 68.971 70.093 71.214 72.336 73.457 74.578 75.7',append)
rc=write(fname,' 76.821 77.943 79.064 80.185 81.307 82.428 83.549 84.67 85.791 86.911',append)
rc=write(fname,' 88.029 89.142',append)
rc=write(fname,'zdef   1 levels  1000 ',append)
rc=write(fname,'tdef 1 linear 0Z1jan1900 1dy',append)
rc=write(fname,'vars 1',append)
rc=write(fname,'var       0 0        generic sfc variable',append)
rc=write(fname,'endvars',append)

rc=close(fname)
rc=subwrd(rc,1)
if(rc>0)
   say _myname 'problems closing T106 template file ' fname 
   return rc
endif

_dimenv = fname

* Classic regrid2 (slow)
* ----------------------
  if ( _regrid2 = 1 )

     say _myname 'regrid2 no longer supported for T106 (can be fixed)'
     return 1

* New .so regrid (much faster)
* ----------------------------
  else

    algo = substr(algo,1,2)
    if ( algo='vt' )
       algo = 'vt,0.5,0.5'
    endif
   _func = 're(@,320,linear,0.0,1.125,160,gaus,1,160,ig,160,' algo ')'

  endif

return 0

***
* mkt126f()  Creates a template ctl for regridding to a Gaussian T126 grid;
*            also sets _dimenv, _func
*

function mkt126f(fname,algo)

if ( _verb = 1 )
      say _myname 'creating T126 template file ' fname
endif

rc=write(fname,'DSET nofile')
rc=subwrd(rc,1)
if ( rc > 0 )
   say rc
   say _myname 'cannot create T126 template file ' fname ' on current directory'
   return rc
endif

xdef = 'xdef 384 linear 0 0.9375'
ydef = 'ydef 190 levels'

rc=write(fname,'title GrADS template for regridding to T126',append)
rc=write(fname,'options template',append)
rc=write(fname,'undef 1e+20',append)
rc=write(fname,xdef,append)
rc=write(fname,ydef,append)
rc=write(fname,'-89.277 -88.340 -87.397 -86.454 -85.509 -84.565 -83.620 -82.676 -81.731 -80.786',append)
rc=write(fname,'-79.841 -78.897 -77.952 -77.007 -76.062 -75.117 -74.173 -73.228 -72.283 -71.338',append)
rc=write(fname,'-70.393 -69.448 -68.503 -67.559 -66.614 -65.669 -64.724 -63.779 -62.834 -61.889',append)
rc=write(fname,'-60.945 -60.000 -59.055 -58.110 -57.165 -56.220 -55.275 -54.330 -53.386 -52.441',append)
rc=write(fname,'-51.496 -50.551 -49.606 -48.661 -47.716 -46.771 -45.827 -44.882 -43.937 -42.992',append)
rc=write(fname,'-42.047 -41.102 -40.157 -39.212 -38.268 -37.323 -36.378 -35.433 -34.488 -33.543',append)
rc=write(fname,'-32.598 -31.653 -30.709 -29.764 -28.819 -27.874 -26.929 -25.984 -25.039 -24.094',append)
rc=write(fname,'-23.150 -22.205 -21.260 -20.315 -19.370 -18.425 -17.480 -16.535 -15.590 -14.646',append)
rc=write(fname,'-13.701 -12.756 -11.811 -10.866  -9.921  -8.976  -8.031  -7.087  -6.142  -5.197',append)
rc=write(fname,' -4.252  -3.307  -2.362  -1.417  -0.472   0.472   1.417   2.362   3.307   4.252',append)
rc=write(fname,'  5.197   6.142   7.087   8.031   8.976   9.921  10.866  11.811  12.756  13.701',append)
rc=write(fname,' 14.646  15.590  16.535  17.480  18.425  19.370  20.315  21.260  22.205  23.150',append)
rc=write(fname,' 24.094  25.039  25.984  26.929  27.874  28.819  29.764  30.709  31.653  32.598',append)
rc=write(fname,' 33.543  34.488  35.433  36.378  37.323  38.268  39.212  40.157  41.102  42.047',append)
rc=write(fname,' 42.992  43.937  44.882  45.827  46.771  47.716  48.661  49.606  50.551  51.496',append)
rc=write(fname,' 52.441  53.386  54.330  55.275  56.220  57.165  58.110  59.055  60.000  60.945',append)
rc=write(fname,' 61.889  62.834  63.779  64.724  65.669  66.614  67.559  68.503  69.448  70.393',append)
rc=write(fname,' 71.338  72.283  73.228  74.173  75.117  76.062  77.007  77.952  78.897  79.841',append)
rc=write(fname,' 80.786  81.731  82.676  83.620  84.565  85.509  86.454  87.397  88.340  89.277',append)
rc=write(fname,'zdef   1 levels  1000 ',append)
rc=write(fname,'tdef 1 linear 0Z1jan1900 1dy',append)
rc=write(fname,'vars 1',append)
rc=write(fname,'var       0 0        generic sfc variable',append)
rc=write(fname,'endvars',append)

rc=close(fname)
rc=subwrd(rc,1)
if(rc>0)
   say _myname 'problems closing T106 template file ' fname 
   return rc
endif

_dimenv = fname

* Classic regrid2 (slow)
* ----------------------
  if ( _regrid2 = 1 )

     say _myname 'regrid2 no longer supported for T126 (can be fixed)'
     return 1

* New .so regrid (much faster)
* ----------------------------
  else

    algo = substr(algo,1,2)
    if ( algo='vt' )
       algo = 'vt,0.5,0.5'
    endif
   _func = 're(@,384,linear,0.0,0.9375,190,gaus,1,190,ig,190,' algo ')'

  endif

return 0

***
* mkt511f()  Creates a template ctl for regridding to a Gaussian T511 grid (JRA);
*            also sets _dimenv, _func
*

function mkt511f(fname,algo)

if ( _verb = 1 )
      say _myname 'creating T511 template file ' fname
endif

rc=write(fname,'DSET nofile')
rc=subwrd(rc,1)
if ( rc > 0 )
   say rc
   say _myname 'cannot create T511 template file ' fname ' on current directory'
   return rc
endif

xdef = 'xdef 1024 linear 0.000000 0.351562072336266'
ydef = 'ydef 512 levels'

rc=write(fname,'title Template GrADS for regridding',append)
rc=write(fname,'options template',append)
rc=write(fname,'undef 1e+20',append)
rc=write(fname,xdef,append)
rc=write(fname,ydef,append)
rc=write(fname,' -89.731 -89.383 -89.033 -88.682 -88.331 -87.980 -87.629 -87.277 -86.926 -86.575',append)
rc=write(fname,' -86.224 -85.873 -85.522 -85.170 -84.819 -84.468 -84.117 -83.766 -83.414 -83.063',append)
rc=write(fname,' -82.712 -82.361 -82.010 -81.658 -81.307 -80.956 -80.605 -80.253 -79.902 -79.551',append)
rc=write(fname,' -79.200 -78.849 -78.497 -78.146 -77.795 -77.444 -77.093 -76.741 -76.390 -76.039',append)
rc=write(fname,' -75.688 -75.336 -74.985 -74.634 -74.283 -73.932 -73.580 -73.229 -72.878 -72.527',append)
rc=write(fname,' -72.176 -71.824 -71.473 -71.122 -70.771 -70.419 -70.068 -69.717 -69.366 -69.015',append)
rc=write(fname,' -68.663 -68.312 -67.961 -67.610 -67.258 -66.907 -66.556 -66.205 -65.854 -65.502',append)
rc=write(fname,' -65.151 -64.800 -64.449 -64.098 -63.746 -63.395 -63.044 -62.693 -62.341 -61.990',append)
rc=write(fname,' -61.639 -61.288 -60.937 -60.585 -60.234 -59.883 -59.532 -59.180 -58.829 -58.478',append)
rc=write(fname,' -58.127 -57.776 -57.424 -57.073 -56.722 -56.371 -56.019 -55.668 -55.317 -54.966',append)
rc=write(fname,' -54.615 -54.263 -53.912 -53.561 -53.210 -52.859 -52.507 -52.156 -51.805 -51.454',append)
rc=write(fname,' -51.102 -50.751 -50.400 -50.049 -49.698 -49.346 -48.995 -48.644 -48.293 -47.941',append)
rc=write(fname,' -47.590 -47.239 -46.888 -46.537 -46.185 -45.834 -45.483 -45.132 -44.780 -44.429',append)
rc=write(fname,' -44.078 -43.727 -43.376 -43.024 -42.673 -42.322 -41.971 -41.619 -41.268 -40.917',append)
rc=write(fname,' -40.566 -40.215 -39.863 -39.512 -39.161 -38.810 -38.459 -38.107 -37.756 -37.405',append)
rc=write(fname,' -37.054 -36.702 -36.351 -36.000 -35.649 -35.298 -34.946 -34.595 -34.244 -33.893',append)
rc=write(fname,' -33.541 -33.190 -32.839 -32.488 -32.137 -31.785 -31.434 -31.083 -30.732 -30.380',append)
rc=write(fname,' -30.029 -29.678 -29.327 -28.976 -28.624 -28.273 -27.922 -27.571 -27.219 -26.868',append)
rc=write(fname,' -26.517 -26.166 -25.815 -25.463 -25.112 -24.761 -24.410 -24.059 -23.707 -23.356',append)
rc=write(fname,' -23.005 -22.654 -22.302 -21.951 -21.600 -21.249 -20.898 -20.546 -20.195 -19.844',append)
rc=write(fname,' -19.493 -19.141 -18.790 -18.439 -18.088 -17.737 -17.385 -17.034 -16.683 -16.332',append)
rc=write(fname,' -15.980 -15.629 -15.278 -14.927 -14.576 -14.224 -13.873 -13.522 -13.171 -12.820',append)
rc=write(fname,' -12.468 -12.117 -11.766 -11.415 -11.063 -10.712 -10.361 -10.010  -9.659  -9.307',append)
rc=write(fname,'  -8.956  -8.605  -8.254  -7.902  -7.551  -7.200  -6.849  -6.498  -6.146  -5.795',append)
rc=write(fname,'  -5.444  -5.093  -4.741  -4.390  -4.039  -3.688  -3.337  -2.985  -2.634  -2.283',append)
rc=write(fname,'  -1.932  -1.580  -1.229  -0.878  -0.527  -0.176   0.176   0.527   0.878   1.229',append)
rc=write(fname,'   1.580   1.932   2.283   2.634   2.985   3.337   3.688   4.039   4.390   4.741',append)
rc=write(fname,'   5.093   5.444   5.795   6.146   6.498   6.849   7.200   7.551   7.902   8.254',append)
rc=write(fname,'   8.605   8.956   9.307   9.659  10.010  10.361  10.712  11.063  11.415  11.766',append)
rc=write(fname,'  12.117  12.468  12.820  13.171  13.522  13.873  14.224  14.576  14.927  15.278',append)
rc=write(fname,'  15.629  15.980  16.332  16.683  17.034  17.385  17.737  18.088  18.439  18.790',append)
rc=write(fname,'  19.141  19.493  19.844  20.195  20.546  20.898  21.249  21.600  21.951  22.302',append)
rc=write(fname,'  22.654  23.005  23.356  23.707  24.059  24.410  24.761  25.112  25.463  25.815',append)
rc=write(fname,'  26.166  26.517  26.868  27.219  27.571  27.922  28.273  28.624  28.976  29.327',append)
rc=write(fname,'  29.678  30.029  30.380  30.732  31.083  31.434  31.785  32.137  32.488  32.839',append)
rc=write(fname,'  33.190  33.541  33.893  34.244  34.595  34.946  35.298  35.649  36.000  36.351',append)
rc=write(fname,'  36.702  37.054  37.405  37.756  38.107  38.459  38.810  39.161  39.512  39.863',append)
rc=write(fname,'  40.215  40.566  40.917  41.268  41.619  41.971  42.322  42.673  43.024  43.376',append)
rc=write(fname,'  43.727  44.078  44.429  44.780  45.132  45.483  45.834  46.185  46.537  46.888',append)
rc=write(fname,'  47.239  47.590  47.941  48.293  48.644  48.995  49.346  49.698  50.049  50.400',append)
rc=write(fname,'  50.751  51.102  51.454  51.805  52.156  52.507  52.859  53.210  53.561  53.912',append)
rc=write(fname,'  54.263  54.615  54.966  55.317  55.668  56.019  56.371  56.722  57.073  57.424',append)
rc=write(fname,'  57.776  58.127  58.478  58.829  59.180  59.532  59.883  60.234  60.585  60.937',append)
rc=write(fname,'  61.288  61.639  61.990  62.341  62.693  63.044  63.395  63.746  64.098  64.449',append)
rc=write(fname,'  64.800  65.151  65.502  65.854  66.205  66.556  66.907  67.258  67.610  67.961',append)
rc=write(fname,'  68.312  68.663  69.015  69.366  69.717  70.068  70.419  70.771  71.122  71.473',append)
rc=write(fname,'  71.824  72.176  72.527  72.878  73.229  73.580  73.932  74.283  74.634  74.985',append)
rc=write(fname,'  75.336  75.688  76.039  76.390  76.741  77.093  77.444  77.795  78.146  78.497',append)
rc=write(fname,'  78.849  79.200  79.551  79.902  80.253  80.605  80.956  81.307  81.658  82.010',append)
rc=write(fname,'  82.361  82.712  83.063  83.414  83.766  84.117  84.468  84.819  85.170  85.522',append)
rc=write(fname,'  85.873  86.224  86.575  86.926  87.277  87.629  87.980  88.331  88.682  89.033',append)
rc=write(fname,'  89.383  89.731',append)
rc=write(fname,'zdef   1 levels  1000 ',append)
rc=write(fname,'tdef 1 linear 0Z1jan1900 1dy',append)
rc=write(fname,'vars 1',append)
rc=write(fname,'var       0 0        generic sfc variable',append)
rc=write(fname,'endvars',append)

rc=close(fname)
rc=subwrd(rc,1)
if(rc>0)
   say _myname 'problems closing T511 template file ' fname 
   return rc
endif

_dimenv = fname

* Classic regrid2 (slow)
* ----------------------
  if ( _regrid2 = 1 )

     say _myname 'regrid2 no longer supported for T511 (can be fixed)'
     return 1

* New .so regrid (much faster)
* ----------------------------
  else

    algo = substr(algo,1,2)
    if ( algo='vt' )
       algo = 'vt,0.5,0.5'
    endif
   _func = 're(@,1024,linear,0.0,0.351562072336266,512,gaus,1,512,ig,512,' algo ')'

  endif

return 0


***
* validate(var,vars)  See whether token var is in the list vars
*
function validate(var,vars)
      if ( vars = '' ); return 1; endif
      valid = 0
      i = 1
      v = subwrd(vars,i)
      while ( v != '' )
         if ( var = v ); valid = 1; endif
         i = i + 1
         v = subwrd(vars,i)
      endwhile
return valid

*
* xvalidate(var,vars)  See whether token var is NOT in the list vars
*
function xvalidat(var,vars)
      if ( vars = '' ); return 1; endif
      valid = 1
      i = 1
      v = subwrd(vars,i)
      while ( v != '' )
         if ( var = v ); valid = 0; endif
         i = i + 1
         v = subwrd(vars,i)
      endwhile
return valid

*
* defvars()  Define variables in output LATS file
*

function defvars()

* BUG: for now, cannot handle "accum" variables, oh well...
* ---------------------------------------------------------
  if ( _mean = 1 )
       timestat = 'average'
  else
       timestat = 'instant'
  endif

* Surface variables
* ------------------
  n = 1; _svids = ''
  while ( n <= _nsvar )
     var = subwrd(_svars,n)
     if ( _needLATS )
       rc=LATScmd(_setLATS ' var  ' _fid ' ' var ' ' timestat ' ' _gid ' '  _sid)
     endif
     vid = subwrd(_result,5)
     if ( vid = 0 ); return 1; endif
     _svids = _svids ' ' vid
     n = n + 1
  endwhile


* Upper air variables
* -------------------
  n = 1; _uvids = ''
  while ( n <= _nuvar )
     var = subwrd(_uvars,n)
     if ( _needLATS )
        rc=LATScmd(_setLATS ' var  ' _fid ' ' var ' ' timestat ' ' _gid ' '  _lid)
     endif
     vid = subwrd(_result,5)
     _uvids = _uvids ' ' vid
     n = n + 1
  endwhile

return 0

*............................................................................

* subst(var,expr) Substitute all the occurences of '@' in expr with the 
*                 contents of var. Example:
*
*                 expr = cos(lat*pi/180)*@*hgrad(@)
*                 var  = ua
*
*                 results in cos(lat*pi/180)*ua*hgrad(ua).
*
*                 If expr='' it returns var.
*
function subst(var,expr)

      if ( expr ='' ); return var; endif

      str = ''
      i = 1
      ch = substr(expr,i,1)
      while( ch != '' )

           if ( ch = '@' )
                str = str '' var
           else
                str = str '' ch
           endif

           i = i + 1
           ch = substr(expr,i,1)

      endwhile

return str


*............................................................................

*
* chkcfg()  Check whether grads version is powerful enough to run lats4d
*

function chkcfg()

      'q config'
      if ( rc != 0 )
         say _myname 'GrADS version appears earlier than 1.7Beta'
         return 1
      endif

      _setLATS = 'unknown'

*     Check for built in LATS (GrADS v1.x)
*     ------------------------------------
      lats = 0
      cfg = sublin(result,1)
      i = 1
      version = subwrd(cfg,2)
      token = subwrd(cfg,i)
      while ( token != '' )
         if ( token = 'lats' ) 
               lats = 1
               _setLATS = 'set lats'
         endif
         i = i + 1
         token = subwrd(cfg,i)
      endwhile

*     Check for LATS extension (GrADS v2.0)
*     -------------------------------------
      _udxLATS = 0
      if ( lats=0 )
         has_it = check_udx('udc','set_lats')
         if ( has_it = 'yes' )
              lats = 1
              _setLATS = 'set_lats'
              _udxLATS = 1
         endif
      endif

      _hasLATS = lats

      if ( lats = 0 )
         say 'WARNING: this build of GrADS ' version ' does not include the LATS option'
         say 'WARNING: "-format grib" or "-format coads" are not supported.'
*         return 1
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

*............................................................................

function pstat ( name, expr, lev )

n = 12

if ( name = 'HEADER' )
  say _pad
  say  format(n,_pad,'   Name ','Lev','Min','Max','MEAN','STDV','RMS')
  say  format(n,_pad,'------------','------------','------------','------------','------------','------------','------------')
  _gnum = 0
  return 
endif
_pad = '  '

if ( name = 'TOTAL' )
  _gavg = _gavg/_gnum
  _gstd = math_sqrt(_gstd/_gnum)
  _grms = math_sqrt(_grms/_gnum)
  say  format(n,'  ','------------','------------','------------','------------','------------','------------','------------')
  say  formatn(n,'+ ',expr,_gnum,_gmin,_gmax,_gavg,_gstd,_grms)
  return 
endif

'd ' expr
if ( rc != 0 ); return 1; endif

line = sublin(result,8)
min  = subwrd(line,4) 
max  = subwrd(line,5)

line = sublin(result,11)
avg  = subwrd(line,2)
rms  = subwrd(line,4)

line = sublin(result,14)
std  = subwrd(line,2)

if ( lev='sfc' )
   say  formatn(n,'+ ',name,lev,min,max,avg,std,rms)
else
   say  formatn(n,'  ',name,lev,min,max,avg,std,rms)
endif


if ( _gnum = 0 )
   _gmin = min
   _gmax = max
   _gavg = avg 
   _grms = rms*rms
   _gstd = std
else
   if ( min < _gmin ); _gmin = min; endif
   if ( max > _gmax ); _gmax = max; endif
   _gavg = _gavg + avg
   _grms = _grms + rms*rms
   _gstd = _gstd + std*std
endif   
_gnum = _gnum + 1.0

return 0

*............................................................................

function format(n,pad,var,lev,min,max,avg,std,rms)
nv = n - 3
rec =  pad l(var,nv) ' ' r(lev,5) ' ' r(min,n) ' ' r(max,n) ' ' r(avg,n) ' ' r(std,n) ' ' r(rms,n)
return rec

function formatn(n,pad,var,lev,min,max,avg,std,rms)
nv = n - 3
rec =  pad l(var,nv) ' ' r(lev,5) ' ' re(min,n) ' ' re(max,n) ' ' re(avg,n) ' ' re(std,n) ' ' re(rms,n)
return rec

*............................................................................

function r ( str, n )
   len = 1
   while(substr(str,len,1)!=''); len=len+1; endwhile
   len = len - 1
   str = '                 ' str
   j = len + 18
   i = j - n + 1 
   str = substr(str,i,j)
return str

*............................................................................

function re ( val, n )
   fmt = '%11.4e'
   if ( math_abs(val) < 9999.99999 )
        fmt = '%11.4f'
   endif
   if ( math_abs(val) < 0.01 )
        fmt = '%11.8f'
   endif
   if ( math_abs(val) < 0.0001 )
        fmt = '%11.4e'
   endif
   if ( math_abs(val) = 0 )
        fmt = '%11.4f'
   endif
   str = math_format(fmt,val)
return str

*............................................................................

function l ( str, n )
   len = 1
   while(substr(str,len,1)!=''); len=len+1; endwhile
   len = len - 1
   str = str '                 ' 
   str = substr(str,1,n)
return str

*............................................................................

function basename ( path )

   len = 1
   slash = 0
   ch = substr(path,len,1)
   while ( ch!='' )
      if ( ch = '/' ); slash = len; endif      
      len=len+1
      ch = substr(path,len,1)
   endwhile
   len = len - 1
   if ( slash > 0 )
        basen = substr(path,slash+1,len)
   else
        basen = path
   endif

return basen

*............................................................................

* For portability: strlen() is not available in older
* versions of GrADS

function lenstr(str)
  n = 1
  while (substr(str,n,1) != '' )
     n = n + 1
  endwhile
  n = n - 1
return n

*............................................................................

* Wrapper around LATS commands; no-op if build has no LATS

function LATScmd ( gacmd )
***   say '                                  <' gacmd '>'
   if ( _hasLATS )
     gacmd
     _result = result
     return rc
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
* Set _func with a given satellite mask
*
function setmask()

* Make sure ORB extension is loaded
* ---------------------------------
  has_it = check_udx('udf','orb_mask')
  if ( has_it = 'no' )
     say _myname 'the ORB extension is not present, cannot use the -mask option'
     return 1
  endif    

* Halo
* ----
  if ( _halo != '' )
     'set_orb halo ' _halo
  endif

* No swath required for these
* ---------------------------
  mask = _mask
  if (mask='terra'|mask='aqua'|mask='aura'|mask='cloudsat'|mask='calipso')
    _func = 'orb_mask(@,'mask')'
     return 0
  endif

* These require swath specification
* ---------------------------------
  rc = 0

* TERRA instruments
* -----------------
  if (mask='modis_terra')
    _func = 'orb_mask(@,terra,2330)'
  else; if (mask='modis_terra_day')
    _func = 'orb_mask(@,terra,2330)*if(cosz(@,h),>,0,1,-u)'
  else; if (mask='misr')
    _func = 'orb_mask(@,terra,380)'
  else; if (mask='mopitt')
    _func = 'orb_mask(@,terra,616)'
  else; if (mask='aster')
    _func = 'orb_mask(@,terra,60)'

* AQUA instruments
* ----------------
  else; if (mask='modis_aqua')
    _func = 'orb_mask(@,aqua,2330)'
  else; if (mask='modis_aqua_day')
    _func = 'orb_mask(@,aqua,2330)*if(cosz(@,h),>,0,1,-u)'
  else; if (mask='airs')
    _func = 'orb_mask(@,aqua,1650)'
  else; if (mask='amsu_a')
    _func = 'orb_mask(@,aqua,1650)'
  else; if (mask='hsb')
    _func = 'orb_mask(@,aqua,1650)'
  else; if (mask='amsr_e')
    _func = 'orb_mask(@,aqua,1445)'

* AURA instruments
* ----------------
  else; if (mask='hirdls')
    _func = 'orb_mask(@,aura,3000)'
  else; if (mask='omi')
    _func = 'orb_mask(@,aura,2600)'
  else; if (mask='omi_day')
    _func = 'orb_mask(@,aura,2600)*if(cosz(@,h),>,0,1,-u)'
  else; if (mask='tes')
    _func = 'orb_mask(@,aura,180)'
  else
    rc = 1

  endif; endif; endif; endif; endif; endif; endif; endif; endif; endif; endif; endif; endif; endif; endif

  return rc
