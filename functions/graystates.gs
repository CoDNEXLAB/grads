function states(sector)
if sector != US
 'set mpdraw off'
 'set rgb 97 255 255 255 200'
 'set line 97 1 1'
 'draw shp /home/scripts/grads/shapefiles/states.shp'
else
 'set mpdraw on'
 'set mpdset hires'
 'set rgb 97 255 255 255 200'
 'set mpt 2 157 1 2'
 'set map 97'
 'set poli on'
 'draw map'
endif
