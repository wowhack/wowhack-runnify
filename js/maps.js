  var directionsService = new google.maps.DirectionsService();
  var map;
  var origin = null;
  var destination = null;
  var waypoints = [];
  var markers = [];	
  var runPoints = [];
  var loadedPoints = 0;
  var loadedPoints = 0;
  var maxSongs = 8;


  function renderMap(workoutList) {
    reset();
    var initLat = 57.703819;
    var initLon = 11.965786;
    directionsDisplay = new google.maps.DirectionsRenderer();
    var startlocation = new google.maps.LatLng(initLat, initLon);
    var myOptions = {
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      draggableCursor: "pointer",
      center: startlocation
    }
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    directionsDisplay.setMap(map);

    //Adding route
    var nextLat = initLat;
    var nextLon = initLon;
    origin = new google.maps.LatLng(initLat, initLon);
    destination = origin;
    //addMarker(origin);
    if(maxSongs > workoutList.length) {
      maxSongs = workoutList.length;
    }
    for(var i = 0; i < maxSongs; i++) {
      var songDistance = 100;
      //calculating distance through linear estimation on http://www.transformpersonaltraining.com/create-a-playlist-that-motivates-you/
      songDistance = (workoutList[i].bpm * 0.041 - 3.1)*workoutList[i].duration /1000;
      var next = calculateNext(nextLat, nextLon, songDistance);
      dest = new google.maps.LatLng(nextLat, nextLon);
      waypoints.push({location: dest});

      //findClosestLocation(dest);
      if(i == maxSongs - 1) {
        //destination = dest;
        calcRoute();
      } 
      console.log(next.lat + ", " + next.lng);
      nextLat = next.lat;
      nextLon = next.lng;
    }
    $('#map_canvas').show();
  }

function calculateNext(lon, lat, dist) {
    // Convert radius from meters to degrees
    var radiusInDegrees = dist / 111000;

    var u = Math.random();
    var v = Math.random();
    var w = radiusInDegrees * Math.sqrt(u);
    var t = 2 * Math.PI * v;
    var x = w * Math.cos(t);
    var y = w * Math.sin(t);

    // Adjust the x-coordinate for the shrinking of the east-west distances
    var new_x = x / Math.cos(lon);

    var foundLongitude = new_x + lat;
    var foundLatitude = y + lon;
    var obj = {};
    obj.lat = foundLatitude;
    obj.lng = foundLongitude;
    return obj;
}

  function addMarker(latlng) {
    markers.push(new google.maps.Marker({
      position: latlng, 
      map: map,
      icon: "http://maps.google.com/mapfiles/marker" + String.fromCharCode(markers.length + 65) + ".png"
    }));    
  }

  function calcRoute() {
    if (origin == null) {
      console.log("Click on the map to add a start point");
      return;
    }
    
    if (destination == null) {
      console.log("Click on the map to add an end point");
      return;
    }
    
    var mode = google.maps.DirectionsTravelMode.WALKING;
    var request = {
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        travelMode: mode,
        optimizeWaypoints: true,
        avoidHighways: true
    };
    
    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
		    clearMarkers();
	      directionsDisplay.setDirections(response);
        setTimeout(function(){$('#map_canvas').css('display', '');}, 100);
      }
    });
  }

  function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  }
  
  function clearWaypoints() {
    markers = [];
    origin = null;
    destination = null;
    waypoints = [];
  }
  
  function reset() {
    if(typeof directionsDisplay != 'undefined') {
      clearMarkers();
      clearWaypoints();
      directionsDisplay.setMap(null);
      directionsDisplay.setPanel(null);
      directionsDisplay = new google.maps.DirectionsRenderer();
      directionsDisplay.setMap(map);
    }
  
  }