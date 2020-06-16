
// set the dimensions and margins of the graph
var margin = {top: 30, right: 0, bottom: 30, left: 30},
    width = 400 - margin.left - margin.right,
    height = 420 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")")


var tooltip2 = d3.select("#chart")
			    .append("div")
			    .attr("class", "tooltip hidden");



d3.csv("data/prox.csv", function(data) {

  ///////////////////////
  // Scales
  var x = d3.scale.ordinal()
      .domain(data.map(function(d) { return d['ENG_LABEL']; }))
      .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
      .domain([0, d3.max(data, function(d) { return +d['amenity_dense']; }) * 1.1])
      .range([height, 0]);

  ///////////////////////
  // Axis
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
			.tickValues([]);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    // .selectAll('text')
    //   .attr("transform", "rotate(90)")
    //   .attr("x", 9)
    //   .style("text-anchor", "start")
		// .append('text')
			// 	.attr("transform",
			// 				"translate(" + (width/2) + " ," +
			// 											 (height + margin.top + 20) + ")")
			// 	.style("text-anchor", "middle")
			// 	.text("Public Health Unit");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  ///////////////////////
  // Title
  svg.append("text")
    .text('Amenity Richness by Public Health Unit')
    .attr("text-anchor", "middle")
    .attr("class", "graph-title")
    .attr("y", -10)
    .attr("x", width / 2.0);

  ///////////////////////
  // Bars
  var bar = svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d['ENG_LABEL']); })
      .attr("y", height)
      .attr("width", x.rangeBand())
      .attr("height", 0)
			.attr('fill', 'rgb(65,174,118)')
      .on('mouseover', showBar)
      .on('mouseout', hideBar);

  bar.transition()
      .duration(1500)
      .ease("elastic")
      .attr("y", function(d) { return y(+d['amenity_dense']); })
      .attr("height", function(d) { return height - y(+d['amenity_dense']);

  });


  // Bar show details
 function showBar(d) {

   // Show the tooltip (unhide it) and set the name of the data entry.
   // Set the position as calculated before.
   tooltip2.classed('hidden', false)
        .html(d.ENG_LABEL+ "</br> "
           + "Amenity Score: " + d.amenity_dense)
       .style("left", (d3.event.pageX - 235) + "px")
       .style("top", (d3.event.pageY-28) + "px");
 }


 /**
  * Bar hide tooltip
  */
 function hideBar() {
   tooltip2.classed('hidden', true);
 }

});
