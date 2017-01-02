dset /home/data/models/cfs/1701020000F%f3.cfs
index /home/data/models/cfs/1701020000F000.cfs.idx
undef 9.999E+20
title /home/data/models/cfs/1701020000F000.cfs
* produced by alt_g2ctl v0.9.999, use alt_gmp to make idx file
* command line options: -nthreads 32 /home/data/models/cfs/1701020000F%f3.cfs
* alt_gmp options: update=0
* alt_gmp options: nthreads=32
* alt_gmp options: big=0
* wgrib2 inventory flags: -npts -set_ext_name 1 -end_FT -ext_name -lev
* wgrib2 inv suffix: .invd01
* griddef=1:0:(360 x 181):grid_template=0:winds(N/S): lat-lon grid:(360 x 181) units 1e-06 input WE:NS output WE:SN res 48 lat 90.000000 to -90.000000 by 1.000000 lon 0.000000 to 359.000000 by 1.000000 #points=65160:winds(N/S)

dtype grib2
options template
ydef 181 linear -90.000000 1
xdef 360 linear 0.000000 1.000000
tdef 134 linear 00Z02jan2017 6hr
zdef 1 levels 1
vars 12
CAPEsfc 0 0 "CAPE:surface" * CAPE:surface
CINsfc 0 0 "CIN:surface" * CIN:surface
HGT500mb 0 0 "HGT:500 mb" * HGT:500 mb
HGT850mb 0 0 "HGT:850 mb" * HGT:850 mb
HLCY3000_0m 0 0 "HLCY:3000-0 m above ground" * HLCY:3000-0 m above ground
PRMSLmsl 0 0 "PRMSL:mean sea level" * PRMSL:mean sea level
TMP500mb 0 0 "TMP:500 mb" * TMP:500 mb
TMP850mb 0 0 "TMP:850 mb" * TMP:850 mb
UGRD500mb 0 0 "UGRD:500 mb" * UGRD:500 mb
UGRD850mb 0 0 "UGRD:850 mb" * UGRD:850 mb
VGRD500mb 0 0 "VGRD:500 mb" * VGRD:500 mb
VGRD850mb 0 0 "VGRD:850 mb" * VGRD:850 mb
endvars
