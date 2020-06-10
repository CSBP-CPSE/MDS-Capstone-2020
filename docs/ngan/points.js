// TRY
// points
aa = [-82.36, 42.98];
bb = [-80.01, 43.21];

// add circles to svg
svg.selectAll("circle")
.data([aa,bb]).enter()
.append("circle")
.attr("cx", function (d) { console.log(projection(d)); return projection(d)[0]; })
.attr("cy", function (d) { return projection(d)[1]; })
.attr("r", "8px")
.attr("fill", "red")

// TRY
// d3.select.('#points').append('svg');
//
// d3.csv("data/ltc_points.csv", function(csv) {
//             mapFeatures.selectAll("circle")
//                  .data(csv)
//                .enter()
//                  .append("circle")
//                  .attr("cx", function (d) {
//                      return proj([d.long, d.lati])[0];
//                  })
//                  .attr("cy", function (d) {
//                      return proj([d.long, d.lati])[1];
//                  })
//                  .attr("r", function (d) {
//                      return Math.sqrt(parseInt(d.number_beds));
//                  })
//                  .style("fill", "yellow")
//                  .style("opacity", 0.75);
//         });
