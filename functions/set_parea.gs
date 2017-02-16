
function set_parea(args)

if(subwrd(args,4)='')
  help()
  return
endif

row=subwrd(args,1)
col=subwrd(args,2)
y=subwrd(args,3)
x=subwrd(args,4)
marg=0.5


check=1
a=5
while(check=1)
  line=subwrd(args,a)
  if(line='');break;endif

  if(line='-margin' | line='-m'); marg=subwrd(args,a+1) ;endif
  if(line='-show' | line='-s'); show=1;endif
  a=a+1
endwhile

if(x>col | y>row | x<1 | y<1)
  say ''
  say ''
  say '!!!!!! WARNING: Your plot choice is out of the accepted range !!!!!'
  say '!!!!!! Entering Help Page !!!!!!'
  say ''
  say ''
  help()
  return
endif

    say '----------------------------------------------'
    say 'You are plotting 'row' rows and 'col' columns.'
    say 'Your margin is 'marg'.'
    say '----------------------------------------------'

    'q gxinfo'
    pg_size=sublin(result,2)
    x_siz=subwrd(pg_size,4)
    y_siz=subwrd(pg_size,6)

    o_marg=marg
    i_marg=marg/2

    xpl_siz=(x_siz-2*o_marg-(col-1)*i_marg)/col
    ypl_siz=(y_siz-2*o_marg-(row-1)*i_marg)/row

if(show=1)
      'q file'
      if(sublin(result,1)='No Files Open');check=0;else;check=1;endif
      
      if(check=1)
        say "Plotting this arrangement"
        var=sublin(result,7)
        var=subwrd(var,1)
        say "Plotting "var
        say '-------------'
        'clear'
        'set mpdset hires'

        i=1
        while(i<=col)
          j=1
          while(j<=row)

            xmin=o_marg+(i-1)*(xpl_siz+i_marg)
            xmax=xmin+xpl_siz
            ymin=o_marg+(row-j)*(ypl_siz+i_marg)
            ymax=ymin+ypl_siz
   
            xmin=substr(xmin,1,5)
            xmax=substr(xmax,1,5)
            ymin=substr(ymin,1,5)
            ymax=substr(ymax,1,5)

            'set parea 'xmin' 'xmax' 'ymin' 'ymax
            'd 'var

            'q gxinfo'
            xs=sublin(result,3)
            ys=sublin(result,4)
            xs=subwrd(xs,4)' 'subwrd(xs,6)
            ys=subwrd(ys,4)' 'subwrd(ys,6)

            x_cent=(subwrd(xs,2)+subwrd(xs,1))/2
            y_cent=(subwrd(ys,2)+subwrd(ys,1))/2

            'set strsiz 0.25'
            'set string 1 c 6'
            'draw string 'x_cent' 'y_cent' 'i','j
            j=j+1
          endwhile
          i=i+1
        endwhile 
      endif
      say 'This is your plot layout.  Press any key to continue'
      pull dummy
    endif


    xmin=o_marg+(x-1)*(xpl_siz+i_marg)
    xmax=xmin+xpl_siz
    ymin=o_marg+(row-y)*(ypl_siz+i_marg)
    ymax=ymin+ypl_siz
   
    xmin=substr(xmin,1,5)
    xmax=substr(xmax,1,5)
    ymin=substr(ymin,1,5)
    ymax=substr(ymax,1,5)
  
     say 'Setting page area to plot column 'x' of 'col' and Row 'y' of 'row
     say 'You are now free to plot your variable'

    'set parea 'xmin' 'xmax' 'ymin' 'ymax

    return


function help()
  say '---------------------------------------------------'
  say '                 Set_Parea v1.1                    '
  say '---------------------------------------------------'
  say 'Usage:'
  say 'set_parea rows cols row col margins'
  say 'Required: rows           - Total Number of Rows'
  say '          cols           - Total Number of Columns'
  say '          row            - Row pointer'
  say '          col            - Col pointer'
  say '---------------------------------------------------'
  say ''
  say 'Optional: -margin        - Sets Page Margins'
  say '          -show          - Clears scree and displays page arrangement'
  say ''
  say '---------------------------------------------------'
  say ''
  say 'Example: set_parea 3 4 1 1 -margin 0.5'
  say '         sets the page area to the top left corner'
  say '         of a 3x4 block of plots.'
  say '         sets the margins to 0.5'
  say 
  say 'Version 1.1: Developed Feb 2013'
 
**



