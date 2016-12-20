function height_var(args)
 level=subwrd(args,1)
 model=subwrd(args,2)
'set gxout contour'
'set ccolor 99'
'set cthick 4'
if (level = surface & model = RAP)
 'd MSLMAmsl/100'
endif
if (level = surface & model = HRRR)
 'd PRMSLmsl/100'
endif
if (level = surface & model != HRRR & model != RAP)
 'd MSLETmsl/100'
endif
if (level != surface)
 'd HGTprs'
endif
if (model = CFS & level != surface)
 'd HGT 'level' mb'
endif

