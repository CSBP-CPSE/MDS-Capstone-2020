var width = 900;
var height = 600;

function InitializeMap(container, width, height) {
	// We create a SVG element in the map container and give it some
	// dimensions. We can use a viewbox and preserve the aspect ratio. This
	// also allows a responsive map which rescales and looks good even on
	// different screen sizes
	var svg = d3.select(container).append('svg')
				.attr("preserveAspectRatio", "xMidYMid")
				.attr("viewBox", "0 0 " + width + " " + height);

	// We add a <g> element to the SVG element and give it a class to
	// style. We also add a class name for Colorbrewer.
	var mapFeatures = svg.append('g').attr('class', 'features YlGnBu');
	  
	// We add a <div> container for the tooltip, which is hidden by default.
	var tooltip = d3.select("#map")
				    .append("div")
				    .attr("class", "tooltip hidden");
  
	
	// We define a geographical projection
	//     https://github.com/mbostock/d3/wiki/Geo-Projections
	// and set the initial zoom to show the features.
	var projection = d3.geo.mercator().scale(1200)
					   // The geographical center of Ontario is -84.771055, 49.306376
					   //     https://de.wikipedia.org/wiki/Älggi-Alp
					   .center([-84.771055, 49.306376])
					   // Translate: Translate it to fit the container
					   .translate([width/2, height/2]);

	// We prepare a path object and apply the projection to it.
	var path = d3.geo.path().projection(projection);
	
	// We prepare a quantize scale to categorize the values in 9 groups.
	// The scale returns text values which can be used for the color CSS
	// classes (q0-9, q1-9 ... q8-9). The domain will be defined once the
	// values are known.
	var quantize = d3.scale.quantize()
					  .range(d3.range(9)
					  .map(function(i) { return 'q' + i + '-9'; }));

	return {
		container : container,
		svg : svg,
		mapFeatures : mapFeatures,
		tooltip : tooltip,
		projection : projection,
		quantize : quantize,
		path : path
	};
}

function InitZoom(map) {
	// Define the zoom and attach it to the map
	var zoom = d3.behavior.zoom()
				 .scaleExtent([1, 10])
				 .on('zoom', doZoom);
				 
	map.svg.call(zoom);
	
	/**
	 * Zoom the features on the map. This rescales the features on the map.
	 * Keep the stroke width proportional when zooming in.
	 */
	function doZoom() {
	  map.mapFeatures.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")")
				// Keep the stroke width proportional. The initial stroke width
				// (0.5) must match the one set in the CSS.
				.style("stroke-width", 0.5 / d3.event.scale + "px");
	}
}

// We specify the dimensions for the map container. We use the same
// width and height as specified in the CSS above.
var map1 = InitializeMap('#map', width, height);
var map2 = InitializeMap('#map2', width, height);
var map3 = InitializeMap('#map3', width, height);
var map4 = InitializeMap('#map4', width, height);

var legend1;
var legend2;
var legend3;
var legend4;

InitZoom(map1);
InitZoom(map2);

// Load the features from the GeoJSON.
d3.json('data/reversed_phu.geojson', function(error, collection) {
	var features = collection.features;
	
	// Read the data for the cartogram
	d3.csv('data/phu_statistics.csv', function(data) { 
		// We store the data object in the variable which is accessible from
		// outside of this function.	
		var index = d3.nest()
					   .key(function(d) { return d.HR_UID; })
					   .rollup(function(d) { return d[0]; })
					   .map(data);

		map1.features = features;
		map2.features = features;
		map3.features = features;
		map4.features = features;
		
		map1.data = data;
		map2.data = data;
		map3.data = data;
		// map4.data = data;
		
		map1.index = index;
		map2.index = index;
		map3.index = index;
		// map3.index = index;

		LoadData(map1, 'TOTAL_prop');
		LoadData(map2, 'TOTAL');
		LoadData(map3, 'FATAL');
		// LoadData(map4, 'FATAL');
		
		legend1 = InitializeLegend('#legend', map1);
		legend2 = InitializeLegend('#legend2', map2);
		legend3 = InitializeLegend('#legend3', map3);
		//legend4 = InitializeLegend('#legend4', map4);
		
		// We add a listener to the browser window, calling updateLegend when the window is resized.
		window.onresize = (ev) => { 
			updateLegend(map1, legend1); 
			updateLegend(map2, legend2); 
			//updateLegend(map3, legend3); 
			//updateLegend(map4, legend4); 
		};
	}) 
})


// TODO : Map data for map2, 3, 4
/*

			d3.csv("data/ltc_points.csv", function(csv) {
				// console.log(csv)

						map.mapFeatures.selectAll("circle")
							 .data(csv)
						   .enter()
							 .append("circle")
							 .attr("cx", function (d) {
								 return projection([d.long, d.lati])[0];
							 })
							 .attr("cy", function (d) {
								 return projection([d.long, d.lati])[1];
							 })
							 // .attr("r", function (d) {
							 //     return Math.sqrt(parseInt(d.number_beds));
							 // })
							 .attr("r", 2)
							 .style("fill", status) //69b3a2
							 .attr("stroke", status)
							 .attr("stroke-width", 1)
							 .attr("fill-opacity", .4)
							 .on('mousemove', showHomes)
							 .on('mouseout', hideHome)
							 .on('click', showLTC)
					});
*/

function LoadData(map, key) {
	// We add the features to the <g> element created before.
	map.mapFeatures.selectAll('path') // D3 wants us to select the (non-existing) path objects first ...
				   .data(map.features) // ... and then enter the data. For each feature, a <path> element is added. 
				   .enter().append('path')
				   .attr('d', map.path) // As "d" attribute, we set the path of the feature.
				   // .on('mousemove', showTooltip) // When the mouse moves over a feature, show the tooltip.
				   // .on('mouseout', hideTooltip) // When the mouse moves out of a feature, hide the tooltip.
				   // .on('click', showDetails); // When a feature is clicked, show the details of it.

	// Set the domain of the values (the minimum and maximum values of
	// all values of the current key) to the quantize scale.
	map.quantize.domain([
		d3.min(map.data, d => +d[key]),
		d3.max(map.data, d => +d[key])
	]);
	
	// Update the class (determining the color) of the features.
	map.mapFeatures.selectAll('path')
				   .attr('class', function(f) {
					   var id = f.properties.HR_UID;
					   var meta = map.index[id];
					   
						// Use the quantized value for the class
						return map.quantize(+meta[key]);
					});

	// We call the function to update the legend.
	// updateLegend();
}


//  Colour by LTC home status
function status(d){
	if(d.outbreak == "No") return "#67A1F1"

	else return "#B51515";
}

// LTC SHOW HOME NAME
function showHomes(d) {
	// Get the ID of the feature.
	d3.select(this).attr("r", 10)
	
	// Get the current mouse position (as integer)
	var mouse = d3.mouse(d3.select('#map').node()).map(
		function(d) { return parseInt(d); }
	);

	// Calculate the absolute left and top offsets of the tooltip. If the
	// mouse is close to the right border of the map, show the tooltip on
	// the left.
	var left = Math.min(width - 4 * d.cleaned_name.length, mouse[0] + 5);
	var top = mouse[1] + 25;

	// Show the tooltip (unhide it) and set the name of the data entry.
	// Set the position as calculated before.
	tooltip.classed('hidden', false)
		   .attr("style", "left:" + left + "px; top:" + top + "px")
		   .html(d.cleaned_name);
}

/**
 * LTC Hide the tooltip.
 */
function hideHome() {
	d3.select(this).attr("r", 2)
	tooltip.classed('hidden', true);
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
