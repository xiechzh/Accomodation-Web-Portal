import json

import pymongo

client = pymongo.MongoClient('mongodb://comp9900:z12345@ds161529.mlab.com:61529/comp9900_2019')
db = client["comp9900_2019"]

customers_collection = db.customers_collection
property_collection = db.property_collection
order_collection = db.order_collection

def update_data(collection_name,data):
    collection_name.insert_one(data)
    return "successful"

'''''
with open("customer.json", 'r') as ff:
    context = ff.read()
    json_data = json.loads(context)
print(json_data)
keys_set = json_data.keys()
print(keys_set)
for i in keys_set:
    data = json_data[i]
    print(data)
    update_data(customers_collection,data)
'''''
