# Open Government Data Access Dashboard using C3.JS, D3.JS and AnyChart JS libraries

## A Rutgers 2019 Data Science and Visualization - Interactive visualiation Project

### Group Members :  Brown Varghese, Krunal Panchal, Luis Davalos, Radha Mahalingam

## Dashboard Execution Instructions (Updated after the project presentation):

1.  All the Dashboard App files are in the "App Project Folder" and this folder needs to be downloaded to your laptop.

2.  In that folder, the following are the components needed to run the app.

    2.1  app.py
    2.2  USCA_DATABASE.sqlite   - under 'db' folder
    2.3  app.js - under 'static/js' folder
    2.4  styles.css - under 'static'
    2.5  index.html - under 'templates'

    other files:  US_Companies_Agency_data_ext.csv  under 'DataSets'
       -  This is not required to run the application

3.  Make sure the following components are installed in the conda python environment:  sqlalchemy, flask, pandas, numpy

4.  The App uses c3.js and anychart-map.js for charting  and mapping respectively.  Their libraries are accessed directly from CDN in the index.html.

5.  The sqlite database has two tables: (1) USCA_TABLE  (2) US_COMPANY_CATEGORY_TABLE

    US_COMPANY_CATEGORY_TABLE -  has all the company categories used for the selection panel for 'Company Category'.
    USCA_TABLE - has the complete GovLab Open 500 Survey Data

6.  Go to "App Project Folder" and give the following command:

     python app.py

7.  Then, Go to chrome and give the following URL : http://127.0.0.1:5000/

    Select one of the company category and press "Build Chart"

    using flask API endpoints (we have 6 API endpoints for fetching data from sqlite DB), we fetch the US Company - Agency data for the selected Company category.  The data fetched are used to present the data in the table format, the count of companies coming from the selection criteria, aggregated by business models (business to business, business to consumer, academic, Business to Government, non profit), FTE (Full Time Equivalent [Employees]) Count range (<500, 501-2500, 2501-5000, 5001-10000, > 10000), Company count by US States.

    While this dashboard can be extended as a full website, currently the use case is that given the 'Company category' it provides with selection of all companies in that category and what agencies/datasets that they have accessed.  It also provides charts to provide metrices based on the aggregation of the selected data.

## Project Charter (Submitted before the presentation)

## A brief overview of our chosen topic and rationale for picking it

The Open Data 500 is the first comprehensive study of U.S. companies that use open government data to generate new business and develop new products and services. Open Data is free, public data that can be used to launch commercial and nonprofit ventures, do research, make data-driven decisions, and solve complex problems.
The Open Data 500 study is conducted by the GovLab at New York University with funding from the John S. and James L. Knight Foundation. The GovLab works to improve people’s lives by changing how we govern, using technology-enabled solutions and a collaborative, networked approach. As part of its mission, the GovLab studies how institutions can publish the data they collect as open data so that businesses, organizations, and citizens can analyze and use this information.
The datasets that we use for this project was obtained from GovLab through Kaggle.  These data sets have information about US Companies that use the public data from various federal and state agencies.

By using the interactive dashboards, we want to provide the users the facility to explore the information about 500 US companies by selecting the company categories that uses public data from selected government agencies.


### Track that we have decided on:

A dashboard page with mutliple charts that all update from some controls

## A Link to the dataset

The following datasets 

    us_companies.csv
    us_agencies.csv

can be found in the following Github Repository 

https://github.com/brownvarghese/us_company_explorer_app.git


## Screenshots of "inspiring" visualization

![Dashboard Inspiration - 1](/images/dashboard_inspiration1.png)


![Dashboard Inspiration - 2](/images/dashboard_inspiration2.png)


![Dashboard Inspiration - 3](/images/dashboard_inspiration3.png)

### A sketch of the final design

![](/images/A_sketch_of_the_final_design.png)


### A link to the primary GitHub Repo that will be storing the work

    https://github.com/brownvarghese/us_company_explorer_app.git

## Project Plan

![](/images/Project_plan.png)
