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

        // Added hardcoded favorite places of interest from professor
        var dunkin = L.marker([42.335794505171414, -71.05603849540067]).addTo(map);
        var beach = L.marker([42.32633311357259, -71.04751104856862]).addTo(map);
        var beaconst = L.marker([42.35617141358264, -71.07250599673633]).addTo(map);
        var jfklib = L.marker([42.31658384819062, -71.0342390256396]).addTo(map);
        var fanpark = L.marker([42.354880844528964, -71.04635016334034]).addTo(map);
        var drawbridge = L.marker([42.30401376889333, -71.04768745928939]).addTo(map);
        var starway = L.marker([42.31881506644686, -71.0505238921386]).addTo(map);
        var boathouse = L.marker([42.311701730075924, -71.03977490530909]).addTo(map);

        // Add the popup descriptions
        beach.bindPopup("<b>Favorited</b><br> Carson Beach.").openPopup();
        beaconst.bindPopup("<b>Favorited</b><br> Home.").openPopup();
        jfklib.bindPopup("<b>Favorited</b><br> JFK Library.").openPopup();
        fanpark.bindPopup("<b>Favorited</b><br> Fan Pier Park.").openPopup();
        drawbridge.bindPopup("<b>Favorited</b><br> Castle Island Drawbridge.").openPopup();
        starway.bindPopup("<b>Favorited</b><br> Starway Market.").openPopup();
        boathouse.bindPopup("<b>Favorited</b><br> UMB Boathouse Fox Point.").openPopup();
        
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
            // modify comfort by applicable comfort modifiers
            // try {
            //     comfortModifiers.forEach((modifier) => {
            //         let dist = L.latLng(modifier.coordinates).distanceTo(instruction.latLng);
            //         if (dist < modifier.dist) {
            //             comfort += modifier.comfortValue;
            //         }
            //     });
            // } catch (e) {
            //     console.log(e);
            // }
            
            // fix comfort precision
            comfort = Math.round(comfort * 100) / 100;    // this is dirty :( 
            directionsHtml += `<li>${instruction.text} - ${instruction.distance} meters - ${comfort} comfort</li>`;
        });
        directionsHtml += '</ol>';
        directionsPanel.innerHTML = directionsHtml;
    }
}

export { initializeMap };
