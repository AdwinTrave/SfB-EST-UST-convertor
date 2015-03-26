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
  //years will go the same way as with countdown, but the clock needs to go forward
  var secondsNew, minutes, hours, days, daysDown, years, dayBegin, hoursDown, minutesDown;
  years = Math.floor(seconds / sutYearSec);
  daysDown = Math.floor( (seconds - (years * sutYearSec)) / sutDaySec );
  //find out at what second has the day begun when day has begun
  dayBegin = (years * sutYearSec)+(daysDown * sutDaySec);
  //find the current time by determining how much time is left in the day
  days = 500 - daysDown;
  hoursDown = Math.floor( (seconds - ((years * sutYearSec)+(daysDown * sutDaySec))) / sutHourSec );
  hours = 10 - hoursDown;
  minutesDown = Math.floor( (seconds - ((years * sutYearSec)+(daysDown * sutDaySec)+(hoursDown*sutHourSec))) / sutMinuteSec );
  minutes = 100 - minutesDown;
  secondsNew = 100 - (seconds -( (years * sutYearSec)+(daysDown * sutDaySec)+(hoursDown*sutHourSec)+(minutesDown*sutMinuteSec)));

  //add default zeros
  years = defaultZeros(years, 2, true);
  days = defaultZeros(days, 2, false);
  hours = defaultZeros(hours, 1, false);
  minutes = defaultZeros(minutes, 1, false);
  secondsNew = defaultZeros(secondsNew, 1, false);

  if(seconds < 120000000000) //means we are before SUT
  {
    years = "-"+years;
  }
  $("#curentSUT").text("SUT " + years + "." + days + " " + hours + ":" + minutes + ":" + secondsNew);
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
  years = defaultZeros(years, 2, true);
  days = defaultZeros(days, 2, false);
  hours = defaultZeros(hours, 1, false);
  minutes = defaultZeros(minutes, 1, false);
  secondsNew = defaultZeros(secondsNew, 1, false);

  //sum
  return years + "." + days + " " + hours + ":" + minutes + ":" + secondsNew;
}

/**
 * Account for default zeros in the given fields
 */
function defaultZeros(number, defaultExtraZeroes, minusBack){

  number = number.toString();

  switch(defaultExtraZeroes)
  {
    case 0: /* no need to do anything */ break;
    case 1:
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

          //add the minus sign back if this is a year or minus back is requested
          if(minusBack)
          {
            number = "-" + number;
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
    case 2:
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

          //add the minus sign back if this is a year or minus back is requested
          if(minusBack)
          {
            number = "-" + number;
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
  var earthYear = moment(earthDate).year() ; //moment.js substracts one from the actual year, bug?

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

  return "SUT " + secondsToSUT(seconds);
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
