import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-control-geocoder';

let map; // This variable will hold your map instance globally.

// comfort modifier coordinates
let comfortModifiers = [
    {
        coordinates: [42.329835,-71.0489529],
        comfortValue: 7,
        reason: 'ocean',
        dist: 500
    },
    {
        coordinates: [42.3494976,-71.0413898],
        comfortValue: 7,
        reason: 'ocean',
        dist: 500
    },
    {
        coordinates: [42.3731379,-71.0518143],
        comfortValue: 7,
        reason: 'ocean',
        dist: 500
    },
    {
        coordinates: [42.3135976,-71.0450596],
        comfortValue: 10,
        reason: 'ocean',
        dist: 500
    },
    {
        coordinates: [42.3464594,-71.0603566],
        comfortValue: -50,
        reason: 'highway',
        dist: 300
    }
]

const initializeMap = (mapContainer, directionsContainerId) => {
    if (!map && mapContainer) {
        // Initialize the map
        map = L.map(mapContainer).setView([42.3128542, -71.0383129], 15);

        // Add an OpenStreetMap tile layer to the map
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: 'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        var marker = L.marker([51.5, -0.09]).addTo(map);

        // Add click event handler to the map
        map.on('click', function (e) {
            // Add a marker at the clicked location
            var newMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);

            // Setup routing from a fixed start point to the clicked point
            var routeControl = L.Routing.control({
                waypoints: [
                    L.latLng(42.3128542, -71.0383129),
                    e.latlng
                ],
                routeWhileDragging: true,
                showAlternatives: true,
                geocoder: L.Control.Geocoder.nominatim({})
            }).addTo(map);

            // Event listener for when routes are found
            routeControl.on('routesfound', function(event) {
                var routes = event.routes;
                var instructions = routes[0].instructions;
                console.log(instructions);
                console.log(routes);
                instructions.forEach(function (instruction) {
                    var index = instruction.index;
                    var text = instruction.text;
                    console.log("Index:", index, "Instruction:", text);
                });
                var directionsPanel = document.getElementById(directionsContainerId);
                displayDirections(event.routes[0], directionsPanel);
            });
        });
    } else {
        console.log('Map is already initialized or container not found');
    }
};

function displayDirections(route, directionsPanel) {
    if (directionsPanel) {
        let directionsHtml = '<h4>Directions</h4><ol>';
        route.instructions.forEach((instruction) => {
            // calculate comfort
            let comfort = 0;
            // if (instruction.distance < 100) {
            //     comfort = 100;
            // } else {
            //     comfort = 100 - (instruction.distance - 100) / 10;
            // }
            // modify comfort by applicable comfort modifiers
            comfortModifiers.forEach((modifier) => {
                let dist = L.latLng(modifier.coordinates).distanceTo(instruction.latLng);
                if (dist < modifier.dist) {
                    comfort += modifier.comfortValue;
                }
            });
            
            // fix comfort precision
            comfort = Math.round(comfort * 100) / 100;    // this is dirty :( 
            directionsHtml += `<li>${instruction.text} - ${instruction.distance} meters - ${comfort} comfort</li>`;
        });
        directionsHtml += '</ol>';
        directionsPanel.innerHTML = directionsHtml;
    }
}

export { initializeMap };
