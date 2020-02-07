import requests
from bs4 import BeautifulSoup
from selenium import webdriver
import time
import re
import pandas as pd
import gmplot
from IPython.display import display


def tarmac():
    latlong = []
    data = []
    driver = webdriver.Chrome()
    for i in range(1, 53):
        url = "https://www.tarmac.com/location-finder/find-a-site/?pageNo=" + str(i)
        driver.get(url)
        soup = BeautifulSoup(driver.page_source, 'html.parser')

        loc_ele = soup.findAll("div", {"class": "col-1-1 locationDetail"})
        for i, ele in enumerate(loc_ele):
            title = ele.find("h5")
            if title.getText().lower().find('concrete') != -1:
                data.append(title.getText())
                loc = ele.find("a", {"class": "getdirection"})
                latlong.append([loc['data-latitude'], loc['data-longitude']])
    driver.quit()
    return latlong, data


def breedon():
    url = "https://www.breedongroup.com/location-finder"
    driver = webdriver.Chrome()
    driver.get(url)
    latlong = []
    data = []
    while 1:
        try:
            length = driver.execute_script("return quarries.markers.length")
            if length > 0:
                break
        except:
            pass
        time.sleep(0.5)
    print(length)
    driver.execute_script("myfunc = function() { markers = []; for (i=0; i < quarries.markers.length; i++) { if ("
                          "quarries.markers[i]) { markers.push([quarries.markers[i].position.lat(), quarries.markers["
                          "i].position.lng(), quarries.markers[i].title, quarries.markers[i].products]); } } return "
                          "markers }")
    markers = driver.execute_script("return myfunc()")
    for m in markers:
        if 'ready-mixed-concrete' in m[3]:
            latlong.append([str(m[0]), str(m[1])])
            data.append(str(m[2]) + ' products ' + str(m[3]))
    driver.quit()
    return latlong, data


def cemex():
    url = "https://www.cemex.co.uk/find-your-location.aspx?p_p_id=CEMEX_MAP_SEARCH&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_resource_id=findTheNearestLocations&p_p_cacheability=cacheLevelPage&_CEMEX_MAP_SEARCH_locationName=Great%20Britain"
    resp = requests.get(url)
    resp_json = resp.json()
    latlong = []
    data = []
    for location in resp_json['theNearestLocations']:
        if location["locationName"].lower().find('concrete') != -1:
            coords = location['locationAddress']['locationCoordinates']
            latlong.append([coords['latitude'], coords['longitude']])
            data.append(location["locationName"])
    return latlong, data


def hanson():
    latlong = []
    data = []
    url = "https://www.hanson.co.uk/en/hanson-location-finder"
    resp = requests.get(url)
    lats = [m.end() for m in re.finditer('"lat":', resp.text)][2:]
    lngs = [m.end() for m in re.finditer('"lon":', resp.text)][2:]
    datas = [m.end() for m in
             re.finditer("field field-name-field-company field-type-entityreference field-label-hidden field-wrapper",
                         resp.text)][12:]
    for i in range(len(lats)):
        lat = float(resp.text[lats[i]:lats[i] + 8].split(",")[0])
        lng = float(resp.text[lngs[i]:lngs[i] + 8].split(",")[0])
        d = resp.text[datas[i] + 12:].split("div")[0][:-8]
        if d.lower().find('concrete') != -1:
            data.append(resp.text[datas[i] + 12:].split("div")[0][:-8])
            latlong.append([lat, lng])
    return latlong, data


def lafarge():
    url = "https://www.aggregate.com/location-finder"
    driver = webdriver.Chrome()
    driver.get(url)
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    loc_ele = soup.findAll("li")
    print(loc_ele)
    driver.quit()

file = open('latlong.js', 'w')
stuff = breedon()
file.write('var latlong_breedon = ' + str(stuff[0]) + '\n')
file.write('var data_breedon = ' + str(stuff[1]) + '\n')
stuff = tarmac()
file.write('var latlong_tarmac = ' + str(stuff[0]) + '\n')
file.write('var data_tarmac = ' + str(stuff[1]) + '\n')
stuff = cemex()
file.write('var latlong_cemex = ' + str(stuff[0]) + '\n')
file.write('var data_cemex = ' + str(stuff[1]) + '\n')
stuff = hanson()
file.write('var latlong_hanson = ' + str(stuff[0]) + '\n')
file.write('var data_hanson = ' + str(stuff[1]) + '\n')
