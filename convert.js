// UDACITY DAND - Data Visualisation - Giacomo Sarchioni

/*This JavaScript modules contains all the code for converting objects
for the Data Analyst Nanodegree - Data Visualisation project.*/

// Convert countryData into an object format
function convert_CountryData(countryData) {

	return Object.keys(countryData)
				 .map(function(key) {
				 	return {
				 		'year': key,
				 		'value': countryData[key]
				 	};
				 });

};

function convert_NestedToObject(nested) {

	nested.forEach(function(obj) {

		newObj = {};

		obj.values.forEach(function(d) {

			newObj[d.year] = d.value;

		});

		// Replace array with object
		obj.values = newObj;

	});

	return nested;

}

// Convert Purpose Name ad-hoc
function convert_PurposeName(purpose, datum) {

	if(purpose == 'VFR') {
		return 'Visiting friends and relatives'
 	} else {
 		return datum.purpose;
 	};

};