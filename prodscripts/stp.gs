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
'draw string 0.1 8.3 Fixed-Layer STP | 10m WIND (kts) | College of DuPage NeXLaB'
*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname sector _con_stp_ fhour
filename = basedir'/'modname'/'modinit'/'sector'/'prodname%filext
*pick a colorbar
'set gxout shade2'
'run /home/scripts/grads/colorbars/color.gs 0 1000 500 -kind white->white'
'd TMP2m'
'run /home/scripts/grads/colorbars/color.gs -levs .05 .1 1 2 3 4 5 6 7 8 9 10 -kind white->(210,210,210)->(50,255,31)->(151,253,23)->(252,245,15)->(251,128,7)->(249,5,0)->(249,0,80)->(249,0,167)->(245,0,249)->(158,0,249)->(180,100,225)->cyan'
'set lev 500'
'define windspeed500 = mag(UGRDprs,VGRDprs)*2'
'define windspeed10m = mag(UGRD10m,VGRD10m)*2'
'define term4 = (windspeed500-windspeed10m)/40'
if modname = RAP
 't = TMP2m'
 'tc=(t-273.16)'
 'rh = RH2m'
 'td=tc-( (14.55+0.114*tc)*(1-0.01*rh) + pow((2.5+0.007*tc)*(1-0.01*rh),3) + (15.9+0.117*tc)*pow((1-0.01*rh),14) )'
endif
if modname = HRRR
 'define stp = (CAPEsfc/1500)*((2000-HGTceil)/1000)*(HLCY1000_0m/150)*term4'
endif
if modname = RAP
 'define stp = (CAPEsfc/1500)*((2000-(125*(TMP2m-td)))/1000)*(HLCY1000_0m/150)*term4'
endif
if modname != RAP & modname != HRRR
 'define stp = (CAPEsfc/1500)*((2000-(125*(TMP2m-DPT2m)))/1000)*(HLCY1000_0m/150)*term4'
endif
'd maskout(stp,CINsfc+75)'
level = surface
'run /home/scripts/grads/functions/counties.gs 'sector
'run /home/scripts/grads/functions/windbarb.gs 'sector' 'modname' 'level
'run /home/scripts/grads/functions/states.gs 'sector
*start_readout
if modname = NAM | modname = NAM4KM | modname = RAP
 'set gxout print'
 'run /home/scripts/grads/functions/readout1.gs 'modname' 'sector
 'd stp'
 dummy=write(basedir'/'modname'/'modinit'/'sector'/readout/'prodname%txtext,result)
endif
*end_readout
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*plot the colorbar on the image
'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 1 -fh .1 -fw .1 -lc 99 -edge triangle -fc 99'
*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
