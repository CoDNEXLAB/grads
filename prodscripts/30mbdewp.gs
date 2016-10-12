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
basedir = '/home/apache/servername/data/forecast'
*************************************************************************
*open the GrADS .ctl file made in the prodrunner script
ctlext = '.ctl'
'open /home/scripts/grads/grads_ctl/'modname'/'modinit''modname%ctlext
if modname = GFS | modname = NAM | modname = GEM
 'set t 'fhour/3+1
else
 'set t 'fhour+1
endif
*get some time parameters
'run /home/scripts/grads/functions/timelabel.gs 'modinit' 'modname' 'fhour
*set domain based on sector input argument
'run /home/scripts/grads/functions/sectors.gs 'sector
*'run /home/scripts/grads/colorbars/color.gs 240 380 2.5 -kind darkseagreen->dimgray->lightsteelblue->magenta->mediumblue->cyan->green->yellow->orange->red->maroon->magenta->white'
'run /home/scripts/grads/colorbars/color.gs -20 85 2 -kind (141,103,74)-(16)->(73,65,54)-(10)->(244,242,215)-(0)->white-(5)->(95,196,95)-(0)->(48,174,48)-(3)->(8,78,8)-(0)->(97,163,175)-(3)->(19,44,43)-(0)->(102,102,154)-(3)->(49,35,104)-(0)->(121,72,114)-(3)->(152,102,125)'
'set gxout shade2'
*START: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*give the image a product title
'draw string 0.1 8.3 `40-30mb AGL Dewpoint (F) | Wind (kts) | College of DuPage NeXLaB'
't = TMP30_0mb'
'tc=(t-273.16)'
'rh = RH30_0mb'
'td=tc-( (14.55+0.114*tc)*(1-0.01*rh) + pow((2.5+0.007*tc)*(1-0.01*rh),3) + (15.9+0.117*tc)*pow((1-0.01*rh),14) )'
'tdf=(1.8*td)+32'
'd tdf'
'set gxout stream'
'set rgb 98 30 60 255 100'
'set ccolor 98'
'ugrd = UGRD30_0mb'
'vgrd = VGRD30_0mb'
'd UGRD30_0mb;VGRD30_0mb'
*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname sector _sfc_30mbdewp_ fhour
filename = basedir'/'modname'/'modinit'/'sector'/'prodname%filext
'run /home/scripts/grads/functions/counties.gs 'sector
*'set cint 2'
*'run /home/scripts/grads/functions/isoheights.gs 'level
*'run /home/scripts/grads/functions/windbarb.gs 'sector' 'modname' 'level
'run /home/scripts/grads/functions/states.gs 'sector
*start_readout
if modname = GFS | modname = NAM | modname = RAP
 'set gxout print'
 'run /home/scripts/grads/functions/readout.gs 'modname' 'sector
 'd tdf'
 dummy=write(basedir'/'modname'/'modinit'/'sector'/readout/'prodname%txtext,result)
endif
*end_readout
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*plot the colorbar on the image
'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 2 -fh .1 -fw .1 -lc 99 -edge triangle -fc 99'
*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
