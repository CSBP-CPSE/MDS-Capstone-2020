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

// We add a <g> element to the SVG element and give it a class to
// style. We also add a class name for Colorbrewer.
var mapFeatures = svg.append('g')
  .attr('class', 'features YlGnBu');

// Define the zoom and attach it to the map
var zoom = d3.behavior.zoom()
  .scaleExtent([1, 10])
  .on('zoom', doZoom);
svg.call(zoom);

// We add a <div> container for the tooltip, which is hidden by default.
var tooltip = d3.select("#map")
  .append("div")
  .attr("class", "tooltip hidden");

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


// Define dictionary to associate PHU names with proportion of covid cases
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


  mapFeatures.selectAll("append")
  // if we were to use the smaller .json (topoJSON) file, we'd have to convert it back to geojson
    // .data(topojson.feature(ontario, ontario.objects.geometry).features)
    .data(ontario.features)
    .enter()
    .append("path")
    .attr('class', function(d) {
      // Use the quantized value for the class
      return quantize(getValueOfData(dataById[getIdOfFeature(d)]));
    })
    .attr("d", path)
    // When the mouse moves over a feature, show the tooltip.
    .on('mousemove', showTooltip);

    });


});



// FUNCTIONS FOR INTERACTIVITY

/**
 * Zoom the features on the map. This rescales the features on the map.
 */
function doZoom() {
  mapFeatures.attr("transform",
  "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")")
 // Keep the stroke width proportional. The initial stroke width
 // (0.5) must match the one set in the CSS.
 .style("stroke-width", 0.5 / d3.event.scale + "px");
}


/**
 * Helper function to access the (current) value of a data object.
 * Use "+" to convert text values to numbers.
 * @param {object} d - A data object representing an entry (one line) of
 * the data CSV.
 */
function getValueOfData(d) {
  return +d[currentKey];
}

/**
* Help function retrieve the ID of a feature.
**/
function getIdOfFeature(f) {
  return f.properties.GMDNR;
}

/*****************************************************
 * Show a tooltip with the name of the feature.
 * Issue with set-up of PHU_metadata.csv. There is no 'id' column
 * but when renaming `HR_UID` -> `id`the map disappears.
 * Example data (areastatistics.csv) from https://data-map-d3.readthedocs.io/en/latest/steps/step_08.html#step-08
 * has id column that aligns with their geojson geometry.
 */
function showTooltip(f) {
  // Get the ID of the feature.
  var id = getIdOfFeature(f);
  // Use the ID to get the data entry.
  var d = dataById[id];
  // Show the tooltip (unhide it) and set the name of the data entry.
  tooltip.classed('hidden', false)
    .html(d.name);
}
