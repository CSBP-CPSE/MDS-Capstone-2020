## PHU analysis

### Proximity Data Preparation

1. Clean the Proximity Measures Database for manipulation in QGIS and in preparation for aggregation.

Type | Name
--|--
Script | proximity_data_prep.ipynb
Input files | PMD-en.csv
Output file | proximity_data_prep_forQGIS.csv

The Proximity Measures Database was downloaded from [Statistics Canada](https://www150.statcan.gc.ca/n1/pub/17-26-0002/2020001/csv/pmd-eng.zip).

2. Aggregate the proximity data from the dissemination block (DB) to the Public Health Unit (PHU) level.

Type | Name
--|--
Script | proximity_data_aggregation.ipynb
Input files | <ul><li>Joined_DB_to_PHU.csv</li><li>proximity_data_prep_forQGIS.csv</li></ul>
Output file | proximity_data_aggregated.csv

The proximity data were aggregated from the DB to the PHU level using 2 methods. In method 1, the proximity value for each PHU was taken to be the sum of the population weighted proximity measures of the DBs. In method 2, the proximity value for each PHU was taken to be the median proximity values at the DB level. The amenity score of the PHU was taken to be the mean of the amenity scores of the DBs.


### Comorbidity Data Preparation

Type | Name
--|--
Script | comorbidity_data_prep.ipynb
Input files | 13100113.csv
Output file | <ul><li>comorbidity_data_percent.csv</li><li>comorbidity_data_num.csv</li></ul>

The Health characteristics, two-year period estimates was downloaded from [Statistics Canada](https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1310011301).
