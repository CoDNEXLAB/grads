##########################################################################################
#This file describes all of the GrADS scripts used for generating CoD model images########
#The scripts are stored in /home/scripts/grads/prodscripts################################
##########################################################################################
#Gensini | Winter 2015####################################################################
##########################################################################################

Name: 250wind.gs	|		Models: All				|	Description: 250 hPa Height / Isotachs / Wind barbs
Name: 500wind.gs	|		Models:	All				|	Description: 500 hPa Height / Isotachs / Wind barbs
Name: 700wind.gs	|		Models:	All				|	Description: 700 hPa Height / Isotachs / Wind barbs
Name: 850wind.gs	|		Models:	All				|	Description: 850 hPa Height / Isotachs / Wind barbs
Name: 925wind.gs	|		Models:	All				|	Description: 925 hPa Height / Isotachs / Wind barbs
Name: 2mtemp.gs		|		Models:	All				|	Description: 2m Temperature / 10m Wind barbs / Mean sea-level pressure
Name: 2mdewpt.gs	|		Models:	All				|	Description: 2m Dewpoint temperature / Lifted Index
Name: sim_radar.gs	|		Models:	All =! GFS		|	Description: Simulated RADAR Reflectivity Factor
Name: hrrrsbcape.gs	|		Models:	HRRR			|	Description: Surface-based convective available potential energy / 0-6km Wind shear
Name: stp.gs		|		Models:	All =! GFS		|	Description: Significant tornado parameter / 10m Wind barbs
Name: 01ehi.gs		|		Models:	All =! GFS		|	Description: 0-1km Energy helicity index
Name: 03ehi.gs		|		Models:	All				|	Description: 0-3km Energy helicity index
Name: visibility.gs	|		Models:	HRRR Only		|	Description: Surface visibility
Name: uphlcy.gs		|		Models:	HRRR & NAM4KM	|	Description: 2-5 km hourly maximum updraft helicity
Name: snowaccum.gs	|		Models:	HRRR			|	Description: Snowfall accumulation (10:1 ratio)
Name: precaccum.gs	|		Models:	All				|	Description: Precipitation accumulation
