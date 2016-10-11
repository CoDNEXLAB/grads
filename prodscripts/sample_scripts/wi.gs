# Implement wi command as a GrADS script
# Needs ImageMagick's import command
#
# Usage: wi <filename>
#
# by Matthias Munnich 02/2004

function wi(arg)
'q xinfo'
id=subwrd(result,4)
if(arg='')
    arg='grads.png'
endif
'!import -silent -window 'id' 'arg
return
