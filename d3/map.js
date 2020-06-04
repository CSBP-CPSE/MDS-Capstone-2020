console.log('Ready to make map!');

// Initialize the column in PHU_metadata to be displayed.
var currentKey = 'Total';

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
var projection = d3.geo.azimuthalEqualArea()
    .rotate([100, -45])
    .center([11.5, 5.90])
    .scale(1500)
    .translate([width/2, height/2])

var path = d3.geo.path()
.projection(projection);


// Preparation for metadata CSV - prepare class,
// ranging from 0 - 100 (we are working with percents).
var quantize = d3.scale.quantize()
.domain([0, 100])
.range(d3.range(3).map(function(d,i) {return "class"+i;}));

// Define dictionary to associate province names with proportion of covid cases
var dataById = d3.map();


// Load the features from the GeoJSON.
d3.json('data/PHU.geojson', function(error, ontario) {
  console.log(ontario);


  // Read the metadata.
  d3.csv('data/PHU_metadata.csv', function(data) {

    // This maps the data of the CSV so it can be easily accessed by
    // the ID of the PHU, for example: dataById[2196] --- how can I change this
    // to work as a search by PHU `ENG_LABEL` (name)?
    dataById = d3.nest()
      .key(function(d) { return d.id; })
      .rollup(function(d) { return d[0]; })
      .map(data);

    // Set the domain of the values (the minimum and maximum values of
    // all values of the current key) to the quantize scale.
    quantize.domain([
      d3.min(data, function(d) { return getValueOfData(d); }),
      d3.max(data, function(d) { return getValueOfData(d); })
    ]);


  svg.selectAll("append")
  // if we were to use the smaller .json (topoJSON) file, we'd have to convert it back to geojson
    // .data(topojson.feature(ontario, ontario.objects.geometry).features)
    .data(ontario.features)
    .enter()
    .append("path")
    .attr('class', function(d) {
      // Use the quantized value for the class
      return quantize(getValueOfData(dataById[d.properties.Total]));
    })
    .attr("d", path);

    });

});




// Using Queue.js to load JSON and CSV
// d3.map().set(key, value); sets values for specified key string
// "+" converts text to numeric.
// queue()
// .defer(d3.json, "data/PHU.geojson")
// .defer(d3.csv, "data/PHU_metadata.csv", function(d)
// { dataById.set(d.ENG_LABEL, +d.Total); })
// .await(myFunction);





/**
 * Helper function to access the (current) value of a data object.
 *
 * Use "+" to convert text values to numbers.
 *
 * @param {object} d - A data object representing an entry (one line) of
 * the data CSV.
 */
function getValueOfData(d) {
  return +d[currentKey];
}


// function myFunction(error, ontario) {
// svg.append("g")
// .attr("class", "phu")
// .selectAll("path")
// .data(ontario.features)
// .enter()
// .append("path")
// .attr("class", function(d) { return quantize(getValueOfData(dataById[d.properties.Total])); })
// .attr("d", path);
// };
