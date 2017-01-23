// UDACITY DAND - Data Visualisation - Giacomo Sarchioni

/*This JavaScript modules contains all the code for adding a legend to
the map of the Data Analyst Nanodegree - Data Visualisation project.*/

// Add legend
function legend_Add() {

	// Append legend to area
	var legend = area.append('g')
					 .attr('class', 'map legend')
					 .attr('transform', 'translate(' + (5.2 * padding.right) + ',' + (0.88 * outerHeight + 25) + ')');

	// Define legendData
	var legendData = [];
	for (var i = 0; i < 150; i += 1) {
		legendData.push(i);
	};

	// Update legend scale
	legendColor.domain([0, legendData.length - 1]);
	
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
		  	return utility_ColorMapInterpolate(i, true);
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
		  .text(format_Units(mapColor.domain()[1]))
		  .attr("transform","translate(" + 150 +',' + 30 + ')');

};