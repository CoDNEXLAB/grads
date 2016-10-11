function zoomout(args)

   step=subwrd(args,1)
   var=subwrd(args,2)

   'query defval numzoom 1 1'
   nzpt = subwrd(result,3)

   if(nzpt+step<=0)
      'unzoomc'
      'zoomprep'
   else
      nzpt=nzpt+step
      'define numzoom='nzpt
      'query defval 'lonlo%nzpt' 1 1'
      lonlo=subwrd(result,3)
      'query defval 'lonhi%nzpt' 1 1'
      lonhi=subwrd(result,3)
      'query defval 'latlo%nzpt' 1 1'
      latlo=subwrd(result,3)
      'query defval 'lathi%nzpt' 1 1'
      lathi=subwrd(result,3)
      'set lon 'lonlo' 'lonhi
      'set lat 'latlo' 'lathi
      'clear'
   endif

   if ( var!='' )
      'display ' var
   endif

return
