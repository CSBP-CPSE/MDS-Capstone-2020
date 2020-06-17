
// set the dimensions and margins of the graph
var margin = {top: 30, right: 0, bottom: 30, left: 30},
    width = 500 - margin.left - margin.right,
    height = 520 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")")


var tooltip2 = d3.select("body")
			    .append("div")
			    .attr("class", "tooltip hidden");



function HighlightChart(f, i) {
	var data = svg.selectAll('circle').data();
	
	// NOT SUPPORTED IN IE
	// var d = data.find(d => d.HR_UID == f.properties.HR_UID);
	
	var circle = svg.selectAll('circle').filter((d, i) => d.HR_UID == f.properties.HR_UID).style("fill", "yellow");
}

function ClearHighlight() {
	svg.selectAll('circle').style("fill", "#69b3a2");
}

d3.csv("https://ubco-mds-2019-labs.github.io/data-599-capstone-statistics-canada/data/phu_statistics.csv", function(data) {

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
  // var bar = svg.selectAll(".bar")
  //     .data(data)
  //   .enter().append("rect")
  //     .attr("class", "bar")
  //     .attr("x", function(d) { return x(d['ENG_LABEL']); })
  //     .attr("y", height)
  //     .attr("width", x.rangeBand())
  //     .attr("height", 0)
	// 		.attr('fill', 'rgb(65,174,118)')
  //     .on('mouseover', showBar)
  //     .on('mouseout', hideBar);

// Lines
svg.selectAll("myline")
  .data(data)
  .enter()
  .append("line")
    .attr("x1", function(d) { return x(d.ENG_LABEL); })
    .attr("x2", function(d) { return x(d.ENG_LABEL); })
    .attr("y1", function(d) { return +y(d.amenity_dense); })
    .attr("y2", y(0))
    .attr("stroke", "grey")

// Circles
svg.selectAll("mycircle")
						  .data(data)
						  .enter()
						  .append("circle")
						    .attr("cx", function(d) { return x(d.ENG_LABEL); })
						    .attr("cy", function(d) { return +y(d.amenity_dense); })
						    .attr("r", "4")
						    .style("fill", "#69b3a2")
						    .attr("stroke", "black")
								.on('mouseover', showBar)
								.on('mouseout', hideBar);

  // bar.transition()
  //     .duration(1500)
  //     .ease("elastic")
  //     .attr("y", function(d) { return y(+d['amenity_dense']); })
  //     .attr("height", function(d) { return height - y(+d['amenity_dense']);
	//
  // });

  // Bar show details
 function showBar(d) {

   // Show the tooltip (unhide it) and set the name of the data entry.
   // Set the position as calculated before.
   tooltip2.classed('hidden', false)
        .html(d.ENG_LABEL+ "</br> "
           + "Amenity Score: " + d.amenity_dense)
       .style("left", (d3.event.pageX + 20) + "px")
       .style("top", (d3.event.pageY - 20) + "px");
 }


 /**
  * Bar hide tooltip
  */
 function hideBar() {
   tooltip2.classed('hidden', true);
 }

});
