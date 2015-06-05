/**
 * Fictional time library
 * This library works with provided fictional time and returns the fictional time
 * from provided milliseconds.
 * @author Jan Dvorak IV.
 * @copyright All rights reserved
 * @version 1.1
 * @since 1.1
 * @todo right now this class can only handle simetric times, will need to improve to handle more diverse times (test on Mayan calendar, then Augustine calendar - the main issue is the length of months)
 */

/**
 * The main object
 * @param {array} units Array of units lengths (int)
 * @param {array} unitsSpace how many spaces does the unit take (int)
 * @param {Moment.js object} beginning The Earth Day the time beginnins - can be null
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
    var output = [];

    //first figure out if we are before of after the beginning of the time
    var before = false;
    if(milliseconds < beginning)
    {
      before = true;
    }

    for (var i = 0; i < units.length; i++) {

      //add minus at the beginning if before time beginning
      var minus = false;
      if(i === 0 && before)
      {
        minus = true
      }

      //calculate how much of the given unit is there in the time
      output[i] = Math.floor( Math.abs(milliseconds / units[i]) );

      //reduce the time by the unit calculated
      milliseconds = milliseconds - (output[i] * units[i]);

      //add the appropriate number of zeroes
      output[i] = defaultZeros(output[i], unitLength[i], minus);
    }

    //return the string to display the time
    return format(output);
  }

  /**
   * Current time
   * @function current
   * @since 1.1
   * @return {string} Formated current time in the fictional time
   */
  this.currentTime = function()
  {
    //first get current time in milliseconds
    var now = Date.now();

    //evaluate for minus
    if(now < beginning)
    {
      var output = [];
      for (var i = 0; i < units.length; i++)
      {
        /**
         * Assuming that the biggest unit is equivalent to years it should be counting down.
         * Other units should be going up as normal clocks.
         */
        if(i === 0)
        {
          //calculate how much of the given unit is there in the time
          output[i] = Math.floor( Math.abs(now / units[i]) );

          //reduce the time by the unit calculated
          now = now - (output[i] * units[i]);

          //add the appropriate number of zeroes
          output[i] = defaultZeros(output[i], unitLength[i], true);
        }
        else
        {
          var count = Math.floor( Math.abs( now / units[i]) );
          output[i] = Math.floor( Math.abs( (units[i] - now) / units[i] ) );

          //reduce the time by the unit calculated
          now = now - (count * units[i]);

          //add the appropriate number of zeroes
          output[i] = defaultZeros(output[i], unitLength[i], false);
        }
      }

      return format(output);
    }
    else
    {
      //no need to adjust for pre-time and can just return the currnet time
      return self.toTime(now);
    }
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

      //account for minus
      if(minus && i === add-1)
      {
        number = "-" + number;
      }
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
