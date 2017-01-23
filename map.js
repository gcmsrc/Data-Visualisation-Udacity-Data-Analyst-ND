/// UDACITY DAND - Data Visualisation - Giacomo Sarchioni

/*This JavaScript modules contains the code for rendering the
visualisation of the final chart in the project (i.e. map)*/
function map() {

	// Remove all elements in area
	utility_RemoveObjs('*');

	// Change tooltip classes
	utility_ChangeClass('#tooltip', 'trend', false);
	utility_ChangeClass('#tooltip', 'map', true);

	// Change tooltipWidth to 200 px
	ttip_ChangeWidth(200);

	// Change tooltip position
	ttip_ChangePosition(5.2 * padding.right, 0.65 * outerHeight);

	// Make tooltip title and value empty
	ttip_ChangeTitle('');
	ttip_ChangeValue('');

	// Change title
	utility_ChangeChartTitle('International Visitors to London by Country of Origin');

	// Append yearBox
	var yearBox = area.append('text')
	   				  .attr('x', 5.2 * padding.right)
	   				  .attr('y', 0.88 * outerHeight)
	   				  .attr('class', 'map year')

	//http://bl.ocks.org/lucguillemot/37cc6eccbdd365556feb
	// Format legend
	legend_Add();

	// Append focus
	var focus = area.append('g')
	  				.attr('id', 'focus')
	  				.attr('class', 'map hidden')
	  				.attr('transform', 'translate(' + (5.2 * padding.right) + ',' + (0.6 * outerHeight) + ')');

	// File downloaded from natural earth data as per Scott Murray
	// File was simplified with mapshaper
	// coropleth chapter from Scott Murray
	d3.csv('dataset_geo.csv', parse_Map, function(data) {
		
		// Extract years
		var years = extract_Years(data);

		// Add first year to text of yearBox
		yearBox.text(years[0]);

		// Get BBox of yearBox
		var box = yearBox.node().getBBox();

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
		// https://github.com/d3/d3-collection#nests
		var nested = d3.nest()
			 		  .key(function(d) {
			 		  	return d.market;
			 		  })
			 		  .entries(data);
		
		/*Update mapColor domain (max is the maximum number of 
		international visitors from a country throughout history)*/
		mapColor.domain([0, format_RoundUpThousand(extract_MaxMax(nested))]);
		
		/*Convert nested values from array of objects to a single
		object, where keys are represented by the years*/
		var nested = convert_NestedToObject(nested);
		
		// Load geoJSON data
		d3.json('world_simple.json', function(json) {

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

				// Update focus and tooltip content
				if(d3.select('#tooltip-value').node().textContent != '') {
					
					// Extract name of country in tooltip
					var country = d3.select('#tooltip-title').node().textContent;

					// Extract country data
					var countryData = extract_CountryData(countries, country);

					// Update tooltip-value
					d3.select('#tooltip-value')
					  .transition()
					  .duration(500)
					  .text(function() {

					  	if(countryData[year]) {

					  		return format_Units(countryData[year]);

					  	} else {

					  		return 'N/A';
					  	};

					  });
				};

				// Update circle
				if(focus.select('circle').node()) {
					
					focus.select('circle')
					     .transition()
					     .duration(50)
					     .attr('cx', xScale(year) + xScale.rangeBand()/2)
					     .call(function() {
					     	
					     	// Extract countryData
					     	var state = d3.select('#tooltip-title').node().textContent;
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
				};

				// Add countries mouseover and click effect
				countries.on('mouseover', function(d) {

							if(d.properties.visitors) {

								if(d.properties.visitors[year]) {

									// Change the cursor
									d3.select(this).style('cursor', 'pointer');
								};
							};
						  })
						  .on('click', function(d) {

						  	//http://bl.ocks.org/d3noob/5d621a60e2d1d02086bf
							// Define previous clicked country (default is null)

							if(d3.select('#tooltip-title').node().textContent != '') {

								var previousCountry = d3.select('#tooltip-title')[0][0].textContent;

							} else {

								var previousCountry = null;

							};

							// Extract clicked state
							var clickedCountry= d.properties.name;
							
							// Extract countryData
							var countryData = extract_CountryData(countries, clickedCountry)
							
							// Convert countryData
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
							d3.select('.focus-y').call(yFocusAxis);

							// Change focus and tooltip based on country value
							if(clickedCountry == previousCountry) {

								// Make tooltip invisible
								utility_ChangeClass('#tooltip', 'hidden', true);

								// Make focus invisible
								utility_ChangeClass('#focus', 'hidden', true);

								// Make tooltip title and value null
								ttip_ChangeTitle('');
								ttip_ChangeValue('');

								// Remove circle
								utility_RemoveObjs('.focus-circle');


							} else {

								if(d.properties.visitors) {

									// Check if value for that year is available
									if(d.properties.visitors[year]) {

										// Change tooltip title and value
										ttip_ChangeTitle(clickedCountry);
										ttip_ChangeValue(format_Units(d.properties.visitors[year]));

										// Logic to display tooltip
										if(previousCountry != clickedCountry) {		

											// Remove any existing focus line
											utility_RemoveObjs('.focus-line');

											// Remove any existing focus circle
											utility_RemoveObjs('.focus-circle');

											// Make tooltip visible
											utility_ChangeClass('#tooltip', 'hidden', false);

											// Make focus visible
											utility_ChangeClass('#focus', 'hidden', false);

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
									};
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