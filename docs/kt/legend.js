
function InitializeLegend(container, map) {
	// For the legend, we prepare a very simple linear scale. Domain and
	// range will be set later as they depend on the data currently shown.
	var legendX = d3.scale.linear();

	// We use the scale to define an axis. The tickvalues will be set later
	// as they also depend on the data.
	var legendXAxis = d3.svg.axis()
	  .scale(legendX)
	  .orient("bottom")
	  .tickSize(13)
	  .tickFormat(d => d3.format('.2f')(d))

	// We create an SVG element in the legend container and give it some
	// dimensions.
	var legendSvg = d3.select(container).append('svg')
					  .attr('width', '100%')
					  .attr('height', '44');

	// To this SVG element, we add a <g> element which will hold all of our
	// legend entries.
	var g = legendSvg.append('g')
		.attr("class", "legend-key YlGnBu")
		.attr("transform", "translate(" + 20 + "," + 20 + ")");

	// We add a <rect> element for each quantize category. The width and
	// color of the rectangles will be set later.
	g.selectAll("rect")
		.data(map.quantize.range().map(function(d) {
		  return map.quantize.invertExtent(d);
		}))
	  .enter().append("rect");

	// We add a <text> element acting as the caption of the legend. The text
	// will be set later.
	g.append("text")
		.attr("class", "caption")
		.attr("y", -6)

	var legend = {
		g : g,
		legendX : legendX,
		legendXAxis : legendXAxis
	}

	updateLegend(map, legend);

	return legend;
}

/**
 * Function to update the legend.
 * Somewhat based on http://bl.ocks.org/mbostock/4573883
 */
function updateLegend(map, legend) {

  // We determine the width of the legend. It is based on the width of
  // the map minus some spacing left and right.
  var legendWidth = d3.select('#map').node().getBoundingClientRect().width - 50;

  // We determine the domain of the quantize scale which will be used as
  // tick values. We cannot directly use the scale via quantize.scale()
  // as this returns only the minimum and maximum values but we need all
  // the steps of the scale. The range() function returns all categories
  // and we need to map the category values (q0-9, ..., q8-9) to the
  // number values. To do this, we can use invertExtent().
  var legendDomain = map.quantize.range().map(function(d) {
	var r = map.quantize.invertExtent(d);
	return r[1];
  });
  // Since we always only took the upper limit of the category, we also
  // need to add the lower limit of the very first category to the top
  // of the domain.
  legendDomain.unshift(map.quantize.domain()[0]);

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
  legend.legendX
	.domain(map.quantize.domain())
	.range([0, legendWidth]);

  // We update the rectangles by (re)defining their position and width
  // (both based on the legend scale) and setting the correct class.
  legend.g.selectAll("rect")
	.data(map.quantize.range().map(function(d) {
	  return map.quantize.invertExtent(d);
	}))
	.attr("height", 8)
	.attr("x", function(d) { return legend.legendX(d[0]); })
	.attr("width", function(d) { return legend.legendX(d[1]) - legend.legendX(d[0]); })
	.attr('class', function(d, i) {
	  return map.quantize.range()[i];
	});

  // We update the legend caption. To do this, we take the text of the
  // currently selected dropdown option.
  //var keyDropdown = d3.select('#select-key').node();
  //var selectedOption = keyDropdown.options[keyDropdown.selectedIndex];
  //g.selectAll('text.caption')
  //	.text(selectedOption.text);

  // We set the calculated domain as tickValues for the legend axis.
  legend.legendXAxis
	.tickValues(legendDomain)

  // We call the axis to draw the axis.
  legend.g.call(legend.legendXAxis);
}
