// TRY
// points
aa = [-82.36, 42.98];
bb = [-80.01, 43.21];

// add circles to svg
// svg.selectAll("circle")
// .data([aa,bb]).enter()
// .append("circle")
// .attr("cx", function (d) { console.log(projection(d)); return projection(d)[0]; })
// .attr("cy", function (d) { return projection(d)[1]; })
// .attr("r", "8px")
// .attr("fill", "red")

// TRY
// d3.select.('#points').append('svg');

d3.csv("data/ltc.csv", function(csv) {
    console.log(csv)
            mapFeatures.selectAll("circle")
                 .data(csv)
               .enter()
                 .append("circle")
                 .attr("cx", function (d) {
                     return projection([d.long, d.lat])[0];
                 })
                 .attr("cy", function (d) {
                     return projection([d.long, d.lat])[1];
                 })
                 // .attr("r", function (d) {
                 //     return Math.sqrt(parseInt(d.number_beds));
                 // })
                 .attr("r", 14)
                 .style("fill", "69b3a2")
                 .attr("stroke", "#69b3a2")
                 .attr("stroke-width", 3)
                 .attr("fill-opacity", .4)
        });
