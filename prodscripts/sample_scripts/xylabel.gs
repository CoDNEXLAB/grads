function xylabel ( args )

*  Parse arguments
*  ---------------
   panel = substr(args,1,3)
   label = substr(args,5,60)

   if ( panel!='top' & panel!='mid' & panel!='bot' )
      say '  Usage:   xylabel  panel  label'
      say 'Example:   xylabel  top This is the Title for the top panel'
      return 1
    endif 

   'set parea 1 7.4 3.92 7.08'
   'set strsiz .12 '
   'set string 1 c' 

   if ( panel='top')
      'draw string  4.25  10.89 ' label
   endif

   if ( panel='mid' )
      'draw string  4.25   7.25  ' label
   endif

   if ( panel='bot' )
      'draw string   4.25 3.75 '   label
   endif

return

