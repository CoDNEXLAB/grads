function timelab(args)
 modinit=subwrd(args,1)
 modname=subwrd(args,2)
 fhour=subwrd(args,3)
if modname != HRRR15 | fhour = 0 | fhour = 4 | fhour = 8 | fhour = 12 | fhour = 16 | fhour = 20 | fhour = 24 | fhour = 28 | fhour = 32 | fhour = 36 | fhour = 40 | fhour = 44 | fhour = 48 | fhour = 52 | fhour = 56
 'q time'
 datestr=subwrd(result,3)
 vdow=subwrd(result,6)
 vyear = substr(datestr,9,4)
 vmonth = substr(datestr,6,3)
 vday = substr(datestr,4,2)
 vhour = substr(datestr,1,2)
 if vdow = Mon
  pvdow = MON
 endif
 if vdow = Tue
  pvdow = TUE
 endif
 if vdow = Wed
  pvdow = WED
 endif
 if vdow = Thu
  pvdow = THU
 endif
 if vdow = Fri
  pvdow = FRI
 endif
 if vdow = Sat
  pvdow = SAT
 endif
 if vdow = Sun
  pvdow = SUN
 endif
 'set string 99 l 1 0'
 if modname = NAM | modname = GFS | modname = RAP | modname = CFS
  'draw string 7.1 8.3 'modinit'Z 'modname' | F'fhour' Valid: 'vhour'Z 'pvdow' 'vmonth' 'vday' 'vyear
 endif
 if modname = HRRR
  'draw string 6.9 8.3 'modinit'Z 'modname' | F'fhour' Valid: 'vhour'Z 'pvdow' 'vmonth' 'vday' 'vyear
 endif
 if modname = NAM4KM
  'draw string 6.8 8.3 'modinit'Z 'modname' | F'fhour' Valid: 'vhour'Z 'pvdow' 'vmonth' 'vday' 'vyear
 endif
 if modname = HRRR15
  'draw string 6.75 8.3 'modinit'Z HRRR | F'fhour' Valid: 'vhour':00Z 'pvdow' 'vmonth' 'vday' 'vyear
 endif
else
 'q time'
 datestr=subwrd(result,3)
 vdow=subwrd(result,6)
 vyear = substr(datestr,12,4)
 vmonth = substr(datestr,9,3)
 vday = substr(datestr,7,2)
 vhour = substr(datestr,1,6)
 if vdow = Mon
  pvdow = MON
 endif
 if vdow = Tue
  pvdow = TUE
 endif
 if vdow = Wed
  pvdow = WED
 endif
 if vdow = Thu
  pvdow = THU
 endif
 if vdow = Fri
  pvdow = FRI
 endif
 if vdow = Sat
  pvdow = SAT
 endif
 if vdow = Sun
  pvdow = SUN
 endif
 'set string 99 l 1 0'
 'draw string 6.75 8.3 'modinit'Z HRRR | F'fhour' Valid: 'vhour' 'pvdow' 'vmonth' 'vday' 'vyear
endif
