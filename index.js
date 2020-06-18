var map;

function createMarkers(name, latlong, data, colour, map) {
    var markers = [];
    for (i = 0; i < latlong.length; i++) {
        var marker = new google.maps.Marker({
            position: {lat: parseFloat(latlong[i][0]), lng: parseFloat(latlong[i][1])},
            info: name.concat(" ", data[i]),
            icon: {url: "http://maps.google.com/mapfiles/ms/icons/".concat(colour, "-dot.png")}
        });
        markers.push(marker);
        marker.infowindow = new google.maps.InfoWindow({
            content: ''.concat(marker.info, '<br>', '<a href="http://maps.google.com/?q=',
                marker.getPosition().lat(), ',', marker.getPosition().lng(), '">Google Maps</a>')
        });
        google.maps.event.addListener(marker, 'click', function () {
            this.infowindow.open(map, this);
        });
    }
    return markers;
}

function initialize() {
    var mapOptions = {
        zoom: 6,
        center: {lat: 52.936204377764, lng: -1.17873295}
    };
    map = new google.maps.Map(document.getElementById('map'),
        mapOptions);

    var markers = createMarkers('Tarmac', latlong_tarmac, data_tarmac, 'red', map).concat(
        createMarkers('Breedon', latlong_breedon, data_breedon, 'blue', map),
        createMarkers('Cemex', latlong_cemex, data_cemex, 'green', map),
        createMarkers('', latlong_hanson, data_hanson, 'purple', map),
        createMarkers('Lafarge', latlong_lafarge, data_lafarge, 'yellow', map),
        createMarkers('Brett', latlong_brett, data_brett, 'pink', map)
    );

    var maxValue = 8;
    google.maps.event.addListener(map, 'zoom_changed', function () {
        var zoom = map.getZoom();
        if (zoom > maxValue) {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(map);
            }
        } else {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
        }
    });

    var heatmapData = [];
    for (i = 0; i < markers.length; i++) {
        var position = markers[i].getPosition();
        heatmapData.push(new google.maps.LatLng(position.lat(), position.lng()));
    }
    var heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        radius: 20,
    });
    heatmap.setMap(map);
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

function add_filter(string) {
    let btn = document.createElement("BUTTON");
    btn.innerHTML = string + " &times";
    btn.style.borderRadius = "3px";
    btn.style.border = "1px solid black";
    btn.onclick = function () {
        btn.parentElement.removeChild(btn);
    };
    document.getElementById("filter_container").appendChild(btn)
}


google.maps.event.addDomListener(window, 'load', initialize);