/* eslint-disable no-console */
/* eslint-disable no-undef */
'use strict';

// Ініціалізація мапи
const map = L.map('map').setView([0, 0], 3);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
}).addTo(map);

// Отримання всіх місць з сервера і їх відображення на карті
fetch('http://localhost:3222/places')
  .then(response => response.json())
  .then(data => {
    data.forEach(place => {
      const marker = L.marker([place.latitude, place.longitude]).addTo(map);

      marker.on('click', function() {
        alert('Назва: ' + place.name + '\nОпис: ' + place.description);
      });
    });
  });

// Відправка форми з новим місцем
document
  .getElementById('placeForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const placeName = document.getElementById('placeName').value;
    const placeDescription = document.getElementById('placeDescription').value;
    const placeLatitude = parseFloat(document
      .getElementById('placeLatitude').value);
    const placeLongitude = parseFloat(document
      .getElementById('placeLongitude').value);

    // Відправка даних нового місця на сервер
    fetch('http://localhost:3222/places', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: placeName,
        description: placeDescription,
        latitude: placeLatitude,
        longitude: placeLongitude,
      }),
    })
      .then(response => response.json())
      .then(data => {
      // Додавання нового маркера на карту після успішного збереження на сервері
        const marker = L.marker([data.latitude, data.longitude]).addTo(map);

        marker.on('click', function() {
          alert('Назва: ' + data.name + '\nОпис: ' + data.description);
        });
      })
      .catch(error => {
        console.error('Помилка:', error);
      });

    document.getElementById('placeName').value = '';
    document.getElementById('placeDescription').value = '';
    document.getElementById('placeLatitude').value = '';
    document.getElementById('placeLongitude').value = '';
  });
