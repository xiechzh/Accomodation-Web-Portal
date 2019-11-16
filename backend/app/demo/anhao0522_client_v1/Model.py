import requests
from urllib.parse import quote
from math import radians, cos, sin, asin, sqrt
from itsdangerous import JSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired
from time import time

secret_key = "haojeremyleekyisophie"


def generate_token(username):
    info = {
        'username': username,
        'creation_time': time()
    }
    s = Serializer(secret_key)
    token = s.dumps(info)
    return token.decode()


def validate_token(token, expires_in=6000):
    try:
        s = Serializer(secret_key)
        info = s.loads(token.encode())
    except:
        return "wrong"

    if time() - info['creation_time'] > expires_in:
        return "expired"

    return info['username']


class Yelp:
    def __init__(self):
        self.Yelp_Api = "25sdgEbw0mpCw-X8o3YO1dcrnUtQ-5-efmiwrKZ35BJns4Vc8sY5HZqe6-bDFj6wLOstx04RYer50wjjDcDwOyLkX1vTQfP15CxGpfKI7ql2RZQFId-5EsNU-PwvXXYx"
        self.API_HOST = 'https://api.yelp.com'
        self.SEARCH_PATH = '/v3/businesses/search'
        self.BUSINESS_PATH = '/v3/businesses/'
        self.event_search = "/v3/events"
        self.SEARCH_LIMIT = 10

    def request(self, host, path, url_params=None):
        url_params = url_params or {}
        url = '{0}{1}'.format(host, quote(path.encode('utf8')))
        headers = {
            'Authorization': 'Bearer %s' % self.Yelp_Api,
        }
        response = requests.request('GET', url, headers=headers, params=url_params)

        return response.json()

    def search_restaurant(self, term, location):
        url_params = {
            'term': term.replace(' ', '+'),
            'location': location.replace(' ', '+'),
            'sort_by': 'distance',
            'limit': self.SEARCH_LIMIT
        }
        response = self.request(self.API_HOST, self.SEARCH_PATH, url_params=url_params)

        businesses = response.get('businesses')

        if not businesses:
            return {"reply": u'No businesses for {0} in {1} found.'.format(term, location)}
        else:
            return response

    def search_events(self, location):
        url_params = {
            'locale': 'en_AU',
            'location': location.replace(' ', '+'),
            'limit': self.SEARCH_LIMIT
        }
        response = self.request(self.API_HOST, self.event_search, url_params=url_params)

        return response

def correctly(item, dic1, dic2):
    if "numberofpeople" in dic1:
        if item["maxium_people"]>=dic1["numberofpeople"]:
            if "suburb" in dic1:
                if item["suburb"]==dic1["suburb"]:
                    date_dic = item["available_time"]
                    flag = 0
                    for elem in date_dic:
                        if elem['time']==dic2["checkin"] and elem['status']==True:
                            flag=1
                            continue
                        if flag==1 and elem['time']==dic2["checkout"] and elem['status']==True:
                            flag=2
                            break
                        if flag==1 and elem['status']==True:
                            continue
                    if flag==2:
                        return True
                    else:
                        return False
                else:
                    return False
            else:
                date_dic = item["available_time"]
                flag = 0
                for elem in date_dic:
                    if elem['time']==dic2["checkin"] and elem['status']==True:
                        flag = 1
                        continue
                    if flag==1 and elem['time']==dic2["checkout"]:
                        flag = 2
                        break
                    if flag==1 and elem['status']==True:
                        continue
                if flag == 2:
                    return True
                else:
                    return False
        else:
            return False
    else:
        date_dic = item["available_time"]
        flag = 0
        for elem in date_dic:
            if elem['time'] == dic2["checkin"] and elem['status'] == True:
                flag = 1
                continue
            if flag == 1 and elem['time'] == dic2["checkout"]:
                flag = 2
                break
            if flag == 1 and elem['status'] == True:
                continue
        if flag == 2:
            return True
        else:
            return False




def haversine(lon1, lat1, lon2, lat2):
    """
    Calculate the great circle distance between two points
    on the earth (specified in decimal degrees)
    """

    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])


    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * asin(sqrt(a))
    r = 6371
    return c * r * 1000
