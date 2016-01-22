//TODO use removeControl() rather than hiding the control with CSS when they are not in use

// All code related to drawing shapes
var drawControl = new L.Control.Draw({
    position: 'topright',
    draw: { circle: false,
            rectangle: false,
            marker: false },
    edit: {
        featureGroup: pathLayerGroup,
        remove: true
    }
});

map.addControl(drawControl);

map.on('draw:drawstart', function (e) {
      var type = e.layerType,
          layer = e.layer,
          distanceStr;
  
  //FIXME
  // get the lenght inside $('.polyline-length') and area inside $('.polygone-area')
  // the value is sotred as distanceStr in L.Draw.js
  console.log("current length", distanceStr);
  $('input[class=polyline-length]').val(distanceStr);
  
});

// Stop click listening when editing features
map.on('draw:editstart', function (e) { map.off('click', onMapClick) });

map.on('draw:editstop', function (e) { map.on('click', onMapClick) });

// Need to make sure the user can click again on the map if the drawing is aborted
// This needs to be called in this fashion else it messes up onMapClick's behavior
map.on('draw:drawstop', function () { map.off('click', onMapClick); map.on('click', onMapClick) });

// What to do once a shape is created
map.on('draw:created', function (e) {
    var type = e.layerType;
        
    if (type === 'polyline') {
      
      var polylineLayer = e.layer;
        
      // Range slider for amount of garbage on polyline
      $('.polyline-range-input').on('change', function() {
          $('.polyline-range-value').html(this.value);
          // Get the color value from the select options
          var selectedValue = parseInt(jQuery(this).val());
            switch(selectedValue){
                    // so much cringe here, let's try to do this with ternaries
                      case 1:
                          polylineLayer.setStyle({color:"green"}); 
                          break;
                      case 2:
                          polylineLayer.setStyle({color:"limegreen"}); 
                          break;
                      case 3:
                          polylineLayer.setStyle({color:"yellow"}); 
                          break;
                      case 4:
                          polylineLayer.setStyle({color:"gold"}); 
                          break;
                      case 5:
                          polylineLayer.setStyle({color:"orange"}); 
                          break;
                      case 6:
                          polylineLayer.setStyle({color:"orangered"});
                          break;
                      case 7:
                          polylineLayer.setStyle({color:"red"});
                          break;
                      case 8:
                          polylineLayer.setStyle({color:"darkred"}); 
                          break;
                      case 9:
                          polylineLayer.setStyle({color:"purple"}); 
                          break;
                      case 10:
                          polylineLayer.setStyle({color:"black"}); 
                          break;
                      default:
                          polylineLayer.resetStyle();
                          break;
              }
      });

      pathLayerGroup.addLayer(polylineLayer)
      map.addLayer(pathLayerGroup);
      
      $('.btn-cancel').on('click', function(){
        $('.leaflet-draw-edit-edit').removeClass('visible');
        map.removeLayer(polylineLayer);
      });
      
      
      // Saving form
       //TODO
      /*
      $('#button-save-tile').click(function () {
          var ne_lat = Number($('#activate-tile-dialog').find('.tile-ne-lat').text());
          var ne_lng = Number($('#activate-tile-dialog').find('.tile-ne-lng').text());
          var sw_lat = Number($('#activate-tile-dialog').find('.tile-sw-lat').text());
          var sw_lng = Number($('#activate-tile-dialog').find('.tile-sw-lng').text());
          var tile_name = $('#l-tile-name').val();
          // Set the type of the shape so we can use if (shapeType = polyline ) in GET
          var shapeType = polyline
          // get the points
          var latLngs = e._latlngs[0]...[n]
          console.log('tile name', tile_name);
          var useToken = localStorage["token"] || window.token;
          $.ajax({
              method: api.createShape.method,
              url: api.createShape.url(),
              headers: {"Authorization": "Bearer " + useToken},
              data: {
                  'name': tile_name,
                  'ne_lat': ne_lat, 
                  'ne_lng': ne_lng,
                  'sw_lat': sw_lat,
                  'sw_lng': sw_lng
              },
              method: 'post',
              success: function (data) {
                  console.log('suc data', data);
                  alert('Tile saved successfully!');
                  showAlert("Path saved successfully!", "success", 1200);
                  window.rectangle.editing.disable();
                  sidebar.hide('slow');

              },
              error: function (err) {
                  console.log('err', err);
                  alert('Something went wrong, please try again', err);
                  showAlert("There was an error while saving the path.", "danger", 1200);
                  sidebar.hide();
                  map.removeLayer(polylineLayer);
              }
          })
      })*/
      
      
    }
  
    if( type === 'polygon') {
      
      var polygonLayer = e.layer;
      
      //TODO
      //ajax success
        showAlert("Area saved successfully!", "success", 1200);
      //ajax error
        showAlert("There was an error while saving the area.", "danger", 1200);
      
        areaLayerGroup.addLayer(polygonLayer);
        map.addLayer(areaLayerGroup);
      
        $('.btn-cancel').on('click', function(){
          $('.leaflet-draw-edit-edit').removeClass('visible');
          map.removeLayer(polygonLayer);
        });
      
    }
    
    // Reactivate default marker event listener
    map.on('click', onMapClick);
});

// What to do once a shape was edited
map.on('draw:edited', function (e) {
    var layers = e.layers;
    layers.eachLayer(function (layer) {
      
    var type = e.layerType,
    layer = e.layer;
      
    if( type === 'polyline') {}
      
    if( type === 'polygon') {}
      
    });
    map.on('click', onMapClick);
});

// Show the edit button on draw, hide on cancel / save
$('.btn-draw-polyline').on('click', function(){
  // Stop default marker event listener
  map.off('click', onMapClick);
  map.removeLayer(marker);
  $('.leaflet-draw-edit-edit').addClass('visible');
  new L.Draw.Polyline(map, 
                          { allowIntersection: false,
                               drawError: {
                               color: '#cc0000',
                               timeout: 2000 
                               },
                            metric: true,
                            clickable: true,
                            shapeOptions: {
                              color: '#A9A9A9',
                              weight: 10,
                              opacity: 0.5,
                              smoothFactor: 2}}).enable();
});

$('.btn-draw-polygon').on('click', function(){
  // Stop default marker event listener
  map.off('click', onMapClick);
  map.removeLayer(marker);
  $('.leaflet-draw-edit-edit').addClass('visible');
  new L.Draw.Polygon(map, 
                          { 
                           shapeOptions: {
                              color: '#dd55ff',
                              weight: 5,
                              opacity: 0.5,
                              smoothFactor: 2
                              },
                          showArea: true,
                          metric: true,
                          clickable: true,
                          allowIntersection: false,
                                 drawError: {
                                 color: '#cc0000',
                                 timeout: 2000 
                                 }}).enable();
});


// FIXME make sure the function below don't mess the shapes onClick in get_features.js
// Add click events for draw layers
pathLayerGroup.on('click', 
  function onPathClick (e) {
    sidebar.hide();
    bottombar.show();
    map.fitBounds(e.layer.getBounds(), {paddingBottomRight: [0,200]});
    // map.panToOffset(e._latlng, _getVerticalOffset());
});

areaLayerGroup.on('click', 
  function onAreaClick (e) {
    sidebar.hide();
    bottombar.show();
    map.fitBounds(e.layer.getBounds());
});