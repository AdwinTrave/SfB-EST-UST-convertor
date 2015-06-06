/**
 * Fictional time library
 * This library works with provided fictional time and returns the fictional time
 * from provided milliseconds.
 * @author Jan Dvorak IV.
 * @copyright All rights reserved
 * @version 2.0
 * @since 2.0
 * @todo right now this class can only handle simetric times, will need to improve to handle more diverse times (test on Mayan calendar, then Augustine calendar - the main issue is the length of months)
 */

/**
 * The main object
 * @param {array} units Array of units lengths (int)
 * @param {array} unitsSpace how many spaces does the unit take (int)
 * @param {int} beginning The Earth Day the time beginnins in milliseconds - @todo make optional - ie. can be null
 * @param {array} separators Separations between the units
 * @param {string} declaration Where should be the time declaration displayed - before, after, both, false
 */
function fictionalTime(units, unitsSpace, beginning, separators, declaration){
  var self = this;

  //all inserted variables are public
  /** @todo revisit */
  this.units = units;
  this.unitsSpace = unitsSpace;
  this.beginning = beginning;
  this.separators = separators;
  this.declaration = declaration;

  /**
   * Calculates the time from milliseconds
   * @function toTime
   * @since 1.0
   * @param {int} milliseconds milliseconds that should be translated into the fictional time.
   * @return {string} Formated time display
   * @todo Add param to determine if to display declaration or not or only at one place (ie. before, after)
   */
  this.toTime = function(milliseconds)
  {
    var output = calculate(milliseconds, false);

    //return the string to display the time
    return format(output);
  }

  /**
   * Calculates the time from milliseconds and takes into account if the time
   * is before the beginning of the fictional time or not.
   * @function toDate
   * @since 2.0
   * @param {int} milliseconds milliseconds that should be translated into the fictional time.
   * @return {string} Formated time display
   * @todo Add param to determine if to display declaration or not or only at one place (ie. before, after)
   */
  this.toDate = function(milliseconds)
  {
    var output = calculate(milliseconds, true);

    //return the string to display the time
    return format(output);
  }

  /**
   * Current time
   * @function current
   * @since 2.0
   * @return {string} Formated current time in the fictional time
   */
  this.currentTime = function()
  {
    //first get current time in milliseconds
    var now = Date.now();
    var output = calculate(now, true);

    return format(output);
  }

  /**
   * Calculates the fictional time
   * @function calculate
   * @since 2.0
   * @param {int} milliseconds The time to be calculated
   * @param {boolean} preTime Should the time be evaluated if it is before the establishment of the time?
   * @return {array} Array with the results to be used for the format function
   */
  function calculate(milliseconds, preTime)
  {
    var output = [];

    //evaluate preTime
    var beforeTime = false;
    if(preTime)
    {
      if(beginning > milliseconds)
      {
        beforeTime = true;
        //for time before establishment make it a countdown
        milliseconds = beginning - milliseconds;
      }
      else
      {
        //for a date after the establishment time remove the time to the establishment time for correct calculations
        milliseconds = milliseconds - beginning;
      }
    }

    for (var i = 0; i < units.length; i++)
    {
      /**
       * Assuming that the biggest unit is equivalent to years it should be counting down.
       * Other units should be going up as normal clocks.
       */
      if(i === 0 || !beforeTime)
      {
        //calculate how much of the given unit is there in the time
        output[i] = Math.floor( Math.abs(milliseconds / units[i]) );

        //reduce the time by the unit calculated
        milliseconds = milliseconds - (output[i] * units[i]);
      }
      else
      {
        //first calculate how many units are there
        var count = Math.floor( Math.abs( milliseconds / units[i]) );

        //now calculate what is the maximum of the given unit
        var max = units[i-1] / units[i];

        //now get the correct number that is going to be increasing
        output[i] = max-count;
        //account for getting the max number displayed
        if(count === 0)
        {
          output[i] = 0;
        }

        //reduce the time by the unit calculated
        milliseconds = milliseconds - (count * units[i]);
      }

      //add the appropriate number of zeroes
      if(i === 0 && beforeTime)
      {
        output[i] = defaultZeros(output[i], unitLength[i], true);
      }
      else
      {
        output[i] = defaultZeros(output[i], unitLength[i], false);
      }
    }

    return output;
  }

   /**
    * Calculate specific unit from Earth Time to fictional time
    * @function toFictionalUnit
    * @since 2.0
    * @param {int} milliseconds
    * @param {int} toUnit To which unit should be the conversion done
    * @return {int} The calculated number
    */
  this.toFictionalUnit = function(milliseconds, toUnit)
  {
    return milliseconds / units[toUnit];
  }

  /**
   * Calculate specific unit from fictional time to milliseconds
   * @function unitToMilliseconds
   * @since 2.0
   * @param {int} count Number of units
   * @param {int} unit From what unit are we doing the conversion
   * @return {int} The calculated number in milliseconds
   */
   this.unitToMilliseconds = function(count, unit)
   {
     return count * units[unit];
   }

   /**
    * Transforms the fictional date to milliseconds
    * @function fictionalDateToMilliseconds
    * @since 2.0
    * @param {string} dateString
    * @return {int} milliseconds
    */
   this.fictionalDateToMilliseconds = function(dateString)
   {
     var calculatedTime = 0;
     //first split time based on separators into an array
     var splitters = "";
     for (var i = 0; i < separators.length; i++) {
       if(splitters.match(separators[i]) === null)
       {
         //we add the new symbol
         splitters += separators[i];
       }
     }
     //make it regex
     splitters = new regex(splitters);

     //split
     var date = dateString.split(splitters);

     //validate that we have split correctly
     if(date.length !== units.length)
     {
       //time declarations might be throwing us of
       /** @todo try to remove time declarations and test again */
       //that would be the first and last entry
       return "The entered date is incorrectly formated.";
     }

     //validate that all entries are numbers
     for (var i = 0; i < date.length; i++)
     {
       //http://stackoverflow.com/questions/3885817/how-to-check-if-a-number-is-float-or-integer
       if( (!(Number(date[i]) === date[i]) && !(date[i]%1===0)) || date[i] === " " || date[i] === null || date[i] === "")
       {
         return "Not all the entries are numeric. Can't calculate.";
       }
       //convert to int
       date[i] = +date[i];

       //Transform unit into milliseconds
       calculatedTime += self.unitToMilliseconds(date[i] , i);

       //determine if before time beginning - first number would be negative
       if(i === 0)
       {
         if(date[i] < 0)
         {
           //before begginning = beginning - calculatedTime
           calculatedTime = begginning - calculatedTime;
         }
         else
         {
           //if after time begginning then add the time to begginning
           calculatedTime =calculatedTime + beginning;
         }
       }
     }
     return calculatedTime;
   }

  /**
   * Account for default zeros in the given fields
   * @function defaultZeros
   * @since 1.0
   * @param {int} number Number that should get the default zeroes before it in order to hold format
   * @param {int} unitLength How long is the given unit 1 through 3
   * @param {boolean} minus Boolean to determine if to add minus before the number or not
   * @return {string} the number with added default zeroes
   * @todo Improve that unitLength can handle more then size 3, use length of the current number to determine how many zeroes need to be added before
   */
  function defaultZeros(number, unitLength, minus){

    number = number.toString();

    //first determine how many zeroes need to be added
    var add = unitLength - number.length;

    //add the zeroes before the given number
    for (var i = 0; i < add; i++) {

      number = "0" + number;
    }
    //account for minus
    if(minus)
    {
      number = "-" + number;
    }

    return number;
  }

  /**
   * Function to return the time in the correct format
   * @function format
   * @since 1.1
   * @param {array} array with the values for each fields
   * @return {string}
   */
   function format(valuesArray)
   {
     //return the string to display the time
     var outputString;
     for (var i = 0; i < valuesArray.length; i++) {
       var k = i+1;

       //unit declaration before time
       if(i === 0)
       {
         if(declaration === "before" || declaration === "both")
         {
           outputString = separators[i];
         }
       }

       outputString += valuesArray[i] + separators[k];

       //unit declaration after time
       if(i === valuesArray.length)
       {
         if(declaration === "after" || declaration === "both")
         {
           outputString += separators[k+1];
         }
       }

     }
     return outputString;
   }

//end of the class
}
