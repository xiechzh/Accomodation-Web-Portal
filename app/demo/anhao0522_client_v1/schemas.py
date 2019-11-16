# -*- coding: utf-8 -*-

import six
from jsonschema import RefResolver
from swagger_py_codegen.parser import RefNode

# TODO: datetime support


###
### DO NOT CHANGE THIS FILE
### 
### The code is auto generated, your change will be overwritten by 
### code generating.
###

base_path = '/anhao0522/client/v1'

definitions = {'definitions': {'Customer': {'type': 'object', 'properties': {'customer_id': {'type': 'string', 'example': 'Avengers'}, 'password': {'type': 'string', 'example': '123456789Abc'}, 'First_name': {'type': 'string', 'example': 'steve'}, 'Last_name': {'type': 'string', 'example': 'rogers'}, 'address': {'type': 'string', 'example': '438 Anzac Parade, Kingsford, 2032'}, 'email': {'type': 'string', 'example': 'avengers@gmail.com'}, 'birthday': {'type': 'string', 'example': '27-06-2019'}, 'credit': {'type': 'number', 'example': 1000.0}, 'contact_number': {'type': 'integer', 'example': 67146313}, 'gender': {'type': 'string', 'enum': ['male', 'female']}, 'account_type': {'type': 'boolean', 'default': False}, 'host_order': {'type': 'array', 'items': {'$ref': '#/definitions/Order'}}, 'trip_order': {'type': 'array', 'items': {'$ref': '#/definitions/Order'}}, 'properties': {'type': 'array', 'items': {'$ref': '#/definitions/Property'}}, 'new_message': {'type': 'array', 'items': {'type': 'string'}}, 'message_box': {'type': 'array', 'items': {'$ref': '#/definitions/Message'}}}}, 'Property': {'type': 'object', 'properties': {'customer_id': {'type': 'string', 'example': 'Avengers'}, 'property_id': {'type': 'integer', 'example': 1}, 'address': {'type': 'string', 'example': '438 Anzac Parade, Kingsford, 2032'}, 'longitude': {'type': 'number'}, 'latitude': {'type': 'number'}, 'price': {'type': 'number', 'example': 500.0}, 'type': {'type': 'string', 'example': 'appartment'}, 'size': {'type': 'number', 'example': 50.0}, 'WiFi': {'type': 'boolean', 'default': True}, 'Air-condition': {'type': 'boolean', 'default': True}, 'cooking': {'type': 'boolean', 'default': True}, 'pet': {'type': 'boolean', 'default': True}, 'bed_room': {'type': 'integer', 'example': 3}, 'bath_room': {'type': 'integer', 'example': 2}, 'parking': {'type': 'integer', 'example': 1}, 'location': {'type': 'string', 'example': 'Sydney'}, 'suburb': {'type': 'string', 'example': 'Kingsford'}, 'maxium_people': {'type': 'integer', 'example': 4}, 'about_the_place': {'type': 'string', 'example': 'it is very convenient place, near to market and bus stop.'}, 'rating': {'type': 'number', 'example': 4.5}, 'comments': {'type': 'array', 'items': {'$ref': '#/definitions/Comment'}}, 'p_photo': {'type': 'array', 'items': {'type': 'string'}}, 'discount': {'type': 'number', 'example': 0.8}, 'available_time': {'type': 'array', 'items': {'$ref': '#/definitions/Time_slot'}}}}, 'Time_slot': {'type': 'object', 'properties': {'time': {'type': 'string', 'example': '25-06-2019'}, 'status': {'type': 'boolean', 'default': True}}}, 'Comment': {'type': 'object', 'properties': {'commenter': {'type': 'string', 'example': 'Chengzhu Xie'}, 'avg_mark': {'type': 'number', 'example': 4.5}, 'cleanliness_mark': {'type': 'number', 'example': 4.0}, 'facility_mark': {'type': 'number', 'example': 4.0}, 'attitude_mark': {'type': 'number', 'example': 4.0}, 'text': {'type': 'string', 'example': 'good accommodation!'}, 'reply': {'type': 'string', 'example': 'Thx!'}, 'photo': {'type': 'array', 'items': {'type': 'string'}}, 'date': {'type': 'string', 'example': '23-06-2019'}}}, 'Message': {'type': 'object', 'properties': {'mid': {'type': 'string', 'example': 'anhao---leekyi'}, 'time': {'type': 'string', 'example': '23-06-2019 09:00:00'}, 'text': {'type': 'string', 'example': 'can i have a party in your house?'}}}, 'Order': {'type': 'object', 'properties': {'order_id': {'type': 'integer', 'example': 1}, 'property_id': {'type': 'integer', 'example': 1}, 'host_id': {'type': 'string', 'example': 'anhao'}, 'customer_id': {'type': 'string', 'example': 'Leekyi'}, 'checkin_time': {'type': 'string', 'example': '02-07-2019'}, 'checkout_time': {'type': 'string', 'example': '05-07-2019'}, 'price': {'type': 'number', 'example': 500.0}, 'payment_type': {'type': 'string', 'example': 'Ali pay'}, 'payment_time': {'type': 'string', 'example': '01-07-2019 09:00:00'}}}, 'ApiResponse': {'type': 'object', 'properties': {'code': {'type': 'integer', 'format': 'int32'}, 'type': {'type': 'string'}, 'message': {'type': 'string'}}}}, 'parameters': {}}

validators = {
    ('accommodation_all', 'GET'): {'args': {'required': ['location', 'searchtype'], 'properties': {'location': {'description': 'the destination you want to go i.e. Sydney, Newcastle', 'type': 'string'}, 'keyword': {'description': 'key point you want to search', 'required': False, 'type': 'string'}, 'checkin': {'description': 'checkin time', 'required': False, 'type': 'string'}, 'checkout': {'description': 'checkout time', 'required': False, 'type': 'string'}, 'numberofpeople': {'description': 'number of people', 'required': False, 'type': 'integer'}, 'searchtype': {'description': 'relative search or direct search', 'type': 'string'}, 'suburb': {'description': 'specific suburb i.e. Kingsford, Ashfield', 'required': False, 'type': 'string'}}}},
    ('accommodation_room_pid_comment', 'GET'): {'headers': {'required': [], 'properties': {'auth_token': {'required': False, 'type': 'string'}}}},
    ('accommodation_room_pid_comment', 'POST'): {'json': {'$ref': '#/definitions/Comment'}, 'headers': {'required': [], 'properties': {'auth_token': {'required': False, 'type': 'string'}}}},
    ('messageBox', 'GET'): {'headers': {'required': [], 'properties': {'auth_token': {'required': False, 'type': 'string'}}}, 'args': {'required': ['AB'], 'properties': {'AB': {'description': 'A---B', 'type': 'string'}}}},
    ('messageBox', 'POST'): {'json': {'$ref': '#/definitions/Message'}, 'headers': {'required': [], 'properties': {'auth_token': {'required': False, 'type': 'string'}}}},
    ('messageBox', 'DELETE'): {'headers': {'required': [], 'properties': {'auth_token': {'required': False, 'type': 'string'}}}, 'args': {'required': ['AB'], 'properties': {'AB': {'description': 'A---B', 'type': 'string'}}}},
    ('chatbot', 'POST'): {'headers': {'required': [], 'properties': {'auth_token': {'required': False, 'type': 'string'}}}, 'args': {'required': ['q'], 'properties': {'q': {'description': 'question which user input', 'type': 'string'}}}},
    ('landlord_lid', 'GET'): {'headers': {'required': [], 'properties': {'auth_token': {'required': False, 'type': 'string'}}}},
    ('landlord_lid', 'PUT'): {'json': {'$ref': '#/definitions/Customer'}, 'headers': {'required': [], 'properties': {'auth_token': {'required': False, 'type': 'string'}}}},
    ('landlord_lid_properties', 'GET'): {'headers': {'required': [], 'properties': {'auth_token': {'required': False, 'type': 'string'}}}, 'args': {'required': [], 'properties': {'pid': {'required': False, 'type': 'integer'}}}},
    ('landlord_lid_properties', 'POST'): {'json': {'$ref': '#/definitions/Property'}, 'headers': {'required': [], 'properties': {'auth_token': {'required': False, 'type': 'string'}}}},
    ('landlord_lid_properties', 'PUT'): {'json': {'$ref': '#/definitions/Property'}, 'headers': {'required': [], 'properties': {'auth_token': {'required': False, 'type': 'string'}}}, 'args': {'required': ['pid'], 'properties': {'pid': {'type': 'integer'}}}},
    ('landlord_lid_properties', 'DELETE'): {'headers': {'required': [], 'properties': {'auth_token': {'required': False, 'type': 'string'}}}, 'args': {'required': ['pid'], 'properties': {'pid': {'type': 'integer'}}}},
    ('login', 'GET'): {'args': {'required': ['username', 'password'], 'properties': {'username': {'description': 'The user name for login', 'type': 'string'}, 'password': {'description': 'The password for login in clear text', 'type': 'string'}}}},
    ('signup', 'POST'): {'json': {'$ref': '#/definitions/Customer'}},
    ('user_uid', 'GET'): {'headers': {'required': [], 'properties': {'auth_token': {'required': False, 'type': 'string'}}}},
    ('user_uid', 'PUT'): {'json': {'$ref': '#/definitions/Customer'}, 'headers': {'required': [], 'properties': {'auth_token': {'required': False, 'type': 'string'}}}},
    ('user_uid_order', 'GET'): {'headers': {'required': [], 'properties': {'auth_token': {'required': False, 'type': 'string'}}}},
    ('user_uid_order', 'POST'): {'json': {'$ref': '#/definitions/Order'}, 'headers': {'required': [], 'properties': {'auth_token': {'required': False, 'type': 'string'}}}},
    ('user_uid_order', 'PUT'): {'json': {'$ref': '#/definitions/Order'}, 'headers': {'required': [], 'properties': {'auth_token': {'required': False, 'type': 'string'}}}},
    ('user_uid_order', 'DELETE'): {'json': {'$ref': '#/definitions/Order'}, 'headers': {'required': [], 'properties': {'auth_token': {'required': False, 'type': 'string'}}}},
}

filters = {
    ('accommodation_all', 'GET'): {200: {'headers': None, 'schema': {'type': 'array', 'items': {'$ref': '#/definitions/Property'}}}, 400: {'headers': None, 'schema': None}},
    ('accommodation_room_pid', 'GET'): {200: {'headers': None, 'schema': {'$ref': '#/definitions/Property'}}, 400: {'headers': None, 'schema': None}, 404: {'headers': None, 'schema': None}},
    ('accommodation_room_pid_comment', 'GET'): {200: {'headers': None, 'schema': {'type': 'array', 'items': {'$ref': '#/definitions/Comment'}}}, 400: {'headers': None, 'schema': None}, 404: {'headers': None, 'schema': None}},
    ('accommodation_room_pid_comment', 'POST'): {201: {'headers': None, 'schema': None}, 400: {'headers': None, 'schema': None}, 401: {'headers': None, 'schema': None}},
    ('messageBox', 'GET'): {200: {'headers': None, 'schema': {'type': 'array', 'items': {'$ref': '#/definitions/Message'}}}, 400: {'headers': None, 'schema': None}, 401: {'headers': None, 'schema': None}},
    ('messageBox', 'POST'): {200: {'headers': None, 'schema': None}, 400: {'headers': None, 'schema': None}, 401: {'headers': None, 'schema': None}},
    ('messageBox', 'DELETE'): {200: {'headers': None, 'schema': None}, 400: {'headers': None, 'schema': None}, 401: {'headers': None, 'schema': None}},
    ('chatbot', 'POST'): {200: {'headers': None, 'schema': {'type': 'array', 'items': {'type': 'string'}}}, 400: {'headers': None, 'schema': None}, 401: {'headers': None, 'schema': None}},
    ('landlord_lid', 'GET'): {200: {'headers': None, 'schema': {'$ref': '#/definitions/Customer'}}, 400: {'headers': None, 'schema': None}, 401: {'headers': None, 'schema': None}, 404: {'headers': None, 'schema': None}},
    ('landlord_lid', 'PUT'): {200: {'headers': None, 'schema': {'$ref': '#/definitions/Customer'}}, 400: {'headers': None, 'schema': None}, 401: {'headers': None, 'schema': None}, 404: {'headers': None, 'schema': None}},
    ('landlord_lid_properties', 'GET'): {200: {'headers': None, 'schema': {'type': 'array', 'items': {'$ref': '#/definitions/Property'}}}, 400: {'headers': None, 'schema': None}, 401: {'headers': None, 'schema': None}, 404: {'headers': None, 'schema': None}},
    ('landlord_lid_properties', 'POST'): {201: {'headers': None, 'schema': None}, 400: {'headers': None, 'schema': None}, 401: {'headers': None, 'schema': None}},
    ('landlord_lid_properties', 'PUT'): {200: {'headers': None, 'schema': None}, 400: {'headers': None, 'schema': None}, 401: {'headers': None, 'schema': None}, 404: {'headers': None, 'schema': None}},
    ('landlord_lid_properties', 'DELETE'): {200: {'headers': None, 'schema': None}, 400: {'headers': None, 'schema': None}, 401: {'headers': None, 'schema': None}, 404: {'headers': None, 'schema': None}},
    ('login', 'GET'): {200: {'headers': None, 'schema': {'type': 'string'}}, 400: {'headers': None, 'schema': {'type': 'string'}}},
    ('signup', 'POST'): {201: {'headers': None, 'schema': None}, 400: {'headers': None, 'schema': None}},
    ('user_uid', 'GET'): {200: {'headers': None, 'schema': {'$ref': '#/definitions/Customer'}}, 400: {'headers': None, 'schema': None}, 401: {'headers': None, 'schema': None}, 404: {'headers': None, 'schema': None}},
    ('user_uid', 'PUT'): {200: {'headers': None, 'schema': None}, 400: {'headers': None, 'schema': None}, 401: {'headers': None, 'schema': None}, 404: {'headers': None, 'schema': None}},
    ('user_uid_order', 'GET'): {200: {'headers': None, 'schema': {'type': 'array', 'items': {'$ref': '#/definitions/Order'}}}, 400: {'headers': None, 'schema': None}, 401: {'headers': None, 'schema': None}, 404: {'headers': None, 'schema': None}},
    ('user_uid_order', 'POST'): {200: {'headers': None, 'schema': None}, 400: {'headers': None, 'schema': None}, 401: {'headers': None, 'schema': None}, 404: {'headers': None, 'schema': None}},
    ('user_uid_order', 'PUT'): {200: {'headers': None, 'schema': None}, 400: {'headers': None, 'schema': None}, 401: {'headers': None, 'schema': None}, 404: {'headers': None, 'schema': None}},
    ('user_uid_order', 'DELETE'): {200: {'headers': None, 'schema': None}, 400: {'headers': None, 'schema': None}, 401: {'headers': None, 'schema': None}, 404: {'headers': None, 'schema': None}},
}

scopes = {
    ('accommodation_room_pid_comment', 'POST'): [],
    ('messageBox', 'GET'): [],
    ('messageBox', 'POST'): [],
    ('messageBox', 'DELETE'): [],
    ('landlord_lid', 'GET'): [],
    ('landlord_lid', 'PUT'): [],
    ('landlord_lid_properties', 'GET'): [],
    ('landlord_lid_properties', 'POST'): [],
    ('landlord_lid_properties', 'PUT'): [],
    ('landlord_lid_properties', 'DELETE'): [],
    ('user_uid', 'GET'): [],
    ('user_uid', 'PUT'): [],
    ('user_uid_order', 'GET'): [],
    ('user_uid_order', 'POST'): [],
    ('user_uid_order', 'PUT'): [],
    ('user_uid_order', 'DELETE'): [],
}

resolver = RefResolver.from_schema(definitions)

class Security(object):

    def __init__(self):
        super(Security, self).__init__()
        self._loader = lambda: []

    @property
    def scopes(self):
        return self._loader()

    def scopes_loader(self, func):
        self._loader = func
        return func

security = Security()


def merge_default(schema, value, get_first=True, resolver=None):
    # TODO: more types support
    type_defaults = {
        'integer': 9573,
        'string': 'something',
        'object': {},
        'array': [],
        'boolean': False
    }

    results = normalize(schema, value, type_defaults, resolver=resolver)
    if get_first:
        return results[0]
    return results


def normalize(schema, data, required_defaults=None, resolver=None):
    if required_defaults is None:
        required_defaults = {}
    errors = []

    class DataWrapper(object):

        def __init__(self, data):
            super(DataWrapper, self).__init__()
            self.data = data

        def get(self, key, default=None):
            if isinstance(self.data, dict):
                return self.data.get(key, default)
            return getattr(self.data, key, default)

        def has(self, key):
            if isinstance(self.data, dict):
                return key in self.data
            return hasattr(self.data, key)

        def keys(self):
            if isinstance(self.data, dict):
                return list(self.data.keys())
            return list(getattr(self.data, '__dict__', {}).keys())

        def get_check(self, key, default=None):
            if isinstance(self.data, dict):
                value = self.data.get(key, default)
                has_key = key in self.data
            else:
                try:
                    value = getattr(self.data, key)
                except AttributeError:
                    value = default
                    has_key = False
                else:
                    has_key = True
            return value, has_key

    def _merge_dict(src, dst):
        for k, v in six.iteritems(dst):
            if isinstance(src, dict):
                if isinstance(v, dict):
                    r = _merge_dict(src.get(k, {}), v)
                    src[k] = r
                else:
                    src[k] = v
            else:
                src = {k: v}
        return src

    def _normalize_dict(schema, data):
        result = {}
        if not isinstance(data, DataWrapper):
            data = DataWrapper(data)

        for _schema in schema.get('allOf', []):
            rs_component = _normalize(_schema, data)
            _merge_dict(result, rs_component)

        for key, _schema in six.iteritems(schema.get('properties', {})):
            # set default
            type_ = _schema.get('type', 'object')

            # get value
            value, has_key = data.get_check(key)
            if has_key and '$ref' in _schema:
                result[key] = _normalize(_schema, value)
            elif has_key:
                result[key] = _normalize(_schema, value)
            elif 'default' in _schema:
                result[key] = _schema['default']
            elif key in schema.get('required', []):
                if type_ in required_defaults:
                    result[key] = required_defaults[type_]
                else:
                    errors.append(dict(name='property_missing',
                                       message='`%s` is required' % key))

        additional_properties_schema = schema.get('additionalProperties', False)
        if additional_properties_schema is not False:
            aproperties_set = set(data.keys()) - set(result.keys())
            for pro in aproperties_set:
                result[pro] = _normalize(additional_properties_schema, data.get(pro))

        return result

    def _normalize_list(schema, data):
        result = []
        if hasattr(data, '__iter__') and not isinstance(data, (dict, RefNode)):
            for item in data:
                result.append(_normalize(schema.get('items'), item))
        elif 'default' in schema:
            result = schema['default']
        return result

    def _normalize_default(schema, data):
        if data is None:
            return schema.get('default')
        else:
            return data

    def _normalize_ref(schema, data):
        if resolver == None:
            raise TypeError("resolver must be provided")
        ref = schema.get(u"$ref")
        scope, resolved = resolver.resolve(ref)
        if resolved.get('nullable', False) and not data:
            return {}
        return _normalize(resolved, data)

    def _normalize(schema, data):
        if schema is True or schema == {}:
            return data
        if not schema:
            return None
        funcs = {
            'object': _normalize_dict,
            'array': _normalize_list,
            'default': _normalize_default,
            'ref': _normalize_ref
        }
        type_ = schema.get('type', 'object')
        if type_ not in funcs:
            type_ = 'default'
        if schema.get(u'$ref', None):
            type_ = 'ref'

        return funcs[type_](schema, data)

    return _normalize(schema, data), errors
