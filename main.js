let map;

// โหลดข้อมูลสถานที่
const fetchData = async () => {
    const response = await fetch('data/locations.json');
    const data = await response.json();
    return data;
};

const initMap = () => {
    // สร้างแผนที่
    map = L.map('map').setView([18.7931, 98.9738], 16); // จุดเริ่มต้น

    // Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
};

const populateDropdowns = (locations) => {
    const startSelect = document.getElementById('start-point');
    const endSelect = document.getElementById('end-point');

    // วนลูปข้อมูลสถานที่ เพื่อเพิ่มใน dropdown
    for (const locationKey in locations) {
        const optionStart = document.createElement('option');
        const optionEnd = document.createElement('option');
        optionStart.value = locationKey;
        optionStart.textContent = locations[locationKey].name;
        optionEnd.value = locationKey;
        optionEnd.textContent = locations[locationKey].name;

        startSelect.appendChild(optionStart);
        endSelect.appendChild(optionEnd);
    }
};

const updateLocationInfo = (locationKey, locations) => {
    const image = document.getElementById('location-image');
    const description = document.getElementById('location-description');

    if (locations[locationKey]) {
        image.src = locations[locationKey].image;
        description.textContent = locations[locationKey].description;
    } else {
        image.src = 'images/default.jpg';
        description.textContent = 'กรุณาเลือกต้นทางและปลายทาง';
    }
};

const startNavigation = () => {
    const startPoint = document.getElementById('start-point').value;
    const endPoint = document.getElementById('end-point').value;

    fetchData().then(locations => {
        const startCoords = locations[startPoint]?.coordinates;
        const endCoords = locations[endPoint]?.coordinates;

        if (startCoords && endCoords) {
            L.Routing.control({
                waypoints: [
                    L.latLng(...startCoords),
                    L.latLng(...endCoords)
                ],
                routeWhileDragging: true
            }).addTo(map);

            // อัปเดตรูปภาพและข้อความ
            updateLocationInfo(startPoint, locations);
            updateLocationInfo(endPoint, locations);
        }
    });
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    fetchData().then(locations => populateDropdowns(locations));
});
