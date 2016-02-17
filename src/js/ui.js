/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/

// Mobile display
// TODO use L.Browser once Leaflet 1.0 is in use
$(document).ready(function() {

  if ( window.innerWidth < 768) {
    $('#topbar').remove();
    $('body').append('<div class="swipe-area-right"></div>');

    showAlert("Drawing tools are not available on mobile.", "info", 6000);
    showAlert("Swipe from the right border of your screen to show the mnu.", "info", 7000);

    $('.draw-link').addClass('disabled');
    
    // TODO remove navigation on mobile

    // Activate swipe on the right border to show the mobile menu
    $(".swipe-area-right").touchwipe({
     wipeLeft: function() {sidebar.show($('#mobile-menu-dialog').show());},
     min_move_x: 15,
     preventDefaultEvents: true
    });
    // Hide the sidebar on right swipe
    $(".sidebar-container").touchwipe({
     wipeRight: function() {sidebar.hide();},
     min_move_x: 100,
     preventDefaultEvents: true
    });
    // Hide the bottombar on down swipe
    $(".bottombar-container").touchwipe({
     wipeDown: function() {bottombar.hide();},
     min_move_y: 50,
     preventDefaultEvents: true
    });

  }

});

// Swtch session function
// TODO destroy/replace/append elements instead of hiding them
function switchSession(sessionStatus) {

  var classicSessionType = localStorage.getItem('classic');

    if (sessionStatus === "logout") {

      $('#session-status a').text('Login').attr("href","#user-login-dialog");
      $('#session-status a').attr("id","");
      $('#session-status a').addClass('dropdown-link');
      $('#user-info-link').remove();
      $('#user-info-mobile-link').remove();
      $('#user-tools').dropdown();
      $('.user-email, .user-glome-key').removeClass('hidden');
      $(".session-link").removeClass('hidden');
    }

    if (sessionStatus === "login") {

      $("#session-status a").text("Logout").attr("href","#");
      $("#session-status a").attr("id","btn-logout");
      $("#session-status a").removeClass('dropdown-link');
      $("#session-status").on('click', '#btn-logout', function() {switchSession("logout"); logout();});
      $("#user-tools").prepend('<li id="user-info-link"><a class="dropdown-link" href="#account-info">User info</a></li>');
      $(".btn-menu").append('<a href="#account-info" class="sidebar-link btn btn-default btn-lg btn-block"><span class="fa fa-fw fa-user"></span> User info</a>');
      $("#user-info-link a").on("click", function(e) {
                                      e.preventDefault();
                                      $('#sidebar').scrollTop = 0;
                                      $(this.hash).fadeIn().siblings().hide();
                                      sidebar.show();
                                    });
      $("#user-tools").dropdown();
      $(".session-link").addClass('hidden');

      // get the data from localStorage or sessionStorage and clear the other

      if (classicSessionType === "true") {

        $('#account-info').find('.user-email').removeClass('hidden');
        $('#account-info').find('.user-name').text(localStorage.getItem('username'));
        $('#account-info').find('.user-email p').html(localStorage.getItem('useremail'));
        $('#account-info').find('.user-glome-key').addClass('hidden');
        $('#account-info').find('.user-id').html(localStorage.getItem('userid'));
        $('.sidebar-content').hide();

        if (!sidebar.isVisible()) {
            sidebar.show();
        }

        $('#account-info').show();

      }

      if  (classicSessionType === "false") {

        $('#account-info').find('.user-name').text('anon (⌐■_■)');
        $('#account-info').find('.user-email').addClass('hidden');
        $('#account-info').find('.user-glome-key p').html( localStorage.getItem('glomekey') );
        $('#account-info').find('.user-id').html( localStorage.getItem('userid') );
        $('.sidebar-content').hide();

        if (!sidebar.isVisible()) {
            sidebar.show();
        }

        $('#account-info').show();

      }

    }

}

// Check if the localStorage has token, if yes log the user in with data
$(document).ready(function() {
  var tokenTest = localStorage.getItem('token');
  console.log('token value', tokenTest);
  if (tokenTest !== null ) {
      switchSession('login');
  }
  else {return;}
});

// Alerts by lgal http://stackoverflow.com/a/33662720/2842348
function showAlert(errorMessage, errorType, closeDelay) {

    // default to alert-info; other options include success, warning, danger
    if (!errorType || typeof errorType === 'undefined' ) {  var errorType = "info"; }

    var alert = $('<div class="alert alert-' + errorType + ' fade in">').append(errorMessage);
    // add the alert div to top of alerts-container, use append() to add to bottom
    $(".alert-container").prepend(alert);

    // if closeDelay was passed - set a timeout to close the alert
    if (closeDelay) {
        window.setTimeout(function() { alert.alert("close"); }, closeDelay);
    }
}

// Activate dropdown menu links
$(document).ready(function() {

  $('#user-tools').on('click', 'a', function(e) {
    if ($(this).hasClass('dropdown-link')) {
          e.preventDefault();
          bottombar.hide();
          sidebar.show();
          $(this.hash).fadeIn().siblings().hide();
    }
  });

});

// Actions for map-tools dropdown
$(document).ready(function() {

  // Locate the user
  $('.btn-locate').on('click', function(){
    sidebar.hide('slow');
    bottombar.hide();
    map.locate({setView: true, maxZoom: 20}).on('locationerror', onLocationError);

  });

  // Show nearby trashbins
  $('#btn-trashbins').on('click', function(){
    osmTrashbinLayer = new L.OverPassLayer({
       query: '(node["amenity"="waste_basket"]({{bbox}});node["amenity"="recycling"]({{bbox}});node["amenity"="waste_disposal"]({{bbox}}););out;'
    });
    map.addLayer(osmTrashbinLayer);
  });

});

// Display the date and time picker and get the data in the cleaning form on change
$(document).ready(function() {

  $('.selectpicker').selectpicker({ style: 'btn-lg btn-default text-center', size: 6});

  $(function () { $('#event-date-time-picker')
    .datetimepicker( {minDate: new Date(2015, 11, 31)});
  });

  $('#event-date-time-picker').on('dp.change', function(e) {
     var eventDateTime = e.date.format('DD/MM/YYYY HH:MM');
    $('.date-time-value').val(eventDateTime);
  });

});

// Hide all the siblings of the clicked link in the sidebar when linking internally and reset sidebar scroll
$('.sidebar-link').click(function(e) {
    e.preventDefault();
    $(this.hash).fadeIn().siblings().hide();
    $('#sidebar').scrollTop = 0;
});

// Go back to the marker creation menu link
$('.menu-backlink').click(function(e) {
    $('.panel-collapse').collapse('hide');
    $('#sidebar').scrollTop = 0;
    $(this.hash).fadeIn().siblings().hide();
    e.preventDefault();
});

// Close sidebar if cancel button clicked
$(".btn-cancel").on('click', function (){
    sidebar.hide();
    map.removeLayer(marker);
});

// Empty the sidebar on hide, reset accordion and reset scroll
sidebar.on('hide', function () {
        $('.sidebar-content').hide();
        $('#sidebar').scrollTop = 0;
        $('form').each(function() { this.reset(); });
        $('input').val('');
        $('.selectpicker').selectpicker('render');
        $('.leaflet-draw-edit-edit').removeClass('visible');
        $('.leaflet-draw-edit-remove').removeClass('visible');
});

// Empty the bottom panel on call of this function
function clearBottomPanelContent() {
  //TODO ad methods depending on the type of object clicked
  $(".feature-info").empty();
  $(".feature-info-confirmed strong").text('0');
  $("#feature-info-image").attr("src", "");
  $("#feature-info").find('.feature-image-link').attr("href", "");
  $('#feature-info').find('.btn-share').each(function() {
    $(this).attr("data-url", "");
  });
}

// Get data from the features into the bottom bar


function pushDataToBottomPanel(e) {
  
  console.log('value of e: ', e)
  console.log('value of e.options: ', e.options.featuretype)
  
  if (typeof e.options.featuretype === 'undefined') {
    console.log('getting data from garbage marker');
    
    var markerTypes = e.options.types,
        markerAmount = e.options.amount,
        markerRawImage = e.options.imageUrl,
        markerId = e.options.id,
        markerCreatedBy = e.options.marked_by,
        markerNote = e.options.note,
        markerTags = e.options.tags,
        markerTodo = e.options.todo,
        markerConfirm = e.options.confirm,
        markerSize = e.options.size,
        markerEmbed = e.options.embed,
        markertarget = "http://garbagepla.net/#15/"+e.options.Lat+"/"+e.options.Lng+"string";

    // Put a placeholder if the media is empty
    if (!markerRawImage) {
      $('#feature-info').find('.feature-image').attr('src', 'http://placehold.it/160x120');
      $('#feature-info').find('.feature-image-link').attr('href', '');
    }

    if (markerRawImage) {
      // Add an IMGUR api character to the url to fetch thumbnails to save bandwidth
      String.prototype.insert = function (index, string) {
          if (index > 0) {
              return this.substring(0, index) + string + this.substring(index, this.length);
          } else {
            return string + this;
          }
      };

      markerImage = markerRawImage.insert(26, "t");
      $('#feature-info').find('.feature-image').attr('src', markerImage);
      $('#feature-info').find('.feature-image-link').attr('href', markerRawImage);
    }

    $('#feature-info').find('.feature-info-garbage-type').html(markerTypes.join(", "));
    $("#feature-info-created-by").html(markerCreatedBy);
    
    // push the url to the href of share buttons
    $('#feature-info').find('.btn-share').each(function() {
      $(this).attr("data-url", markertarget);
    });
    
    $('#feature-info').find('.feature-info-confirmed p strong').html(markerConfirm);

    // amount mapping
    switch (markerAmount) {
        case 0:
            $('#feature-info').find('.feature-info-garbage-amount').html(' Are you sure about that?');
            break;
        case 1:
            $('#feature-info').find('.feature-info-garbage-amount').html(' You are seeing ghosts');
            break;
        case 2:
            $('#feature-info').find('.feature-info-garbage-amount').html(' Here and there');
            break;
        case 3:
            $('#feature-info').find('.feature-info-garbage-amount').html(' Quite some');
            break;
        case 4:
            $('#feature-info').find('.feature-info-garbage-amount').html(' Already too much');
            break;
        case 5:
            $('#feature-info').find('.feature-info-garbage-amount').html(' What happened here?');
            break;
        case 6:
            $('#feature-info').find('.feature-info-garbage-amount').html(' This is getting out of hand');
            break;
        case 7:
            $('#feature-info').find('.feature-info-garbage-amount').html(' Dude...');
            break;
        case 8:
            $('#feature-info').find('.feature-info-garbage-amount').html(' What the what?');
            break;
        case 9:
            $('#feature-info').find('.feature-info-garbage-amount').html(' Cant touch this');
            break;
        case 10:
            $('#feature-info').find('.feature-info-garbage-amount').html(' Oh my God Becky, look at...');
            break;
        default:
            $('#feature-info').find('.feature-info-garbage-amount').html(' Undefined');
            break;
    }
    
  }
  
  if (e.options.featuretype === 'marker_cleaning') {
    console.log('getting data from cleaning marker');
    
    var markerDate = e.options.date,
        markerId = e.options.id,
        markerRecurrence = e.options.Rrcurrence,
        markerParticipants = e.options.participants,
        markerCreatedBy = e.options.marked_by
    }
  
  if (e.options.featuretype === 'polyline_litter') {
    console.log('getting data from litter');
    
    var tlitterType = e.layer.options.type,
        litterAmount = e.layer.options.amount,
        litterRawImage = e.layer.options.imageUrl,
        litterLatLngs =e.layer.options.latlngs,
        litterId = e.layer.options.id,
        litterTags = e.layer.options.tags,
        litterNote = e.layer.options.note,
        litterLength = e.layer.options.length,
        litterConfirm = e.layer.options.confirm,
        litterCreatedBy = e.options.marked_by;
    
    // Put a placeholder if the media is empty
    if (!litterRawImage ) {
      $('#feature-info').find('.feature-image').attr('src', 'http://placehold.it/160x120');
      $('#feature-info').find('.feature-image-link').attr('href', '');
    }

    if (litterRawImage) {

      // Add an IMGUR api character to the url to fetch thumbnails to save bandwith
      String.prototype.insert = function (index, string) {

        if (index > 0) {
            return this.substring(0, index) + string + this.substring(index, this.length);
        } else {
          return string + this;
        }
      };

      litterImage = litterRawImage.insert(26, "t");

      $('#feature-info').find('.feature-image').attr('src', litterImage);
      $('#feature-info').find('.feature-image-link').attr('href', litterRawImage);

    }
    
    // amount mapping
    switch (litterAmount) {
      case 0:
        $('#feature-info').find('.feature-info-garbage-amount').html('Are you sure about that?');
        break;
      case 1:
        $('#feature-info').find('.feature-info-garbage-amount').html('You are seeing ghosts');
        break;
      case 2:
        $('#feature-info').find('.feature-info-garbage-amount').html('Here and there');
        break;
      case 3:
        $('#feature-info').find('.feature-info-garbage-amount').html('Quite some');
        break;
      case 4:
        $('#feature-info').find('.feature-info-garbage-amount').html('Already too much');
        break;
      case 5:
        $('#feature-info').find('.feature-info-garbage-amount').html('What happened here?');
        break;
      case 6:
        $('#feature-info').find('.feature-info-garbage-amount').html('This is getting out of hand');
        break;
      case 7:
        $('#feature-info').find('.feature-info-garbage-amount').html('Dude...');
        break;
      case 8:
        $('#feature-info').find('.feature-info-garbage-amount').html('What the what?');
        break;
      case 9:
        $('#feature-info').find('.feature-info-garbage-amount').html('Cant touch this');
        break;
      case 10:
        $('#feature-info').find('.feature-info-garbage-amount').html('Oh my God Becky');
        break;
      default:
        $('#feature-info').find('.feature-info-garbage-amount').html('Undefined');
    } 
    
  }
  
  if (e.options.featuretype === 'polygon_area') {
    console.log('getting data from area');
    
    var areaLatLngs = e.layer.options.latlngs,
    areaId = e.layer.options.id,
    areatags = e.layer.options.tags,
    areacontact = e.layer.options.contact,
    areanote = e.layer.options.note,
    areatitle = e.layer.options.title,
    areaplayers = e.layer.options.players,
    areaCreatedBy = e.options.marked_by;
    
    if (e.options.game) {
      // TODO add button to join game
      // TODO body.append('modal') with secret input to join game area
    }
  }
  
}

// Confirm garbage function
// TODO bind this to the db
/*$('.btn-confirm').on('click', confirmGarbage );*/

// Confirmation for garage abd polylines
/*function confirmGarbage(obj){
  // TODO Finish this
  // TODO make session-dependant and allow once per user per marker
  if (!localStorage.getItem('token')){
    showAlert("You need to login to do that.", "info", 2000);
  }

  var counts = parseInt($(".feature-info-confirmed strong").val, 10);
  counts = isNaN(counts) ? 0 : value;
  counts++;
  $(".feature-info-confirmed strong").val = counts;

    setTimeout(function () {
      // var useToken = localStorage["token"] || window.token;
      var useToken = localStorage.getItem('token') || window.token;

      $.ajax({
          method: api.confirmTrash.method,
          url: api.confirmTrash.url(),
          headers: {"Authorization": "Bearer" + useToken},
          data: {
              'confirm': counts // TODO how to do this?
          },
          success: function (data) {
              console.log('success data', data);
              // todo change the value in the UI
          },
          error: function (err) {
              console.log('err', err);
          }
      });
    }, 100);
};*/

// TODO Join cleaning event function
/*function joinCleaning(obj){
  // TODO Finish this
  // TODO make session-dependant and allow once per user per marker
  if (!localStorage.getItem('token')){
    showAlert("You need to login to do that.", "info", 2000);
  }

  var counts = parseInt($(".feature-info-confirmed strong").val, 10);
  counts = isNaN(counts) ? 0 : value;
  counts++;
  $(".cleaning-info-confirmed strong").val = counts;

    setTimeout(function () {
      // var useToken = localStorage["token"] || window.token;
      var useToken = localStorage.getItem('token') || window.token;

      $.ajax({
          method: api.joinCleaning.method,
          url: api.readCleaning.url(),
          headers: {"Authorization": "Bearer" + useToken},
          data: {
              'confirm': counts // TODO how to do this?
          },
          success: function (data) {
              console.log('success data', data);
              // todo change the value in the UI
          },
          error: function (err) {
              console.log('err', err);
          }
      });
    }, 100);
};*/