function merra_monthly3d(dset)

   if(dset=''|dset='dset')
      say ''
      say 'NAME'
      say '       merra_monthly3d - Opens MERRA 3D monthly mean collections'
      say ''
      say 'SYNOPSIS'
      say '       merra_monthly3d  collection'
      say ''
      say 'DESCRIPTION'
      say ''
      say '       This script sdf-opens the MERRA 3D monthly mean OPeNDAP' 
      say '       URL for the specified *collection* using either' 
      say '       the collection *nickname*, a *short name* or even the'
      say '       official *product* name. The input *collection* is'
      say '       case insensitive, so that "cld" is the same as '
      say '       "CLD" or "Cld".'
      say ''
      say '                     Short'
      say '         Nickname    Name   Product         Brief Description'
      say '       -----------   ----  ----------  -------------------------------'
      say '       Analysis      ana   MAIMNPANA   Instantaneous analyzed state'
      say '       Assimilation  asm   MAIMCPASM   Instantaneous assimilated state'
      say '       Clouds        cld   MATMCPCLD   Cloud properties'
      say '       MoistPhysics  h2o   MATMCPMST   Moist physics diagnostics'
      say '       Radiation     rad   MATMCPRAD   Cloud/radiation diagnostics'
      say '       Turbulence    trb   MATMCPTRB   Turbulence diagnostics'
      say '       T_Tendency    d_t   MATMCPTDT   Temperature tendencies'
      say '       q_Tendency    d_q   MATMCPQDT   Specific hmidity tendencies'
      say '       uv_Tendency   d_u   MATMCPUDT   Wind tendencies'
      say '       O3_Tendency   d_o   MATMCPODT   Ozone tendencies'
      say ''
      say 'RESOLUTION'
      say ''
      say '       Recall that these 3-dimensional MERRA datasets are given'
      say '       at the REDUCED horizontal resolution of 1.25 degree'
      say '       longitude by 1.25 degree latitude, globally. Each dataset'
      say '       has 42 constant pressure levels, from 1000 hPa to 0.1 hPa.'
      say '       Each value is the 3-hour mean centered around the valid time.'
      say '       Please consult the collection metadata or the MERRA File '
      say '       Specification document available from' 
      say ''
      say '            http://gmao.gsfc.nasa.gov/research/merra/'
      say ''
      say '       for additional details about each collection.'
      say ''
      say 'EXAMPLES'
      say ''
      say '       merra_monthly3d Clouds'
      say '       merra_monthly3d rad'
      say '       merra_monthly3d MATMCPUDT'
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
         if ( DSET='ANALYSIS'    | DSET='ANA'  | DSET='MAIMNPANA')
              url = base_url % 'MAIMNPANA'
   else; if ( DSET='ASSIMILATION'| DSET='ASM'  | DSET='MAIMCPASM')
              url = base_url % 'MAIMCPASM'
   else; if ( DSET='CLOUDS'      |DSET='CLD'   |DSET='MATMCPCLD' )
              url = base_url % 'MATMCPCLD' 
   else; if ( DSET='MOISTPHYSICS'|DSET='H2O'   |DSET='MATMCPMST' )
              url = base_url % 'MATMCPMST' 
   else; if ( DSET='RADIATION'   |DSET='RAD'   |DSET='MATMCPRAD' )
              url = base_url % 'MATMCPRAD' 
   else; if ( DSET='TURBULENCE'  |DSET='TRB'   |DSET='MATMCPTRB' )
              url = base_url % 'MATMCPTRB' 
   else; if ( DSET='T_TENDENCY'  |DSET='D_T'   |DSET='MATMCPTDT' )
              url = base_url % 'MATMCPTDT' 
   else; if ( DSET='Q_TENDENCY'  |DSET='D_Q'   |DSET='MATMCPQDT' )
              url = base_url % 'MATMCPQDT' 
   else; if ( DSET='UV_TENDENCY' |DSET='D_U'   |DSET='MATMCPUDT' )
              url = base_url % 'MATMCPUDT' 
   else; if ( DSET='O3_TENDENCY' |DSET='D_O'   |DSET='MATMCPODT' )
              url = base_url % 'MATMCPODT' 
   else
      say 'merra_monthly3d: unknown dataset ' dset
      return 1
   endif; endif; endif; endif; endif; endif; endif; endif; endif; endif

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
        say 'merra_monthly3d: this version of GrADS cannot open OPeNDAP datasets'
        say 'merra_monthly3d: try "gradsdods" or "gradsdap" instead'
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

