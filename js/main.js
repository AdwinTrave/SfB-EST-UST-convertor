//basic values
var sutStart = moment("2400-01-01");
var secondsOnPage = 0;

var sutMinuteSec = 100;
var sutHourSec = sutMinuteSec * 100;
var sutDaySec = sutHourSec * 10;
var sutYearSec = sutDaySec * 500;

var earthYearReformedSec = 31622400;

$(function(){
  //basic selectors
  moment().format();

  //time to sut start
  $("#toUst").text(moment(sutStart).fromNow());

  //today at GMT
  todayGMT();
  //today at local time
  todayLocal();
  //countdown to SUT in SUT
  sutCountdown();
  //passed SUT
  passedSUT();
  //curent date and time
  curentSUT();

  //forms
  $("#eyToSUTY").submit(function(event){
    event.preventDefault();
    $("#eyToSUTYResult").text( earthYearsToSUT($("#eyToSUTYInput").val()) );
  });

  $("#sutToEY").submit(function(event){
    event.preventDefault();
    $("#sutToEYResult").text( SUTyearsToEarth($("#sutToEYInput").val()) );
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
function sutCountdown(){
  //first determine time to SUT beginning
  var toSUT = sutStart.diff(moment(), 'seconds');
  //convert the seconds to SUT date
  var SUTDate = secondsToSUT(toSUT);
  //add minus and display
  $("#sutCountdown").text("SUT -" + SUTDate);

  setTimeout(sutCountdown, 1000);
}

/**
 * A clock that counts how much time has passed since user opened the webpage
 */
function passedSUT(){
  secondsOnPage++;
  $("#passedSUT").text("SUT " + secondsToSUT(secondsOnPage));
  setTimeout(passedSUT, 1000);
}

/**
 * Current SUT time
 */
function curentSUT(){
  //get the number of seconds to SUT
  var seconds = sutStart.diff(moment(), 'seconds');

  //@todo extrapolate into new funtion that should be able to deal with both pre and SUT times, not just pre-SUT
  //years and days will go the same way as with countdown, but the clock needs to go forward
  var secondsNew, minutes, hours, days, years, dayBegin, hoursDown, minutesDown;
  years = Math.floor(seconds / sutYearSec);
  days = Math.floor( (seconds - (years * sutYearSec)) / sutDaySec );
  //find out at what second has the day begun when day has begun
  dayBegin = (years * sutYearSec)+(days * sutDaySec);
  //find the current time by determining how much time is left in the day
  hours = 10 - Math.floor( (seconds - ((years * sutYearSec)+(days * sutDaySec))) / sutHourSec );
  hoursDown = Math.floor( (seconds - ((years * sutYearSec)+(days * sutDaySec))) / sutHourSec );
  minutes = 100 - Math.floor( (seconds - ((years * sutYearSec)+(days * sutDaySec)+(hoursDown*sutHourSec))) / sutMinuteSec );
  minutesDown = Math.floor( (seconds - ((years * sutYearSec)+(days * sutDaySec)+(hoursDown*sutHourSec))) / sutMinuteSec );
  secondsNew = 100 - (seconds -( (years * sutYearSec)+(days * sutDaySec)+(hoursDown*sutHourSec)+(minutesDown*sutMinuteSec)));

  //add default zeros
  years = defaultZeros(years, 2);
  days = defaultZeros(days, 2);
  hours = defaultZeros(hours, 1);
  minutes = defaultZeros(minutes, 1);
  secondsNew = defaultZeros(secondsNew, 1);

  if(seconds < 120000000000) //means we are before SUT
  {
    years = "-"+years;
  }
  $("#curentSUT").text(years + "." + days + " " + hours + ":" + minutes + ":" + secondsNew);
  setTimeout(curentSUT, 1000);
}

/**
 * Calculates the SUT time from input of seconds and returns in a formated string
 */
function secondsToSUT(seconds){
  //parts
  var secondsNew, minutes, hours, days, years;

  years = Math.floor(seconds / sutYearSec);
  days = Math.floor( (seconds - (years * sutYearSec)) / sutDaySec );
  hours = Math.floor( (seconds - ((years * sutYearSec)+(days * sutDaySec))) / sutHourSec );
  minutes = Math.floor( (seconds - ((years * sutYearSec)+(days * sutDaySec)+(hours*sutHourSec))) / sutMinuteSec );
  secondsNew = seconds - ( (years * sutYearSec)+(days * sutDaySec)+(hours*sutHourSec)+(minutes*sutMinuteSec) );

  //add default zeros
  years = defaultZeros(years, 2);
  days = defaultZeros(days, 2);
  hours = defaultZeros(hours, 1);
  minutes = defaultZeros(minutes, 1);
  secondsNew = defaultZeros(secondsNew, 1);

  //sum
  return years + "." + days + " " + hours + ":" + minutes + ":" + secondsNew;
}

/**
 * Account for default zeros in the given fields
 */
function defaultZeros(number, defaultExtraZeroes){

  switch(defaultExtraZeroes)
  {
    case 0: /* no need to do anything */ break;
    case 1:
      if(number < 10)
      {
        return "0"+number;
      }
      break;
    case 2:
      if(number < 10)
      {
        return "00"+number;
      }
      if(number < 100)
      {
        return "0"+number;
      }
      break;
      default: break;
  }

  return number;
}

/**
 * Takes in SUT years and figures out Earth years before calendar reform of 2400
 */
function SUTyearsToEarth(sutYears){
  //first get down to seconds
  var seconds = sutYears*sutYearSec;

  //@todo
  //we need to calculate ourselves the number of years as Moment.js is no use here
  return Math.floor(seconds / earthYearReformedSec);
}

/**
 * Takes in SUT years and figures out the Earth years count after the calendar reform of 2400
 */
function SUTyearsToEarthReform(sutYears){
  var seconds = sutYears*sutYearSec;
  return Math.floor(seconds / earthYearReformedSec);
}

/**
 * Takes Earth years and converts them to SUT years
 */
function earthYearsToSUT(earthYear)
{
  //break it down to seconds
  var seconds = earthYear * earthYearReformedSec;

  //reconstruct into SUT and return
  return Math.floor(seconds / sutYearSec);
}

/**
 * Gets an Earth date and converts it to SUT date
 */
function earthDateToSUT(earthDate){
  var seconds;
  var earthYear = moment(earthDate).year() + 1; //moment.js substracts one from the actual year, bug?

  //first check if it is before or after 2400
  if(earthYear <= 2400)
  {
    //we can use Moment.js to get us the seconds counts
    seconds = (earthYear-2400)*earthYearReformedSec;
    //add minus, because it is before SUT
    return "SUT -" + secondsToSUT(seconds);
  }
  else
  {
    //we have to count ourselves due to the calendar reform of 2400
    //first let's get the seconds for year (don't forget to subtract year 2400)
    seconds = (earthYear-2400)*earthYearReformedSec;

    //figure out if we have more than a year

    /*
    //now let's get the day of the year
    var day = moment(earthDate).dayOfYear();
    console.log(day);
    //29th February is the 60th day
    if( !((day > 60 && moment(earthYear).isLeapYear()) || day <= 60))
    {
      //we have to add one extra day to our calculations to be more accurate
      day++;
    }

    //add second for the days in the the year
    seconds += day*86400; //24*60*60
    console.log(seconds);
    */

    //now we can calculate
    return "SUT " + secondsToSUT(seconds);
  }
}


/**
 * Get SUT date and convert it to Earth date
 */
