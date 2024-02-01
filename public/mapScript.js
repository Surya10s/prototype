   var map = L.map('map').setView([40.848447, -73.856077], 4);

   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   }).addTo(map);

   L.marker([13.0836939,80.270186]).addTo(map)
      .bindPopup('Your Marker Information Goes Here')
      .openPopup();
