var time;
$(function(){
  /**
   * Load the submited time
   */
  $("#load").submit(function(event){
    event.preventDefault();

    //start animation on the button
    $("#cog").attr("class", "fa fa-cog fa-spin");

    //parse into JSON
    var code = $("#timeCode").val();

    var valid = true;

    var json, name, beginning, units, separators, declaration;
    try {
      json = JSON.parse(code);

      //separate all the parts into individual variables
      name = json.name;
      beginning = json.beginning;
      units = json.units;
      separators = json.separators;
      declaration = json.declaration;

    } catch (e) {
      console.log(e);
      //display error after #warning
      $("#warning").after('<div id="warning" data-alert class="alert-box alert radius">Incorrect JSON format.<a href="#" class="close">&times;</a></div>');
      valid = false;
    }

    if(valid)
    {
      /**
       * Validate the variables
       */
      //name - check for any potential code insertions

      //beginning - make sure that it is an int

      //units - check that it is a int array
      if( !Array.isArray(units) )
      {
        valid = false;
      }

      //separators - check that it is a proper string array
      //check proper length
      if (!Array.isArray(separators))
      {
        valid = false;
      }

      if(!valid)
      {
        $("#warning").after('<div id="warning" data-alert class="alert-box alert radius">Incorrect JSON format.<a href="#" class="close">&times;</a></div>');
      }
      else
      {
        //initialize the fictional time
        time = new fictionalTime(name, units, beginning, separators, declaration);

        //initialize the rest of the page
        startTime();
      }
    }
  });
});

/**
 * Starts all the clocks and converters
 * @function startTime
 */
function startTime()
{
  //get how long does it take for the smallest unit to elapse to set timeouts
  var timeout = time.units[time.units.length-1];

  //put the name into the text
  $("[class^=timeName]").html(time.name);

  //clocks
  localTime();
  currentFictional(timeout);
  countdownToBegin(timeout);

  //converters
  $("#eyToTimeY").submit(function(event){
    event.preventDefault();
    $("#eyToTimeYResult").text( earthYearsToTimeYears($("#eyToTimeYInput").val()) );
  });

  //SUT year to Earth year
  $("#timeToEY").submit(function(event){
    event.preventDefault();
    $("#timeToEYResult").text( timeYearsToEarthYears($("#timeToEYInput").val()) );
  });

  //setup date picker for Earth year
  $("#eDToTimeInput").fdatepicker({format:"yyyy-mm-dd"});
  //Earth date to SUT
  $("#eDToTime").submit(function(event){
    event.preventDefault();
    $("#eDToTimeResult").text( earthDateToTime($("#eDToTimeInput").val()) );
  });

}

function localTime()
{
  $("#localTime").text(moment().format("MMMM DD, YYYY HH:mm:ss"));
  setTimeout(localTime, 1000);
}

function currentFictional(timeout)
{
  $("#currentFictional").text(time.currentTime);
  setTimeout(currentFictional, timeout);
}

function countdownToBegin(timeout)
{
  $("#countdownToBegin").text(time.toTime(time.beginning - Date.now()));
  setTimeout(countdownToBegin, timeout);
}

function earthYearsToTimeYears(input)
{
  //break it down to milliseconds
  var milliseconds = input * 31557600000;

  //reconstruct into SUT and return
  return time.toFictionalUnit(milliseconds, 0);
}

function timeYearsToEarthYears(input)
{
  //first get down to milliseconds
  var milliseconds = time.unitToMilliseconds(input, 0);

  return milliseconds / 31557600000;
}

function earthDateToTime(input)
{
  return time.toDate(moment(input).valueOf());
}
