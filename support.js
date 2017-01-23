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
		if ((key!= 'year') && (key!='market')) {
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
}

// Change tooltip value
function changeTooltipValue(newValue) {
	d3.select('#tooltip-value')
	  .text(newValue);
}

// Change tooltip width
function changeTooltipWidth(newValue) {
	d3.select('#tooltip')
	  .style('width', newValue + 'px');
}

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
					  .scale(110)
					  .translate([outerWidth/1.7, outerHeight/1.35]);
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

// Extract unique values from array of objects
function extractUniques(data, field) {
	var uniques = d3.set();

	data.forEach(function(d) {
		uniques.add(d[field]);
	});

	var uniques = uniques.values();

	return uniques;

};

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





