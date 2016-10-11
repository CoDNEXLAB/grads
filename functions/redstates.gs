function rstates(sector)
if sector != US & sector !=AO & sector != PO & sector != AK & sector != WLD & sector != AUS & sector != NA
 'set mpdraw off'
 'set line 2 1 1'
 'draw shp /home/scripts/grads/shapefiles/states.shp'
else
 'set mpdraw on'
 'set mpdset hires'
 'set rgb 157 205 0 0'
 'set mpt 2 157 1 2'
 'set map 157'
 'set poli on'
 'draw map'
endif
