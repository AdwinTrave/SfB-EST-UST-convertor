QUnit.test( "toTime", function( assert ) {
  assert.deepEqual(toTime(10000), "SUT 000.000 00:00:10");
  assert.deepEqual(toTime(100000), "SUT 000.000 00:01:00");
  assert.deepEqual(toTime(10000000), "SUT 000.000 01:00:00");
  assert.deepEqual(toTime(100000000), "SUT 000.001 00:00:00");
  assert.deepEqual(toTime(50000000000), "SUT 001.000 00:00:00");
  assert.deepEqual(toTime(100000000000), "SUT 002.000 00:00:00");
  assert.deepEqual(toTime(550000000000), "SUT 011.000 00:00:00");
  assert.deepEqual(toTime(10550000000000), "SUT 211.000 00:00:00");
});
QUnit.test("defaultZeroes", function ( assert ){
  assert.deepEqual(defaultZeros(1, 1), "1");
  assert.deepEqual(defaultZeros(2, 2), "02");
  assert.deepEqual(defaultZeros(10, 2), "10");
  assert.deepEqual(defaultZeros(1, 3, "001");
  assert.deepEqual(defaultZeros(40, 3), "040");
  assert.deepEqual(defaultZeros(500, 3), "500");
  //handling negative values
  assert.deepEqual(defaultZeros(-242, 3), "242");
  assert.deepEqual(defaultZeros(-45, 3), "045");
  assert.deepEqual(defaultZeros(-4, 3), "004");
  assert.deepEqual(defaultZeros(-45, 3), "045");
  assert.deepEqual(defaultZeros(-4, 3), "004");
  assert.deepEqual(defaultZeros(-42, 2), "42");
  assert.deepEqual(defaultZeros(-2, 1), "2");
  assert.deepEqual(defaultZeros(-2, 0), "2");
});
QUnit.test("SUTyearsToEarth", function ( assert ){
  assert.equal(SUTyearsToEarth(15.811), 25);
});
QUnit.test("earthYearsToSUT", function ( assert ){
  assert.equal(earthYearsToSUT(25), 15.811);
});
QUnit.test("earthDateToSUT", function( assert ){
  assert.deepEqual(earthDateToSUT("2300-07-23"), "SUT -063.053 08:56:00", "Before SUT");
  assert.deepEqual(earthDateToSUT("2400-07-23"), "SUT 000.177 01:20:00", "SUT date");
});
QUnit.test("sutDateToEY", function( assert ){
  assert.deepEqual(sutDateToEY("000.000"), "2400-01-01", "First day of the new calendar");
  assert.deepEqual(sutDateToEY("12.000"), "2419-01-05", "SUT");
  assert.deepEqual(sutDateToEY("-12.490"), "2382-07-16", "Before SUT");
  assert.deepEqual(sutDateToEY("bleh"), "Please enter a valid SUT date in this format: YYY.DDD", "Invalid entry");
  assert.deepEqual(sutDateToEY("12"), "Please enter a valid SUT date in this format: YYY.DDD", "Only year");
  assert.deepEqual(sutDateToEY("12.650"), "SUT Year has only 500 days.", "More than 500 days in a year");
});
