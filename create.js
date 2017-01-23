// UDACITY DAND - Data Visualisation - Giacomo Sarchioni

/*This JavaScript modules contains all the code for creating objects
for the Data Analyst Nanodegree - Data Visualisation project.*/

// Create nested data, i.e. visits by country
function create_Nested(data) {

	return d3.nest()
			 .key(function(d) {
			 	return d.market;
			 })
			 .entries(data);

};

// Create Purpose Data, i.e. for each purpose, I create an array of objects.
function create_PurposesData(data) {

	var dataPurposes = Object.keys(data[0]).slice(1,6).map(function(purpose) {
		return {
			purpose: purpose,
			values: data.map(function(d) {
				return {
					year: d.year,
					value: d[purpose]
				};
			})
		}
	});;

	return dataPurposes;
};