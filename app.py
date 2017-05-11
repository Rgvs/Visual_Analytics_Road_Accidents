from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
from bson import json_util
from bson.json_util import dumps

app = Flask(__name__)

MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DBS_NAME = 'visproj_new'
COLLECTION_NAME = 'accidents2'
#FIELDS = {"": True, "caseid": True ,"state": True ,"age": True ,"airbag": True ,"injury": True ,
#    "restraint": True ,"sex": True ,"inimpact": True ,"modelyr": True ,"airbagAvail": True ,"airbagDeploy": True ,
#    "Restraint": True ,"D_injury": True ,"D_airbagAvail": True, "D_airbagDeploy": True ,"D_Restraint": True ,"year": True}


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/accidents")
def donorschoose_projects():
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    collection = connection[DBS_NAME][COLLECTION_NAME]
    projects = collection.find(limit=10000)
    #projects = collection.find()
    # fp = open("FARS2.csv","r")
    #
    # data1 = fp.read().split()
    # data = []
    # for d in data1:
    # 	data.append(d.split(","))

    json_projects = []
    #for project in data[1:]:
    for project in projects:
        json_projects.append(project)
    print(json_projects[1:10])
    json_projects = json.dumps(json_projects, default=json_util.default)
    connection.close()
    return json_projects

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)
