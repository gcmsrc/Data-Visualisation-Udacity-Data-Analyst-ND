"""

	This is the Python script I have used to parse and format the
	data on International Visitors to London. The original dataset
	is available at:
	
	https://data.london.gov.uk/dataset/number-international-visitors-london

	in csv format.

"""

import pandas as pd
import numpy as np

def upload_data(filename,
	   			replace_dict = {'Irish Republic' : 'Ireland',
                				'USA' : 'United States of America',
                				'Serbia' : 'Republic of Serbia',
                				'Hong Kong' : 'Hong Kong S.A.R.'}):

	"""

		This function loads the data from a csv file and replace
		some country names with the specified correct value.

		Args:
			- filename: a string, i.e. the path to the csv file
			- replace_dict: a Python dictionary

		Returns:
			- df: a pandas dataframe

	"""

	# Read dataset
	df = pd.read_csv('international-visitors-london-raw.csv')

	# Remove last column (sample size is not needed)
	df = df.iloc[:,:-1]

	# Fix country names
	replace_dict = {'Irish Republic' : 'Ireland',
	                'USA' : 'United States of America',
	                'Serbia' : 'Republic of Serbia',
	                'Hong Kong' : 'Hong Kong S.A.R.'}
	
	for old, new in replace_dict.items():
		df['market'] = df['market'].replace(old, new)

	return df

def group_df(df,
			 group_by = ['year', 'purpose'],
			 index = False):

	"""

		This function simply groups a dataframe by the fields
		provided and aggregates it by summing up the values.

		Args:
			- df: a pandas dataframe
			- group_by: a Pyhon list, i.e. the fields (in order) on
						which to group by.
			- index: a Boolean, i.e. whethere the fields used to group
					 the dataframe should be added to as indexes.

		Returns:
			- df: a pandas dataframe

	"""

	# Grouped the dataframe
	df = df.groupby(group_by, as_index = index)
	df = df.aggregate(np.sum)

	return df

def geo_df(filename, output='dataset_geo.csv'):

	"""

		This is a simple script to return a csv file that reports the
		total number of visitors to London by country of origin, by
		year.
		Please notice that all entries belonging to an invalid country
		are dropped, e.g. "Other Eastern Europe".

		Args:
			- filename: a string, i.e. the name of the file
			- output: a string, i.e. the name of the file to save

		Returns:
			- save a csv file in the current directory

	"""

	df = upload_data(filename)

	df_geo = df.groupby(['market', 'year'], as_index=False)
	df_geo = df_geo.aggregate(np.sum)

	# Keep only market, year and visits columns
	df_geo = df_geo.iloc[:,:3]

	# Remove 'Other xxx' countries
	df_geo = df_geo[~df_geo['market'].str.contains('Other')]

	# Rename columns
	df_geo.columns = ['market', 'year', 'value']

	df_geo.to_csv(output, index=False)


def pivot_df(df):

	"""

		This function does indeed some magic!
		It pivots the dataframe so that purposes become column names,
		i.e. every row contains the data for a specific year (e.g. 
		2002) with five columns corresponding to the five purpose
		categories. It then adds a field called 'visits' which is
		simply the horizontal sum, i.e. total visitors in that year.

		Args:
			- df: a pandas dataframe

		Returns:
			- df: a pandas dataframe

	"""
	# Pivot the dataframe
	df = df.pivot(index = 'year',
				  columns = 'purpose',
				  values = 'visits')

	# Add the total visits
	df.loc[:,'visits'] = df.sum(axis = 1)

	return df

def add_purpose_perc(df, adder = '_perc'):

	"""

		This function replaces the purpose columns with their
		percentage values (over the total number of visits).

		Args:
			- df: a pandas dataframe


		Returns:
			- df: a pandas dataframe

	"""

	for i, _ in enumerate(df.columns[:-1]):
		df.iloc[:, i] = df.apply(lambda x: x[i] / x[5], axis =1)

	# reset indexes
	df = df.reset_index()

	return df

## Main function
if __name__ == "__main__":

	# Upload
	df = upload_data('international-visitors-london-raw.csv')

	# Group
	df = group_df(df)
	
	# Pivot
	df = pivot_df(df)
	
	# Add percentage
	df = add_purpose_perc(df)
	
	# Save to csv
	df.to_csv('dataset.csv', index=False)

	# Save to csv the geo_df
	geo_df('international-visitors-london-raw.csv')
