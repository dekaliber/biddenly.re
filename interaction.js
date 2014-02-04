$(document).ready(function() {

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
		id = id.substring(0,5);
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