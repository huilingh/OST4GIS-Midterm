var map = L.map('map', {
  center: [39.959603, -75.162059],
  zoom: 10
});

var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 17,
  ext: 'png'
}).addTo(map);

var Line = {
  color: "#5aa6e0",
  weight: 2,
  opacity: 0.5
}

var polygon = {
  color: "#ff8600",
  weight: 5,
  opacity: 0.6,
  fillOpacity: 0.1
}

var BikeMarker = {
  radius: 5,
  weight: 1,
  color: "#ffffff",
  fillColor: "#ffffff",
  opacity: 1,
  fillOpacity: 0.5,
}

var PedMarker = {
  radius: 5,
  color: "#ffffff",
  fillColor: "#ffffff",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.5
}

// get data
var trail = "https://raw.githubusercontent.com/huilingh/OST4GIS-Midterm/master/MyMidterm/data/DVRPC_Circuit_Trails.geojson"
var bike = "https://raw.githubusercontent.com/huilingh/OST4GIS-Midterm/master/MyMidterm/data/DVRPC_Bicycle_Counts.geojson"
var pedestrian = "https://raw.githubusercontent.com/huilingh/OST4GIS-Midterm/master/MyMidterm/data/DVRPC_Pedestrian_Counts.geojson"
var district = "https://raw.githubusercontent.com/huilingh/OST4GIS-Midterm/master/MyMidterm/data/Districts.geojson"

// parse data
var parse = function(res) {return JSON.parse(res)};

// something happen when click on points
var eachFeatureFunction = function(layer) {
  layer.on('click', function (event) {
    // map.fitBounds(event.target.getBounds());
    // some functions goes here
  });}

var central = function(feature) {
  if (feature.properties.DISTRICT === "Central") {
    return feature.properties.DISTRICT;
  }
}

// the code execute
$(document).ready(function() {
  $('button.previous1').hide();
  $('button.previous2').hide();
  $('button.previous3').hide();
  $('button.previous4').hide();

  $('button.next2').hide();
  $('button.next3').hide();
  $('button.next4').hide();

  $('#page1').show();
  $('#page2').hide();
  $('#page3').hide();
  $('#page4').hide();
  $('#page5').hide();

  $('#legend-bike').hide();
  $('#legend-ped').hide();

  $.ajax(trail).done(function(data){

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

      $('#page1').hide();
      $('#page2').show();
      $('#page3').hide();
      $('#page4').hide();
      $('#page5').hide();

      // load bike counts
      $.ajax(bike).done(function(data){
        $('#legend-bike').show();
        $('#legend-ped').hide();

        var parsedBike = parse(data);

        _.each(parsedBike.features, function(feature) {
          if(feature.properties.RECORDNUM > 131510) {
            feature.properties.COLOR = 3;
          }
          else if(feature.properties.RECORDNUM <= 131510 && feature.properties.RECORDNUM > 113233) {
            feature.properties.COLOR = 2;
          }
          else if(feature.properties.RECORDNUM <= 113233) {
            feature.properties.COLOR = 1;
          }
        })
        console.log(parsedBike);

        Bike = L.geoJson(parsedBike, {
          pointToLayer: function (feature, latlng) {return L.circleMarker(latlng, BikeMarker);},
          // onEachFeature: function(feature, layer) {layer.bindPopup(feature.properties.FACIL_NAME)},
          style: function(feature) {
            switch (feature.properties.COLOR) {
              case 1: return {fillColor: "#fd7575", radius: 3};
              case 2: return {fillColor: "#df2121", radius: 6};
              case 3: return {fillColor: "#a60000", radius: 10}
            }
          }
          // filter: filter1
        }).addTo(map).eachLayer(eachFeatureFunction);
      })
    })

    //return to page 1
    $('button.previous1').click(function(){
      map.removeLayer(Bike);
      $('button.previous1').hide();
      $('button.next2').hide();
      $('button.next1').show();

      $('#page1').show();
      $('#page2').hide();
      $('#page3').hide();
      $('#page4').hide();
      $('#page5').hide();

      $('#legend-bike').hide();
      $('#legend-ped').hide();

      Trails = L.geoJson(parsedTrails, {
        style: Line
        // filter:
      }).addTo(map)
    })

    // turn to page 3
    $('button.next2').click(function(){
      map.removeLayer(Bike);
      $('button.previous1').hide();
      $('button.previous2').show();
      $('button.next3').show();
      $('button.next2').hide();

      $('#page1').hide();
      $('#page2').hide();
      $('#page3').show();
      $('#page4').hide();
      $('#page5').hide();

      // load pedestrian counts
      $.ajax(pedestrian).done(function(data){
        $('#legend-bike').hide();
        $('#legend-ped').show();

        var parsedPedestrian = parse(data);

        _.each(parsedPedestrian.features, function(feature) {
          if(feature.properties.RECORDNUM > 129509) {
            feature.properties.COLOR = 3;
          }
          else if(feature.properties.RECORDNUM <= 129509 && feature.properties.RECORDNUM > 81653) {
            feature.properties.COLOR = 2;
          }
          else if(feature.properties.RECORDNUM <= 81653) {
            feature.properties.COLOR = 1;
          }
        })

        Pedestrian = L.geoJson(parsedPedestrian, {
          pointToLayer: function (feature, latlng) {return L.circleMarker(latlng, PedMarker);},
          // onEachFeature: function(feature, layer) {layer.bindPopup(feature.properties.FACIL_NAME)},
          style: function(feature) {
            switch (feature.properties.COLOR) {
              case 1: return {fillColor: "#8d97f3", radius: 3};
              case 2: return {fillColor: "#4855d4", radius: 6};
              case 3: return {fillColor: "#1a269f", radius: 10}
            }
          }
          // filter: filter1
        }).addTo(map).eachLayer(eachFeatureFunction);
      })
    })

    //return to page 2
    $('button.previous2').click(function(){
      map.removeLayer(Pedestrian);
      $('button.previous1').show();
      $('button.previous2').hide();
      $('button.next3').hide();
      $('button.next2').show();

      $('#page1').hide();
      $('#page2').show();
      $('#page3').hide();
      $('#page4').hide();
      $('#page5').hide();

      $.ajax(bike).done(function(data){
        $('#legend-bike').show();
        $('#legend-ped').hide();

        var parsedBike = parse(data);

        _.each(parsedBike.features, function(feature) {
          if(feature.properties.RECORDNUM > 131510) {
            feature.properties.COLOR = 3;
          }
          else if(feature.properties.RECORDNUM <= 131510 && feature.properties.RECORDNUM > 113233) {
            feature.properties.COLOR = 2;
          }
          else if(feature.properties.RECORDNUM <= 113233) {
            feature.properties.COLOR = 1;
          }
        })

        Bike = L.geoJson(parsedBike, {
          pointToLayer: function (feature, latlng) {return L.circleMarker(latlng, BikeMarker);},
          // onEachFeature: function(feature, layer) {layer.bindPopup(feature.properties.FACIL_NAME)},
          style: function(feature) {
            switch (feature.properties.COLOR) {
              case 1: return {fillColor: "#fd7575", radius: 3};
              case 2: return {fillColor: "#df2121", radius: 6};
              case 3: return {fillColor: "#a60000", radius: 10}
            }
          }
          // filter: filter1
        }).addTo(map).eachLayer(eachFeatureFunction);
      })
    })

    // turn to page 4
    $('button.next3').click(function(){
      map.removeLayer(Pedestrian);
      $('button.previous2').hide();
      $('button.previous3').show();
      $('button.next4').show();
      $('button.next3').hide();

      $('#page1').hide();
      $('#page2').hide();
      $('#page3').hide();
      $('#page4').show();
      $('#page5').hide();

      $('#legend-bike').hide();
      $('#legend-ped').hide();

      //load bike counts and pedestrian counts
      $.ajax(bike).done(function(data){
        var parsedBike = parse(data);

        _.each(parsedBike.features, function(feature) {
          if(feature.properties.RECORDNUM > 131510) {
            feature.properties.COLOR = 3;
          }
          else if(feature.properties.RECORDNUM <= 131510 && feature.properties.RECORDNUM > 113233) {
            feature.properties.COLOR = 2;
          }
          else if(feature.properties.RECORDNUM <= 113233) {
            feature.properties.COLOR = 1;
          }
        })

        $.ajax(pedestrian).done(function(data){
          var parsedPedestrian = parse(data);

          _.each(parsedPedestrian.features, function(feature) {
            if(feature.properties.RECORDNUM > 129509) {
              feature.properties.COLOR = 3;
            }
            else if(feature.properties.RECORDNUM <= 129509 && feature.properties.RECORDNUM > 81653) {
              feature.properties.COLOR = 2;
            }
            else if(feature.properties.RECORDNUM <= 81653) {
              feature.properties.COLOR = 1;
            }
          })

          Bike = L.geoJson(parsedBike, {
            pointToLayer: function (feature, latlng) {return L.circleMarker(latlng, BikeMarker);},
            // onEachFeature: function(feature, layer) {layer.bindPopup(feature.properties.FACIL_NAME)},
            style: function(feature) {
              switch (feature.properties.COLOR) {
                case 1: return {fillColor: "#fd7575", radius: 3};
                case 2: return {fillColor: "#df2121", radius: 6};
                case 3: return {fillColor: "#a60000", radius: 10}
              }
            }
            // filter: filter1
          }).addTo(map).eachLayer(eachFeatureFunction);

          Pedestrian = L.geoJson(parsedPedestrian, {
            pointToLayer: function (feature, latlng) {return L.circleMarker(latlng, PedMarker);},
            // onEachFeature: function(feature, layer) {layer.bindPopup(feature.properties.FACIL_NAME)},
            style: function(feature) {
              switch (feature.properties.COLOR) {
                case 1: return {fillColor: "#8d97f3", radius: 3};
                case 2: return {fillColor: "#4855d4", radius: 6};
                case 3: return {fillColor: "#1a269f", radius: 10}
              }
            }
            // filter: filter1
          }).addTo(map).eachLayer(eachFeatureFunction);
        })
      })
    })

    //return to page 3
    $('button.previous3').click(function(){
      map.removeLayer(Bike);
      map.removeLayer(Pedestrian);
      map.setZoom(10);
      $('button.previous2').show();
      $('button.previous3').hide();
      $('button.next4').hide();
      $('button.next3').show();

      $('#page1').hide();
      $('#page2').hide();
      $('#page3').show();
      $('#page4').hide();
      $('#page5').hide();


      $.ajax(pedestrian).done(function(data){
        $('#legend-bike').hide();
        $('#legend-ped').show();

        var parsedPedestrian = parse(data);

        _.each(parsedPedestrian.features, function(feature) {
          if(feature.properties.RECORDNUM > 129509) {
            feature.properties.COLOR = 3;
          }
          else if(feature.properties.RECORDNUM <= 129509 && feature.properties.RECORDNUM > 81653) {
            feature.properties.COLOR = 2;
          }
          else if(feature.properties.RECORDNUM <= 81653) {
            feature.properties.COLOR = 1;
          }
        })

        Pedestrian = L.geoJson(parsedPedestrian, {
          pointToLayer: function (feature, latlng) {return L.circleMarker(latlng, PedMarker);},
          // onEachFeature: function(feature, layer) {layer.bindPopup(feature.properties.FACIL_NAME)},
          style: function(feature) {
            switch (feature.properties.COLOR) {
              case 1: return {fillColor: "#8d97f3", radius: 3};
              case 2: return {fillColor: "#4855d4", radius: 6};
              case 3: return {fillColor: "#1a269f", radius: 10}
            }
          }
          // filter: filter1
        }).addTo(map).eachLayer(eachFeatureFunction);
      })
    })

    // turn to page 5
    $('button.next4').click(function(){
      $('button.previous3').hide();
      $('button.previous4').show();
      $('button.next4').hide();

      $('#page1').hide();
      $('#page2').hide();
      $('#page3').hide();
      $('#page4').hide();
      $('#page5').show();
      //zoom to Philadelphia
      $.ajax(district).done(function(data){
        var parsedDistrict = parse(data);
        District = L.geoJson(parsedDistrict, {
          filter: central,
          style: polygon
        }).addTo(map)
        map.fitBounds(District.getBounds())
        // map.setZoom(13);
      })
    })

    // return to page 4
    $('button.previous4').click(function(){
      $('button.previous4').hide();
      $('button.previous3').show();
      $('button.next4').show();

      $('#page1').hide();
      $('#page2').hide();
      $('#page3').hide();
      $('#page4').show();
      $('#page5').hide();
      map.removeLayer(District);
      map.setZoom(10);
    })

  });
});
