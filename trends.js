/// UDACITY DAND - Data Visualisation - Giacomo Sarchioni

/*This JavaScript modules contains the code for rendering the
visualisation of the first two charts in the project (i.e. Trends)*/

function trends(story) {

	// Remove any map
	removeObjs('.map');

	// Define tooltip width
	var tooltipWidth = 80;

	// Define range for xScale
	xScale.rangeRoundBands([
		5 * padding.left,
		outerWidth - 3 * padding.right],
		0.05);

	// Define range for yScale
	yScale.range([innerHeight, 6 * padding.top]);

	// Upload data
	var data = d3.csv('dataset.csv', parseTrends, function(data) {

		// Append x and y axis
		area.append('g')
		    .attr('class', 'x axis')
		    .attr('transform', 'translate(0,' + (innerHeight + padding.bottom) + ')')

		area.append('g')
		    .attr('class', 'y axis')
		    .attr('transform', 'translate(' + 4.5 * padding.left + ',0)')

		// Update axis
		xAxis.innerTickSize(0);
		yAxis.innerTickSize(0).ticks(4);

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
			removeObjs('.purpose');

			// Hide tooltip
			changeTooltipClass('hidden', true);

			// Change tooltip width
			changeTooltipWidth(tooltipWidth);

			// Change title
		    changeTitle('International Visitors to London (in Millions)');

		    // Update yScale domain and format, and call axis
		    yScale.domain([0, d3.max(data, function(d) {
		    	return d.visits;
		    })]);
		    yAxis.tickFormat(function(d) {return formatMillAxis(d);})
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
		    	barOver(d, d3.select(this), tooltipWidth);
		    })
		    .on('mouseout', function() {
		    	barOut(d3.select(this));
		    })
		};

		// Define function to render the second story
		function drawTrendTwo(data) {

			// Hide tooltip
			changeTooltipClass('hidden', true);

			// Remove bars with transition
			area.selectAll('.bar')
				.transition()
				.duration(750)
				.attr('y', innerHeight)
				.attr('height', 0)
				.remove();

			// Change chart title
			changeTitle('Purpose of International Visits to London (% of visitors)')

			// Create dataPurposes object
			// https://bl.ocks.org/mbostock/3884955
			var dataPurposes = createPurposesData(data);

			// Update trendColor scale domain
			trendColor.domain(dataPurposes.map(function(d) {return d.purpose; }))

			// Update yScale domain
			yScale.domain([0, extractMaxMax(dataPurposes)])

			// Update yAxis formatting and call it
			yAxis.ticks(4)
					 .tickFormat(function(d) {return formatPerc(d); })
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
				    .attr("stroke", function(d) { return trendColor(d.purpose); })
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
						return extractPurposeBoxY(purpose, d, 0);
					})
					.text(function(d) {
						var purpose = this.parentElement.classList[0];
						return extractPurposeName(purpose, d, 0);
					})
					.attr('fill', function(d) {
						return trendColor(d.purpose);
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
						return extractPurposePerc(d, d.values.length - 1);
					})
					.attr('fill', function(d) {
						return trendColor(d.purpose);
					})
					.style('opacity', 0)
					.transition()
					.duration(1500)
					.style('opacity', 1);

			// Add mouseover and mouseout effects when selecting purpose-box
			// Problem of JS taking precedence over CSS
			// http://stackoverflow.com/questions/15709304/d3-color-change-on-mouseover-using-classedactive-true
			area.selectAll('.purpose-box')
				.on('mouseover', purposeBoxOver)
				.on('mouseout', purposeBoxOut);
		}
	});
};