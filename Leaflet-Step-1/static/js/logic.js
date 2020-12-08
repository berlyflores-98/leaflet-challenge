// Store our API endpoint inside queryUrl
var queryUrl =  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, create a geoJSON layer containing the features array and add a popup for each marker
  // then, send the layer to the createMap() function.
  var earthquakes = L.geoJSON(data.features)//, {
  //   onEachFeature : addPopup
  // });

  createMap(earthquakes, data.features);
});


// Define a function we want to run once for each feature in the features array
// function addPopup(feature, layer) {
//   // Give each feature a popup describing the place and time of the earthquake
//   return layer.bindPopup(`<h3> ${feature.properties.place} </h3> <hr> <p>Date: ${Date(feature.properties.time)} (UTC)</p> 
//   <p>Magnitude: ${feature.properties.mag} ml</p>
//   <p>Depth: ${feature.geometry.coordinates[2]} km</p>
//   <a href="${feature.properties.url}" target="_blank">More details...</a>`);
// }

// function to receive a layer of markers and plot them on a map.
function createMap(earthquakes, data) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    maxZoom: 18,
    id: "streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  // var overlayMaps = {
  //   "Earthquakes": earthquakes
  // };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [streetmap]
  });

    // Create the circles for each data point
    data.forEach(function add_circles(earthdata){

      var color = ""
        if (earthdata.geometry.coordinates[2]< 10) {
          color = "#009900";
      }
      else if (earthdata.geometry.coordinates[2] < 30) {
          color = "#00FF00";
      }
      else if (earthdata.geometry.coordinates[2] < 50) {
          color = "#e7d45c";
      }
      else if (earthdata.geometry.coordinates[2] < 70) {
          color = "#e3a340";
      }
      else if (earthdata.geometry.coordinates[2] < 90) {
          color = "#ec250f";
      }
      else {
          color = "#d6d6d6";
      }

      // add circles to map
      L.circle([earthdata.geometry.coordinates[1], earthdata.geometry.coordinates[0]], {
        fillOpacity: .8,
        color: "black",
        fillColor: color,
        // Adjust radius
        radius: earthdata.properties.mag * 20000
    }).bindPopup(`<h3>Name: ${earthdata.properties.title}</h3> <hr> 
        <p>Date: ${Date(earthdata.properties.time)} (UTC)</p> 
        <p>Magnitude: ${earthdata.properties.mag} ml</p>
        <p>Depth: ${earthdata.geometry.coordinates[2]} km</p>
        <a href="${earthdata.properties.url}" target="_blank">More details...</a>`)
        .addTo(myMap);


    });
  


  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  // L.control.layers(baseMaps, overlayMaps,{
  //   collapsed: false
  // }).addTo(myMap);
}
