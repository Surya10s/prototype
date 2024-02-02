document.addEventListener('DOMContentLoaded', () => {
  const map = L.map('map').setView([51.505, -0.09], 2);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  // Simplified marker data extraction from JSON
  const markersData = JSON.parse(decodeHtmlEntities(encodedContent)).map(d => ({
      lat: d.geo_coordinates.coordinates[0],
      lng: d.geo_coordinates.coordinates[1],
      campId:d._id
  })
  
  );

  // Create a marker cluster group
  const markersCluster = L.markerClusterGroup({
      iconCreateFunction: function (cluster) {
          return L.divIcon({ 
              html: `<div style="font: 1.6em sans-serif;" class="cluster-no">${cluster.getChildCount()}</div>`,
              className: 'my-cluster', 
              iconSize: L.point(40, 40) 
          });
      }
  });

  // Add markers to the cluster group
  markersData.forEach(markerData => {
      const marker = L.marker(L.latLng(markerData.lat, markerData.lng));
      marker.bindPopup(`     <a href="/campground/detial/${markerData.campId}" class="btn btn-dark btn-sm">view</a>`);
      markersCluster.addLayer(marker);
  });

  // Add the cluster group to the map
  map.addLayer(markersCluster);

  // Function to decode HTML entities
  function decodeHtmlEntities(encodedString) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(encodedString, 'text/html');
      return doc.documentElement.textContent;
  }
});
