#!/usr/bin/csh
set fileloc = "/home/data/spc/current_day1_outlook.grib2"
#perl /home/scripts/grads/functions/g2ctl.pl ${fileloc} > /home/data/models/grads_ctl/outlooks/day1.ctl	
#gribmap -q -i /home/data/models/grads_ctl/outlooks/day1.ctl
foreach Sector (US)
	grads -bxcl "run /home/scripts/grads/runners/day1outlook_prodlist.gs ${Sector}" &
end
wait
