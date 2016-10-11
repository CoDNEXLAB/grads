function counties(sector)
if sector != US & sector != PO & sector != AO & sector != WLD & sector != NA
 'set rgb 98 0 0 0 40'
 'set line 98 1 1'
 'draw shp /home/scripts/grads/shapefiles/counties.shp'
endif
