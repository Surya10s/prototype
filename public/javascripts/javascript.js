
   if(lat==0&&!long==0){
    var map = L.map('map').setView([34.0479 , 100.6197], 2);
   
   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   }).addTo(map);

   }else{
   var map = L.map('map').setView([lat,long], 12);
   
   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   }).addTo(map);
   L.marker([lat,long]).addTo(map)
      .openPopup();
}