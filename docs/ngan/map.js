// We define a variable holding the current key to visualize on the map.
var currentKey = 'TOTAL';

// Listen to changes of the dropdown to select the key to visualize on
// the map.
d3.select('#select-key').on('change', function(a) {
  // Change the current key and call the function to update the colors.
  currentKey = d3.select(this).property('value');
  updateMapColors();
});


// We specify the dimensions for the map container. We use the same
// width and height as specified in the CSS above.
var width = 900,
    height = 600;

// We define a variable to later hold the data of the CSV.
var mapData;

// We create a SVG element in the map container and give it some
// dimensions. We can use a viewbox and preserve the aspect ratio. This
// also allows a responsive map which rescales and looks good even on
// different screen sizes
var svg = d3.select('#map').append('svg')
  .attr("preserveAspectRatio", "xMidYMid")
  .attr("viewBox", "0 0 " + width + " " + height);

// We add a <g> element to the SVG element and give it a class to
// style. We also add a class name for Colorbrewer.
var mapFeatures = svg.append('g')
  .attr('class', 'features YlGnBu');

// We add a <div> container for the tooltip, which is hidden by default.
var tooltip = d3.select("#map")
  .append("div")
  .attr("class", "tooltip hidden");

// Define the zoom and attach it to the map
var zoom = d3.behavior.zoom()
  .scaleExtent([1, 10])
  .on('zoom', doZoom);
svg.call(zoom);

// We define a geographical projection
//     https://github.com/mbostock/d3/wiki/Geo-Projections
// and set the initial zoom to show the features.
var projection = d3.geo.mercator()
  .scale(1200)
  // The geographical center of Ontario is -84.771055, 49.306376
  //     https://de.wikipedia.org/wiki/Älggi-Alp
  .center([-84.771055, 49.306376])
  // Translate: Translate it to fit the container
  .translate([width/2, height/2]);

// We prepare a path object and apply the projection to it.
var path = d3.geo.path()
  .projection(projection);

// We prepare an object to later have easier access to the data.
var dataById = d3.map();

// We prepare a quantize scale to categorize the values in 9 groups.
// The scale returns text values which can be used for the color CSS
// classes (q0-9, q1-9 ... q8-9). The domain will be defined once the
// values are known.
var quantize = d3.scale.quantize()
  .range(d3.range(9)
  .map(function(i) { return 'q' + i + '-9'; }));

// We prepare a number format which will always return 2 decimal places.
// var formatNumber = d3.format('.2f');
var formatNumber = d3.format('.4f');

// Load the features from the GeoJSON.
d3.json('data/r34_phus.geojson', function(error, features) {
  //
  // aa = [-82.36, 42.98];
  // bb = [-80.01, 43.21];
  //
  // svg.selectAll("circle")
  // .data([aa,bb]).enter()
  // .append("circle")
  // .attr("cx", function (d) { console.log(projection(d)); return projection(d)[0]; })
  // .attr("cy", function (d) { return projection(d)[1]; })
  // .attr("r", "2px")
  // .attr("fill", "red")

  // Read the data for the cartogram
  d3.csv('data/phu_statistics.csv', function(data) {

    // We store the data object in the variable which is accessible from
    // outside of this function.
    mapData = data;

    // This maps the data of the CSV so it can be easily accessed by
    // the HR_UID of the health region, for example: dataById[2196]
    dataById = d3.nest()
      .key(function(d) { return d.HR_UID; })
      .rollup(function(d) { return d[0]; })
      .map(data);

    //
    // We add the features to the <g> element created before.
    // D3 wants us to select the (non-existing) path objects first ...
    mapFeatures.selectAll('path')
        // ... and then enter the data. For each feature, a <path>
        // element is added.
        .data(features.features)
      .enter().append('path')
        // As "d" attribute, we set the path of the feature.
        .attr('d', path)
        // When the mouse moves over a feature, show the tooltip.
        .on('mousemove', showTooltip)
        // When the mouse moves out of a feature, hide the tooltip.
        .on('mouseout', hideTooltip)
        // When a feature is clicked, show the details of it.
        .on('click', showDetails);

        // Call the function to update the map colors.
        updateMapColors();

  });
});

/**
 * Update the colors of the features on the map. Each feature is given a
 * CSS class based on its value.
 */

function updateMapColors() {
  // Set the domain of the values (the minimum and maximum values of
  // all values of the current key) to the quantize scale.
  quantize.domain([
    d3.min(mapData, function(d) { return getValueOfData(d); }),
    d3.max(mapData, function(d) { return getValueOfData(d); })
  ]);
  // Update the class (determining the color) of the features.
  mapFeatures.selectAll('path')
    .attr('class', function(f) {
      // Use the quantized value for the class
      return quantize(getValueOfData(dataById[getIdOfFeature(f)]));
    });

  // We call the function to update the legend.
  updateLegend();
}

/**
 * Hide the details <div> container and show the initial content instead.
 */
function hideDetails() {
  // Hide the details
  d3.select('#details').classed("hidden", true);
  // Show the initial content
  d3.select('#initial').classed("hidden", false);
}

/**
 * Show a tooltip with the name of the feature.
 *
 * @param {object} f - A GeoJSON Feature object.
 */
function showTooltip(f) {
  // Get the ID of the feature.
  var id = getIdOfFeature(f);
  // Use the ID to get the data entry.
  var d = dataById[id];

  // Get the current mouse position (as integer)
  var mouse = d3.mouse(d3.select('#map').node()).map(
    function(d) { return parseInt(d); }
  );

  // Calculate the absolute left and top offsets of the tooltip. If the
  // mouse is close to the right border of the map, show the tooltip on
  // the left.
  var left = Math.min(width - 4 * d.ENG_LABEL.length, mouse[0] + 5);
  var top = mouse[1] + 25;

  // Show the tooltip (unhide it) and set the name of the data entry.
  // Set the position as calculated before.
  tooltip.classed('hidden', false)
    .attr("style", "left:" + left + "px; top:" + top + "px")
    .html(d.ENG_LABEL);
}

/**
 * Hide the tooltip.
 */
function hideTooltip() {
  tooltip.classed('hidden', true);
}

/**
 * Zoom the features on the map. This rescales the features on the map.
 * Keep the stroke width proportional when zooming in.
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
 *
 * Use "+" to convert text values to numbers.
 *
 * @param {object} d - A data object representing an entry (one line) of
 * the data CSV.
 */
function getValueOfData(d) {
  return +d[currentKey];
}

/**
 * Helper function to retrieve the ID of a feature. The ID is found in
 * the properties of the feature.
 *
 * @param {object} f - A GeoJSON Feature object.
 */
function getIdOfFeature(f) {
  return f.properties.HR_UID;
}
