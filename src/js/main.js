//load our custom elements
require("component-leaflet-map");
require("component-responsive-frame");

//get access to Leaflet and the map
var element = document.querySelector("leaflet-map");
var L = element.leaflet;
var map = element.map;


var ich = require("icanhaz");
var templateFile = require("./_popup.html");
ich.addTemplate("popup", templateFile);

var data = require("./july27.geo.json");

// var data = require("./map-fyi.geo.json");

// console.log(data);

var mapElement = document.querySelector("leaflet-map");

  var zoomLevel = (document.getElementById("map").offsetWidth > 500) ? 9.4 : 8;

  var L = mapElement.leaflet;
  var map = mapElement.map;

  map.scrollWheelZoom.disable();

  // map.setView(new L.LatLng(47.4200, -121.8), zoomLevel);



  var focused = false;

  var deaths = "DeathRate_100";
  // var cases = "covid_Positive_Tests";
  var tests = "TestRate_100";
  var tests_pos = "Pos_test_per";

  var DeathRate_100_array = [20,40,60,80];
  // var covid_Positive_Tests_array  = [100,200,300,400];
  var TestRate_100_array  = [9000, 11000, 13000, 15000];
  var Pos_test_per_array  = [3,6,9,12];

  var arrayLegend = {
    DeathRate_100_array: DeathRate_100_array,
    // covid_Positive_Tests_array: covid_Positive_Tests_array,
    TestRate_100_array: TestRate_100_array,
    Pos_test_per_array: Pos_test_per_array,
    deaths: deaths,
    // cases: cases,
    tests: tests,
    tests_pos: tests_pos
  };

  var commafy = s => (s * 1).toLocaleString().replace(/\.0+$/, "");

  data.features.forEach(function(f) {
    // ["percent", "single", "joint"].forEach(function(prop) {
    //   f.properties[prop] = (f.properties[prop] * 100).toFixed(1);
    // });
    ["tests", "positives"].forEach(function(prop) {
      f.properties[prop] = commafy ((f.properties[prop]));
    });

    // ["Pos_test_per"].forEach(function(prop) {
    //   var number = f.properties[prop] * 100;
    //   var rounded = Math.round(number * 10) / 10;
    //
    //   f.properties[prop] = rounded;
    // });
  });


  var onEachFeature = function(feature, layer) {
    layer.bindPopup(ich.popup(feature.properties))
    layer.on({
      mouseover: function(e) {
        layer.setStyle({ weight: 2, fillOpacity: 1 });
      },
      mouseout: function(e) {
        if (focused && focused == layer) { return }
        layer.setStyle({ weight: 1, fillOpacity: 0.7 });
      }
    });
  };

  var getColor = function(d, array) {
    var value = d;
    var thisArray = arrayLegend[array];

    // console.log(thisArray[0]);

    if (typeof value == "string") {
      value = Number(value.replace(/,/, ""));
    }
    // console.log(value)
    if (typeof value != "undefined") {
      // condition ? if-true : if-false;
     return value >= thisArray[3] ? '#B22118' :
     		    value >= thisArray[2] ? '#E34D32' :
            value >= thisArray[1] ? '#ED8A52' :
            value >= thisArray[0]  ? '#F4BD6E' :

             '#FAE2C1' ;
    } else {
      return "gray"
    }
  };


  var geojson = L.geoJson(data, {
    onEachFeature: onEachFeature
  }).addTo(map);

  map.fitBounds(geojson.getBounds());



  function restyleLayer(propertyName) {

    geojson.eachLayer(function(featureInstanceLayer) {
        var propertyValue = featureInstanceLayer.feature.properties[propertyName];

        var colorArray = propertyName + "_array";

        // console.log(colorArray);

        // Your function that determines a fill color for a particular
        // property name and value.
        var myFillColor = getColor(propertyValue, colorArray);

        featureInstanceLayer.setStyle({
            fillColor: myFillColor,
            opacity: .25,
            color: '#000',
            fillOpacity: 0.7,
            weight: 1
        });
    });
}

restyleLayer(tests_pos);

// const startSel = document.getElementById("tests_pos");
// startSel.classList.add("active");



var onEachFeature = function(feature, layer) {
  layer.bindPopup(ich.popup(feature.properties))
};

 map.scrollWheelZoom.disable();



 var filterMarkers = function(clickedID) {
   // if (clickedID === "tests_pos") {
   //   lastColor.style.display = "none";
   // } else { lastColor.style.display = "inline-block"; }
   hideSpans();
   var chosenSpans = legendContainer.getElementsByClassName(clickedID);
   showSpans(chosenSpans);

   for (var i = 0; i < filterButtons.length; i++) {
     filterButtons[i].classList.remove("active");
   }
   var selectedID = document.getElementById(clickedID);
   selectedID.classList.add("active");
   var myID = arrayLegend[clickedID];

   restyleLayer(myID);
 }


 var filterButtons = document.getElementsByClassName("button");
 var legendContainer = document.getElementById("legendCon");
 var allSpans = legendContainer.getElementsByTagName('span');
 var lastColor = document.getElementById("last");

 var hideSpans = function() {
   for (var i = 0; i < allSpans.length; i++) {
     allSpans[i].classList.add("hide");
   }
 };

 var showSpans = function(spanClass) {
   for (var i = 0; i < spanClass.length; i++) {
     spanClass[i].classList.remove("hide");
   }
 };


hideSpans();
var tests_posSpans = legendContainer.getElementsByClassName('tests_pos');

showSpans(tests_posSpans);


 for (var i = 0; i < filterButtons.length; i++) {
    let thisID = filterButtons[i].getAttribute("id");

    // filterButtons[i].style.backgroundColor = "#f8f8f8";

    filterButtons[i].addEventListener('click', () => filterMarkers(thisID), false);
}
