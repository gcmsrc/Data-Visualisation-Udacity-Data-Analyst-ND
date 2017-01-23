// UDACITY DAND - Data Visualisation - Giacomo Sarchioni

/*This JavaScript modules contains all the code for performing
administartive action on the Data Analyst Nanodegree - Data Visualisation project.*/

// Change class of a specific object
function utility_ChangeClass(object, className, boolean) {

	d3.select(object).classed(className, boolean);

};

// Change class of all objects specified
function utility_ChangeClassAll(objects, className, boolean) {

	d3.selectAll(objects).classed(className, boolean);
	
};

// Change chart title
function utility_ChangeChartTitle(newTitle) {
	
	chart.select('#title')
		 .select('text')
		 .text(newTitle);

}

// InterpolateBlues
function utility_ColorMapInterpolate(value, legend = false) {

	if(legend) {
		return d3.interpolateBlues(legendColor(value));
	} else {
		return d3.interpolateBlues(mapColor(value));
	};

};

// Remove specific ojects from area
function utility_RemoveObjs(objects) {
	area.selectAll(objects).remove();
};