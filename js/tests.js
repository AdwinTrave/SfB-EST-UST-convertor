//create fictionalTime
var unit1 = 1000; //how many miliseconds does the unit have
var unit2 = unit1 * 100;
var unit3 = unit2 * 100;
var unit4 = unit3 * 10;
var unit5 = unit4 * 500;

var unitArray = [unit5, unit4, unit3, unit2, unit1]; //must be in order from the largest to smallest
var unitSeparator = ["SUT ", ".", " ", ":", ":", ""]; //formating, determines what symbols will be between different
var unitDeclaration = "before"; //options: before, after, both, false - additional option for unitSeparator to show time declaration like SUT xxxx

var timeBegins = moment("2400/01/01 00:00 GMT"); //the moment when time begins in relation to Earth time

QUnit.test("Correct starting time", function( assert ){
  assert.deepEqual(timeBegins.valueOf(), 13569465600000);
});

//create the object
var sut = new fictionalTime("Standard Universal Time", unitArray, timeBegins.valueOf(), unitSeparator, unitDeclaration);

//fictionalTime tests
QUnit.test("toTime", function( assert ){
  assert.deepEqual(sut.toTime(10000), "SUT 0.000 0:00:10");
  assert.deepEqual(sut.toTime(100000), "SUT 0.000 0:01:00");
  assert.deepEqual(sut.toTime(10000000), "SUT 0.000 1:00:00");
  assert.deepEqual(sut.toTime(100000000), "SUT 0.001 0:00:00");
  assert.deepEqual(sut.toTime(50000000000), "SUT 1.000 0:00:00");
  assert.deepEqual(sut.toTime(100000000000), "SUT 2.000 0:00:00");
  assert.deepEqual(sut.toTime(550000000000), "SUT 11.000 0:00:00");
  assert.deepEqual(sut.toTime(10550000000000), "SUT 211.000 0:00:00");
});

QUnit.test("toDate",  function( assert ){
  assert.deepEqual(sut.toDate(10000), "SUT -271.306 4:45:10", "Calculate date of 1970-01-01T00:00:10.000Z in SUT");
  assert.deepEqual(sut.toDate(30000000000000), "SUT 328.305 3:44:00", "Calculate date of 2920-08-30T05:20:00.000Z in SUT");
});

QUnit.test("toFictionalUnit", function( assert ){
  assert.deepEqual(sut.toFictionalUnit(10000, 4), 10, "SUT seconds");
  assert.deepEqual(sut.toFictionalUnit(100000, 3), 1, "SUT minutes");
  assert.deepEqual(sut.toFictionalUnit(10000000, 2), 1, "SUT hours");
  assert.deepEqual(sut.toFictionalUnit(100000000, 1), 1, "SUT years");
  assert.deepEqual(sut.toFictionalUnit(550000000000, 0), 11, "SUT years");
  assert.deepEqual(sut.toFictionalUnit(10550000000000, 0), 211, "SUT years");
});

QUnit.test("unitToMilliseconds", function( assert ){
  assert.deepEqual(sut.unitToMilliseconds(10, 4), 10000, "10 SUT seconds -> milliseconds");
  assert.deepEqual(sut.unitToMilliseconds(1, 3), 100000, "1 SUT minute -> milliseconds");
  assert.deepEqual(sut.unitToMilliseconds(10, 2), 100000000, "10 SUT hours -> milliseconds");
  assert.deepEqual(sut.unitToMilliseconds(1, 0), 50000000000, "SUT year -> milliseconds");
  assert.deepEqual(sut.unitToMilliseconds(211, 0), 10550000000000, "211 SUT years -> milliseconds");
});

/** @todo devise a test for sut.currentTime() */

//main page converters testing
QUnit.test("SUTyearsToEarth", function ( assert ){
  assert.equal(SUTyearsToEarth(15.8112), 25);
});

QUnit.test("earthYearsToSUT", function ( assert ){
  assert.equal(earthYearsToSUT(25), 15.8112);
});

QUnit.test("earthDateToSUT", function( assert ){
  assert.deepEqual(earthDateToSUT("2300-07-23"), "SUT -62.119 7:56:00", "Before SUT");
  assert.deepEqual(earthDateToSUT("2400-07-23"), "SUT 0.176 2:56:00", "SUT date");
});

QUnit.test("sutDateToEY", function( assert ){
  assert.deepEqual(sutDateToEY("000.000"), "2400-01-01", "First day of the new calendar");
  assert.deepEqual(sutDateToEY("12.000"), "2419-01-05", "SUT");
  assert.deepEqual(sutDateToEY("-12.490"), "2382-07-16", "Before SUT");
  assert.deepEqual(sutDateToEY("bleh"), "Please enter a valid SUT date in this format: YYY.DDD", "Invalid entry");
  assert.deepEqual(sutDateToEY("12"), "Please enter a valid SUT date in this format: YYY.DDD", "Only year");
  assert.deepEqual(sutDateToEY("12.650"), "SUT Year has only 500 days. Which means you should enter days between 000 to 499.", "More than 500 days in a year");
});
