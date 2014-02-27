$(document).ready(function() {

	// Yelp stuff
	var auth = { 
		consumerKey: "TV8ZPlzTG6Hn4fpvUGXqCA", 
		consumerSecret: "s5V8pgQBiTExSu_dwpZGtim5Gn4",
		accessToken: "WXpb7krnP15g1mIzEaj3ZhLqOtjLhVP6",
		accessTokenSecret: "zyKGjW7rhE_eJnlAvfpG3iKUNek",
		serviceProvider: { 
			signatureMethod: "HMAC-SHA1"
		}
	};

	var terms = ['Restaurants', 'Grocery Stores', 'Cleaners', 'Banks', 'Nightlife', 'Parks'];
	var near = address.split(' ').join('+');
	var latlong = "41.883046,-87.948925"

	var accessor = {
	  consumerSecret: auth.consumerSecret,
	  tokenSecret: auth.accessTokenSecret
	};

	var parameterMap = new Array();
	var globalStore = new Array();

	for (var a=0; a<terms.length; a++) {

		var parameters = new Array();
		parameters[a] = [];
		parameters[a].push(['term', terms[a]]);
		parameters[a].push(['limit', 10]);
		//parameters[a].push(['location', near]);
		parameters[a].push(['ll', latlong]);
		parameters[a].push(['sort', 1]);
		parameters[a].push(['callback', 'cb']);
		parameters[a].push(['oauth_consumer_key', auth.consumerKey]);
		parameters[a].push(['oauth_consumer_secret', auth.consumerSecret]);
		parameters[a].push(['oauth_token', auth.accessToken]);
		parameters[a].push(['oauth_signature_method', 'HMAC-SHA1']);

		var message = { 
		  'action': 'http://api.yelp.com/v2/search',
		  'method': 'GET',
		  'parameters': parameters[a] 
		};

		OAuth.setTimestampAndNonce(message);
		OAuth.SignatureMethod.sign(message, accessor);

		parameterMap[a] = OAuth.getParameterMap(message.parameters);
		parameterMap[a].oauth_signature = OAuth.percentEncode(parameterMap[a].oauth_signature)
		//console.log(parameterMap[a]);
		$('#yelp_nearby').append('<div class="col3" id="neighborhood' + a +'"><h2>' + terms[a] + '</h2><table>');
		$('#yelp_nearby').append('</table></div>');
	}

	$.when(
		$.ajax({
		  'url': message.action,
		  'data': parameterMap[0],
		  'cache': true,
		  'dataType': 'jsonp',
		  'success': function(data, textStats, XMLHttpRequest) {
		    globalStore[0] = data;
		  }
		}),
		$.ajax({
		  'url': message.action,
		  'data': parameterMap[1],
		  'cache': true,
		  'dataType': 'jsonp',
		  'success': function(data, textStats, XMLHttpRequest) {
		    globalStore[1] = data;
		  }
		}),
		$.ajax({
		  'url': message.action,
		  'data': parameterMap[2],
		  'cache': true,
		  'dataType': 'jsonp',
		  'success': function(data, textStats, XMLHttpRequest) {
		    globalStore[2] = data;
		  }
		}),
		$.ajax({
		  'url': message.action,
		  'data': parameterMap[3],
		  'cache': true,
		  'dataType': 'jsonp',
		  'success': function(data, textStats, XMLHttpRequest) {
		    globalStore[3] = data;
		  }
		}),
		$.ajax({
		  'url': message.action,
		  'data': parameterMap[4],
		  'cache': true,
		  'dataType': 'jsonp',
		  'success': function(data, textStats, XMLHttpRequest) {
		    globalStore[4] = data;
		  }
		}),
		$.ajax({
		  'url': message.action,
		  'data': parameterMap[5],
		  'cache': true,
		  'dataType': 'jsonp',
		  'success': function(data, textStats, XMLHttpRequest) {
		    globalStore[5] = data;
		  }
		})
	).then(function() {
		for (var a=0; a<globalStore.length; a++) {
			console.log(globalStore[a]);
			for (var i=0; i<5; i++) {
				var rating = globalStore[a].businesses[i].rating + '';
				rating = rating.replace('.', '');
				var reviewText = globalStore[a].businesses[i].review_count > 1 ? "reviews" : "review";
				$('#neighborhood'+a+ ' table').append('<tr><td class="venue">' + globalStore[a].businesses[i].name + 
					'</td><td class="rating"><div class="rating stars' + rating + '"></div><a href="' + globalStore[a].businesses[i].url + 
					'" target="_blank">read ' + globalStore[a].businesses[i].review_count + ' ' + reviewText + '</a></td><td class="distance">' + (globalStore[a].businesses[i].distance*0.00062137).toFixed(1) + 
					' mi</td></tr>');

			}	
		}
	});

	//$('#video_tour_link').fadeTo(0,0);

	// populate dimensions in floorplans
	var total_rooms = $('.room_floorplan').length;
	for (var i = 1; i <= total_rooms; i++) {
		var curr_room = '#room' + i;
		var curr_room_dims = '#room' + i + '_dims';
		var curr_room_name = $('.room' + i + '_link').text();
		$(curr_room).find('.active').children().append($(curr_room_dims).text());
		$('.room' + i + '_cell').attr("title", curr_room_name);
	}

	// toggle monthly calculator
	$('#monthly_calc_toggle').click(function (event) {
		if ($('#monthly_calc').is(":visible")) {
			$('#monthly_calc_toggle span').removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
		} else {
			$('#monthly_calc_toggle span').addClass("glyphicon-chevron-up").removeClass("glyphicon-chevron-down");
		}
		$('#monthly_calc').toggle();
		event.preventDefault();
	});

	// toggle home details (can probably rewrite this)
	$('#more_details_link').click(function (event) {
		$('#home_details .secondary_details').show();
		$('#more_details_link').hide();
		$('#fewer_details_link').show();
		event.preventDefault();
	});

	$('#fewer_details_link').click(function (event) {
		$('#home_details .secondary_details').hide();
		$('#fewer_details_link').hide();
		$('#more_details_link').show();
		event.preventDefault();
	});

	// toggle private schools (can probably rewrite this)
	$('#show_private_schools_link').click(function (event) {
		$('#schools .secondary_details').toggle();
		$('#show_private_schools_link').hide();
		$('#hide_private_schools_link').show();
		event.preventDefault();
		//showPrivateSchools();
	});

	$('#hide_private_schools_link').click(function (event) {
		$('#schools .secondary_details').toggle();
		$('#hide_private_schools_link').hide();
		$('#show_private_schools_link').show();
		event.preventDefault();
	});

	// event handlers for inter-page travel
	$('#secondary_keys').click(function (event) {
		$('html, body').animate({
	    scrollTop: ($('#home_details').offset().top)
		},300);
	});

	$('#main_images').click(function (event) {
		$('html, body').animate({
	    scrollTop: ($('#tour').offset().top)
		},300);
	});

	$('#morepics').click(function (event) {
		$('html, body').animate({
	    scrollTop: ($('#tour').offset().top)
		},300);
	});

	$('#contact_button').click(function (event) {
		$('html, body').animate({
	    scrollTop: ($('#contact').offset().top)
		},300);
	});

	$('#school_link').click(function (event) {
		$('html, body').animate({
	    scrollTop: ($('#schools').offset().top)
		},500);
		event.preventDefault();
	});

	$('#walkscore_link').click(function (event) {
		$('html, body').animate({
	    scrollTop: ($('#neighborhood').offset().top)
		},500);
		event.preventDefault();
	});

	$('.backtop').click(function (event) {
		$('html, body').animate({
	    scrollTop: ($('#tour').offset().top)
		},500);
		event.preventDefault();
	});

	$('.floor_label').click(function (event) {
		$('html, body').animate({
	    scrollTop: ($('#tour').offset().top)
		},500);
		event.preventDefault();
	});

	$('#footer_top_link').click(function (event) {
		$('html, body').animate({
	    scrollTop: 0
		},700);
		event.preventDefault();
	});
	$('#footer_details_link').click(function (event) {
		$('html, body').animate({
	    scrollTop: ($('#home_details').offset().top)
		},700);
		event.preventDefault();
	});
	$('#footer_tour_link').click(function (event) {
		$('html, body').animate({
	    scrollTop: ($('#tour').offset().top)
		},700);
		event.preventDefault();
	});
	$('#footer_neighborhood_link').click(function (event) {
		$('html, body').animate({
	    scrollTop: ($('#neighborhood').offset().top)
		},500);
		event.preventDefault();
	});
	$('#footer_schools_link').click(function (event) {
		$('html, body').animate({
	    scrollTop: ($('#schools').offset().top)
		},300);
		event.preventDefault();
	});

	// floor plan navigation & tooltips
	$('.floor_dims td a').click(roomNavigationClick);
	$('.floor_dims td a').hover(roomNavigationHoverOn, roomNavigationHoverOut);

	$('.floorplan div').click(roomNavigationClick);
	$('.floorplan div').hover(roomNavigationHoverOn, roomNavigationHoverOut);
	$('.room_floorplan div').click(roomNavigationClick);

	$("#work_address").keyup(function(event) {
	    if(event.keyCode == 13) {		// count a keypress as a click
	    	event.preventDefault();
	        $("#work_address_button").click();
		}
	});

	function roomNavigationClick(event) {
		var id = $(this).attr('class');
		console.log(id);
		id = id.substring(0,5);
		console.log(id);
		$('html, body').animate({
	    scrollTop: ($('#' + id).offset().top)
		},300);
		event.preventDefault();
	}

	function roomNavigationHoverOn() {
		var id = $(this).attr('class');
		id = id.substring(0,5);
		$(this).addClass("highlighted");
		//$('#' + id + '_cell').addClass("highlighted");
		if ($(this).parent().attr('class') == "floorplan" || $(this).parent().attr('class') == "room" ) {
			$('#' + id + '_dims').css("font-weight", "bold");
		}
	}

	function roomNavigationHoverOut() {
		var id = $(this).attr('class');
		id = id.substring(0,5);
		$(this).removeClass("highlighted");
		//$('#' + id + '_cell').removeClass("highlighted");
		if ($(this).parent().attr('class') == "floorplan" || $(this).parent().attr('class') == "room" ) {
			$('#' + id + '_dims').css("font-weight", "normal");
		}
	}


	tooltip();

	// load the map
	initialize();

});

this.tooltip = function(){	
	xOffset = 4;
	yOffset = 4;		

	$(".room_floorplan div").hover(function(e){
		$(this).addClass("highlighted");
		this.t = this.title;
		this.title = "";
		if ($(this).hasClass("active")) {
			// don't show tooltip if active
		} else {
			$("body").append("<p id='tooltip'>"+ this.t +"</p>");
			$("#tooltip")
			.css("top",($(this).offset().top + yOffset) + "px")
			.css("left",($(this).offset().left + $(this).width() - xOffset) + "px")
			.show();
		}
    },
	function(){
		this.title = this.t;		
		$("#tooltip").remove();
		$(this).removeClass("highlighted");
    });	
		
};


// Google Maps stuff
function initialize() {

	var geocoder = new google.maps.Geocoder();
  	var mapOptions = {
    	zoom: 15,
    	scrollwheel: false,
    	center: new google.maps.LatLng(41.883289,-87.942066)
  	};
  	var schoolmapOptions = {
  		zoom: 14,
  		scrollwheel: false,
    	center: new google.maps.LatLng(41.883289,-87.942066)
  	};

  	map = new google.maps.Map(document.getElementById('map_container'), mapOptions);
  	schoolmap = new google.maps.Map(document.getElementById('schoolmap_container'), schoolmapOptions);
  	
  	directionsDisplay.setMap(map);
  	//directionsDisplay.setPanel(document.getElementById('directionsPanel'));

    geocoder.geocode( { 'address': address}, function(results, status) {
    	if (status == google.maps.GeocoderStatus.OK) {
    		latitude = results[0].geometry.location.d;
    		longitude = results[0].geometry.location.e;
        	map.setCenter(results[0].geometry.location);
        	schoolmap.setCenter(results[0].geometry.location);
        	schoolmapCenter = schoolmap.getCenter();
        	var marker = new google.maps.Marker({
            	map: map,
            	position: results[0].geometry.location
        	});
        	var schoolmarker = new google.maps.Marker({
            	map: schoolmap,
            	position: results[0].geometry.location
        	});

        	var panoramaOptions = {
			    position: results[0].geometry.location,
			    scrollwheel: false,
			    addressControlOptions: {
			    	position: google.maps.ControlPosition.TOP_RIGHT
			    }
			};

			panorama = new google.maps.StreetViewPanorama(document.getElementById('street_container'),panoramaOptions);
      	} else {
        	alert("Geocode was not successful for the following reason: " + status);
      	}
	});

	
	var image = '../schools_maps.png';
	var schooladdresses = new Array();
	$('#schools .public_school .school').each(function (i,v) {
		schooladdresses[i] = $(this).text();
		var schooladdress = schooladdresses[i] + ' near ' + cityzip;
		
		geocoder.geocode( { 'address': schooladdress}, function(results, status) {
	    	if (status == google.maps.GeocoderStatus.OK) {
	        	var schoolmarker = new google.maps.Marker({
	            	map: schoolmap,
	            	position: results[0].geometry.location,
	            	title: schooladdresses[i],
	            	icon: image
	        	});
	      	} else {
	        	alert("Geocode was not successful for the following reason: " + status);
	      	}
    	});

	});
}

function calcRoute() {
	var start = document.getElementById("address").textContent;
	var end = document.getElementById("work_address").value;
	var request = {
		origin: start,
		destination: end,
		travelMode: google.maps.TravelMode.DRIVING
	};
	directionsService.route(request, function(result, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(result);
			computeTotalDistance(directionsDisplay.directions);
		}
	});
}

function computeTotalDistance(result) {
	var total = 0;
	var time = 0;
	//var from = 0;
	var to = 0;
	var myroute = result.routes[0];
	for (var i = 0; i < myroute.legs.length; i++) {
		total += myroute.legs[i].distance.value;	// distance in meters
		time += myroute.legs[i].duration.value;		// time in seconds
		//from = myroute.legs[i].start_address;	
		to = myroute.legs[i].end_address;
	}
	//from = from.slice(0,from.lastIndexOf(',')); // remove country from address
	to = to.slice(0,to.lastIndexOf(','));
	time = Math.round(time / 60);
	total = (total / 1000)*0.621371;	// convert to mi
	total = Math.round(total * 10)/10;
	$('#directions_bar').show().fadeTo(0,0).animate({
		opacity: 0.8,
		bottom: "60"
	}, 500);
	document.getElementById('distance_time').innerHTML = '<strong>' + total + " mi</strong> - about <strong>" + time + ' mins</strong>';
	document.getElementById('from_to').innerHTML = 'Directions to <strong>' + to + '</strong>';
}

function showPrivateSchools() { // incomplete

	var geocoder = new google.maps.Geocoder();

	geocoder.geocode( { 'address': address}, function(results, status) {
    	if (status == google.maps.GeocoderStatus.OK) {
    		var request = {
    			location: results[0].geometry.location,
    			radius: 500,
    			types: ['private school']
    		}
    		var service = new google.maps.places.PlacesService(schoolmap);
    		service.nearbySearch(request, callback);
      	} else {
        	alert("Geocode was not successful for the following reason: " + status);
      	}
	});
}

function callback(results, status, pagination) {
	if (status != google.maps.places.PlacesServiceStatus.OK) {
	    return;
	} else {
	    createMarkers(results);
	}
}

function createMarkers(places) {
	schoolmap.setZoom(13);
	for (var i=0, place; place = places[i]; i++) {
    	var schoolmarker = new google.maps.Marker({
        	map: schoolmap,
        	position: place.geometry.location,
        	animation: google.maps.Animation.DROP,
        	title: place.name
    	});
	}
}