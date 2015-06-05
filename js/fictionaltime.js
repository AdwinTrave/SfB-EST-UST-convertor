/**
 * Fictional time library
 * This library works with provided fictional time and returns the fictional time
 * from provided miliseconds.
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
  //all inserted variables are public
  /** @todo revisit */
  this.units = units;
  this.unitsSpace = unitsSpace;
  this.beginning = beginning;
  this.separators = separators;
  this.declaration = declaration;

  /**
   * Calculates the time from miliseconds
   * @since 1.0
   * @param {int} miliseconds Miliseconds that should be translated into the fictional time.
   * @todo Add param to determine if to display declaration or not or only at one place (ie. before, after)
   * @todo Figure out how to handle
   */
  this.toTime = function(miliseconds)
  {
    var output = [];

    for (var i = 0; i < unitArray.length; i++) {
      //first figure out if we are before of after the beginning of the time
      var minus = false;

      //only add minus at the first number
      if(i === 0)
      {
        if(miliseconds < beginning.valueOf())
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
        if(declaration === "before" || declaration === "both")
        {
          outputString = separators[i];
        }
      }

      outputString += output[i] + separators[k];

      //unit declaration after time
      if(i === output.length)
      {
        if(declaration === "after" || declaration === "both")
        {
          outputString += separators[k+1];
        }
      }

    }
    return outputString;
  }

  /**
   * Account for default zeros in the given fields
   * @since 1.0
   * @param {int} number Number that should get the default zeroes before it in order to hold format
   * @param {int} unitLength How long is the given unit 1 through 3
   * @param {boolean} minus Boolean to determine if to add minus before the number or not
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
      if(minus && i === add)
      {
        number = "-" + number;
      }
    }

    return number;
  }
//end of the class
}
