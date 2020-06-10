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

  // We prepare a number format which will always return 2 decimal places.
var formatNumber = d3.format('.2f');

// For the legend, we prepare a very simple linear scale. Domain and
// range will be set later as they depend on the data currently shown.
var legendX = d3.scale.linear();

// We use the scale to define an axis. The tickvalues will be set later
// as they also depend on the data.
var legendXAxis = d3.svg.axis()
  .scale(legendX)
  .orient("bottom")
  .tickSize(13)
  .tickFormat(function(d) {
    return formatNumber(d);
  });

// We create an SVG element in the legend container and give it some
// dimensions.
var legendSvg = d3.select('#legend').append('svg')
  .attr('width', '100%')
  .attr('height', '44');

  // Preparation for metadata CSV - prepare class,
// ranging from 0 - 100 (we are working with percents).
// var quantize = d3.scale.quantize()
// .domain([0, 100])
// .range(d3.range(3).map(function(d,i) {return "class"+i;}));
var quantize = d3.scale.quantize()
.range(d3.range(9)
.map(function(i) { return 'q' + i + '-9'; }));



// To this SVG element, we add a <g> element which will hold all of our
// legend entries.
var g = legendSvg.append('g')
    .attr("class", "legend-key YlGnBu")
    .attr("transform", "translate(" + 20 + "," + 20 + ")");

// We add a <rect> element for each quantize category. The width and
// color of the rectangles will be set later.
g.selectAll("rect")
    .data(quantize.range().map(function(d) {
      return quantize.invertExtent(d);
    }))
  .enter().append("rect");


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



// Define dictionary to associate PHU names with proportion of covid cases
var dataById = d3.map();


// Load the features from the GeoJSON.
d3.json('https://ubco-mds-2019-labs.github.io/data-599-capstone-statistics-canada/data/PHU.geojson', function(error, ontario) {
  console.log(ontario.features[0].properties.HR_UID);


  // Read the metadata.
  d3.csv('https://ubco-mds-2019-labs.github.io/data-599-capstone-statistics-canada/data/PHU_metadata.csv', function(data) {
      console.log(data[0].HR_UID)
    // This maps the data of the CSV so it can be easily accessed by
    // the ID of the PHU, for example: dataById[2196] --- how can I change this
    // to work as a search by PHU `ENG_LABEL` (name)?
    // data.forEach(function(d, i) {
    //   ontario.features.forEach(function(e, j){
    //     if (d.HR_UID == e.properties.HR_UID) {
    //       e.ENG_LABEL = d.ENG_LABEL
    //       // console.log(e, d)
    //       // Show the tooltip (unhide it) and set the name of the data entry.
          
    //       tooltip.classed('hidden', false)
    //         .html(d.ENG_LABEL);
    //     }
    mapData = data;

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
        .data(ontario.features)
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
      })
    });


    // Set the domain of the values (the minimum and maximum values of
    // all values of the current key) to the quantize scale.
    // quantize.domain([
    //   d3.min(data, function(d) { return getValueOfData(d); }),
    //   d3.max(data, function(d) { return getValueOfData(d); })
    // ]);


  // mapFeatures.selectAll("append")
  // // if we were to use the smaller .json (topoJSON) file, we'd have to convert it back to geojson
  //   // .data(topojson.feature(ontario, ontario.objects.geometry).features)
  //   .data(ontario.features)
  //   .enter()
  //   .append("path")
  //   // .attr('class', function(d) {
  //   //   // Use the quantized value for the class
  //   //   return quantize(getValueOfData(dataById[getIdOfFeature(d)]));
  //   // })
  //   .attr("d", path)
  //   // When the mouse moves over a feature, show the tooltip.
  //   .on('mousemove', showTooltip)
  //   .on('mouseout', hideTooltip);






// FUNCTIONS FOR INTERACTIVITY
function updateLegend() {

  // We determine the width of the legend. It is based on the width of
  // the map minus some spacing left and right.
  var legendWidth = d3.select('#map').node().getBoundingClientRect().width - 50;

  // We determine the domain of the quantize scale which will be used as
  // tick values. We cannot directly use the scale via quantize.scale()
  // as this returns only the minimum and maximum values but we need all
  // the steps of the scale. The range() function returns all categories
  // and we need to map the category values (q0-9, ..., q8-9) to the
  // number values. To do this, we can use invertExtent().
  var legendDomain = quantize.range().map(function(d) {
    var r = quantize.invertExtent(d);
    return r[1];
  });
  // Since we always only took the upper limit of the category, we also
  // need to add the lower limit of the very first category to the top
  // of the domain.
  legendDomain.unshift(quantize.domain()[0]);

  // On smaller screens, there is not enough room to show all 10
  // category values. In this case, we add a filter leaving only every
  // third value of the domain.
  if (legendWidth < 400) {
    legendDomain = legendDomain.filter(function(d, i) {
      return i % 3 == 0;
        });
  }

  // We set the domain and range for the x scale of the legend. The
  // domain is the same as for the quantize scale and the range takes up
  // all the space available to draw the legend.
  legendX
    .domain(quantize.domain())
    .range([0, legendWidth]);

  // We update the rectangles by (re)defining their position and width
  // (both based on the legend scale) and setting the correct class.
  g.selectAll("rect")
    .data(quantize.range().map(function(d) {
      return quantize.invertExtent(d);
    }))
    .attr("height", 8)
    .attr("x", function(d) { return legendX(d[0]); })
    .attr("width", function(d) { return legendX(d[1]) - legendX(d[0]); })
    .attr('class', function(d, i) {
      return quantize.range()[i];
    });

  // We update the legend caption. To do this, we take the text of the
  // currently selected dropdown option.
  var keyDropdown = d3.select('#select-key').node();
  var selectedOption = keyDropdown.options[keyDropdown.selectedIndex];
  g.selectAll('text.caption')
    .text(selectedOption.text);

  // We set the calculated domain as tickValues for the legend axis.
  legendXAxis
    .tickValues(legendDomain)

  // We call the axis to draw the axis.
  g.call(legendXAxis);
}

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
 * Show the details of a feature in the details <div> container.
 * The content is rendered with a Mustache template.
 *
 * @param {object} f - A GeoJSON Feature object.
 */
function showDetails(f) {
  // Get the ID of the feature.
  var id = getIdOfFeature(f);
  // Use the ID to get the data entry.
  var d = dataById[id];

  // Render the Mustache template with the data object and put the
  // resulting HTML output in the details container.
  var detailsHtml = Mustache.render(template, d);

  // Hide the initial container.
  d3.select('#initial').classed("hidden", true);

  // Put the HTML output in the details container and show (unhide) it.
  d3.select('#details').html(detailsHtml);
  d3.select('#details').classed("hidden", false);
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

