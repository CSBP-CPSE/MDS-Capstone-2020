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
				    .attr("class", "tooltip hidden")
						// .attr('style', 'left:' + d3.event.x + 'px'; 'top:' + d3.event.y + 'px');

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
				 .scaleExtent([1, 50])
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
		map.mapFeatures.selectAll("circle")
            // .attr("d", map.projection(projection))
            .attr("r", 4/zoom.scale())
						.attr("stroke-width", 1/zoom.scale());
	}
}

// We specify the dimensions for the map container. We use the same
// width and height as specified in the CSS above.
var map1 = InitializeMap('#map', width, height);
// var map2 = InitializeMap('#map2', width, height);
// var map3 = InitializeMap('#map3', width, height);
var map4 = InitializeMap('#map4', width, height);

var legend1;
// var legend2;
// var legend3;
var legend4;

InitZoom(map1);
// InitZoom(map2);
// InitZoom(map3);
InitZoom(map4);

// Load the features from the GeoJSON.
d3.json('https://ubco-mds-2019-labs.github.io/data-599-capstone-statistics-canada/data/reversed_phu.geojson', function(error, collection) {
	// console.log(collection.features)
	var features = collection.features;

	// Read the data for the cartogram
	d3.csv('https://ubco-mds-2019-labs.github.io/data-599-capstone-statistics-canada/data/phu_statistics.csv', function(data) {
		// We store the data object in the variable which is accessible from
		// outside of this function.
		var index = d3.nest()
					   .key(function(d) { return d.HR_UID; })
					   .rollup(function(d) { return d[0]; })
					   .map(data);

		map1.features = features;
		// map2.features = features;
		// map3.features = features;
		// map4.features = features;

		map1.data = data;
		// map2.data = data;
		// map3.data = data;
		// map4.data = data;

		map1.index = index;
		// map2.index = index;
		// map3.index = index;
		// map3.index = index;

		LoadData(map1, key = 'TOTAL_prop');
		// LoadData(map2, key = 'TOTAL');
		// LoadData(map3, key = 'FATAL');
		// LoadData(map4, 'FATAL');

		legend1 = InitializeLegend('#legend', map1);
		// legend2 = InitializeLegend('#legend2', map2);
		// legend3 = InitializeLegend('#legend3', map3);
		// legend4 = InitializeLegend('#legend4', map4);
		// LTCLegend('#legend4', map4);

		// We add a listener to the browser window, calling updateLegend when the window is resized.
		window.onresize = (ev) => {
			updateLegend(map1, legend1);
			updateLegend(map2, legend2);
			updateLegend(map3, legend3);

		};

	})
})


// TODO : Map data for map2, 3, 4

// Load the features from the GeoJSON.
d3.json('https://ubco-mds-2019-labs.github.io/data-599-capstone-statistics-canada/data/reversed_LHIN.json', function(error, collection) {
	// console.log(collection.features)
	var features = collection.features;

			d3.csv("https://ubco-mds-2019-labs.github.io/data-599-capstone-statistics-canada/data/ltc_points.csv", function(csv) {
				console.log(csv)
						map4.features = features;
						map4.data = csv;
						LoadData(map4, key = 0, points = csv);



				})
	});


function LoadData(map, key, points) {
	points = points || 0
	key = key || 0
	// We add the features to the <g> element created before.
	map.mapFeatures.selectAll('path') // D3 wants us to select the (non-existing) path objects first ...
				   .data(map.features) // ... and then enter the data. For each feature, a <path> element is added.
				   .enter().append('path')
	 				.attr('d', map.path) // As "d" attribute, we set the path of the feature.


	// Set the domain of the values (the minimum and maximum values of
	// all values of the current key) to the quantize scale.
	map.quantize.domain([
		d3.min(map.data, d => +d[key]),
		d3.max(map.data, d => +d[key])
	]);

	if (key != 0){			// Update the class (determining the color) of the features.
			map.mapFeatures.selectAll('path')
						   .attr('class', function(f) {
							   var id = f.properties.HR_UID;
							   var meta = map.index[id];

								return map.quantize(+meta[key]); // Use the quantized value for the class
							})
	 				   .on('mousemove',  function(f){ // show tooltip
	 						 var id = f.properties.HR_UID;
	 						 var meta = map.index[id];

	 							map.tooltip.classed('hidden', false)
	 							.html(meta.ENG_LABEL + "</br> "
										+ "Proportion: " + meta.TOTAL_prop + "</br> "
										+ "Fatalities: " + meta.FATAL + "</br> "
										+ "Amenity Score: " + meta.amenity_dense)
								.style("left", (d3.event.pageX - 108) + "px")
      					.style("top", (d3.event.pageY-28) + "px");
	 						})
							.on('mouseout', function() {map.tooltip.classed('hidden', true)}) //hide tooltip
				};

	if (points != 0)	{
					map.mapFeatures.selectAll("path")
						.attr('d', map.path)
						.style('fill', "#243327") // map fill colour

					map.mapFeatures.selectAll("circle")
						 .data(points)
						 .enter()
						 .append("circle")
						 .attr("cx", function (d) {
							 return map.projection([d.long, d.lati])[0];
						 })
						 .attr("cy", function (d) {
							 return map.projection([d.long, d.lati])[1];
						 })
						 .attr("r", 2)
						 .style("fill", status)
						 .attr("stroke", status)
						 .attr("stroke-width", 1)
						 .attr("fill-opacity", .4)
						 .on('mousemove', showHomes)
						 .on('mouseout', hideHome)
					 };



					 // LTC SHOW HOME NAME
				 	function showHomes(d) {

				 		// d3.select(this).attr("r", 10) // increase size on hover

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
				 		map.tooltip.classed('hidden', false)
				 			   .html(d.cleaned_name+ "</br> "
 										+ "Type: " + d.home_type + "</br> "
 										+ "Beds: " + d.number_beds + "</br> "
 										+ "LHIN: " + d.LHIN + "</br> "
										+ "Status: " + d.status)
								.style("left", (d3.event.pageX - 108) + "px")
      					.style("top", (d3.event.pageY-28) + "px");
				 	}


					/**
					 * LTC Hide the tooltip.
					 */
					function hideHome() {
						// d3.select(this).attr("r", 2)
						map.tooltip.classed('hidden', true);
					}
};





//  Colour by LTC home status
function status(d){
	if(d.outbreak == "No") return "#69b3a2"

	else return "#61acff";
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
 * Hide the tooltip.
 */
function hideTooltip() {
  map.tooltip.classed('hidden', true);
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
