function merra_hourly(dset)

   if(dset=''|dset='dset')
      say ''
      say 'NAME'
      say '       merra_hourly - Opens MERRA hourly collections'
      say ''
      say 'SYNOPSIS'
      say '       merra_hourly  collection'
      say ''
      say 'DESCRIPTION'
      say ''
      say '       This script sdf-opens the MERRA *hourly* OPeNDAP' 
      say '       URL for the specified *collection* using either' 
      say '       the collection *nickname*, a *short name* or even the'
      say '       official *product* name. The input *collection* is'
      say '       case insensitive, so that "met" is the same as '
      say '       "MET" or "Met".'
      say ''
      say '                     Short'
      say '         Nickname    Name   Product         Brief Description'
      say '       -----------   ----  ----------  ----------------------------'
      say '       Meteorology   met   MAT1NXSLV   Single level met fields'
      say '       Surface       sfc   MAT1NXFLX   Surface fluxes'
      say '       LandSurface   lnd   MAT1NXLND   Land surface diagnostics'
      say '       Radiation     rad   MAT1NXRAD   Radiation fluxes: sfc & toa'
      say '       Cloud         cld   MAI1NXINT   Column cloud properties'
      say '       Budget        bgt   MAT1NXINT   Column budget terms'
      say ''
      say 'RESOLUTION'
      say ''
      say '       Recall that all MERRA hourly datasets are 2-dimensional '
      say '       and given at the NATIVE horizontal resolution of 2/3 degree'
      say '       longitude by 1/2 degree latitude, globally. Consult the'
      say '       collection metadata or the MERRA File Specification '
      say '       document available from' 
      say ''
      say '            http://gmao.gsfc.nasa.gov/research/merra/'
      say ''
      say '       for additional details about each collection.'
      say ''
      say 'EXAMPLES'
      say '       merra_hourly Meteorology'
      say '       merra_hourly sfc'
      say '       merra_hourly MAT1NXINT'
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
   if ( DSET='METEOROLOGY'|DSET='MET'|DSET='MAT1NXSLV' )
     url = base_url % 'MAT1NXSLV'
   else; if ( DSET='SURFACEFLUXES'|DSET='SFC'|DSET='MAT1NXFLX' )
     url = base_url % 'MAT1NXFLX' 
   else; if ( DSET='RADIATIONFLUXES'|DSET='RAD'|DSET='MAT1NXRAD' )
     url = base_url % 'MAT1NXRAD' 
   else; if ( DSET='LANDSURFACE'|DSET='LND'|DSET='MAT1NXLND' )
     url = base_url % 'MAT1NXLND' 
   else; if ( DSET='CLOUDSPROPERTIES'|DSET='CLD'|DSET='MAI1NXINT' )
     url = base_url % 'MAI1NXINT' 
   else; if ( DSET='BUDGETTERMS'|DSET='BGT'|DSET='MAT1NXINT' )
     url = base_url % 'MAT1NXINT' 
   else
      say 'merra_hourly: unknown dataset ' dset
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
        say 'merra_hourly: this version of GrADS cannot open OPeNDAP datasets'
        say 'merra_hourly: try "gradsdods" or "gradsdap" instead'
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

