## Create a local server
- In terminal cd to the folder containing the webpage and input
  - `python3 -m http.server`
- In browser search bar navigate to
  - http://localhost:8000/

## About winding order
https://bl.ocks.org/mbostock/a7bdfeb041e850799a8d3dce4d8c50c8

## Using mapshaper to make coordinates wgs84
https://help.flourish.studio/article/67-how-to-make-your-coordinates-wgs84-with-mapshaper-org

## Use mapshaper to simplify the geojson
Drop file into mapshaper
Click `Simplify` at the top right
Click `Apply`
Simplify to 30% using the `Settings` slider

## Reverse winding order
- Install node and npm for mac
  - https://treehouse.github.io/installation-guides/mac/node-mac.html
- Install geojson-rewind
  - https://www.npmjs.com/package/geojson-rewind
- `geojson-rewind --counterclockwise ontario_phu_regions.geojson > new.geojson`
  - https://gis.stackexchange.com/questions/348120/scale-and-fit-geojson-to-the-svg-map-with-d3-geo
