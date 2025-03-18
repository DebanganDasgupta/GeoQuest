/* jshint esversion: 6 */
/* jshint node: true */
'use strict';


//change ablility to hit check multiple times
var map;
var resultmap;
var markers = [];
var guess_coordinates = [];
var true_location = [];
var us_city_set = [4699066, 5809844, 4164138, 4440906,4894465, 2562501];
var world_city_set = [
  { lat: 22.5448, lon: 88.3426 }, // Victoria Memorial, Kolkata
  { lat: 22.5850, lon: 88.3466 }, // Howrah Bridge, Kolkata
  { lat: 22.5626, lon: 88.3510 }, // Indian Museum, Kolkata
  { lat: 22.6556, lon: 88.3575 }, // Dakshineswar Kali Temple, Kolkata
  { lat: 22.5395, lon: 88.4072 },  // Science City, Kolkata
  { lat: 22.5756, lon: 88.3642 }, // College Street
  { lat: 22.4610, lon: 88.3915 }, // Meghnad Saha Institute of Technology
  { lat: 22.5646, lon: 88.3433 }, // Eden Gardens
  { lat: 22.5395, lon: 88.4072 },  // Science City
  { lat: 21.8380, lon: 73.7191 }, // Statue of Unity
  { lat: 27.1751, lon: 78.0421 }, // Taj Mahal
  { lat: 18.9220, lon: 72.8347 }, // Gateway of India
  { lat: 28.5245, lon: 77.1855 }, // Qutub Minar
  { lat: 28.6129, lon: 77.2295 }, // India Gate
  { lat: 30.7352, lon: 79.0669 }, // Kedarnath Temple
  { lat: 28.6562, lon: 77.2410 }, // Red Fort
  { lat: 28.5933, lon: 77.2507 }, // Humayun’s Tomb
  { lat: 20.5519, lon: 75.7033 }, // Ajanta Caves
  { lat: 20.0268, lon: 75.1791 }, // Ellora Caves
  { lat: 12.3052, lon: 76.6551 }, // Mysore Palace
  { lat: 25.3012, lon: 83.0063 }, // Varanasi Ghats
  { lat: 40.4319, lon: 116.5704 }, // Great Wall of China
  { lat: -22.9519, lon: -43.2105 }, // Christ the Redeemer
  { lat: -13.1631, lon: -72.5450 }, // Machu Picchu
  { lat: 41.8902, lon: 12.4922 }, // Colosseum
  { lat: 30.3285, lon: 35.4444 }, // Petra
  { lat: 20.6843, lon: -88.5678 }, // Chichen Itza
  { lat: 29.9792, lon: 31.1342 }, // Great Pyramid of Giza
  { lat: 40.6892, lon: -74.0445 }, // Statue of Liberty
  { lat: 48.8584, lon: 2.2945 }, // Eiffel Tower
  { lat: -33.8568, lon: 151.2153 }  // Sydney Opera House
];
// Kolkata, Howrah, Barrackpore, Durgapur, Asansol, Mumbai, Delhi, Bangalore, Chennai, Hyderabad
var accumulated_distance = 0;
var current_name = '';
var distance_from_guess = [];
var check_count = 0;


async function getData(url) {
  return fetch(url)
      .then(response => response.json())
      .catch(error => console.log(error));
}

async function initialize() {
    check_count = 0;
    disableButton('check');
    disableButton('next');
    if(accumulated_distance == 0){
      document.getElementById("totaldistance").innerHTML = 'Round Score: 0 Miles'; 
    }
    document.getElementById("location").innerHTML = ' ';
    document.getElementById("distance").innerHTML = ' '; 


    var locationData = randomLoc();
    var number = await Promise.all([getData(`https://api.openweathermap.org/data/2.5/weather?lat=${locationData.lat}&lon=${locationData.lon}&APPID=2e35570eab59959f85e835dabdddc726`)]);

    true_location = [];
    true_location.push(number[0].coord.lat,number[0].coord.lon);
    current_name = (number[0].name + ", " + number[0].sys.country);
        
    
    var luther = {lat: 43.31613189259254, lng: -91.80256027484972};
  
    var map = new google.maps.Map(document.getElementById('map'), {
      center: luther,
      zoom: 1,
      streetViewControl: false,
    });

    var rmap = new google.maps.Map(document.getElementById('result'), {
        center: luther,
        zoom: 2,
        streetViewControl: false,
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
    },
      });

    
    google.maps.event.addListener(map, 'click', function(event) {
        placeMarker(event.latLng);
        if (check_count == 0){
          enableButton('check');
          check_count += 1;
        }
     });
     
     function placeMarker(location) {
         deleteMarkers();
         guess_coordinates = [];
         var marker = new google.maps.Marker({
             position: location, 
             map: map,
         });
         markers.push(marker);
         guess_coordinates.push(marker.getPosition().lat(),marker.getPosition().lng());
        }
 /*
    console.log("Guessed Location: " + guess_coordinates);
    console.log("Actual Location: " + true_location);
    console.log("current guess error: " + guess_error);
    console.log("total guess error: " + accumulated_distance);
   */
    
    var panorama = new google.maps.StreetViewPanorama(
        document.getElementById('pano'), {
          position: {lat: number[0].coord.lat, lng: number[0].coord.lon},
          pov: {
            heading: 34,
            pitch: 10
          },
          addressControl: false
        });
    map.setStreetView(panorama);
  
}

  function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }

  function clearMarkers() {
    setMapOnAll(null);
  }

  function showMarkers() {
    setMapOnAll(map);
  }

  function deleteMarkers() {
    clearMarkers();
    markers = [];
  }

function check(){

    enableButton('next');
    distance_from_guess = [];
    var guess_error = (distance(guess_coordinates[0],guess_coordinates[1],true_location[0], true_location[1],'K'));
    accumulated_distance += parseFloat(guess_error);
    distance_from_guess = guess_error;

    /*
    console.log("Guessed Location: " + guess_coordinates);
    console.log("Actual Location: " + true_location);
    console.log("current guess error: " + guess_error);
    console.log("total guess error: " + accumulated_distance);
   */
    var true_coords = {lat: true_location[0], lng: true_location[1]};
    var guess_coords = {lat: guess_coordinates[0], lng: guess_coordinates[1]};
    var result_map = new google.maps.Map(document.getElementById('result'), {
    zoom: 2,
    center: true_coords
  });

  var true_marker = new google.maps.Marker({
    position: true_coords, 
    map: result_map,
    title: 'True Location',
    icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
      }
  });
    var infoWindow = new google.maps.InfoWindow({
        content: current_name
    })

    true_marker.addListener('click', function(){
        infoWindow.open(result_map, true_marker);
    });

  var guess_marker = new google.maps.Marker({
    position: guess_coords,
    map: result_map,
    title: 'Guessing Location',
    icon: {
      url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
    }
  });

  var flightPlanCoordinates = [
    true_coords, guess_coords,
    
  ];
  var lineSymbol = {
    path: 'M 0,-1 0,1',
    strokeOpacity: 1,
    scale: 2
  };

  var flightPath = new google.maps.Polyline({
    path: flightPlanCoordinates,
    strokeOpacity: 0,
    icons: [{
        icon: lineSymbol,
        offset: '1',
        repeat: '15px'
      }],
  });
/*function randomLoc() {
    index += 1;
    if (index >= selected_cities.length) {
        index = 0;
        accumulated_distance = 0;

        swal({
            title: "Game Over!",
            icon: "success",
            text: "Your total error distance: " + accumulated_distance.toFixed(1) + " Miles!"
        });

        document.getElementById("totaldistance").innerHTML = 'Round Score: 0 Miles';
        document.getElementById('round').innerHTML = "Round: 1/5";
        document.getElementById("next").innerHTML = "Next Location";

        return selected_cities[0]; // Reset to first city
    } else {
        document.getElementById("next").innerHTML = index === selected_cities.length - 1 ? "Finish Round" : "Next Location";
        document.getElementById('round').innerHTML = "Round: " + (index + 1) + "/5";
        return selected_cities[index];
    }
}
*/

  flightPath.setMap(result_map);
  display_location();
  disableButton('check');
}

function distance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return (dist / 1.609).toFixed(1)
    ;
	}
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}

var index = -1;
var maxRounds = 5; // Set max playable rounds
shuffleArray(world_city_set); // Shuffle once at the start

function randomLoc() {
  index += 1;
  
  if (index >= maxRounds) {  // Limit to 5 rounds
      swal({
          title: "Game Over!",
          icon: "success",
          text: "Your total guess error: " + accumulated_distance.toFixed(1) + " Miles!"
      });
      accumulated_distance = 0;
      index = -1; // Reset for next game
      shuffleArray(world_city_set); // Reshuffle for a new game
      document.getElementById("totaldistance").innerHTML = 'Round Score: 0 Miles'; 
      document.getElementById('round').innerHTML = "Round: 0/" + maxRounds;
      document.getElementById("next").innerHTML = "Play Again";
      return null; // Stop the game
  } 

  document.getElementById("next").innerHTML = index === maxRounds - 1 ? "Finish Round" : "Next Location";
  document.getElementById('round').innerHTML = "Round: " + (index + 1) + "/" + maxRounds;

  return world_city_set[index % world_city_set.length]; // Return lat/lon object
}




function display_location(){
    document.getElementById("location").innerHTML = "Correct Location: " + current_name;
    document.getElementById("distance").innerHTML = "Your Guess was " + distance_from_guess + " Miles away";
    document.getElementById("totaldistance").innerHTML = "Round Score: " + accumulated_distance.toFixed(1) + " Miles";
}

function disableButton(id){
  document.getElementById(id).disabled = true;
}

function enableButton(id){
  document.getElementById(id).disabled = false;
}


