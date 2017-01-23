// UDACITY DAND - Data Visualisation - Giacomo Sarchioni

/*This JavaScript modules contains all the code for setting up  the
page for the Data Analyst Nanodegree - Data Visualisation project.*/

// ### MARGINS ###
//Margins as per convention from bl.ocks.org
var margin = {top: 20, right: 10, bottom: 20, left: 10};
var padding = {top: 20, right: 20, bottom: 20, left:20};
var outerWidth = 960,
    outerHeight = 500,
    width = outerWidth - margin.left - margin.right,
    height = outerHeight - margin.top - margin.bottom,
    innerWidth = width - padding.left - padding.right,
    innerHeight = height - padding.top - padding.bottom;

// ### AXIS SCALES ###
// xScale
var xScale = d3.scale.ordinal();
// yScale
var yScale = d3.scale.linear();
// Scale for yearBox
var yearBoxScale = d3.scale.linear();

// ### COLOR SCALES ###
// Color scale for trend chart
var purposeColor = d3.scale.ordinal().range(colorbrewer.Set1[5]);
// Scale for legend
var legendColor = d3.scale.linear().range([0,1]);
// Color scale for map
var mapColor = d3.scale.linear().range([0,1]);

// ### AXIS ###
var xAxis = d3.svg.axis().orient('bottom').innerTickSize(0);
var yAxis = d3.svg.axis().orient('left').ticks(4);
var xFocusAxis = d3.svg.axis().orient('bottom').innerTickSize(0).tickPadding(5);
var yFocusAxis = d3.svg.axis().orient('left').ticks(0);

// ### LINE ###
var line = d3.svg.line()
			 .x(function(d) { return xScale(d.year) + xScale.rangeBand() / 2; })
			 .y(function(d) { return yScale(d.value); });

// ### PROJECTIONS ###
var mapProjection = d3.geo.mercator()
					  .scale(105)
					  .translate([outerWidth/1.65, outerHeight/1.4]);
var mapPath = d3.geo.path().projection(mapProjection);