function readout(args)
 modname=subwrd(args,1)
 sector=subwrd(args,2)
if modname = GFS & sector = SE
 'set prnopts %0.1f 37 1 u'
endif
if modname = GFS & sector = NE
 'set prnopts %0.1f 38 1 u'
endif
if modname = GFS & sector = CGP
 'set prnopts %0.1f 44 1 u'
endif
if modname = GFS & sector = NGP
 'set prnopts %0.1f 44 1 u'
endif
if modname = GFS & sector = SW
 'set prnopts %0.1f 44 1 u'
endif
if modname = GFS & sector = NW
 'set prnopts %0.1f 44 1 u'
endif
if modname = GFS & sector = MW
 'set prnopts %0.1f 43 1 u'
endif
if modname = GFS & sector = SGP
 'set prnopts %0.1f 49 1 u'
endif
if modname = GFS & sector = MA
 'set prnopts %0.1f 43 1 u'
endif
if modname = GFS & sector = AK
 'set prnopts %0.1f 119 1 u'
endif
if modname = GFS & sector = US
 'set prnopts %0.1f 127 1 u'
endif
if modname = GFS & sector = PO
 'set prnopts %0.1f 251 1 u'
endif
if modname = GFS & sector = AO
 'set prnopts %0.1f 227 1 u'
endif
if modname = GFS & sector = NA
 'set prnopts %0.1f 235 1 u'
endif
if modname = GFS & sector = WLD
 'set prnopts %0.1f 721 1 u'
endif
if modname = GFS & sector = FLT
 'set prnopts %0.1f 23 1 u'
endif
if modname = GFS & sector = WCAN
 'set prnopts %0.1f 49 1 u'
endif
if modname = NAM & sector = US
 'set prnopts %0.1f 558 1 u'
endif
if modname = NAM & sector = NE
 'set prnopts %0.1f 162 1 u'
endif
if modname = NAM & sector = MA
 'set prnopts %0.1f 187 1 u'
endif
if modname = NAM & sector = SE
 'set prnopts %0.1f 161 1 u'
endif
if modname = NAM & sector = NGP
 'set prnopts %0.1f 189 1 u'
endif
if modname = NAM & sector = CGP
 'set prnopts %0.1f 189 1 u'
endif
if modname = NAM & sector = NW
 'set prnopts %0.1f 189 1 u'
endif
if modname = NAM & sector = MW
 'set prnopts %0.1f 187 1 u'
endif
if modname = NAM & sector = SGP
 'set prnopts %0.1f 214 1 u'
endif
if modname = NAM & sector = SW
 'set prnopts %0.1f 190 1 u'
endif
if modname = NAM & sector = FLT
 'set prnopts %0.1f 90 1 u'
endif
if modname = NAM & sector = AK
 'set prnopts %0.1f 585 1 u'
endif
if modname = NAM & sector = WCAN
 'set prnopts %0.1f 214 1 u'
endif
if modname = NAM4KM & sector = NE
 'set prnopts %0.1f 385 1 u'
endif
if modname = NAM4KM & sector = MA
 'set prnopts %0.1f 447 1 u'
endif
if modname = NAM4KM & sector = MW
 'set prnopts %0.1f 447 1 u'
endif
if modname = NAM4KM & sector = SE
 'set prnopts %0.1f 383 1 u'
endif
if modname = NAM4KM & sector = NGP
 'set prnopts %0.1f 451 1 u'
endif
if modname = NAM4KM & sector = CGP
 'set prnopts %0.1f 450 1 u'
endif
if modname = NAM4KM & sector = SGP
 'set prnopts %0.1f 510 1 u'
endif
if modname = NAM4KM & sector = NW
 'set prnopts %0.1f 453 1 u'
endif
if modname = NAM4KM & sector = SW
 'set prnopts %0.1f 455 1 u'
endif
if modname = NAM4KM & sector = FLT
 'set prnopts %0.1f 216 1 u'
endif
if modname = RAP & sector = SGP
 'set prnopts %0.1f 189 1 u'
endif
if modname = RAP & sector = SW
 'set prnopts %0.1f 169 1 u'
endif
if modname = RAP & sector = NW
 'set prnopts %0.1f 168 1 u'
endif
if modname = RAP & sector = CGP
 'set prnopts %0.1f 167 1 u'
endif
if modname = RAP & sector = NGP
 'set prnopts %0.1f 167 1 u'
endif
if modname = RAP & sector = MA
 'set prnopts %0.1f 166 1 u'
endif
if modname = RAP & sector = MW
 'set prnopts %0.1f 166 1 u'
endif
if modname = RAP & sector = NE
 'set prnopts %0.1f 143 1 u'
endif
if modname = RAP & sector = SE
 'set prnopts %0.1f 143 1 u'
endif
if modname = RAP & sector = FLT
 'set prnopts %0.1f 143 1 u'
endif
