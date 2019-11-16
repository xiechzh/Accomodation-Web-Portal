import requests
from urllib.parse import quote
from datetime import datetime, timedelta
from math import cos, sin, atan2, sqrt, pi ,radians, degrees


def center_geolocation(geolocations):
    x = 0
    y = 0
    z = 0
    lenth = len(geolocations)
    for lon, lat in geolocations:
        lon = radians(float(lon))
        lat = radians(float(lat))
        x += cos(lat) * cos(lon)
        y += cos(lat) * sin(lon)
        z += sin(lat)
    x = float(x / lenth)
    y = float(y / lenth)
    z = float(z / lenth)
    return [degrees(atan2(z, sqrt(x * x + y * y))), degrees(atan2(y, x))]


def gen_dates(b_date, days):
    day = timedelta(days=1)
    for i in range(days):
        yield b_date + day * i


def get_date_list(start, end):
    start = datetime.strptime(start, "%Y-%m-%d")
    end = datetime.strptime(end, "%Y-%m-%d")
    data = []
    for d in gen_dates(start, (end - start).days):
        time = ""
        year = d.year
        month = d.month
        if month < 10:
            month = "0" + str(month)
        else:
            month = str(month)
        day = d.day
        if day < 10:
            day = "0" + str(day)
        else:
            day = str(day)
        time = str(year) + "-" + month + "-" + day

        data.append(time)

    return data


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
            'locale': 'en_AU',
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

