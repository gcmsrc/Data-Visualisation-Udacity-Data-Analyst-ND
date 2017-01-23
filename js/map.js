/// UDACITY DAND - Data Visualisation - Giacomo Sarchioni

/*This JavaScript modules contains the code for rendering the
visualisation of the final chart in the project (i.e. map)*/
function map() {

	// Remove all elements in area
	utility_RemoveObjs('*');

	// Define tooltipHeight
	var tooltipHeight = 50;

	// Append map tooltip
	area.append('g')
		.attr('id', 'tooltip')
		.attr('class', 'map')
		.attr('transform', 'translate(' + (5 * padding.right) + ',' + (0.74 * innerHeight) + ')')
		.append('rect')
		.attr('class', 'ttip-map-container')
		.attr('height', tooltipHeight);

	// Change fill of button
	utility_FillButton(2);

	// Update subtitle
	utility_ChangeSubtitle('Fewer from USA, more from Europe')

	// Change comment
	utility_ChangeComment('The number of visitors travelling to London<br>'
		+ 'from the USA has diminished, while those<br>'
		+  'from Europe have increased<br><br>'
		+ 'Click on a country and/or mouse over<br>'
		+ 'the year to interact with the chart.');

	// Append yearBox
	var yearBox = area.append('text')
	   				  .attr('x', 5 * padding.right)
	   				  .attr('y', 0.86 * outerHeight)
	   				  .attr('class', 'map year')

	// Append focus
	var focus = area.append('g')
	  				.attr('id', 'focus')
	  				.attr('class', 'map')
	  				.attr('transform', 'translate(' + (5 * padding.right) + ',' + (0.58 * outerHeight) + ')');

	d3.csv('data/dataset_geo.csv', parse_Map, function(data) {

		// Extract years
		var years = extract_Years(data);

		// Add first year to text of yearBox
		yearBox.text(years[0]);

		// Get BBox of yearBox
		var box = yearBox.node().getBBox();

		// Update tooltip width
		area.select('.ttip-trend-container').attr('width', box.width);

		// Append country name to tooltip
		area.select('#tooltip')
			.append('text')
			.attr('class', 'ttip-map-country')
			.attr('x', 0)
			.attr('y', 1 / 3 * tooltipHeight)
			.style('alignment-baseline', 'middle');
	
		// Append value to tooltip
		area.select('#tooltip')
			.append('text')
			.attr('class', 'ttip-map-value')
			.attr('x', 0)
			.attr('y', 3 / 4 * tooltipHeight)
			.style('alignment-baseline', 'middle');

		// Define domain and range of yearBoxScale
		yearBoxScale.domain([years[0], years[years.length - 1]])
			 	    .range([box.x + 5, box.x + box.width - 20]);

		// Update xScale
		xScale.rangeRoundBands([5, box.width], 0.05);

		// Append xAxis
		focus.append('g').attr('class', 'axis focus-x');

		// Call xScale on xAxis
		xFocusAxis.tickValues([years[0], years[years.length - 1]])
		          .scale(xScale);
		focus.select('.focus-x').call(xFocusAxis);

		// Update yScale
		yScale.range([-30, 0]);

		// Append yAxis
		focus.append('g').attr('class', 'axis focus-y');

		// Nesting by market, i.e. by country of origin
		var nested = d3.nest()
			 		  .key(function(d) {
			 		  	return d.market;
			 		  })
			 		  .entries(data);
		
		/*Update mapColor domain (max is the maximum number of 
		international visitors from a country throughout history)*/
		mapColor.domain([0, format_RoundUpThousand(extract_MaxMax(nested))]);

		// Format legend
		legend_Add();
		
		/*Convert nested values from array of objects to a single
		object, where keys are represented by the years*/
		var nested = convert_NestedToObject(nested);
		
		// Load geoJSON data
		d3.json('data/world_simple.json', function(json) {

			// Add data to map as per Scott Murray choropleth
			for (var i = 0; i < nested.length; i++) {

				var dataCountry = nested[i].key;
				var dataValues = nested[i].values;
				
				for (var j = 0; j < json.features.length; j++) {
									
					var mapCountry = json.features[j].properties.name;

					if (dataCountry == mapCountry) {

						json.features[j].properties.visitors = dataValues;
						break;
					}
				}
			};
			
			// Bind data
			var countries = area.selectAll('path')
							    .data(json.features)
							    .enter()
							    .append('path')
							    .attr('d', mapPath)
							    .attr('class', 'map country');

			// Change tooltip value based on countryData
			function newTtipValue(countryData, year) {

				if(countryData[year]) {

					return format_Units(countryData[year]);

				} else {

					return 'N/A';

				}
			};

			// Create focus mini chart, i.e. a line chart with a circle for a given year
			function appendFocusChart(country, year) {
				
				// Remove any existing focus line
				utility_RemoveObjs('.focus-line');

				// Remove any existing focus circle
				utility_RemoveObjs('.focus-circle');

				// Extract countryData
				var countryData = extract_CountryData(countries, country);

				// Change tooltip value
				area.select('.ttip-map-value')
					.text(newTtipValue(countryData, year));

				// Convert to focusData
				var focusData = convert_CountryData(countryData);

				// Update yScale
				yScale.domain([
						d3.max(focusData, function(d) {
							return d.value;
						}),
						d3.min(focusData, function(d) {
							return d.value;
						})]);
				
				// Update yAxis scale
				yFocusAxis.scale(yScale)

				// Call yAxis
				focus.select('.focus-y').call(yFocusAxis);

				// Append focus line
				focus.append('path')
					 .attr('d', line(focusData))
					 .attr('class', 'focus-line');

				// Append circle
				focus.append('circle')
					 .attr('r', 4)
					 .attr('class', 'focus-circle')
					 .attr('cx', function() {
					 	
					 	return xScale(year) + xScale.rangeBand() / 2;

					 })
					 .attr('cy', function() {
					 	
					 	return yScale(countryData[year])

					 });
			};

			// Start with the US
			area.select('.ttip-map-country')
				.text('United States of America');
			
			// Append focusChart
			appendFocusChart(area.select('.ttip-map-country').text(), years[0]);

			// Initialise chart
			updateMap(years[0]);

			function updateMap(year) {

				// Transition country fills
				countries.transition()
						 .duration(50)
						 .style('fill', function(d) {

						 	if(d.properties.visitors) {

						 		if(d.properties.visitors[year]) {

						 			return utility_ColorMapInterpolate(d.properties.visitors[year]);
			 					};
			 				};
			 			 });

				// Transition yearBox value
				yearBox.transition()
					   .duration(50)
					   .text(year);
	
				// Extract name of country in tooltip
				var country = area.select('.ttip-map-country').text();

				// Extract country data
				var countryData = extract_CountryData(countries, country);

				// Update tooltip-value
				area.select('.ttip-map-value')
				    .transition()
				    .duration(500)
				    .text(newTtipValue(countryData, year));
			
				// Update circle
				focus.select('.focus-circle')
				     .transition()
				     .duration(50)
				     .attr('cx', xScale(year) + xScale.rangeBand()/2)
				     .call(function() {

				     	// Extract countryData
				     	var state = area.select('.ttip-map-country').text();
				     	var countryData = extract_CountryData(countries, state)

					     	if(countryData[year]) {
					     		
					     		// Change circle position
					     		this.attr('cy', yScale(countryData[year]));

					     		// Change circle fill
					     		this.style('fill', 'red');

					     	} else {
					     		
					     		// Change circle fill
					     		this.style('fill', 'white');

					     	}
					     });

				// Add countries mouseover and click effect
				countries.on('mouseover', function(d) {

							if(d.properties.visitors) {
									
								// Change the cursor
								d3.select(this).style('cursor', 'pointer');

							};

						  })
						  .on('click', function(d) {

						  	if(d.properties.visitors) {

						  		// Define previous country value
							  	var previousCountry = area.select('.ttip-map-country').text();

								// Extract clicked state
								var clickedCountry= d.properties.name;

								// Change tooltip title
								area.select('.ttip-map-country')
									.text(clickedCountry);

								// Change focus and tooltip based on country value
								if(clickedCountry != previousCountry) {

									appendFocusChart(clickedCountry, year);
									
								};
							};

						  });
			};

			// Add yearBox mousemove effect
			yearBox.on('mousemove', function() {

				// Cancel current transition if any
				area.transition().duration(0);

				// Extract year using yearBoxScale
				var yearValue = Math.round(yearBoxScale.invert(d3.mouse(this)[0]));

				// Trim yearValue
				if(yearValue < years[0]) {

					yearValue = years[0];

				} else if (yearValue > years[years.length - 1]) {

					yearValue = years[years.length -1];

				} else {

					// Conver number to string
					yearValue = yearValue.toString();

				};

				// Change text of yearBox
				yearBox.transition()
				       .duration(150)
				       .text(yearValue);

				// Update map
				updateMap(yearValue);
			});
		});
	});
};