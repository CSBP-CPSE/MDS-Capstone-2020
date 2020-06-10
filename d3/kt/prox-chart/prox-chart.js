
// define columns to use
var columns=['emp',
             'pharma',
            'childcare',
            'health',
            'grocery',
            'educpri',
            'edusec',
            'lib',
            'parks',
            'transit'];

var x='ENG_LABEL',y='';

// the variable y is going to be left blank since it's going to change for every month
var xLabel="Public Health Unit",yLabel="Proximity";

// container SVG
var color=d3.scale.category20c();
var margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 900 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xValue = function(d) { return d[x];},
    xScale = d3.scale.ordinal().range([50, 70, 90, 110, 130, 150, 170, 190, 210, 230, 250, 270, 290, 310, 330, 350, 
        370, 390, 410, 430, 450, 470, 490, 510, 530, 550, 570, 590, 610, 630,
    650, 670, 690, 710, 730, 750]),
    xMap = function(d) { return xScale(xValue(d));},
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");


// plotting columns

d3.csv('https://raw.githubusercontent.com/ubco-mds-2019-labs/data-599-capstone-statistics-canada/master/d3/kt/data/prox.csv?token=AJI7AYZNBL7UTJA6WJMASE265AOO6',
function(data){
    console.log(data)


for(var i=0;i<columns.length;i++) {

    //xScale.domain([d3.min(data, xValue), d3.max(data, xValue)]);

    var y=columns[i];
    var yValue = function(d) { return +d[y];},
    yScale = d3.scale.linear().range([height, 0]),
    yMap = function(d) { return yScale(yValue(d));},
    yAxis = d3.svg.axis().scale(yScale).orient("left");
    data.forEach(function(d) {
        console.log(columns[i], d[x], +d[y])
        d[x] = d[x];
        d[y] = +d[y];
    });
    
    yScale.domain([d3.min(data, yValue)-0.001, d3.max(data, yValue)+0.05]);
    
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


        // axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(5," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("transform", "rotate(90)")
            .style("font-size","10px").style("text-anchor", "start")
            .append("text")
            .attr("y", -2)
            .attr("x", width-20)
            .style("text-anchor", "end").style("fill","#333333").style("font-size","10px").text(xLabel);
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end").style("fill","#333333").style("font-size","15px").text(yLabel);

});

// legend
legend=svg.append("g")
    .attr("class","legend")
    .attr("transform","translate(100,10)")
    .style("font-size","12px")
    .style("fill","#DBDCDE")
    .call(d3.legend);
