function merra_monthly2d(dset)

   if(dset=''|dset='dset')
      say ''
      say 'NAME'
      say '       merra_monthly2d - Opens MERRA 2D monthly mean collections'
      say ''
      say 'SYNOPSIS'
      say '       merra_monthly2d  collection'
      say ''
      say 'DESCRIPTION'
      say ''
      say '       This script sdf-opens the MERRA 2D monthly mean OPeNDAP' 
      say '       URL for the specified *collection* using either' 
      say '       the collection *nickname*, a *short name* or even the'
      say '       official *product* name. The input *collection* is'
      say '       case insensitive, so that "met" is the same as '
      say '       "MET" or "Met".'
      say ''
      say '                     Short'
      say '         Nickname    Name   Product         Brief Description'
      say '       -----------   ----  ----------  ----------------------------'
      say '       Meteorology   met   MATMNXSLV   Single level met fields'
      say '       Surface       sfc   MATMNXFLX   Surface fluxes'
      say '       LandSurface   lnd   MATMNXLND   Land surface diagnostics'
      say '       Radiation     rad   MATMNXRAD   Radiation fluxes: sfc & toa'
      say '       Cloud         cld   MAI1NXINT   Column cloud properties'
      say '       Budget        bgt   MATMNXINT   Column budget terms'
      say ''
      say 'RESOLUTION'
      say ''
      say '       Recall that these 2-dimensional MERRA datasets are'
      say '       given at the NATIVE horizontal resolution of 2/3 degree'
      say '       longitude by 1/2 degree latitude, globally. Consult the'
      say '       collection metadata or the MERRA File Specification '
      say '       document available from' 
      say ''
      say '            http://gmao.gsfc.nasa.gov/research/merra/'
      say ''
      say '       for additional details about each collection.'
      say ''
      say 'EXAMPLES'
      say ''
      say '       merra_monthly2d Meteorology'
      say '       merra_monthly2d sfc'
      say '       merra_monthly2d MATMNXINT'
      say ''
      say 'CONTACT'
      say '       Script: Arlindo.daSilva@nasa.gov'
      say '       Data:   Michael.Bosilovich@nasa.gov'
      say ''
      return 1
   endif

*  Hardwired parameters
*  --------------------
   base_url = 'http://goldsmr2.sci.gsfc.nasa.gov:80/dods/'

*  case insensitive
*  ----------------
   DSET = uppercase(dset)

*  Get URL
*  -------
   if ( DSET='METEOROLOGY'|DSET='MET'|DSET='MATMNXSLV' )
     url = base_url % 'MATMNXSLV'
   else; if ( DSET='SURFACEFLUXES'|DSET='SFC'|DSET='MATMNXFLX' )
     url = base_url % 'MATMNXFLX' 
   else; if ( DSET='RADIATIONFLUXES'|DSET='RAD'|DSET='MATMNXRAD' )
     url = base_url % 'MATMNXRAD' 
   else; if ( DSET='LANDSURFACE'|DSET='LND'|DSET='MATMNXLND' )
     url = base_url % 'MATMNXLND' 
   else; if ( DSET='CLOUDSPROPERTIES'|DSET='CLD'|DSET='MAI1NXINT' )
     url = base_url % 'MAI1NXINT' 
   else; if ( DSET='BUDGETTERMS'|DSET='BGT'|DSET='MATMNXINT' )
     url = base_url % 'MATMNXINT' 
   else
      say 'merra_monthly2d: unknown dataset ' dset
      return 1
   endif; endif; endif; endif; endif; endif

* Make sure we've got DODS
* ------------------------
  'q config'
  config = sublin(result,1)
  i = 1
  while ( i>0 )
    word = subwrd(config,i)
    if ( word='' ); i=-1; endif
    if ( word='dods'|word='dap'|word='opendap-grids'|word='opendap-grids,stn'); dods='yes'; endif
    i = i + 1
  endwhile

*  Open the file
*  -------------
   if ( dods='yes' )
        'sdfopen ' url
	say result
   else
        say ' '
        say 'merra_monthly2d: this version of GrADS cannot open OPeNDAP datasets'
        say 'merra_monthly2d: try "gradsdods" or "gradsdap" instead'
        say ' '
	return 1
   endif

return rc

* ........................................................................

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

