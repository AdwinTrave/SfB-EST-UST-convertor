//create fictionalTime
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

//fictionalTime tests
QUnit.test("toTime", function( assert ){
  assert.deepEqual(sut.toTime(10000), "SUT 000.000 00:00:10");
  assert.deepEqual(sut.toTime(100000), "SUT 000.000 00:01:00");
  assert.deepEqual(sut.toTime(10000000), "SUT 000.000 01:00:00");
  assert.deepEqual(sut.toTime(100000000), "SUT 000.001 00:00:00");
  assert.deepEqual(sut.toTime(50000000000), "SUT 001.000 00:00:00");
  assert.deepEqual(sut.toTime(100000000000), "SUT 002.000 00:00:00");
  assert.deepEqual(sut.toTime(550000000000), "SUT 011.000 00:00:00");
  assert.deepEqual(sut.toTime(10550000000000), "SUT 211.000 00:00:00");
});

QUnit.test("toDate",  function( assert ){
  assert.deepEqual(sut.toDate(10000), "SUT -271.306 02:65:10", "Calculate date of 1970-01-01T00:00:10.000Z in SUT");
  assert.deepEqual(sut.toDate(30000000000000), "SUT 328.305 01:64:00", "Calculate date of 2920-08-30T05:20:00.000Z in SUT");
});

//main page converters testing
QUnit.test("SUTyearsToEarth", function ( assert ){
  assert.equal(SUTyearsToEarth(15.8112), 25);
});

QUnit.test("earthYearsToSUT", function ( assert ){
  assert.equal(earthYearsToSUT(25), 15.8112);
});

QUnit.test("earthDateToSUT", function( assert ){
  assert.deepEqual(earthDateToSUT("2300-07-23"), "SUT -062.119 07:20:00", "Before SUT");
  assert.deepEqual(earthDateToSUT("2400-07-23"), "SUT 000.176 02:20:00", "SUT date");
});

QUnit.test("sutDateToEY", function( assert ){
  assert.deepEqual(sutDateToEY("000.000"), "2400-01-01", "First day of the new calendar");
  assert.deepEqual(sutDateToEY("12.000"), "2419-01-05", "SUT");
  assert.deepEqual(sutDateToEY("-12.490"), "2382-07-16", "Before SUT");
  assert.deepEqual(sutDateToEY("bleh"), "Please enter a valid SUT date in this format: YYY.DDD", "Invalid entry");
  assert.deepEqual(sutDateToEY("12"), "Please enter a valid SUT date in this format: YYY.DDD", "Only year");
  assert.deepEqual(sutDateToEY("12.650"), "SUT Year has only 500 days. Which means you should enter days between 000 to 499.", "More than 500 days in a year");
});
