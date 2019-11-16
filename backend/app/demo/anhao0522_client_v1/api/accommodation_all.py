# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

from flask import request, g

from . import Resource
from .. import schemas
from ..MongoDB import *
from ..Model import correctly,Yelp,haversine

class AccommodationAll(Resource):

    def get(self):
        params = g.args
        searchtype = params.get("searchtype")
        if searchtype == "0":
            reply_ls = []
            requests1 = {}
            requests2 = {}
            for key in params:
                if key == "searchtype":
                    continue
                if key == "checkin" or key == "checkout":
                    requests2.setdefault(key,params[key])
                else:
                    requests1.setdefault(key,params[key])
            accomm_data_cursor=property_collection.find({"location":requests1["location"]})
            tmp_ls = []
            for document in accomm_data_cursor:
                tmp_ls.append(document)

            for item in tmp_ls:
                #print(item)
                if correctly(item,requests1,requests2):
                    #print(item)
                    reply_ls.append(item)
            #print(reply_ls)


        elif searchtype == "1":
            reply_ls = []
            location = params.get("location")
            yelp = Yelp()
            if "keyword" in params:
                events = params.get("keyword")
                result = yelp.search_events(location)["events"]
                for item in result:
                    if events == item["name"]:
                        lat1 = item["latitude"]
                        long1 = item["longitude"]
                        accomm_data_cursor = property_collection.find({"location": location})
                        tmp_ls = []
                        for document in accomm_data_cursor:
                            tmp_ls.append(document)
                        for item in tmp_ls:
                            lat2 = item["latitude"]
                            long2 = item["longitude"]
                            distance = haversine(long1,lat1,long2,lat2)
                            if distance<5000:
                                reply_ls.append(item)
                if not reply_ls:
                    accomm_data_cursor = property_collection.find({"location": location})
                    for document in accomm_data_cursor:
                        reply_ls.append(document)
            else:
                accomm_data_cursor = property_collection.find({"location": location})
                for document in accomm_data_cursor:
                    reply_ls.append(document)
        else:
            return None,400,None
        #print(len(reply_ls))
        return reply_ls, 200, None