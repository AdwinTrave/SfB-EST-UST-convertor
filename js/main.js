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

var timeBegins = moment("2400-01-01"); //the moment when time begins in relation to Earth time

//old variables
var sutMinuteSec = 100;
var sutHourSec = sutMinuteSec * 100;
var sutDaySec = sutHourSec * 10;
var sutYearSec = sutDaySec * 500;

var earthYearReformedSec = 31622400;

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
  //first determine time to SUT beginning
  var toStart = timeBegins.diff(moment());
  //convert the miliseconds to SUT date
  $("#countdownToBegin").text(toTime(toStart));

  setTimeout(countdownToBegin, 1000);
}

/**
 * A clock that counts how much time has passed since user opened the webpage
 */
var timeOnPage = 0;
function passedSUT(){
  timeOnPage += 1000;
  $("#passedSUT").text(toTime(timeOnPage));
  setTimeout(passedSUT, 1000);
}

/**
 * Current SUT time
 */
function curentSUT(){
  $("#curentSUT").text(toTime(moment()));
  setTimeout(curentSUT, 1000);
}

/**
 * Calculates the time from miliseconds
 */
function toTime(miliseconds)
{
  var output = [];

  for (var i = 0; i < unitArray.length; i++) {
    //first figure out if we are before of after the beginning of the time
    var minus = false;

    //only add minus at the first number
    if(i === 0)
    {
      if(miliseconds < timeBegins.valueOf())
      {
        minus = true;
      }
    }
    //calculate how much of the given unit is there in the time
    output[i] = Math.floor( Math.abs(miliseconds / unitArray[i]) );

    //reduce the time by the unit calculated
    miliseconds = miliseconds - (output[i] * unitArray[i]);

    //add the appropriate number of zeroes
    output[i] = defaultZeros(output[i], unitLength[i], minus);
  }

  //return the string to display the time
  var outputString;
  for (var i = 0; i < output.length; i++) {
    var k = i+1;

    //unit declaration before time
    if(i === 0)
    {
      if(unitDeclaration === "before" || unitDeclaration === "both")
      {
        outputString = unitSeparator[i];
      }
    }

    outputString += output[i] + unitSeparator[k];

    //unit declaration after time
    if(i === output.length)
    {
      if(unitDeclaration === "after" || unitDeclaration === "both")
      {
        outputString += unitSeparator[k+1];
      }
    }

  }
  return outputString;
}

/**
 * Account for default zeros in the given fields
 */
function defaultZeros(number, defaultExtraZeroes){

  number = number.toString();

  switch(defaultExtraZeroes)
  {
    case 1: /* no need to do anything */ break;
    case 2:
      if(number < 0)
      {
        //we have a negative value
        //determine if any changes are needed
        if(number.length !== 3)
        {
          //remove the minus sign
          number = number.substring(1);

          //determine how many zeroes will have to be added
          if(number.length === 1)
          {
            number = "0" + number;
          }
        }
      }
      else
      {
        if(number < 10)
        {
          return "0"+number;
        }
      }
      break;
    case 3:
      if(number < 0)
      {
        //we have a negative value
        //determine if any changes are needed
        if(number.length !== 4)
        {
          //remove the minus sign
          number = number.substring(1);

          //determine how many zeroes will have to be added
          if(number.length === 1)
          {
            number = "00" + number;
          }
          if(number.length === 2)
          {
            number = "0" + number;
          }
        }
      }
      else
      {
        if(number < 10)
        {
          return "00"+number;
        }
        if(number < 100)
        {
          return "0"+number;
        }
      }
      break;
      default: break;
  }

  return number;
}

/**
 * Takes in SUT years and figures out Earth years based on years after calendar reform of 2400
 */
function SUTyearsToEarth(sutYears){
  //first get down to seconds
  var seconds = sutYears*sutYearSec;

  return Math.round((seconds / earthYearReformedSec)*1000)/1000;
}

/**
 * Takes Earth years and converts them to SUT years
 */
function earthYearsToSUT(earthYear)
{
  //break it down to seconds
  var seconds = earthYear * earthYearReformedSec;

  //reconstruct into SUT and return
  return Math.floor((seconds / sutYearSec)*1000)/1000;
}

/**
 * Gets an Earth date and converts it to SUT date
 */
function earthDateToSUT(earthDate){
  var seconds, day;
  var earthYear = moment(earthDate).year()-1 ; //moment.js substracts one from the actual year, bug?

  //first check if it is before or after 2400
  if(earthYear <= 2400)
  {
    seconds = (earthYear-2400)*earthYearReformedSec;
    //we can use Moment.js to get us the seconds counts for day
    day = moment(earthDate).dayOfYear();
  }
  else
  {
    //we have to count ourselves due to the calendar reform of 2400
    //first let's get the seconds for year (don't forget to subtract year 2400)
    seconds = (earthYear-2400)*earthYearReformedSec;

    //now let's get the day of the year
    day = moment(earthDate).dayOfYear();
    //29th February is the 60th day
    if( !((day > 60 && !moment(earthYear).isLeapYear()) || day <= 60))
    {
      //we have to add one extra day to our calculations to be more accurate
      day++;
    }
  }
  //add second for the days in the the year
  seconds += day*86400; //24*60*60

  return toTime(seconds*1000);
}


/**
 * Get SUT date and convert it to Earth date
 */
function sutDateToEY(sutDate){
  var year, day, seconds;

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

  year = input[0];
  day = input[1];

  //validate input
  if(day > 500)
  {
    return "SUT Year has only 500 days.";
  }

  //get the seconds for the years
  seconds = year * sutYearSec;
  //get the seconds for the days
  seconds += day * sutDaySec;

  //add year 2400
  var milliseconds = 13569483600000; // 2400 in milliseconds
  milliseconds = milliseconds + (seconds * 1000);
  return moment(milliseconds).format('YYYY-MM-DD');
}
