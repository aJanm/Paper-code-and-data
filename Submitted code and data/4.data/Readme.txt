1.Historical Data Analysis Dataset: 
After successfully developing the system, experiments were conducted to measure water quality, 
and the collected data were stored in the MongoDB database, 

namely in the "auto_msg" collection. (auto.json)
With over 100,000 entries in the dataset, the measurement took place over the course of around a year and a half. 


Data collection started in early October 2022 and continued until December 2023, 
with the bulk of the data being collected between October and December 2022. 
We can use the MongoDB tool to import it into a database named water_ 5index_ 20220923,
The user's JSON file is used to store user data, while the manual JSON file
is used to store manually recorded water quality data at the same time.

2.2.Dataset for Outlier Analysis: 
When analyzing outlier data, it is required to extract data from the same water sample, 
as multiple water samples were collected at different times. 
To accomplish this, data is extracted from five different time periods, designated Data1 through Data5, 
each of which is associated with a single water sample. We will conduct outlier data analysis on the items in these datasets,
 which are subsets of the historical data analysis dataset. 
To facilitate reproducibility, data from these five periods will be exported in CSV format and uploaded with the paper.