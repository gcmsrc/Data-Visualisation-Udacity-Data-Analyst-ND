// UDACITY DAND - Data Visualisation - Giacomo Sarchioni

/*This JavaScript modules contains all the code for manaing the
tooltips on the Data Analyst Nanodegree - Data Visualisation project.*/

function ttip_ChangeTitle(newTitle) {
	d3.select('#tooltip-title')
	  .text(newTitle);
};

// Change tooltip value
function ttip_ChangeValue(newValue) {
	d3.select('#tooltip-value')
	  .text(newValue);
};

// Change tooltip width
function ttip_ChangeWidth(newValue) {
	d3.select('#tooltip')
	  .style('width', newValue + 'px');
};

// Change tooltip position
function ttip_ChangePosition(left, top) {
	d3.select('#tooltip')
	  .style('left', left + 'px')
	  .style('top', top + 'px');
};