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
	var near = address;
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
		$('#yelp_nearby').append('<div class="col" id="neighborhood' + a +'"><h2>' + terms[a] + '</h2><table>');
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
				if (i<3) { // anything beyond the first 3 rows will be hidden by default
					$('#neighborhood'+a+ ' table').append('<tr><td class="venue">' + globalStore[a].businesses[i].name + 
						'</td><td class="rating"><div class="rating stars' + rating + 
						'"></div><a href="' + globalStore[a].businesses[i].url + 
						'" target="_blank">read ' + globalStore[a].businesses[i].review_count + ' ' + reviewText + '</a></td><td class="distance">' + (globalStore[a].businesses[i].distance*0.00062137).toFixed(1) + 
						' mi</td></tr>');
				} else {
					$('#neighborhood'+a+ ' table').append('<tr class="secondary_details"><td class="venue">' + globalStore[a].businesses[i].name + 
						'</td><td class="rating"><div class="rating stars' + rating + 
						'"></div><a href="' + globalStore[a].businesses[i].url + 
						'" target="_blank">read ' + globalStore[a].businesses[i].review_count + ' ' + reviewText + '</a></td><td class="distance">' + (globalStore[a].businesses[i].distance*0.00062137).toFixed(1) + 
						' mi</td></tr>');
				}
			}	
		}

		for (var a=3; a<globalStore.length; a++) {
			$('#neighborhood'+a).addClass('secondary_details');
		}
	});

	//$('.secondary_details').show();
	//$('#video_tour_link').fadeTo(0,0);

	$('#addresslink').attr('href', 'http://maps.apple.com/?q='+address);

	// populate dimensions in floorplans
	var total_rooms = $('.room_floorplan').length;
	for (var i = 1; i <= total_rooms; i++) {
		var curr_room = '#room' + i;
		var curr_room_dims = '#room' + i + '_dims';
		var curr_room_name = $('.room' + i + '_link').text();
		$(curr_room).find('.active').children().append($(curr_room_dims).text());
		$('.room' + i + '_cell').attr("title", curr_room_name);
	}


	// set the right heights for all 

	$('#menu_button').click(function (event) {
		// if ($('#mobilemenu').is(":visible")) {
		// 	$('#monthly_calc_toggle span').removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
		// } else {
		// 	$('#monthly_calc_toggle span').addClass("glyphicon-chevron-up").removeClass("glyphicon-chevron-down");
		// }
		$('#mobilemenu').slideToggle(100);
	});

	//$('#mobilemenu ul li').click(footerToggleSection);

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

	// toggle private schools (can probably rewrite this)
	$('#show_private_schools_link').click(function (event) {
		$('#schools_section .secondary_details').toggle();
		$('#show_private_schools_link').hide();
		$('#hide_private_schools_link').show();
		event.preventDefault();
		//showPrivateSchools();
	});

	$('#hide_private_schools_link').click(function (event) {
		$('#schools_section .secondary_details').toggle();
		$('#hide_private_schools_link').hide();
		$('#show_private_schools_link').show();
		event.preventDefault();
	});

	// event handlers for inter-page travel
	$('#secondary_keys').click(function (event) {
		document.location.hash = "#home_details";
		// $('.info_section').hide();
		// $('#home_details').show();
		// $('#home_details .secondary_details').show();
		// $('#home_details-more').html("&laquo; back");
		// $('html, body').animate({
		//     scrollTop: 0
		// 	},0);
	});

	$('#tour_button').click(function (event) {
		document.location.hash = "#tour";
		// $('.info_section').hide();
		// $('#tour').show();
		// $('#tour .secondary_details').show();
		// $('#tour-more').html("&laquo; back");
		// $('html, body').animate({
		//     scrollTop: 0
		// 	},0);
	});

	// $('#school_link').click(function (event) {
	// 	$('#home_details').hide();
	// 	$('#schools').show();
	// 	$('#schools .secondary_details').show();
	// 	$('.more_link a').html("more &raquo;");
	// 	$('#schools-more').html("&laquo; back");
	// 	google.maps.event.trigger(schoolmap, "resize");
	// 	$('html, body').animate({
	// 	    scrollTop: 0
	// 		},0);
	// 	event.preventDefault();
	// });

	// $('#walkscore_link').click(function (event) {
	// 	$('#home_details').hide();
	// 	$('#neighborhood').show();
	// 	$('#neighborhood .secondary_details').show();
	// 	$('.more_link a').html("more &raquo;");
	// 	$('#neighborhood-more').html("&laquo; back");
	// 	google.maps.event.trigger(panorama, "resize");
	// 	$('html, body').animate({
	// 	    scrollTop: 0
	// 		},0);
	// 	event.preventDefault();
	// });

	function toggleSection(event) {
		// var id = $(this).attr('id').split("-");
		// var section = "#" + id[0];
		// var sectionlink = "#" + id[0] + "-more";
		
		// if ($(section + ' .secondary_details').is(':visible')) {
		// 	$('.info_section').show();
		// 	$('.secondary_details').hide();
		// 	$(sectionlink).html("more &raquo;");
		// 	console.log("home");
		// 	$('html, body').animate({
		// 	    scrollTop: ($(section).offset().top)
		// 		},0);
		// } else {
		// 	$('.info_section').hide();
		// 	$(section).show();
		// 	$(section + ' .secondary_details').show();
		// 	$(sectionlink).html("&laquo; back");
		// 	console.log(section);
		// 	$('html, body').animate({
		// 	    scrollTop: 0
		// 		},0);
		// }

		// fix google maps resize rendering issues


		//event.preventDefault();
	}

	// $('.more_link a').click(toggleSection);

	//var curr_section;

	var prev_section;
	var section = document.location.hash;
	var scrollPos, prev_scrollPos;

	window.onhashchange = navigateSection;
	window.onload = navigateSection;

	function navigateSection() {
		// if (document.location.hash == "#contact") {
		// 	return;
		// }

		prev_section = section;
		section = document.location.hash;
	    var sectionlink = document.location.hash + "-more";
	    scrollPos = window.pageYOffset;
	    //console.log(curr_section);

	    $('.more_link a').html("more &raquo;");
		$(prev_section + '-more').attr("href", prev_section);	// change the href back
		$(prev_section + '-more').attr("onclick", "");
	    
	    switch(document.location.hash) {
	    	case "":
		    	$('.info_section').show();
				$('.secondary_details').hide();
				
				if (prev_section) {
					$('html, body').animate({								// scroll to the top of the last section
					    scrollTop: prev_scrollPos
						},500);
				}
				break;
			case "#home_details":
			case "#tour":
			case "#neighborhood":
			case "#schools":
				//$('.info_section').hide();
				//$(section).show();
				$('.secondary_details').hide();
				$(section + '_section .secondary_details').slideToggle();
				$(sectionlink).html("&laquo; back");
				$(sectionlink).attr("href", "#");
				$(sectionlink).attr("onclick", "history.back();return false;")
				console.log(section);
				$('html, body').animate({
				    scrollTop: ($(section + '_section').offset().top - 60)
				},500, function () {
					google.maps.event.trigger(schoolmap, 'resize');
					google.maps.event.trigger(panorama, 'resize');
					schoolmap.setCenter(schoolmapCenter);
				});

				if ($('#mobilemenu').is(':visible')) {
					$('#mobilemenu').slideUp(100);
				}
				prev_scrollPos = scrollPos;

				break;
			case "#contact":
				$('.secondary_details').hide();
				$('.more_link a').html("more &raquo;");
				console.log(section);
				$('html, body').animate({
				    scrollTop: ($(section + '_section').offset().top - 60)
				},500);
				prev_scrollPos = scrollPos;
				break;
			case "#room1":
			case "#room2":
			case "#room3":
			case "#room4":
			case "#room5":
			case "#room6":
				//$('.info_section').hide();
				$('#tour_section').show();
				$('#tour_section .secondary_details').show();
				$('#tour-more').html("&laquo; back");

				$('html, body').animate({
			    	scrollTop: ($(section).offset().top - 60)
				},500);
				prev_scrollPos = scrollPos;
				section = "#tour";
				break;
			default:
				break;
	    }
	}

	$('.backtop').click(function (event) {
		$('html, body').animate({
	    scrollTop: ($('#tour_section').offset().top)
		},300);
		event.preventDefault();
	});

	$('.floor_label').click(function (event) {
		$('html, body').animate({
	    scrollTop: ($('#tour_section').offset().top)
		},300);
		event.preventDefault();
	});

	// footer links
	function footerToggleSection() {
		var id = $(this).attr('id').split("-");
		var section = "#" + id[1];
		var sectionlink = "#" + id[1] + "-more";
		console.log(section);
		
		if (section == '#top') {
			if ($('.secondary_details').is(':visible')) {
				$('.info_section').show();
				$('.secondary_details').hide();
				$('.more_link a').html("more &raquo;");
			} 
			$('html, body').animate({
			    scrollTop: 0
				},300);
		} else if (section == '#contact') {
			//if ($('.secondary_details').is(':visible')) {
				//$('.info_section').show();
				$('.secondary_details').hide();
				$('.more_link a').html("more &raquo;");
			//} 
			$('html, body').animate({
		    scrollTop: ($('#contact_section').offset().top - 60)
			},500);
			document.location.hash = "#contact";
		} else if ($(section + ' .secondary_details').is(':visible')) {
			$('html, body').animate({
			    scrollTop: 0
				},300);
		} else {
			$('.info_section').hide();
			$(section).show();
			$(section + ' .secondary_details').show();
			$('.more_link a').html("more &raquo;");
			$(sectionlink).html("&laquo; back");
			$('html, body').animate({
			    scrollTop: 0
				},300);
		}

		if ($('#mobilemenu').is(':visible')) {
			$('#mobilemenu').slideUp(100);
		}
		google.maps.event.trigger(schoolmap, "resize");
		google.maps.event.trigger(panorama, "resize");
		schoolmap.setCenter(schoolmapCenter);
		event.preventDefault();
	}

	//$('.footer li a').click(footerToggleSection);

	$('#footer-top').click(function (event) {
		$('html, body').animate({
		    scrollTop: 0
			},500);
		event.preventDefault();
	});
	//$('#menu-contact').click(footerToggleSection);

	// $('.swipe_prev_section').click(function (event) {
	// 	mySwipe.prev();
	// });
	// $('.swipe_next_section').click(function (event) {
	// 	mySwipe.next();
	// });

	// $('.swipe_arrows').click(function (event) {
	//     if (event.pageX - $(this).offset().left > $(this).width() / 2) {
	//         mySwipe.next();
	//     } else {
	//         mySwipe.prev();
	//     }
	// });

	$('#dots li').click(function (event) {
		mySwipe.slide($(this).index(), 200);
	});

	$('.flip_container').click(function (event) {
		$(this).children(":first").toggleClass("flipped");
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
		id = id.substring(0,5);
		//console.log(id);

		//$('.info_section').hide();
		// $('#tour').show();
		// $('#tour .secondary_details').show();
		// $('#tour-more').html("&laquo; back");

		$('html, body').animate({
	    scrollTop: ($('#' + id).offset().top - 60)
		},300);

		event.preventDefault();
		document.location.hash = "#"+id;
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


	//tooltip();

	// load the map
	initialize();

});

this.tooltip = function(){	
	xOffset = -4;
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
			.css("left",($(this).offset().left - $(this).width() - xOffset) + "px")
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
    	draggable: false, // eliminates dragging on mobile
    	center: new google.maps.LatLng(41.883289,-87.942066)
  	};
  	var schoolmapOptions = {
  		zoom: 13,
  		scrollwheel: false,
  		draggable: false, // eliminates dragging on mobile
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
	$('#schools_section .public_school .school').each(function (i,v) {
		schooladdresses[i] = $(this).text();
		var schooladdress = schooladdresses[i] + ' near ' + town;
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