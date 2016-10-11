#!/bin/csh
set path = ($path /home/ldm/grads-2.1.a2/bin)
setenv GADDIR /home/ldm/grads-2.1.a2/data
foreach Model (NAM NAM4KM GFS)
	/home/ldm/grads-2.1.a2/bin/grads -bxcl "run /home/scripts/grads/prodscripts/create_shapefile.gs 06 ${Model} 003 FLT"
end
