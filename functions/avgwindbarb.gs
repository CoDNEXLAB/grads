function abarb_spacing(args)
 sector=subwrd(args,1)
 model=subwrd(args,2)
 level=subwrd(args,3)
'set gxout barb'
'set rgb 99 0 0 0'
'set ccolor 99'
'set cthick 1'
'set digsize 0.05'
if level = 75delta
 'define u=ave(UGRDprs,lev=700,lev=500)'
 'define v=ave(VGRDprs,lev=700,lev=500)'
endif
if level = 81delta
 'define u=ave(UGRDprs,lev=1000,lev=850)'
 'define v=ave(VGRDprs,lev=1000,lev=850)'
endif
if level = 41delta
 'define u=ave(UGRDprs,lev=1000,lev=400)'
 'define v=ave(VGRDprs,lev=1000,lev=400)'
endif
if model = GFS & sector != AK
 'define xskip = u*2'
 'define yskip = v*2'
endif
if model = GFS & sector = US
 'define xskip = skip(u,3,3)*2'
 'define yskip = skip(v,3,3)*2'
endif
if model = GFS & sector = AK
 'define xskip = skip(u,2,2)*2'
 'define yskip = skip(v,2,2)*2'
endif
if model = GFS & sector = AO | sector = PO | sector = NA
 'define xskip = skip(u,6,6)*2'
 'define yskip = skip(v,6,6)*2'
 'define iskip = skip(u,6,6)*2'
 'define jskip = skip(v,6,6)*2'
endif
if model = NAM & sector != AK
 'define xskip = skip(u,4,4)*2'
 'define yskip = skip(v,4,4)*2'
endif
if model = NAM & sector = AK
 'define xskip = skip(u,8,8)*2'
 'define yskip = skip(v,8,8)*2'
endif
if model = NAM & sector = FLT
 'define xskip = skip(u,2,2)*2'
 'define yskip = skip(v,2,2)*2'
endif
if model = NAM & sector = US
 'define xskip = skip(u,12,12)*2'
 'define yskip = skip(v,12,12)*2'
endif
if model = RAP
 'define xskip = skip(u,8,8)*2'
 'define yskip = skip(v,8,8)*2'
endif
if model = RAP & sector = US
 'define xskip = skip(u,14,14)*2'
 'define yskip = skip(v,14,14)*2'
endif
'd xskip;yskip'
