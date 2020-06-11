
// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 40, left: 100},
    width = 460 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// // append the svg object to the body of the page
// var svg = d3.select("#chart")
//   .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform",
//           "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
// d3.csv("https://raw.githubusercontent.com/ubco-mds-2019-labs/data-599-capstone-statistics-canada/master/d3/kt/data/prox.csv?token=AJI7AY4AT22OXIBYAXBF3OK65EK7I", function(data) {
//
//   // Add X axis
//   var x = d3.scale.linear()
//     .domain([0, 0.7])
//     .range([ 0, width]);
//   svg.append("g")
//     .attr("transform", "translate(0," + height + ")")
//     // .call(d3.axisBottom(x))
//     .selectAll("text")
//       .attr("transform", "translate(-10,0)rotate(-45)")
//       .style("text-anchor", "end");
//
//   // Y axis
//   var y = d3.scale.ordinal()
//     .range([ 0, height ])
//     .domain(data.map(function(d) { return d.ENG_LABEL; }))
//     .padding(1);
//   svg.append("g")
//     .call(d3.axisLeft(y))
//
//
//   // Lines
//   svg.selectAll("myline")
//     .data(data)
//     .enter()
//     .append("line")
//       .attr("x1", function(d) { return x(+d.amenity_dense); })
//       .attr("x2", x(0))
//       .attr("y1", function(d) { return y(d.ENG_LABEL); })
//       .attr("y2", function(d) { return y(d.ENG_LABEL); })
//       .attr("stroke", "grey")
//
//   // Circles
//   svg.selectAll("mycircle")
//     .data(data)
//     .enter()
//     .append("circle")
//       .attr("cx", function(d) { return x(+d.amenity_dense); })
//       .attr("cy", function(d) { return y(d.ENG_LABEL); })
//       .attr("r", "4")
//       .style("fill", "#69b3a2")
//       .attr("stroke", "black")
// })
d3.csv("https://raw.githubusercontent.com/ubco-mds-2019-labs/data-599-capstone-statistics-canada/master/d3/kt/data/prox.csv?token=AJI7AY4AT22OXIBYAXBF3OK65EK7I", function(data) {

  ///////////////////////
  // Chart Size Setup
  var margin = { top: 35, right: 0, bottom: 30, left: 40 };

  var width = 960 - margin.left - margin.right;
  var height = 500 - margin.top - margin.bottom;

  var chart = d3.select(".chart")
      .attr("width", 960)
      .attr("height", 500)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  ///////////////////////
  // Title
  chart.append("text")
    .text('Bar Chart!')
    .attr("text-anchor", "middle")
    .attr("class", "graph-title")
    .attr("y", -10)
    .attr("x", width / 2.0);

  ///////////////////////
  // Bars
  var bar = chart.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d['ENG_LABEL']); })
      .attr("y", height)
      .attr("width", x.rangeBand())
      .attr("height", 0);

  bar.transition()
      .duration(1500)
      .ease("elastic")
      .attr("y", function(d) { return y(+d['amenity_dense']); })
      .attr("height", function(d) { return height - y(+d['amenity_dense']);

  });
});
