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
basedir = '/home/apache/servername/gensini/exper/ccindex'
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
'run /home/scripts/grads/colorbars/color.gs 240 380 2.5 -kind darkseagreen->lightgray->lightsteelblue->magenta->mediumblue->cyan->green->yellow->orange->red->maroon->magenta->white'
'set gxout shade2'
*START: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*give the image a product title
'draw string 0.1 8.3 `4Experimental "CC Index" (Not For Public Consumption) | 10m Wind (kts)'
't = TMP2m'
'tc=(t-273.16)'
'rh = RH2m'
'td=DPT2m-273.16'
'define vapr= 6.112*exp((17.67*td)/(td+243.5))'
'define e= vapr*1.001+(lev-100)/900*0.0034'
'define mixr= 0.62197*(e/(lev-e))*1000'
'define dwpk= td+273.16'
'undefine td'
'define tlcl= 1/(1/(dwpk-56)+log(t/dwpk)/800)+56'
'undefine e'
'define theta=t*pow(1000/lev,0.286)'
'define thte=theta*exp((3.376/Tlcl-0.00254)*mixr*1.0+0.00081*mixr)'
level = 850
'set lev 'level
'define windspeed = mag(UGRDprs,VGRDprs)*2'
*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname sector _sfc_thetae_ fhour
filename = basedir'/'modname'/'modinit'/'sector'/'prodname%filext
*pick a colorbar
'run /home/scripts/grads/colorbars/color.gs 0 27 .5 -kind white-(0)->white-(0)->lightgray-(3)->limegreen-(3)->yellow->goldenrod->red->maroon->magenta->darkmagenta->powderblue->deepskyblue'
'set gxout shade2'
'd thte*windspeed/1000'
level = surface
'run /home/scripts/grads/functions/counties.gs 'sector
'run /home/scripts/grads/functions/windbarb.gs 'sector' 'modname' 'level
'run /home/scripts/grads/functions/states.gs 'sector
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*plot the colorbar on the image
'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 2 -fh .1 -fw .1 -lc 99 -edge triangle -fc 99'
*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
