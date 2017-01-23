/// UDACITY DAND - Data Visualisation - Giacomo Sarchioni

/*This JavaScript modules contains the code for rendering the
visualisation of the final chart in the project (i.e. map)*/
function map() {

	// Remove all elements in area
	removeObjs('*');

	// Change tooltipWidth to 200 px
	changeTooltipWidth(200);

	// Change title
	changeTitle('International Visitors to London by Country of Origin');

	// Append yearBox
	var yearBox = appendYearBox();
	
	// Append legend
	//http://bl.ocks.org/lucguillemot/37cc6eccbdd365556feb
	var legend = appendLegend();

	// File downloaded from natural earth data as per Scott Murray
	// File was simplified with mapshaper
	// coropleth chapter from Scott Murray
	d3.csv('dataset_geo.csv', parseMap, function(data) {

		// Extract years
		var years = extractYears(data);

		// Add initial text to yearBox
		yearBox.text(years[0]);

		// Update yearBox scale
		updateYearBoxScale(yearBox, years);

		// Nesting by market, i.e. by country of origin
		// https://github.com/d3/d3-collection#nests
		var nested = extractNested(data);
		
		/*Update mapColor domain (max is the maximum number of 
		international visitors from a country throughout history)*/
		mapColor.domain([0, roundUpThousand(extractMaxMax(nested))]);
		
		// Format legend
		formatLegend(legend);

		/*Convert nested values from array of objects to a single
		object, where keys are the years*/
		nested.forEach(function(obj) {
			
			newObj = {};

			obj.values.forEach(function(d) {
				newObj[d.year] = d.value;
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

			// Start with the first year						 
			updateMap(countries, yearBox, years[0]);

			// Add yearBox mousemove effect
			yearBox.on('mousemove', function() {

				yearBoxMove(yearBox, d3.mouse(this), countries);

			});

		})



	})

};