let street;         // Serà un objecte de Street View
let map;            // Serà un objecte de mapa
let originalMarker; // Punter de la ubicació real
let selectedMarker; // Punter de la ubicació seleccionada
let polyline;       // Linea per traçar la distancia entre els dos punters 

// No he trobat cap manera de afegir les coordenades de forma automàtica.
const streetViewCat = [
    { lat: 41.9471764, lng: 2.3836778 },
    { lat: 42.6208598, lng: 1.5428439 },
    { lat: 41.3951735, lng: 2.1481049 },
    { lat: 41.2150846, lng: 1.7273057 },
    { lat: 42.1798301, lng: 2.4955301 },
    { lat: 42.702005, lng: 0.795298 },
    { lat: 41.9413332, lng: 3.2173469 },
    { lat: 41.6511566, lng: 0.8800007 },
    { lat: 41.0691059, lng: 1.0610129 },
    { lat: 40.7244744, lng: 0.7215137 },
    { lat: 41.6255205, lng: 0.8930346 },
    { lat: 42.110936, lng: 1.8327606 },
    { lat: 41.534599, lng: 2.104551 },
    { lat: 41.2366889, lng: 1.8096768 },
    { lat: 41.9827116, lng: 2.8228288 },
];

function initialize() {

    // Codi per estilitzar cada ronda la pàgina
    document.getElementById('street-container').style.display = 'block';    // Bloquejat
    document.getElementById('map-container').style.flex = '1'; 
    document.getElementById('saveButton').style.display = 'block';          
    document.getElementById('nextRoundButton').style.display = 'none';      // Amagat

    // Per crear el mapa:
    const mapOptions = {
        center: { lat: 41.7659458, lng: 1.8093253 },    // On es centra el mapa
        zoom: 8,                                        // zoom del mapa (21 max, 4 min)
        streetViewControl: false,                       // Per amagar el ninot taronja 
    };
    // "Crida" a la api (de l'script)
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Seleccionem una ubicació aleatoria per cada ronda
    const randomIndex = Math.floor(Math.random() * streetViewCat.length);
    const selectedLocation = streetViewCat[randomIndex];

    // Per crear el Street View
    const streetOptions = {
        position: selectedLocation,
        pov: {
            heading: 34,    // On mira (360)
            pitch: 10       // Angle vertical
        },
        visible: true,              // No necessari
        addressControl: false,      // per ocultar l'adreça
    };
    street = new google.maps.StreetViewPanorama(document.getElementById('street'), streetOptions);
    map.setStreetView(street);

    // Creem el punter de la posició real
    originalMarker = new google.maps.Marker({
        position: selectedLocation,
        map: null,                      // "null" no apareix, "map" apareix
        draggable: false,               // fixe
        title: 'Localització real',
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
    });

    // Punter de la posició a esbrinar
    selectedMarker = new google.maps.Marker({
        map: null,
        draggable: false,
        title: 'Ubicació escollida',
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    });

    // Listener per si hi ha un click al mapa
    google.maps.event.addListener(map, 'click', function (event) {
        const clickedLocation = event.latLng;

        // Canviem el punter de l'usuari al punt seleccionat.
        selectedMarker.setPosition(clickedLocation);
        selectedMarker.setMap(map);

    });

    // Listener per si es clica el botó de guardar ubicació
    document.getElementById('saveButton').addEventListener('click', function () {
        
        // Obtennim la posició triada i la centrem al mapa.
        const streetViewPosition = street.getPosition();
        map.setCenter(streetViewPosition);

        // Fem que es vegi el mapa només:
        document.getElementById('street-container').style.display = 'none';
        document.getElementById('map-container').style.flex = '1';
        document.getElementById('saveButton').style.display = 'none';

        // Revelem on era el punter original
        originalMarker.setMap(map);

        // Mostrem la linia entre punt i punt, i mostrem el botó de següent ronda.
        updatePolyline();
        document.getElementById('nextRoundButton').style.display = 'block';
    });

    // Listener pel botó de següent ronda
    document.getElementById('nextRoundButton').addEventListener('click', function () {
        // Amagem el botó i renicïem tot.
        this.style.display = 'none';
        initialize();
    });
}


// Funcions per la linia
function updatePolyline() {

    // Creem la linia amb la api i li posem els paramtres següents:
    polyline = new google.maps.Polyline({
        path: [originalMarker.getPosition(), selectedMarker.getPosition()], 
        geodesic: true,         // Segueix la curvatura de la terra?
        strokeColor: '#101010', // Opcions d'estil
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: map                // Fer la linia visible
    });
}
