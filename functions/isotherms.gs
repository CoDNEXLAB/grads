function height_var(args)
 level=subwrd(args,1)
if level = surface
 'd (TMP2m-273.16)*9/5+32'
 'set gxout contour'
 'set ccolor 100'
 'set cthick 6'
 'set cint 1'
 'set cmax 32'
 'set cmin 32'
 'set cstyle 3'
 'd (TMP2m-273.16)*9/5+32'
else
 'd (TMPprs-273.16)'
 'set gxout contour'
 'set ccolor 100'
 'set cthick 6'
 'set cint 1'
 'set cmax 0'
 'set cmin 0'
 'set cstyle 3'
 'd (TMPprs-273.16)'
endif
