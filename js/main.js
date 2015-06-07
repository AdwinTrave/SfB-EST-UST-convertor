/**
 * Struggle for Balance time conventor
 * @author Jan Dvorak IV.
 */

/*
 * Settings
 * Standard unit is milisecond from which all calculations are going to be made
 */
var unit1 = 1000; //how many miliseconds does the unit have
var unit2 = unit1 * 100;
var unit3 = unit2 * 100;
var unit4 = unit3 * 10;
var unit5 = unit4 * 500;

var unitArray = [unit5, unit4, unit3, unit2, unit1]; //must be in order from the largest to smallest
var unitLength = [3, 3, 2, 2, 2]; //default length of each unit space, ie. 001 - 3, 100 - 3, 59 - 2, maximum is 3 right now
var unitSeparator = ["SUT ", ".", " ", ":", ":", ""]; //formating, determines what symbols will be between different
var unitDeclaration = "before"; //options: before, after, both, false - additional option for unitSeparator to show time declaration like SUT xxxx

var timeBegins = moment("2400-01-01 00:00"); //the moment when time begins in relation to Earth time

//create the object
var sut = new fictionalTime(unitArray, unitLength, timeBegins.valueOf(), unitSeparator, unitDeclaration);

//old variables
var sutMinuteSec = 100;
var sutHourSec = sutMinuteSec * 100;
var sutDaySec = sutHourSec * 10;
var sutYearSec = sutDaySec * 500;

var earthYearReformed = 31622400000;

$(function(){
  //time to sut start
  $("#toSut").text(timeBegins.fromNow());

  //today at GMT
  todayGMT();
  //today at local time
  todayLocal();
  //countdown to SUT in SUT
  countdownToBegin();
  //passed SUT
  passedSUT();
  //curent date and time
  curentSUT();

  //forms
  //Earth year to SUT year
  $("#eyToSUTY").submit(function(event){
    event.preventDefault();
    $("#eyToSUTYResult").text( earthYearsToSUT($("#eyToSUTYInput").val()) );
  });

  //SUT year to Earth year
  $("#sutToEY").submit(function(event){
    event.preventDefault();
    $("#sutToEYResult").text( SUTyearsToEarth($("#sutToEYInput").val()) );
  });

  //setup date picker for Earth year
  $("#eDToSUTInput").fdatepicker({format:"yyyy-mm-dd"});
  //Earth date to SUT
  $("#eDToSUT").submit(function(event){
    event.preventDefault();
    $("#eDToSUTResult").text( earthDateToSUT($("#eDToSUTInput").val()) );
  });

  //SUT date to Earth date
  $("#sutToED").submit(function(event){
    event.preventDefault();
    $("#sutToEDResult").text( sutDateToEY($("#sutToEDInput").val()) );
  });
});

/**
 * Shows current GMT time
 */
function todayGMT(){
  $("#todayGMT").text(moment().utc().format("MMMM DD, YYYY HH:mm:ss"));
  setTimeout(todayGMT, 1000);
}

/**
 * Shows current local time
 */
function todayLocal(){
  $("#todayLocal").text(moment().format("MMMM DD, YYYY HH:mm:ss"));
  setTimeout(todayLocal, 1000);
}

/**
 * Calculates current SUT time for the local time
 */
function countdownToBegin(){
  $("#countdownToBegin").text(sut.toTime(timeBegins.valueOf() - Date.now()));

  setTimeout(countdownToBegin, 1000);
}

/**
 * A clock that counts how much time has passed since user opened the webpage
 */
var timeOnPage = 0;
function passedSUT(){
  timeOnPage += 1000;
  $("#passedSUT").text(sut.toTime(timeOnPage));
  setTimeout(passedSUT, 1000);
}

/**
 * Current SUT time
 */
function curentSUT(){
  $("#curentSUT").text(sut.currentTime);
  setTimeout(curentSUT, 1000);
}

/**
 * Takes in SUT years and figures out Earth years based on years after calendar reform of 2400
 */
function SUTyearsToEarth(sutYears){
  //first get down to milliseconds
  var milliseconds = sut.unitToMilliseconds(sutYears, 0);

  return milliseconds / earthYearReformed;
}

/**
 * Takes Earth years and converts them to SUT years
 */
function earthYearsToSUT(earthYear)
{
  //break it down to milliseconds
  var milliseconds = earthYear * earthYearReformed;

  //reconstruct into SUT and return
  return sut.toFictionalUnit(milliseconds, 0);
}

/**
 * Gets an Earth date and converts it to SUT date
 */
function earthDateToSUT(earthDate){
  return sut.toDate(moment(earthDate).valueOf());
}


/**
 * Get SUT date and convert it to Earth date
 */
function sutDateToEY(sutDate){

  //validate we have a number
  //@todo improve validation
  if(isNaN(sutDate))
  {
    return "Please enter a valid SUT date in this format: YYY.DDD";
  }

  //validate that the input is correct
  var input = sutDate.split(".");

  if(input.length !== 2)
  {
    //there should be two entries, if there aren't return error
    return "Please enter a valid SUT date in this format: YYY.DDD";
  }

  var year = input[0];
  var day = input[1];

  //validate input
  if(day > 500)
  {
    return "SUT Year has only 500 days. Which means you should enter days between 000 to 499.";
  }

  //get the seconds for the years
  var milliseconds = sut.unitToMilliseconds(year, 0);
  //get the seconds for the days
  milliseconds += sut.unitToMilliseconds(day, 1);

  //add year 2400
  milliseconds = timeBegins.valueOf() + milliseconds;
  return moment(milliseconds).format('YYYY-MM-DD');
}
