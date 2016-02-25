// Display the date and time picker and get the data in the cleaning form on change
$(document).ready(function() {

  $('.selectpicker').selectpicker({ style: 'btn-lg btn-default text-center', size: 6});

  // TODO start mobile and non-mobile instance to be able to customize the display
  
  $(function () { $('#event-date-time-picker')
    .datetimepicker( {
        minDate: new Date(2015, 11, 31),
        showClose: true,
        ignoreReadonly: true,
        focusOnShow: false,
        toolbarPlacement: 'top'
    });
  });

  $('#event-date-time-picker').on('dp.change', function(e) {
     var eventDateTime = e.date.format('DD/MM/YYYY HH:MM');
    $('.date-time-value').val(eventDateTime);
  });
  
  // Separate tags by hitting space bar or right key
  $('.feature-tags').tagsinput({
    maxTags: 3,
    confirmKeys: [32, 39],
    maxChars: 16,
    trimValue: true
  });
  
  
  $("form").bind("keypress", function (e) {
      if (e.keyCode == 13) {
          $(".btn-save").attr('type');
          e.preventDefault();
      }
  });

});