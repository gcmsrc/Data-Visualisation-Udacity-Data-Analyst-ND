/// UDACITY DAND - Data Visualisation - Giacomo Sarchioni

/*This JavaScript modules contains the code for rendering the
visualisation of the first two charts in the project (i.e. Trends)*/

function trends(story) {

	// Remove any map
	utility_RemoveObjs('.map');

	// Change tooltip classes
	utility_ChangeClass('#tooltip', 'trend', true);
	utility_ChangeClass('#tooltip', 'map', false);
	utility_ChangeClass('#tooltip', 'hidden', true);

	// Define range for xScale
	xScale.rangeRoundBands([
		7 * padding.left,
		outerWidth - 3 * padding.right],
		0.05);

	// Define range for yScale
	yScale.range([innerHeight, 5 * padding.top]);

	// Append xAxis
	area.append('g')
	    .attr('class', 'x axis')
	    .attr('transform', 'translate(0,' + (innerHeight + padding.bottom) + ')')

	// Append yAxis
	area.append('g')
	    .attr('class', 'y axis')
	    .attr('transform', 'translate(' + (6.5 * padding.left) + ',0)')

	// Append yAxis label
	area.append('g')
		.attr('transform', 'translate(' + (4 * padding.left) + ',' + (innerHeight + 5) + ')rotate(-90)')
		.append('text')
		.attr('class', 'axis label');

	// Upload data
	var data = d3.csv('data/dataset.csv', parse_Trend, function(data) {
		
		// Update xScale domain and call axis
		xScale.domain(data.map(function(d) {return d.year; }));
		xAxis.scale(xScale);
		area.select('.x').call(xAxis)

		// Choose story to render based on input
		if(story==1) {

			drawTrendOne(data);

		} else {

			drawTrendTwo(data);

		};

		// Define function to render first trend story
		function drawTrendOne(data) {

			// Remove object from second trend, i.e. purpose (if any)
			utility_RemoveObjs('.purpose');

			// Change fill of button
			utility_FillButton(0);

			// Define tooltip width and height
			var tooltipWidth = 100;	
			var tooltipHeight = 60;

			// Update subtitle
			utility_ChangeSubtitle('Growing number of international visitors')

			// Change comment
			utility_ChangeComment('The number of visitors coming to London from abroad has been increasing steadily<br>' +
				'over the last decade. In 2015, more than 18 millions people visited<br>' +
				'the British capital, a 60% increased compared to 2002.');

			// Change axis label
			utility_ChangeLabel('International visitors (millions)');

		    // Update yScale domain and format, and call axis
		    yScale.domain([0, d3.max(data, function(d) {
		    	return d.visits;
		    })]);
		    yAxis.tickFormat(function(d) {return format_Mill(d);})
		    	 .innerTickSize(0)
		         .scale(yScale);
		    area.select('.y').call(yAxis);

		    // Bind data
		    var bars = area.selectAll('rect')
		    			   .data(data)

		    bars.enter()
		        .append('rect')
		        .attr('class', 'bar')
		        .attr('width', xScale.rangeBand())
		        .attr('height', 0)
		        .attr('x', function(d) {
		        	return xScale(d.year);
		        })
		        .attr('y', innerHeight)
		        // add transition
		        .transition()
		        .delay(function(d, i) {
		        	return i / (data.length - 1) * 500;
		        })
		        .duration(500)
		        .attr('y', function(d) {
		        	return yScale(d.visits)
		        })
		        .attr('height', function(d) {
		        	return innerHeight - yScale(d.visits);
		        });
		    
		    // Add mouseover and mouseout effects
		    bars.on('mouseover', function(d) {
		    	
		    	// Extract x position
				var xPos = this.getAttribute('x');
				
				// Calculate left and top for tooltip
				var left = xPos - (tooltipWidth - xScale.rangeBand()) / 2
				var top = innerHeight - 3.7 * padding.bottom;
				
				// Change class of bar to highlight
				utility_ChangeClass(this, 'highlight', true);

				// Append trend tooltip
				area.append('g')
					.attr('id', 'tooltip')
					.attr('class', 'trend')
					.attr('transform', 'translate(' + left + ',' + top + ')')
					.append('rect')
					.attr('class', 'ttip-trend-container')
					.attr('width', tooltipWidth)
					.attr('height', tooltipHeight)
					.attr('rx', 10)
					.attr('ry', 10)

				// Append year to tooltip
				area.select('#tooltip')
					.append('text')
					.attr('class', 'ttip-trend-year')
					.attr('x', tooltipWidth / 2)
					.attr('y', 1 / 3 * tooltipHeight)
					.text(d.year)
					.style('text-anchor', 'middle')
					.style('alignment-baseline', 'middle');

				// Append value to tooltip
				area.select('#tooltip')
					.append('text')
					.attr('class', 'ttip-trend-value')
					.attr('x', tooltipWidth / 2)
					.attr('y', 2 / 3 * tooltipHeight)
					.text(format_Mill(d.visits, tooltip = true))
					.style('text-anchor', 'middle')
					.style('alignment-baseline', 'middle');

		    })
		    .on('mouseout', function() {

		    	// Remove tooltip
		    	utility_RemoveObjs('#tooltip');

		    	// Reset bar, i.e. remove highlight class
		    	utility_ChangeClass(this, 'highlight', false);

		    });

		};

		// Define function to render the second story
		function drawTrendTwo(data) {

			// Change fill of button
			utility_FillButton(1);

			// Update subtitle
			utility_ChangeSubtitle('A holiday destination')

			// Change comment
			utility_ChangeComment('For the majority of international visitors, London remains a holiday destination.<br>' +
				'Contrarily to expectations, only 20% of international visitors to London do<br>' +
				'actually travel for business reasons.');

			// Change axis label
			utility_ChangeLabel('Purpose of visit (%)');

			// Remove bars with transition (and remove pointer-events)
			area.selectAll('.bar')
				.style('pointer-events', 'none')
				.transition()
				.duration(750)
				.attr('y', innerHeight)
				.attr('height', 0)
				.remove();

			// Create dataPurposes object
			// https://bl.ocks.org/mbostock/3884955
			var dataPurposes = create_PurposesData(data);

			// Update trendColor scale domain
			purposeColor.domain(dataPurposes.map(function(d) {return d.purpose; }))

			// Update yScale domain
			yScale.domain([0, extract_MaxMax(dataPurposes)])

			// Update yAxis formatting and call it
			yAxis.ticks(3)
				 .tickFormat(function(d) {return format_Perc(d); })
				 .innerTickSize(-innerWidth + 8.5 * padding.right)
				 .scale(yScale);
			area.select('.y').call(yAxis);

			// Bind data
			var purposes = area.selectAll('.purpose')
						       .data(dataPurposes)
						       .enter()
						       .append('g')
						       .attr('class', function(d) {

						       		return d.purpose + ' purpose'

						       });

			// Add line with animation
			//https://css-tricks.com/svg-line-animation-works/
			purposes.append("path")
				    .attr("class", 'line')
				    .attr("d", function(d) {

				    	return line(d.values); 

				    })
				    .attr("stroke", function(d) {

				    	return purposeColor(d.purpose);

				    })
				    .style("stroke-dasharray", innerWidth)
				    .style('stroke-dashoffset', innerWidth)
				    .transition()
				    .duration(1500)
				    .style('stroke-dashoffset', 0);

			// http://bl.ocks.org/d3noob/8603837
			// Add text at the beginning of the line
			purposes.append('text')
					.attr('class', 'purpose-box')
					.attr('x', function(d) {

						return xScale(d.values[0].year) + xScale.rangeBand() / 2;

					})
					.attr('y', function(d) {

						var purpose = this.parentElement.classList[0];
						return format_PurposeBoxY(purpose, d, 0);

					})
					.text(function(d) {

						var purpose = this.parentElement.classList[0];
						return convert_PurposeName(purpose, d);

					})
					.attr('fill', function(d) {

						return purposeColor(d.purpose);

					})
					.style('opacity', 0)
					.transition()
					.duration(1500)
					.style('opacity', 1);

			// Add text at the end of the line
			purposes.append('text')
					.attr('class', 'percentage-box')
					.attr('x', function(d) {

						return xScale(d.values[d.values.length - 1].year) + 35;

					})
					.attr('y', function(d) {

						var purpose = this.parentElement.classList[0];
						return yScale(d.values[d.values.length - 1].value);

					})
					.text(function(d) {

						// Extarct precentage of last value
						return extract_PurposePerc(d, d.values.length - 1);

					})
					.attr('fill', function(d) {return purposeColor(d.purpose); })
					.style('opacity', 0)
					.transition()
					.duration(1500)
					.style('opacity', 1);

			// Add mouseover and mouseout effects when selecting purpose-box
			area.selectAll('.purpose-box')
				.on('mouseover', function() {

					// Move selection to front
					d3.select(this.parentElement).format_MoveToFront();

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

				})
				.on('mouseout', function() {

					utility_ChangeClassAll('.purpose', 'unfocused', false);
					utility_ChangeClassAll('.purpose', 'focused', false);

				});
		}
	});
};