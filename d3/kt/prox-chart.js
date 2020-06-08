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

var xValue = function(d) { return d[x];},
    xScale = d3.scale.linear().range([0, width]),
    xMap = function(d) { return xScale(xValue(d));},
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
