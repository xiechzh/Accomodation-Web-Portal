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
with open("orders.json", 'r') as ff:
    context = ff.read()
    json_data = json.loads(context)
print(json_data)
keys_set = json_data.keys()
print(keys_set)
for i in keys_set:
    data = json_data[i]
    print(data)
    update_data(order_collection,data)


dict_use = {"average_mark": 4.5,
			"cleanliness_mark": 4.5,
			"facility_mark": 3,
			"attitude_mark": 4,
			"text": "I think this house not very good for me, because the hot water is not available 24 hours.",
			"photo": None,
			"date": "09-06-2019"}


datt = property_collection.find_one({"property_id": '5'})
#property_collection.update({"property_id": str(4)},{"$set": {"comments": dict_use}})
comment = datt["comments"]
comment.append(dict_use)
property_collection.update_one({"property_id": str(5)},{"$set": {"comments": comment}})
print(comment)
'''''
#url = "https://maps.google.com/maps/api/geocode/json?key=AIzaSyAANyBQ6ikIoa53iMdahFL99Bjt0oBmWpc&address={address}&sensor=false".format(address=ad)
#data = requests.request("GET",url)
#data.json()['results'][0]['geometry']['location']