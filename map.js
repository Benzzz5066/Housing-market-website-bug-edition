
var map = L.map('map').setView([51.505, -0.09], 13);


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


var markersLayer = new L.LayerGroup();
map.addLayer(markersLayer);


var geocoder = L.Control.Geocoder.nominatim();


var searchControl = new L.Control.Search({
    url: 'https://nominatim.openstreetmap.org/search?format=json&q={s}', // Use Nominatim search API
    jsonpParam: 'json_callback',
    propertyName: 'display_name',
    propertyLoc: ['lat', 'lon'],
    marker: false,
    moveToLocation: function(latlng, title, map) {
        map.setView(latlng, 13);
        L.marker(latlng).addTo(map).bindPopup(title).openPopup();
    },
    textErr: 'Location not found',
    textPlaceholder: 'Search...'
}).addTo(map);


document.getElementById('search-container').appendChild(searchControl.getContainer());


var exampleMarkers = [
    L.marker([51.5, -0.09]).bindPopup('Marker 1'),
    L.marker([51.51, -0.1]).bindPopup('Marker 2'),
    L.marker([51.49, -0.08]).bindPopup('Marker 3')
];


exampleMarkers.forEach(function(marker) {
    marker.addTo(markersLayer);
});


document.getElementById('remove-markers').addEventListener('click', function() {
    markersLayer.clearLayers();
});


document.getElementById('menu-toggle').addEventListener('click', function() {
    var menu = document.getElementById('menu');
    if (menu.classList.contains('collapsed')) {
        menu.classList.remove('collapsed');
        this.classList.remove('collapsed');
} else {
        menu.classList.add('collapsed');
        this.classList.add('collapsed');
    }
});


document.getElementById('zoom-in').addEventListener('click', function() {
    map.zoomIn();
});


document.getElementById('zoom-out').addEventListener('click', function() {
    map.zoomOut();
});
