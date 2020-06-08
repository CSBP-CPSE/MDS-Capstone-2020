// load data as variable

var data=dashboard.dataset('https://raw.githubusercontent.com/ubco-mds-2019-labs/data-599-capstone-statistics-canada/master/d3/kt/data/prox.csv?token=AJI7AY5FEEM7K3SHMVPY5F2647QYO');

// define columns to use
var columns=['prox_idx_emp_wt',
             'prox_idx_pharma_wt',
            'prox_idx_childcare_wt',
            'prox_idx_health_wt',
            'prox_idx_grocery_wt',
            'prox_idx_educpri_wt',
            'prox_idx_educsec_wt',
            'prox_idx_lib_wt',
            'prox_idx_parks_wt',
            'prox_idx_transit_wt'];

var x='ENG_LABEL',y='';

// the variable y is going to be left blank since it's going to change for every month
var xLabel="PHU",yLabel="Proximity";

// container SVG
var color=d3.scale.category20c();
var margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xValue = function(d) { return +d[x];},
    xScale = d3.scale.linear().range([0, width]),
    xMap = function(d) { return xScale(xValue(d));},
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);

// plotting columns

for(var i=0;i<columns.length;i++) {
    var y=columns[i];
    var yValue = function(d) { return d[y];},
    yScale = d3.scale.linear().range([height, 0]),
    yMap = function(d) { return yScale(yValue(d));},
    yAxis = d3.svg.axis().scale(yScale).orient("left");
    data.forEach(function(d) {
        d[x] = +d[x];
        d[y] = +d[y];
    });
    yScale.domain([d3.min(data, yValue)-0.1, d3.max(data, yValue)+0.1]);
    svg.selectAll(".dot"+i)
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot"+i)
        .attr("data-legend",function() { return y}) //optional legend
        .style("fill",color(i))
        .style("stroke",color(i))
        .attr("r", 2)
        .attr("cx", xMap)
        .attr("cy", yMap);
}

yScale.domain([d3.min(data, yValue)-0.2, d3.max(data, yValue)+0.2]);

// axis
svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis).append("text").attr("y", 2).attr("x", width-20).style("text-anchor", "end").style("fill","#333333").style("font-size","15px").text(xLabel);
svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").style("fill","#333333").style("font-size","15px").text(yLabel);


// legend
legend=svg.append("g")
    .attr("class","legend")
    .attr("transform","translate(100,10)")
    .style("font-size","12px")
    .style("fill","#DBDCDE")
    .call(d3.legend);
