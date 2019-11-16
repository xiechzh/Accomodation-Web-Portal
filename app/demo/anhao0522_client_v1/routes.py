# -*- coding: utf-8 -*-

###
### DO NOT CHANGE THIS FILE
### 
### The code is auto generated, your change will be overwritten by 
### code generating.
###
from __future__ import absolute_import

from .api.accommodation_all import AccommodationAll
from .api.accommodation_room_pid import AccommodationRoomPid
from .api.accommodation_room_pid_comment import AccommodationRoomPidComment
from .api.messageBox import Messagebox
from .api.chatbot import Chatbot
from .api.landlord_lid import LandlordLid
from .api.landlord_lid_properties import LandlordLidProperties
from .api.login import Login
from .api.signup import Signup
from .api.user_uid import UserUid
from .api.user_uid_order import UserUidOrder


routes = [
    dict(resource=AccommodationAll, urls=['/accommodation/all'], endpoint='accommodation_all'),
    dict(resource=AccommodationRoomPid, urls=['/accommodation/room/<int:pid>'], endpoint='accommodation_room_pid'),
    dict(resource=AccommodationRoomPidComment, urls=['/accommodation/room/<int:pid>/comment'], endpoint='accommodation_room_pid_comment'),
    dict(resource=Messagebox, urls=['/messageBox'], endpoint='messageBox'),
    dict(resource=Chatbot, urls=['/chatbot'], endpoint='chatbot'),
    dict(resource=LandlordLid, urls=['/landlord/<lid>'], endpoint='landlord_lid'),
    dict(resource=LandlordLidProperties, urls=['/landlord/<lid>/properties'], endpoint='landlord_lid_properties'),
    dict(resource=Login, urls=['/login'], endpoint='login'),
    dict(resource=Signup, urls=['/signup'], endpoint='signup'),
    dict(resource=UserUid, urls=['/user/<uid>'], endpoint='user_uid'),
    dict(resource=UserUidOrder, urls=['/user/<uid>/order'], endpoint='user_uid_order'),
]