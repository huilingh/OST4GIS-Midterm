var map = L.map('map', {
  center: [40.1000, -75.1090],
  zoom: 9
});

var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 17,
  ext: 'png'
}).addTo(map);

var Line = {
  "color": "#5aa6e0",
  "weight": 2,
  "opacity": 0.8
}

var BikeMarker = {
  radius: 3,
  fillColor: "#c42b2b",
  color: "#ffffff",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
}

var PedMarker = {
  radius: 3,
  fillColor: "#ffee00",
  color: "#ffffff",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
}


// get data
var trail = "https://raw.githubusercontent.com/huilingh/OST4GIS-Midterm/master/MyMidterm/data/DVRPC_Circuit_Trails.geojson"
var bike = "https://raw.githubusercontent.com/huilingh/OST4GIS-Midterm/master/MyMidterm/data/DVRPC_Bicycle_Counts.geojson"
var pedestrian = "https://raw.githubusercontent.com/huilingh/OST4GIS-Midterm/master/MyMidterm/data/DVRPC_Pedestrian_Counts.geojson"

// parse data
var parse = function(res) {return JSON.parse(res)};

// something happen when click on points
var eachFeatureFunction = function(layer) {
  layer.on('click', function (event) {
    // map.fitBounds(event.target.getBounds());
    // some functions goes here
  });}

var filter1 = function(feature) {
  if (feature.properties.TYPE_SPECIFIC === "Private") {
    return feature.properties.TYPE_SPECIFIC;
  }
}

var filter2 = function(feature) {
  if (feature.properties.TYPE_SPECIFIC === "District" || feature.properties.TYPE_SPECIFIC === "DISTRICT") {
    return feature.properties.TYPE_SPECIFIC;
  }
}

var filter3 = function(feature) {
  if (feature.properties.TYPE_SPECIFIC === "Archdiocese") {
    return feature.properties.TYPE_SPECIFIC;
  }
}

// the code execute
$(document).ready(function() {$.ajax(trail).done(function(data){

  $('button.previous1').hide();
  $('button.previous2').hide();
  $('button.previous3').hide();
  $('button.previous4').hide();

  $('button.next2').hide();
  $('button.next3').hide();
  $('button.next4').hide();

  // page 1: load circuits
  var parsedTrails = parse(data);
  Trails = L.geoJson(parsedTrails, {
    style: Line
    // filter:
  }).addTo(map)

    // turn to page 2
    $('button.next1').click(function(){
      $('button.previous1').show();
      $('button.next2').show();
      $('button.next1').hide();
      // load bike counts
      $.ajax(bike).done(function(data){
        var parsedBike = parse(data);
        Bike = L.geoJson(parsedBike, {
          pointToLayer: function (feature, latlng) {return L.circleMarker(latlng, BikeMarker);},
          // onEachFeature: function(feature, layer) {layer.bindPopup(feature.properties.FACIL_NAME)},
          // style:
          // filter: filter1
        }).addTo(map).eachLayer(eachFeatureFunction);
      })
    })

    //return to page 1 (to be continued)
    $('button.previous1').click(function(){
      map.removeLayer(privateSchools);
      $('button.previous1').hide();
      $('button.next2').hide();
      $('button.next1').show();
      allSchools = L.geoJson(parsedSchools, {
        pointToLayer: function (feature, latlng) {return L.circleMarker(latlng, myMarker);},
        onEachFeature: function(feature, layer) {layer.bindPopup(feature.properties.FACIL_NAME)},
        // style:
        // filter:
      }).addTo(map).eachLayer(eachFeatureFunction);
    })

    // turn to page 3
    $('button.next2').click(function(){
      map.removeLayer(Bike);
      $('button.previous1').hide();
      $('button.previous2').show();
      $('button.next3').show();
      $('button.next2').hide();
      // load pedestrian counts
      $.ajax(pedestrian).done(function(data){
        var parsedPedestrian = parse(data);
        Pedestrian = L.geoJson(parsedPedestrian, {
          pointToLayer: function (feature, latlng) {return L.circleMarker(latlng, PedMarker);},
          // onEachFeature: function(feature, layer) {layer.bindPopup(feature.properties.FACIL_NAME)},
          // style:
          // filter: filter1
        }).addTo(map).eachLayer(eachFeatureFunction);
      })
    })

    //return to page 2 (to be continued)
    $('button.previous2').click(function(){
      map.removeLayer(districtSchools);
      $('button.previous1').show();
      $('button.previous2').hide();
      $('button.next3').hide();
      $('button.next2').show();
      privateSchools = L.geoJson(parsedSchools, {
        pointToLayer: function (feature, latlng) {return L.circleMarker(latlng, myMarker);},
        onEachFeature: function(feature, layer) {layer.bindPopup(feature.properties.FACIL_NAME)},
        // style:
        filter: filter1
      }).addTo(map).eachLayer(eachFeatureFunction);
    })

    // turn to page 4
    $('button.next3').click(function(){
      map.removeLayer(Pedestrian);
      $('button.previous2').hide();
      $('button.previous3').show();
      $('button.next4').show();
      $('button.next3').hide();
      //load bike counts and pedestrian counts
      $.ajax(bike).done(function(data){
        var parsedBike = parse(data);
        $.ajax(pedestrian).done(function(data){
          var parsedPedestrian = parse(data);
          Bike = L.geoJson(parsedBike, {
            pointToLayer: function (feature, latlng) {return L.circleMarker(latlng, BikeMarker);},
            // onEachFeature: function(feature, layer) {layer.bindPopup(feature.properties.FACIL_NAME)},
            // style:
            // filter: filter1
          }).addTo(map).eachLayer(eachFeatureFunction);

          Pedestrian = L.geoJson(parsedPedestrian, {
            pointToLayer: function (feature, latlng) {return L.circleMarker(latlng, PedMarker);},
            // onEachFeature: function(feature, layer) {layer.bindPopup(feature.properties.FACIL_NAME)},
            // style:
            // filter: filter1
          }).addTo(map).eachLayer(eachFeatureFunction);
        })
      })
    })

    //return to page 3 (to be continued)
    $('button.previous3').click(function(){
      map.removeLayer(districtSchools);
      $('button.previous2').show();
      $('button.previous3').hide();
      $('button.next4').hide();
      $('button.next3').show();
      districtSchools = L.geoJson(parsedSchools, {
        pointToLayer: function (feature, latlng) {return L.circleMarker(latlng, myMarker);},
        onEachFeature: function(feature, layer) {layer.bindPopup(feature.properties.FACIL_NAME)},
        // style:
        filter: filter2
      }).addTo(map).eachLayer(eachFeatureFunction);
    })

    // turn to page 5
    $('button.next3').click(function(){
      map.removeLayer(Pedestrian);
      $('button.previous3').hide();
      $('button.previous4').show();
      $('button.next4').hide();
      //zoom to Philadelphia
      $.ajax(bike).done(function(data){
        var parsedBike = parse(data);
        $.ajax(pedestrian).done(function(data){
          var parsedPedestrian = parse(data);
          Bike = L.geoJson(parsedBike, {
            pointToLayer: function (feature, latlng) {return L.circleMarker(latlng, BikeMarker);},
            // onEachFeature: function(feature, layer) {layer.bindPopup(feature.properties.FACIL_NAME)},
            // style:
            // filter: filter1
          }).addTo(map).eachLayer(eachFeatureFunction);

          Pedestrian = L.geoJson(parsedPedestrian, {
            pointToLayer: function (feature, latlng) {return L.circleMarker(latlng, PedMarker);},
            // onEachFeature: function(feature, layer) {layer.bindPopup(feature.properties.FACIL_NAME)},
            // style:
            // filter: filter1
          }).addTo(map).eachLayer(eachFeatureFunction);
        })
      })
    })

  });
});


/* things to do:
add popup
change sidebar text when clicked
add buttons
remove and add new data when clicked
zoom in when location clicked
*/
