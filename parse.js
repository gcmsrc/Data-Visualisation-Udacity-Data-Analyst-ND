// UDACITY DAND - Data Visualisation - Giacomo Sarchioni

/*This JavaScript modules contains all the code for parsing the data
for the Data Analyst Nanodegree - Data Visualisation project.*/

// Parse trend data
function parse_Trend(data) {

	for (var key in data) {
		if (key != 'year') {
			data[key] = +data[key];
		};
	};
	return data;

};

// Parse map data
function parse_Map(data) {

	for (var key in data) {
		if (key == 'value') {
			data[key] = +data[key];
		};
	};
	return data;

};