# US Company Exploration App Project 

# Developed by Radha Mahalingam on 6/18/19

import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

#################################################
# Database Setup
#################################################

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/USCA_DATABASE.sqlite"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
USCA_Fulldata = Base.classes.USCA_TABLE
uscctab = Base.classes.US_COMPANY_CATEGORY_TABLE

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/usccnames")
def usccnames():
    """Return a list of US Company Category names."""

    # Use Pandas to perform the sql query
    stmt = db.session.query(uscctab).statement
    df = pd.read_sql_query(stmt, db.session.bind)
    # print(df)
    df1=df.set_index('company_category').T
    # print(df1)
    # Return a list of the column names (sample names)
    return jsonify(list(df1.columns)[0:])

@app.route("/seldata/<cccat>")
def cccat_seldata(cccat):
    """Return the data for a given company category."""

    sel = [
        USCA_Fulldata.company_name,
        USCA_Fulldata.company_category,
        USCA_Fulldata.state,
        USCA_Fulldata.full_time_employees,
        USCA_Fulldata.business_model,
        USCA_Fulldata.agency_name,
        USCA_Fulldata.dataset_name
    ]

    results = db.session.query(*sel).filter(USCA_Fulldata.company_category == cccat).all()
    print(results)

    # Create a dictionary entry for each row of metadata information
    cccat_metadata = []
    sno = 0

    for result in results:
        cccat_dict = {}
        sno += 1
        cccat_dict["sno"] = sno
        cccat_dict["company_name"] = result[0]
        cccat_dict["company_category"] = result[1]
        cccat_dict["state"] = result[2]
        cccat_dict["full_time_employees"] = result[3]
        cccat_dict["business_model"] = result[4]
        cccat_dict["agency_name"] = result[5]
        cccat_dict["dataset_name"] = result[6]
        cccat_metadata.append(cccat_dict)

    print(cccat_metadata)
    return jsonify(cccat_metadata)

@app.route("/mapdata/<cccat>")
def cccat_mapdata(cccat):

    sel = [
        USCA_Fulldata.state,
        func.count(USCA_Fulldata.company_name.distinct()),
        func.count(USCA_Fulldata.agency_name)
    ]

    mquery = db.session.query(*sel ).filter(USCA_Fulldata.company_category == cccat).group_by(USCA_Fulldata.state).all()
    
    # print(mquery)        

    cccat_mdata = []

    for s in mquery:
        m_dict = {}
        m_dict["id"]="US."+s[0]
        m_dict["value"]=s[1]
        m_dict["Avg_agcy_cnt"]= round(s[2]/s[1]+0.5,0)
        cccat_mdata.append(m_dict)

    return jsonify(cccat_mdata)

@app.route("/piedata/<cccat>")
def cccat_piedata(cccat):

    pquery = db.session.query(USCA_Fulldata.full_time_employees, USCA_Fulldata.company_name).filter(USCA_Fulldata.company_category == cccat).order_by(USCA_Fulldata.company_name).all()
    
    # print(pquery)        

    c1=0
    c2=0
    c3=0
    c4=0
    c5=0
    old_com = ""

    for s in pquery:

        if old_com != s[1]:
           old_com = s[1]
           if s[0] < 501:
              c1 = c1 + 1
           elif s[0] < 2501:
              c2 = c2 + 1
           elif s[0] < 5001:
              c3 = c3 + 1
           elif s[0] < 10001:
            c4 = c4 + 1
           else:
            c5 = c5 + 1 

    cccat_pdata = []

    if c1 !=0:
        p_dict={}
        p_dict["FTE_range"]='< 501'
        p_dict["range_count"]=c1
        cccat_pdata.append(p_dict)
    if c2 !=0:
        p_dict={}
        p_dict["FTE_range"]='501-2500'
        p_dict["range_count"]=c2
        cccat_pdata.append(p_dict)
    if c3 !=0:    
        p_dict={}
        p_dict["FTE_range"]='2501-5000'
        p_dict["range_count"]=c3
        cccat_pdata.append(p_dict)
    if c4 !=0:    
        p_dict={}
        p_dict["FTE_range"]='5001-10000'
        p_dict["range_count"]=c4
        cccat_pdata.append(p_dict)
    if c5 !=0:
        p_dict={}
        p_dict["FTE_range"]='> 10000'
        p_dict["range_count"]=c5
        cccat_pdata.append(p_dict)

    return jsonify(cccat_pdata)

@app.route("/bardata/<cccat>")
def cccat_bardata(cccat):

    bquery = db.session.query(USCA_Fulldata.business_model,func.count(USCA_Fulldata.company_name.distinct())).\
             filter(USCA_Fulldata.company_category == cccat).group_by(USCA_Fulldata.business_model).all()
    
    # print(bquery)        

    cccat_bdata = []

    for s in bquery:
        b_dict = {}
        b_dict["Bus_Model"]=s[0]
        b_dict["Company_count"]=s[1]
        cccat_bdata.append(b_dict)

    return jsonify(cccat_bdata)

if __name__ == "__main__":
    app.run(debug=True)
