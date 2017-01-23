/// UDACITY DAND - Data Visualisation - Giacomo Sarchioni

/*This JavaScript modules contains all the supporting functions for
the Data Analyst Nanodegree - Data Visualisation project.*/

// ### MARGINS ###
//Margins as per convention from bl.ocks.org
var margin = {top: 20, right: 10, bottom: 20, left: 10};
var padding = {top: 20, right: 20, bottom: 20, left:20};
var outerWidth = 960,
    outerHeight = 500,
    width = outerWidth - margin.left - margin.right,
    height = outerHeight - margin.top - margin.bottom,
    innerWidth = width - padding.left - padding.right,
    innerHeight = height - padding.top - padding.bottom

// ### UPDATING CHART ###
// Title
function changeTitle(newTitle) {
	chart.select('#title')
		 .select('text')
		 .text(newTitle);
};

// ### FORMATTING ###
// Formatting nymbers
var formatDec = d3.format('.2f');
var formatInt = d3.format(',.0f');
var formatPerc = d3.format(',%');

function formatMillAxis(value) {
	return formatInt(parseFloat(value) / 1e3) + ' M';
}

function formatMill(value) {
	return formatDec(parseFloat(value) / 1e3) + ' M';
};

function formatMap(value) {
	return formatInt(parseFloat(value) * 1e3);
};

function roundUpThousand(value) {
	/*Round up to the next hundredth thousand for a value expressed
	in thousands*/
	return Math.ceil(value / 1e2) * 1e2;
};

/*http://bl.ocks.org/eesur/4e0a69d57d3bfc8a82c2*/
//https://developer.mozilla.org/en/docs/Web/API/Node/appendChild
d3.selection.prototype.moveToFront = function() {  
	return this.each(function() {
        this.parentNode.appendChild(this);
    });
};

// ### DATA PARSING ###
// Trends
function parseTrends(data) {
	for (var key in data) {
		if (key != 'year') {
			data[key] = +data[key];
		}
	}
	return data;
};
// Map
function parseMap(data) {
	for (var key in data) {
		if (key == 'value') {
			data[key] = +data[key];
		}
	}
	return data;
};

// ### OBJECT REMOVING ###
// Remove objects from area
function removeObjs(object) {
	area.selectAll(object).remove();
};

// ### TOOLTIP MANAGING ###
// Change tooltip title
function changeTooltipTitle(newTitle) {
	d3.select('#tooltip-title')
	  .text(newTitle);
};

// Change tooltip value
function changeTooltipValue(newValue) {
	d3.select('#tooltip-value')
	  .text(newValue);
};

// Change tooltip width
function changeTooltipWidth(newValue) {
	d3.select('#tooltip')
	  .style('width', newValue + 'px');
};

// Change tooltip class
function changeTooltipClass(classed, boolean) {
	d3.select('#tooltip')
	  .classed(classed, boolean);
}

// Change tooltip position
function changeTooltipPosition(left, top) {
	d3.select('#tooltip')
	  .style('left', left + 'px')
	  .style('top', top + 'px');
}

// ### D3 SCALES ###
// Axis scales
var xScale = d3.scale.ordinal();
var yScale = d3.scale.linear();
var yearBoxScale = d3.scale.linear();
var legendScale = d3.scale.linear().range([0,1]);

// Update yearBoxScale
function updateYearBoxScale(yearBox, years) {
	
	// Get BBox of yearBox
	var box = yearBox.node().getBBox();

	// Define domain and range of yearScale
	yearBoxScale.domain([years[0], years[years.length - 1]])
			 .range([box.x + 5, box.x + box.width - 20]);

};

// Color scales
var trendColor = d3.scale.ordinal().range(colorbrewer.Set1[5]);
var mapColor = d3.scale.linear().range([0,1]);

// ### D3 AXIS ###
var xAxis = d3.svg.axis().orient('bottom');
var yAxis = d3.svg.axis().orient('left');

// ### LINE ###
var line = d3.svg.line()
			 .x(function(d) { return xScale(d.year) + xScale.rangeBand() / 2; })
			 .y(function(d) { return yScale(d.value); });

// ### PROJECTIONS ###
var mapProjection = d3.geo.mercator()
					  .scale(105)
					  .translate([outerWidth/1.65, outerHeight/1.4]);
var mapPath = d3.geo.path().projection(mapProjection);

// ### CREATE PURPOSE OBJECT ###
function createPurposesData(data) {
	/*Creates an object where for each purpose (key), there is an
	array of values, one for every year*/
	var dataPurposes = Object.keys(data[0]).slice(1,6).map(function(purpose) {
		return {
			purpose: purpose,
			values: data.map(function(d) {
				return {
					year: d.year,
					value: d[purpose]
				};
			})
		};
	})
	return dataPurposes;
};


// ### EXTRACTING VALUES ###
// Extract max value of the max values in an object
function extractMaxMax(data) {
	return d3.max(data, function(d) {
		return d3.max(d.values, function(d) {
			return d.value;
		});
	});
};

// Extract properly formatted purpose name from an Object
function extractPurposeName(purpose, datum) {
	if(purpose == 'VFR') {
		return 'Visiting friends and relatives'
 	} else {
 		return datum.purpose;
 	}
};

// Extract purpose percentage
function extractPurposePerc(datum, index) {
	return formatPerc(datum.values[index].value);
};

// Extract y of purpose-box
function extractPurposeBoxY(purpose, datum, index) {
	// Ad hoc code to position labelling correctly
	if (purpose == 'Business') {
		return yScale(datum.values[index].value) + 25;
	} else if (purpose == 'VFR') {
		return yScale(datum.values[index].value) - 25;
	} else {
		return yScale(datum.values[index].value) - 15;
	}
};

// Extract nested, i.e. visits data by country as a JS object
function extractNested(data) {
	return d3.nest()
			 .key(function(d) {
			 	return d.market;
			 })
			 .entries(data);
};

// Extract years from geo dataset
function extractYears(data) {
	years = d3.set();
	data.forEach(function(d) {
		years.add(d.year);
	})
	return years.values();
}


// ### MERGE DATASETS ***
// Add visitors to data to geoJSON
function addDataToMap(data, map) {

	for (var i = 0; i < data.length; i++) {

		var dataCountry = data[i].key;
		var dataValues = data[i].values;
						
		for (var j = 0; j < map.features.length; j++) {
							
			var mapCountry = map.features[j].properties.name;

			if (dataCountry == mapCountry) {

				map.features[j].properties.visitors = dataValues;
				break;
			}
		}
	};

	return map;
};

// ### UPDATE MAP ###
// Interpolate mapColor in Blue continous scale
function countryInterpolate(value) {
	return d3.interpolateBlues(mapColor(value));
};

function legendInterpolate(value) {
	return d3.interpolateBlues(legendScale(value));
}

// Update countries fill with transition
function countriesTransition(countries, year) {
	countries.transition()
			 .duration(50)
			 .style('fill', function(d) {
			 	if(d.properties.visitors) {
			 		if(d.properties.visitors[year]) {
			 			return countryInterpolate(d.properties.visitors[year]);
			 		};
			 	};
			 });
};

function yearTransition(yearBox, year) {
	yearBox.transition()
		   .duration(50)
		   .text(year);
};

function updateMap(countries, yearBox, year) {

	// Update countries fill
	countriesTransition(countries, year);

	// Update year
	yearTransition(yearBox, year);

};

// ### OBJECT APPENDING ###
// Append map yearBox
function appendYearBox() {
	return area.append('text')
	    	   .attr('x', 5 * padding.right)
	    	   .attr('y', 0.88 * outerHeight)
	    	   .attr('class', 'map year')
};

function appendLegend() {
	return area.append('g')
			   .attr('class', 'map legend')
			   .attr('transform', 'translate(' + (5.2 * padding.right) + ',' + (0.88 * outerHeight + 25) + ')');
};


// ### LEGEND MANAGING ###
function formatLegend(legend) {

	// Define legendData
	var legendData = [];
	for (var i = 0; i < 150; i += 1) {
		legendData.push(i);
	};

	// Update legend scale
	legendScale.domain([0, legendData.length - 1]);
	
	// Add legend sections
	legend.append('g')
		  .attr('class', 'legend-bar')
		  .selectAll('rect')
		  .data(legendData)
		  .enter()
		  .append('rect')
		  .attr('x', function(d) {return d})
		  .attr('y', '5')
		  .attr('height', '10')
		  .attr('width', '1')
		  .attr('fill', function(d, i) {
		  	return legendInterpolate(i);
		  });

	// Append title
	legend.append('text')
		  .attr('class', 'legend-title')
		  .text('International Visitors to London');

	// Append min
	legend.append('text')
		  .attr('class', 'legend-range min')
		  .text(0)
		  .attr("transform","translate(0" +',' + 30 + ')');

	// Append max
	legend.append('text')
		  .attr('class', 'legend-range')
		  .text(formatMap(mapColor.domain()[1]))
		  .attr("transform","translate(" + 150 +',' + 30 + ')');

};


// ### MOUSE EFFECTS ###
// Bar mouseover
function barOver(d, selected, tooltipWidth) {
	
	// Extract x position
	var xPos = parseFloat(selected.attr('x'));
	
	// Calculate left and top for tooltip
	var left = xPos - (tooltipWidth - xScale.rangeBand()) / 2
	var top = innerHeight - 3.5 * padding.bottom;

	// Change tooltip position
	changeTooltipPosition(left, top);

	// Change tooltip's title and value
	changeTooltipTitle(d.year);
	changeTooltipValue(formatMill(d.visits));

	// Change tooltip width
	changeTooltipWidth(80);

	// Make tooltip visible and change style
	changeTooltipClass('hidden', false);
	changeTooltipClass('focus-bar', true);
	
	// Make bar focus
	selected.classed('focus', true)
};

// Bar mouseout
function barOut(selected) {

	// Make tooltip invisile
	changeTooltipClass('hidden', true);

	// Reset bar color
	selected.classed('focus', false);
};

// Purpose box mouseover
function purposeBoxOver() {
	// Move selection to fron
	d3.select(this.parentElement).moveToFront();

	// Extract purpose
	var selectedPurpose = this.parentElement.classList[0];

	// Change class based on selection
	area.selectAll('.purpose')
	    .classed('unfocused', function() {
			if(this.classList[0] != selectedPurpose) {
				return true;
			};
		})
		.classed('focused', function() {
			if(this.classList[0] == selectedPurpose) {
				return true;
			};
		});
};

// Purpose box mouseout
function purposeBoxOut() {
	area.selectAll('.purpose')
		.classed('unfocused', false)
		.classed('focused', false)
};

// Yearbox mousemove
function yearBoxMove(yearBox, mouseValue, countries) {

	// Cancel current transition if any
	area.transition().duration(0);

	// Extract year using yearBoxScale
	var yearValue = Math.round(yearBoxScale.invert(mouseValue[0]));

	// Trim yearValue
	if(yearValue < 2002) {
		return 2002;
	} else if (yearValue > 2015) {
		return 2015
	};

	// Change text of yearBox
	yearBox.transition()
			.duration(150)
			.text(yearValue);

	// Update map
	updateMap(countries, yearBox, yearValue.toString());
};







