import sys
from osgeo import ogr

shapefile = sys.argv[1]

lats = []
lons = []
driver = ogr.GetDriverByName("ESRI Shapefile")
dataSource = driver.Open(shapefile, 0)
layer = dataSource.GetLayer()
for feature in layer:
    geo = feature.GetGeometryRef()
    if geo.GetY() not in lats:
        lats.append(geo.GetY())
    if geo.GetX() not in lons:
        lons.append(geo.GetX())

# print layer.GetFeatureCount()
# print len(lats)
print len(lons)
