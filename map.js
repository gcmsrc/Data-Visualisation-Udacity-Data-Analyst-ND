/// UDACITY DAND - Data Visualisation - Giacomo Sarchioni

/*This JavaScript modules contains the code for rendering the
visualisation of the final chart in the project (i.e. map)*/
function map() {

	// Remove all elements in area
	removeObjs('*');

	// Change title
	changeTitle('International Visitors to London by Country of Origin');

	// File downloaded from natural earth data as per Scott Murray
	// File was simplified with mapshaper
	// coropleth chapter from Scott Murray
	d3.csv('dataset_geo.csv', parseMap, function(data) {

		// Nesting by market, i.e. by country of origin
		// https://github.com/d3/d3-collection#nests
		var nested = extractNested(data);

		/*Convert nested values from array of objects to a single
		object, where keys are the years*/
		nested.forEach(function(obj) {
			
			newObj = {};

			obj.values.forEach(function(value) {
				newObj[value.year] = value.visits
			});

			// Replace array with object
			obj.values = newObj;

		});

		// Load geoJSON data
		d3.json('world_simple.json', function(json) {

			// Source Scott Murray choropleth
			json = addDataToMap(nested, json);
			
			// Bind data
			var countries = area.selectAll('path')
							    .data(json.features)
							    .enter()
							    .append('path')
							    .attr('d', mapPath)
							    .attr('class', 'map country');
			
			// Append year-box
			var year_box = area.append('text')
							   .attr('x', 4 * padding.right)
							   .attr('y', 0.88 * outerHeight)
							   .attr('class', 'map year')
							   .style('opacity', 0);

			// ** DO LATER **
			// Update and call xAxis
			// Append focus group (i.e. where the small line chart is going to be)
			var focus = area.append('g')
							.attr('id', 'focus')
							.attr('class', 'hidden map')
							.attr('transform', 'translate(' + 4 * padding.right + ',' + 0.63 * outerHeight + ')');




			
		})



	})

};