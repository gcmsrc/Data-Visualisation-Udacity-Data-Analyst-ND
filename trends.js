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

	// Define tooltip width
	var tooltipWidth = 80;

	// Define range for xScale
	xScale.rangeRoundBands([
		5 * padding.left,
		outerWidth - 3 * padding.right],
		0.05);

	// Define range for yScale
	yScale.range([innerHeight, 5 * padding.top]);

	// Upload data
	var data = d3.csv('dataset.csv', parse_Trend, function(data) {

		// Append xAxis
		area.append('g')
		    .attr('class', 'x axis')
		    .attr('transform', 'translate(0,' + (innerHeight + padding.bottom) + ')')

		// Append yAxis
		area.append('g')
		    .attr('class', 'y axis')
		    .attr('transform', 'translate(' + 4.5 * padding.left + ',0)')

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

			// Hide tooltip
			utility_ChangeClass('#tooltip', 'hidden', true);

			// Change tooltip width
			ttip_ChangeWidth(tooltipWidth);

			// Change title
		    utility_ChangeChartTitle('International Visitors to London (in Millions)');

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
				var top = innerHeight - 3.5 * padding.bottom;

				// Change tooltip position
				ttip_ChangePosition(left, top);

				// Change tooltip's title and value
				ttip_ChangeTitle(d.year);
				ttip_ChangeValue(format_Mill(d.visits, tooltip = true));

				// Make tooltip visible and change style
				utility_ChangeClass('#tooltip', 'hidden', false);
				utility_ChangeClass('#trend', 'hidden', false);
				
				// Change class of bar to highlight
				utility_ChangeClass(this, 'highlight', true);

		    })
		    .on('mouseout', function() {

		    	// Change tooltip class to hidden
		    	utility_ChangeClass('#tooltip', 'hidden', true);

		    	// Reset bar, i.e. remove highlight class
		    	utility_ChangeClass(this, 'highlight', false);

		    })
		};

		// Define function to render the second story
		function drawTrendTwo(data) {

			// Hide tooltip
			utility_ChangeClass('#tooltip', 'hidden', true);

			// Remove bars with transition
			area.selectAll('.bar')
				.transition()
				.duration(750)
				.attr('y', innerHeight)
				.attr('height', 0)
				.remove();

			// Change chart title
			utility_ChangeChartTitle('Purpose of International Visits to London (% of visitors)')

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
				 .innerTickSize(-innerWidth + 3 * padding.right)
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
			// Problem of JS taking precedence over CSS
			// http://stackoverflow.com/questions/15709304/d3-color-change-on-mouseover-using-classedactive-true
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