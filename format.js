// UDACITY DAND - Data Visualisation - Giacomo Sarchioni

/*This JavaScript modules contains all the code for formatting data
for the Data Analyst Nanodegree - Data Visualisation project.*/

// Two decimal numbers
var format_Dec = d3.format('.2f');

// Integer with thousand-separing comma
var format_Int = d3.format(',.0f');

// Percentage
var format_Perc = d3.format(',%');

// Format millions (formatting different if for tooltip)
function format_Mill(value, tooltip = false) {
	if(tooltip) {
		return format_Dec(parseFloat(value) / 1e3) + ' M';
	} else {
		return format_Int(parseFloat(value) / 1e3) + ' M';
	};
};

// Format thousands into units
function format_Units(value) {

	return format_Int(parseFloat(value) * 1e3);

};

/*http://bl.ocks.org/eesur/4e0a69d57d3bfc8a82c2*/
// Move selected object to front
d3.selection.prototype.format_MoveToFront = function() { 

	return this.each(function() {
        this.parentNode.appendChild(this);
    });

};

// Format purposeBox Y ad-hoc
function format_PurposeBoxY(purpose, datum, index) {

	if (purpose == 'Business') {

		return yScale(datum.values[index].value) + 25;

	} else if (purpose == 'VFR') {

		return yScale(datum.values[index].value) - 25;

	} else {

		return yScale(datum.values[index].value) - 15;

	};
};

/*Round up to the next hundredth thousand for a value expressed 
in thousands*/
function format_RoundUpThousand(value) {

	return Math.ceil(value / 1e2) * 1e2;

};