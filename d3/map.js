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
var projection = d3.geoMercator();

// We prepare a path object and apply the projection to it.
var path = d3.geoPath()
  .projection(projection);



// Load the features from the GeoJSON.
d3.json('data/PHU.json', function(error, features) {


// rewinding the polygons in case they were counter-clockwise (to avoid the black image).
  // var feat = features.features
  //
  // var fixed = feat.map(function(f) {
  // 	return turf.rewind(f,{reverse:true});
  // })

  // console.log(fixed);


  projection.fitSize([width,height], features)

  // We add a <g> element to the SVG element and give it a class to
  // style it later.
  svg.append('g')
      .attr('class', 'features')
    // D3 wants us to select the (non-existing) path objects first ...
    .selectAll('path')
      // ... and then enter the data. For each feature, a <path> element
      // is added.
      .data(features.features) // was features.features
    .enter().append('path')
      // As "d" attribute, we set the path of the feature.
      .attr('d', path);

});
