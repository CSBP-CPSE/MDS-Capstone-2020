
// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 40, left: 150},
    width = 460 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("https://raw.githubusercontent.com/ubco-mds-2019-labs/data-599-capstone-statistics-canada/master/d3/kt/data/prox.csv?token=AJI7AY6TTDG5MEQKMS7EVXS65ECSY", function(data) {

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 0.7])
    .range([ 0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

// Y axis
var y = d3.scaleBand()
  .range([ 0, height ])
  .domain(data.map(function(d) { return d.ENG_LABEL; }))
  .padding(1);
svg.append("g")
  .call(d3.axisLeft(y))


// Lines
svg.selectAll("myline")
  .data(data)
  .enter()
  .append("line")
    .attr("x1", function(d) { return x(+d.amenity_dense); })
    .attr("x2", x(0))
    .attr("y1", function(d) { return y(d.ENG_LABEL); })
    .attr("y2", function(d) { return y(d.ENG_LABEL); })
    .attr("stroke", "grey")

// Circles
svg.selectAll("mycircle")
  .data(data)
  .enter()
  .append("circle")
    .attr("cx", function(d) { return x(+d.amenity_dense); })
    .attr("cy", function(d) { return y(d.ENG_LABEL); })
    .attr("r", "4")
    .style("fill", "#69b3a2")
    .attr("stroke", "black")
})

