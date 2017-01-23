// UDACITY DAND - Data Visualisation - Giacomo Sarchioni

/*This JavaScript modules contains all the code for extracting
data on the Data Analyst Nanodegree - Data Visualisation project.*/

// Extract max value of the max values in an object
function extract_MaxMax(data) {
	return d3.max(data, function(d) {
		return d3.max(d.values, function(d) {
			return d.value;
		});
	});
};

// Extract purpose percentage
function extract_PurposePerc(datum, index) {
	return format_Perc(datum.values[index].value);
};

// Extract years from geo dataset
function extract_Years(data) {

	// Use a for loop and an empty set
	years = d3.set();

	data.forEach(function(d) {
		years.add(d.year);
	})

	return years.values();
};

// Extract data of a specific country
function extract_CountryData(countries, country) {

	// Return visitors array for a given country
	var filterData = countries.filter(function(d) {
						return d.properties.name == country;
					 });
	
	// Return data only if there are visitors values.
	if(filterData.data()[0].properties.visitors) {
		return filterData.data()[0].properties.visitors;
	};
};