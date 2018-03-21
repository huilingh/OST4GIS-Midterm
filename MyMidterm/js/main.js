var mapOpts = {
  center: [40.000, -75.1090],
  zoom: 11
};
var map = L.map('map', mapOpts);

var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 17,
  ext: 'png'
}).addTo(map);

var myMarker = {
  radius: 5,
  fillColor: "#c42b2b",
  color: "#ffffff",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
}

// get data
var schools = "https://raw.githubusercontent.com/huilingh/philly-school/master/Schools.geojson"
var tracts = "https://raw.githubusercontent.com/huilingh/philly-school/master/Census_Tracts_2010.geojson"

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
$(document).ready(function() {$.ajax(tracts).done(function(data){
  var parsedTracts = parse(data);
  $.ajax(schools).done(function(data) {
    var parsedSchools = parse(data);
    // Tracts = L.geoJson(parsedTracts, {
    //
    // }).addTo(map);

    $('button.previous1').hide();
    $('button.previous2').hide();
    $('button.previous3').hide();
    $('button.previous4').hide();

    $('button.next2').hide();
    $('button.next3').hide();
    $('button.next4').hide();

    allSchools = L.geoJson(parsedSchools, {
      pointToLayer: function (feature, latlng) {return L.circleMarker(latlng, myMarker);},
      onEachFeature: function(feature, layer) {layer.bindPopup(feature.properties.FACIL_NAME)},
      // style:
      // filter:
    }).addTo(map).eachLayer(eachFeatureFunction);

    // turn to page 2
    $('button.next1').click(function(){
      map.removeLayer(allSchools);
      $('button.previous1').show();
      $('button.next2').show();
      $('button.next1').hide();
      privateSchools = L.geoJson(parsedSchools, {
        pointToLayer: function (feature, latlng) {return L.circleMarker(latlng, myMarker);},
        onEachFeature: function(feature, layer) {layer.bindPopup(feature.properties.FACIL_NAME)},
        // style:
        filter: filter1
      }).addTo(map).eachLayer(eachFeatureFunction);
    })

    //return to page 1
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
      map.removeLayer(privateSchools);
      $('button.previous1').hide();
      $('button.previous2').show();
      $('button.next3').show();
      $('button.next2').hide();
      districtSchools = L.geoJson(parsedSchools, {
        pointToLayer: function (feature, latlng) {return L.circleMarker(latlng, myMarker);},
        onEachFeature: function(feature, layer) {layer.bindPopup(feature.properties.FACIL_NAME)},
        // style:
        filter: filter2
      }).addTo(map).eachLayer(eachFeatureFunction);
    })

    //return to page 2
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
      map.removeLayer(districtSchools);
      $('button.previous2').hide();
      $('button.previous3').show();
      $('button.next4').show();
      $('button.next3').hide();
      archdioceseSchools = L.geoJson(parsedSchools, {
        pointToLayer: function (feature, latlng) {return L.circleMarker(latlng, myMarker);},
        onEachFeature: function(feature, layer) {layer.bindPopup(feature.properties.FACIL_NAME)},
        // style:
        filter: filter3
      }).addTo(map).eachLayer(eachFeatureFunction);
    })

    //return to page 3
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

  });
});
});

/* things to do:
add popup
change sidebar text when clicked
add buttons
remove and add new data when clicked
zoom in when location clicked
*/
