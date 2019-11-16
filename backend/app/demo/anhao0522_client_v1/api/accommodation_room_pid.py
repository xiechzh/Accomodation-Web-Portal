# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

from flask import request, g

from . import Resource
from .. import schemas
from ..MongoDB import *


class AccommodationRoomPid(Resource):

    def get(self, pid):

        property_info = property_collection.find_one({"property_id": int(pid)})
        #print(property_info)
        return property_info, 200, None