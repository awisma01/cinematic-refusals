// This file contains the main JavaScript functionality for the Cinematic Counter-Cartographies project.

// Function to initialize the map
function initMap() {
    // Create a map instance
    const map = L.map('map').setView([31.9522, 35.2332], 7); // Centered on Palestine

    // Add a tile layer to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Load GeoJSON data for locations
    fetch('data/locations.geojson')
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, {
                onEachFeature: function (feature, layer) {
                    layer.bindPopup(`<strong>${feature.properties.name}</strong><br>${feature.properties.description}`);
                }
            }).addTo(map);
        })
        .catch(error => console.error('Error loading GeoJSON data:', error));
}

// Function to load film data and populate the archive
function loadFilmArchive() {
    fetch('data/films.json')
        .then(response => response.json())
        .then(data => {
            const archiveContainer = document.getElementById('film-archive');
            data.forEach(film => {
                const filmElement = document.createElement('div');
                filmElement.classList.add('film-item');
                filmElement.innerHTML = `<h5>${film.title}</h5><p>Director: ${film.director}</p><p>${film.description}</p>`;
                archiveContainer.appendChild(filmElement);
            });
        })
        .catch(error => console.error('Error loading film data:', error));
}

// Initialize the map and load film archive on page load
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    loadFilmArchive();
});