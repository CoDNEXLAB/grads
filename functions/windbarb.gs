function barb_spacing(args)
 sector=subwrd(args,1)
 model=subwrd(args,2)
 level=subwrd(args,3)
'set gxout barb'
'set rgb 99 0 0 0'
'set ccolor 99'
'set cthick 1'
'set digsize 0.05'
'set barbopts filled'
if (model = GFS & sector != AK)
 'define xskip = UGRDprs*2'
 'define yskip = VGRDprs*2'
 'define iskip = UGRD10m*2'
 'define jskip = VGRD10m*2'
 'define strmu = USTM6000_0m*2'
 'define strmv = VSTM6000_0m*2'
endif
if (model = GFS & sector = US)
 'define xskip = skip(UGRDprs,3,3)*2'
 'define yskip = skip(VGRDprs,3,3)*2'
 'define iskip = skip(UGRD10m,3,3)*2'
 'define jskip = skip(VGRD10m,3,3)*2'
 'define strmu = skip(USTM6000_0m,3,3)*2'
 'define strmv = skip(VSTM6000_0m,3,3)*2'
endif
if (model = GFS & sector = AK)
 'define xskip = skip(UGRDprs,2,2)*2'
 'define yskip = skip(VGRDprs,2,2)*2'
 'define iskip = skip(UGRD10m,2,2)*2'
 'define jskip = skip(VGRD10m,2,2)*2'
endif
if model = GFS & sector = AO | sector = PO | sector = NA | sector = WLD
 'define xskip = skip(UGRDprs,6,6)*2'
 'define yskip = skip(VGRDprs,6,6)*2'
 'define iskip = skip(UGRD10m,6,6)*2'
 'define jskip = skip(VGRD10m,6,6)*2'
endif
if (model = NAM & sector != AK)
 'define xskip = skip(UGRDprs,4,4)*2'
 'define yskip = skip(VGRDprs,4,4)*2'
 'define iskip = skip(UGRD10m,4,4)*2'
 'define jskip = skip(VGRD10m,4,4)*2'
 'define strmu = skip(USTM6000_0m,4,4)*2'
 'define strmv = skip(VSTM6000_0m,4,4)*2'
endif
if (model = NAM & sector = FLT)
 'define xskip = skip(UGRDprs,2,2)*2'
 'define yskip = skip(VGRDprs,2,2)*2'
 'define iskip = skip(UGRD10m,2,2)*2'
 'define jskip = skip(VGRD10m,2,2)*2'
 'define strmu = skip(USTM6000_0m,2,2)*2'
 'define strmv = skip(VSTM6000_0m,2,2)*2'
endif
if (model = NAM & sector = AK)
 'define xskip = skip(UGRDprs,8,8)*2'
 'define yskip = skip(VGRDprs,8,8)*2'
 'define iskip = skip(UGRD10m,8,8)*2'
 'define jskip = skip(VGRD10m,8,8)*2'
endif
if (model = NAM & sector = US)
 'define xskip = skip(UGRDprs,12,12)*2'
 'define yskip = skip(VGRDprs,12,12)*2'
 'define iskip = skip(UGRD10m,12,12)*2'
 'define jskip = skip(VGRD10m,12,12)*2'
 'define strmu = skip(USTM6000_0m,12,12)*2'
 'define strmv = skip(VSTM6000_0m,12,12)*2'
endif
if model = NAMNST
 'define xskip = skip(UGRDprs,14,14)*2'
 'define yskip = skip(VGRDprs,14,14)*2'
 'define iskip = skip(UGRD10m,14,14)*2'
 'define jskip = skip(VGRD10m,14,14)*2'
endif
if model = NAMNST & sector = FLT
 'define xskip = skip(UGRDprs,9,9)*2'
 'define yskip = skip(VGRDprs,9,9)*2'
 'define iskip = skip(UGRD10m,9,9)*2'
 'define jskip = skip(VGRD10m,9,9)*2'
endif
if model = NAMNST & sector = US
 'define xskip = skip(UGRDprs,20,20)*2'
 'define yskip = skip(VGRDprs,20,20)*2'
 'define iskip = skip(UGRD10m,20,20)*2'
 'define jskip = skip(VGRD10m,20,20)*2'
endif
if model = RAP
 'define xskip = skip(UGRDprs,4,4)*2'
 'define yskip = skip(VGRDprs,4,4)*2'
 'define iskip = skip(UGRD10m,4,4)*2'
 'define jskip = skip(VGRD10m,4,4)*2'
endif
if model = RAP & sector = US
 'define xskip = skip(UGRDprs,12,12)*2'
 'define yskip = skip(VGRDprs,12,12)*2'
 'define iskip = skip(UGRD10m,12,12)*2'
 'define jskip = skip(VGRD10m,12,12)*2'
endif
if model = HRRR
 'define xskip = skip(UGRDprs,20,20)*2'
 'define yskip = skip(VGRDprs,20,20)*2'
 'define iskip = skip(UGRD10m,20,20)*2'
 'define jskip = skip(VGRD10m,20,20)*2'
 'define sh6xskip = skip(VUCSH0_6000m,20,20)*2'
 'define sh6yskip = skip(VVCSH0_6000m,20,20)*2'
endif
if model = HRRR & sector = OKC | sector = CHI | sector = DEN
 'define xskip = skip(UGRDprs,10,10)*2'
 'define yskip = skip(VGRDprs,10,10)*2'
 'define iskip = skip(UGRD10m,10,10)*2'
 'define jskip = skip(VGRD10m,10,10)*2'
 'define sh6xskip = skip(VUCSH0_6000m,10,10)*2'
 'define sh6yskip = skip(VVCSH0_6000m,10,10)*2'
endif
if model = CFS
 'define xskip = skip(UGRD 'level' mb,2,2)*2'
 'define yskip = skip(VGRD 'level' mb,2,2)*2'
endif
if model = ECMWF
 'define xskip = skip(UGRD 'level' mb,3,3)*2'
 'define yskip = skip(VGRD 'level' mb,3,3)*2'
endif
if model = CFS & sector != US
 'define xskip = skip(UGRD 'level' mb,3,3)*2'
 'define yskip = skip(VGRD 'level' mb,3,3)*2'
endif
if level = shear06
 'd maskout(sh6xskip,CAPEsfc-100);sh6yskip'
endif
if level = shear500 & model != RAP
 'define ushear = (xskip-iskip)'
 'define vshear = (yskip-jskip)'
 'd maskout(ushear,CAPE180_0mb-100);vshear'
endif
if level = shear500 & model = RAP
 'define ushear = (xskip-iskip)'
 'define vshear = (yskip-jskip)'
 'd maskout(ushear,CAPE255_0mb-100);vshear'
endif
if level = surface
 'd iskip;jskip'
endif
if level = strm
 'd strmu;strmv'
endif
if level != surface & level != shear500 & level != shear06 & level != strm
 'd xskip;yskip'
endif
