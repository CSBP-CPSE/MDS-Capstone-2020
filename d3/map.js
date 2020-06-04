console.log('Ready to make map!');
// We specify the dimensions for the map container. We use the same
// width and height as specified in the CSS above.
var width = 900,
    height = 600;

// We create a SVG element in the map container and give it some
// dimensions.
var svg = d3.select('#map').append('svg')
  .attr('width', width)
  .attr('height', height);

console.log('Selecting map with d3.');

// We define a geographical projection
//     https://github.com/mbostock/d3/wiki/Geo-Projections
// and set the initial zoom to show the features.
var projection = d3.geo.azimuthalEqualArea()
    .rotate([100, -45])
    .center([5, 20])
    .scale(800)
    .translate([width/2, height/2])

var path = d3.geo.path()
.projection(projection);



// Load the features from the GeoJSON.
d3.json('data/PHU.geojson', function(error, ontario) {
  console.log(ontario);

// rewinding the polygons in case they were counter-clockwise (to avoid the black image).
  // var feat = features.features
  //
  // var fixed = feat.map(function(f) {
  // 	return turf.rewind(f,{reverse:true});
  // })

  // console.log(fixed);


  // We add a <g> element to the SVG element and give it a class to
  // style it later.


  // svg.append('g')
  //     .attr('class', 'features')
  //   // D3 wants us to select the (non-existing) path objects first ...
  //   .selectAll('path')
  //     // ... and then enter the data. For each feature, a <path> element
  //     // is added.
  //     .data(features.features) // was features.features
  //   .enter().append('path')
  //     // As "d" attribute, we set the path of the feature.
  //     .attr('d', path);


  svg.selectAll("append")
    // .data(topojson.feature(ontario, ontario.objects.geometry).features)
    .data(ontario.features)
    .enter()
    .append("path")
    .attr("d", path);

});
