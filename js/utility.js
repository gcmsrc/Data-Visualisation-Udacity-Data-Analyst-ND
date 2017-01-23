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

// Change comment text
function utility_ChangeComment(newText) {

	// Remove existing text
	chart.select('.comment').selectAll('text').remove();
	
	newText = newText.split('<br>');

	for (var i = 0; i < newText.length; i++) {

		chart.select('.comment')
			 .append('text')
			 .text(newText[i])
			 .attr('transform', 'translate(0' + ',' + (i * 15) + ')')
			 .style("text-anchor", "start");
	};
};

// Change axis label text
function utility_ChangeLabel(newText) {

	chart.select('.label').text(newText);

};

// Change subtitle text
function utility_ChangeSubtitle(newText) {

	chart.select('.subtitle').text(newText);

};

// InterpolateBlues
function utility_ColorMapInterpolate(value, legend = false) {

	if(legend) {
		return d3.interpolateBlues(legendColor(value));
	} else {
		return d3.interpolateBlues(mapColor(value));
	};

};

function utility_FillButton(index) {
	
	chart.selectAll('.button')
	    .style('fill', function(d, i) {
	    	if(i==index) {
	    		return '#666666';
	    	} else {
	    		return '#b2b2b2';
	    	};
	    });
};

// Remove specific ojects from area
function utility_RemoveObjs(objects) {
	area.selectAll(objects).remove();
};