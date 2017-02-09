function states(sector)
if sector != US & sector !=AO & sector != PO & sector != AK & sector != WLD & sector != AUS & sector != NA
 'set mpdraw off'
 'set rgb 92 0 0 0 200'
 'set line 92 1 1'
 'draw shp /home/scripts/grads/shapefiles/states.shp'
else
 'set mpdraw on'
 'set mpdset hires'
 'set rgb 92 0 0 0 200'
 'set mpt 2 92 1 2'
 'set map 92'
 'set poli on'
 'draw map'
endif
