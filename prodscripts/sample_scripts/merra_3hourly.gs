function merra_3hourly(dset)

   if(dset=''|dset='dset')
      say ''
      say 'NAME'
      say '       merra_3hourly -  Opens MERRA 3-hourly collections'
      say ''
      say 'SYNOPSIS'
      say '       merra_3hourly  collection'
      say ''
      say 'DESCRIPTION'
      say ''
      say '       This script sdf-opens the MERRA *3-hourly* OPeNDAP' 
      say '       URL for the specified *collection* using either' 
      say '       the collection *nickname*, a *short name* or even the'
      say '       official *product* name. The input *collection* is'
      say '       case insensitive, so that "cld" is the same as '
      say '       "CLD" or "Cld".'
      say ''
      say '                     Short'
      say '         Nickname    Name   Product         Brief Description'
      say '       -----------   ----  ----------  ----------------------------'
      say '       Assimilation  asm   MAI3CPASM   Instantaneous assimilated state'
      say '       Clouds        cld   MAT3CPCLD   Cloud properties'
      say '       MoistPhysics  h2o   MAT3CPMST   Moist physics diagnostics'
      say '       Radiation     rad   MAT3CPRAD   Cloud/radiation diagnostics'
      say '       Turbulence    trb   MAT3CPTRB   Turbulence diagnostics'
      say '       T_Tendency    d_t   MAT3CPTDT   Temperature tendencies'
      say '       q_Tendency    d_q   MAT3CPQDT   Specific hmidity tendencies'
      say '       uv_Tendency   d_u   MAT3CPUDT   Wind tendencies'
      say '       O3_Tendency   d_o   MAT3CPODT   Ozone tendencies'
      say ''
      say 'RESOLUTION'
      say ''
      say '       Recall that all MERRA 3-hourly datasets are 3-dimensional'
      say '       and given at the REDUCED horizontal resolution of 1.25 degree'
      say '       longitude by 1.25 degree latitude, globally. Each dataset'
      say '       has 42 constant pressure levels, from 1000 hPa to 0.1 hPa.'
      say '       Except for the assimilated meteorology (MAICPASM) which is'
      say '       instantaneous, each value is the 3-hour mean centered around'
      say '       the valid time.'
      say '       Please consult the collection metadata or the MERRA File '
      say '       Specification document available from' 
      say ''
      say '            http://gmao.gsfc.nasa.gov/research/merra/'
      say ''
      say '       for additional details about each collection.'
      say ''
      say 'EXAMPLES'
      say ''
      say '       merra_3hourly Clouds'
      say '       merra_3hourly rad'
      say '       merra_3hourly MAT3CPUDT'
      say ''
      say 'CONTACT'
      say '       Script: Arlindo.daSilva@nasa.gov'
      say '       Data:   Michael.Bosilovich@nasa.gov'
      say ''
      return 1
   endif

*  Hardwired parameters
*  --------------------
   base_url = 'http://goldsmr3.sci.gsfc.nasa.gov:80/dods/'

*  case insensitive
*  ----------------
   DSET = uppercase(dset)

*  Get URL
*  -------
         if ( DSET='ASSIMILATION'|DSET='ASM'   |DSET='MAI3CPASM' )
         url = base_url % 'MAI3CPASM'
   else; if ( DSET='CLOUDS'      |DSET='CLD'   |DSET='MAT3CPCLD' )
         url = base_url % 'MAT3CPCLD' 
   else; if ( DSET='MOISTPHYSICS'|DSET='H2O'   |DSET='MAT3CPMST' )
         url = base_url % 'MAT3CPMST' 
   else; if ( DSET='RADIATION'   |DSET='RAD'   |DSET='MAT3CPRAD' )
         url = base_url % 'MAT3CPRAD' 
   else; if ( DSET='TURBULENCE'  |DSET='TRB'   |DSET='MAT3CPTRB' )
         url = base_url % 'MAT3CPTRB' 
   else; if ( DSET='T_TENDENCY'  |DSET='D_T'   |DSET='MAT3CPTDT' )
         url = base_url % 'MAT3CPTDT' 
   else; if ( DSET='Q_TENDENCY'  |DSET='D_Q'   |DSET='MAT3CPQDT' )
         url = base_url % 'MAT3CPQDT' 
   else; if ( DSET='UV_TENDENCY' |DSET='D_U'   |DSET='MAT3CPUDT' )
         url = base_url % 'MAT3CPUDT' 
   else; if ( DSET='O3_TENDENCY' |DSET='D_O'   |DSET='MAT3CPODT' )
         url = base_url % 'MAT3CPODT' 
   else
      say 'merra_3hourly: unknown dataset ' dset
      return 1
   endif; endif; endif; endif; endif; endif; endif; endif; endif

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
        say 'merra_3hourly: this version of GrADS cannot open OPeNDAP datasets'
        say 'merra_3hourly: try "gradsdods" or "gradsdap" instead'
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

