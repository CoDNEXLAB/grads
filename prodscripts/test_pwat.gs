*Purpose: College of DuPage Models Product Shell
*Author: Gensini, Winter 2015
*************************************************************************
*always run this function to get model arguments and plotting defaults
function main(args)
 modinit=subwrd(args,1)
 modname=subwrd(args,2)
 fhour=subwrd(args,3)
 sector=subwrd(args,4)
 'run /home/scripts/grads/functions/pltdefaults.gs'
*GLOBAL VARIABLES
filext = '.png'
txtext = '.txt'
basedir = '/home/apache/climate/data/forecast'
*************************************************************************
*open the GrADS .ctl file made in the prodrunner script
ctlext = '.ctl'
'open /home/scripts/grads/grads_ctl/'modname'/'modinit''modname%ctlext
if modname = NAMAK
 modname = NAM
endif
say modname
if modname = GFS | modname = NAM
 'set t 'fhour/3+1
else
 'set t 'fhour+1
endif
*get some time parameters
'run /home/scripts/grads/functions/timelabel.gs 'modinit' 'modname' 'fhour
*set domain based on sector input argument
'run /home/scripts/grads/functions/sectors.gs 'sector
*START: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*give the image a product title
'draw string 0.1 8.3 `nPrecipitable Water (in.) | Sfc-400mb Mean Wind (kts) | College of DuPage NeXLaB'
*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname sector _prec_pwat_ fhour
filename = basedir'/'modname'/'modinit'/'sector'/'prodname%filext
*pick a colorbar
'run /home/scripts/grads/colorbars/color.gs 0 3 .1 -kind (155,95,30)->(244,242,215)-(4)->(95,196,95)-(0)->(48,174,48)-(0)->(8,78,8)-(0)->(97,163,175)-(3)->(19,44,43)-(0)->(102,102,154)-(3)->(49,35,104)-(0)->olive-(3)->yellow-(0)->tomato-(3)->magenta'
'set gxout shade2'
'd PWATclm*0.0393700787'
*May have to get crafty here in the future if model is missing 0-6shear grib entry (e.g., 500 hPa wind - 10m wind)
level = 41delta
if sector != WLD
 'run /home/scripts/grads/functions/avgwindbarb.gs 'sector' 'modname' 'level
endif
'run /home/scripts/grads/functions/counties.gs 'sector
'run /home/scripts/grads/functions/states.gs 'sector
*start_readout
if modname = GFS | modname = NAM
 'set gxout print'
 'run /home/scripts/grads/functions/readout2.gs 'modname' 'sector
 'd PWATclm*0.0393700787'
 dummy=write(basedir'/'modname'/'modinit'/'sector'/readout/'prodname%txtext,result)
endif
*end_readout
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*plot the colorbar on the image
'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 2 -fh .1 -fw .1 -lc 99 -edge triangle -fc 99'
*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
