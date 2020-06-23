var map;
var markers = [];
var filterd_markers = [];
var heatmap;
var company_filters = []
var keyword_filters = []

function createMarkers(name, latlong, data, colour, map) {
    var mrks = [];
    for (var i = 0; i < latlong.length; i++) {
        var marker = new google.maps.Marker({
            position: {lat: parseFloat(latlong[i][0]), lng: parseFloat(latlong[i][1])},
            info: name.concat(" ", data[i]),
            icon: {url: "http://maps.google.com/mapfiles/ms/icons/".concat(colour, "-dot.png")}
        });
        mrks.push(marker);
        marker.infowindow = new google.maps.InfoWindow({
            content: ''.concat(marker.info, '<br>', '<a href="http://maps.google.com/?q=',
                marker.getPosition().lat(), ',', marker.getPosition().lng(), '">Google Maps</a>')
        });
        google.maps.event.addListener(marker, 'click', function () {
            this.infowindow.open(map, this);
        });
    }
    return mrks;
}

function update_zoom() {
    var maxValue = 8;
    var zoom = map.getZoom();
    if (zoom > maxValue) {
        for (var i = 0; i < filterd_markers.length; i++) {
            filterd_markers[i].setMap(map);
        }
    } else {
        for (var i = 0; i < filterd_markers.length; i++) {
            filterd_markers[i].setMap(null);
        }
    }
}

function initialize() {
    var mapOptions = {
        zoom: 6,
        center: {lat: 52.936204377764, lng: -1.17873295}
    };
    map = new google.maps.Map(document.getElementById('map'),
        mapOptions);

    const colours = ['red', 'blue', 'green', 'purple', 'yellow', 'pink'];
    for (let i = 0; i < companies.length; i++) {
        markers = markers.concat(createMarkers(companies[i],
            eval('latlong_'.concat(companies[i].toLowerCase())),
            eval('data_'.concat(companies[i].toLowerCase())),
            colours[i], map));
    }

    google.maps.event.addListener(map, 'zoom_changed', function () {
        update_zoom();
    });

    let heatmapData = [];
    for (i = 0; i < markers.length; i++) {
        var position = markers[i].getPosition();
        heatmapData.push(new google.maps.LatLng(position.lat(), position.lng()));
    }
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        radius: 20,
    });
    heatmap.setMap(map);
    filter();
}

function sidebar_open() {
    document.getElementById("main").style.marginRight = "25%";
    document.getElementById("sidebar").style.width = "25%";
    document.getElementById("sidebar").style.display = "block";
    document.getElementById("openNav").style.display = 'none';
}

function sidebar_close() {
    document.getElementById("main").style.marginRight = "0%";
    document.getElementById("sidebar").style.display = "none";
    document.getElementById("openNav").style.display = "inline-block";
}

function removeItem(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

function add_company_filter(string) {
    let btn = document.createElement("BUTTON");
    btn.innerHTML = string + " &times";
    btn.style.borderRadius = "3px";
    btn.style.borderWidth = "0px";
    btn.classList.add("btn-primary");
    btn.onclick = function () {
        btn.parentElement.removeChild(btn);
        company_filters = removeItem(company_filters, string);
    };
    document.getElementById("filter_container").appendChild(btn)
    company_filters.push(string);
}

function add_keyword_filter(string) {
    let btn = document.createElement("BUTTON");
    btn.innerHTML = string + " &times";
    btn.style.borderRadius = "3px";
    btn.style.borderWidth = "0px";
    btn.classList.add("btn-secondary");
    btn.onclick = function () {
        btn.parentElement.removeChild(btn);
        keyword_filters = removeItem(keyword_filters, string);
    };
    document.getElementById("filter_container").appendChild(btn)
    keyword_filters.push(string);
}

function filtered_company(info) {
    if (company_filters.length > 0) {
        for (let i = 0; i < company_filters.length; i++) {
            if (info.includes(company_filters[i])) {
                return true;
            }
        }
        return false;
    } else {
        return true;
    }
}

function filtered_keyword(info) {
    if (keyword_filters.length > 0) {
        for (let i = 0; i < keyword_filters.length; i++) {
            if (info.includes(keyword_filters[i])) {
                return true;
            }
        }
        return false;
    } else {
        return true;
    }
}

function filter() {
    let heatmapData = [];
    filterd_markers = [];

    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
        if (filtered_company(markers[i].info) && filtered_keyword(markers[i].info)) {
            heatmapData.push(markers[i].getPosition());
            filterd_markers.push(markers[i]);
        }
    }
    update_zoom();
    heatmap.data.i = heatmapData;
    heatmap.setMap(map);
}

google.maps.event.addDomListener(window, 'load', initialize);