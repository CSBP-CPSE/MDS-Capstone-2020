// We specify the dimensions for the map container. We use the same
// width and height as specified in the CSS above.
var width = 900,
    height = 600;

// We create a SVG element in the map container and give it some
// dimensions.
var svg = d3.select('#map').append('svg')
  .attr('width', width)
  .attr('height', height);

// We define a geographical projection
//     https://github.com/mbostock/d3/wiki/Geo-Projections
// and set the initial zoom to show the features.
var projection = d3.geo.mercator()
  // The approximate scale factor was found through try and error
  .scale(1000)
  // The geographical center of Switzerland is around 46.8°, 8.2°
  //     https://de.wikipedia.org/wiki/Älggi-Alp
  // .center([-83.90671521623318,46.06389577121218])
    .center([-84.771055, 49.306376])
  // Translate: Translate it to fit the container
  .translate([width/2, height/2]);

// We prepare a path object and apply the projection to it.
var path = d3.geo.path()
  .projection(projection);

// Load the features from the GeoJSON.
d3.json('data/reversed_phu.geojson', function(error, features) {

  // We add a <g> element to the SVG element and give it a class to
  // style it later.
  svg.append('g')
      .attr('class', 'features')
    // D3 wants us to select the (non-existing) path objects first ...
    .selectAll('path')
      // ... and then enter the data. For each feature, a <path> element
      // is added.
      .data(features.features)
    .enter().append('path')
      // As "d" attribute, we set the path of the feature.
      .attr('d', path);

});

// Example
// var width = 700, height = 400;
//
// var svg = d3.select(".graph").append("svg")
//         .attr("viewBox", "0 0 " + (width) + " " + (height))
//         .style("max-width", "700px")
//
//
//
// d3.json("data/ontario_phu_regions.geojson", function (error, mapData) {
//     var features = mapData.features;
//
// var projection = d3.geo.mercator();
//     var path = d3.geo.path().projection(projection);
//
// var fixed = features.map(function(f) {
//   return turf.rewind(f,{reverse:true});
// })
//
// console.log(fixed);
//
// projection.fit.size([width,height],{"type": "FeatureCollection","features":fixed})
//
// svg.append("g")
//             .attr("class", "region")
//             .selectAll("path")
//             .data(fixed)
//             .enter()
//             .append("path")
//             .attr("d", path)
// });
//
// var width  = 300;
// var height = 400;
//
// var vis = d3.select("#vis").append("svg")
//     .attr("width", width).attr("height", height)
//
// d3.json("data/ontario_phu_regions.json", function(json) {
//     // create a first guess for the projection
//     var center = d3.geo.centroid(json)
//     var scale  = 150;
//     var offset = [width/2, height/2];
//     var projection = d3.geo.mercator().scale(scale).center(center)
//         .translate(offset);
//
//     // create the path
//     var path = d3.geo.path().projection(projection);
//
//     // using the path determine the bounds of the current map and use
//     // these to determine better values for the scale and translation
//     var bounds  = path.bounds(json);
//     var hscale  = scale*width  / (bounds[1][0] - bounds[0][0]);
//     var vscale  = scale*height / (bounds[1][1] - bounds[0][1]);
//     var scale   = (hscale < vscale) ? hscale : vscale;
//     var offset  = [width - (bounds[0][0] + bounds[1][0])/2,
//                       height - (bounds[0][1] + bounds[1][1])/2];
//
//     // new projection
//     projection = d3.geo.mercator().center(center)
//       .scale(scale).translate(offset);
//     path = path.projection(projection);
//
//     // add a rectangle to see the bound of the svg
//     vis.append("rect").attr('width', width).attr('height', height)
//       .style('stroke', 'black').style('fill', 'none');
//
//     vis.selectAll("path").data(json.features).enter().append("path")
//       .attr("d", path)
//       .style("fill", "red")
//       .style("stroke-width", "1")
//       .style("stroke", "black")
//   });
