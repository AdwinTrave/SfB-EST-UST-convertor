QUnit.test( "secondsToSUT", function( assert ) {
  assert.deepEqual(secondsToSUT(10), "000.000 00:00:10");
  assert.deepEqual(secondsToSUT(100), "000.000 00:01:00");
  assert.deepEqual(secondsToSUT(10000), "000.000 01:00:00");
  assert.deepEqual(secondsToSUT(100000), "000.001 00:00:00");
  assert.deepEqual(secondsToSUT(50000000), "001.000 00:00:00");
  assert.deepEqual(secondsToSUT(100000000), "002.000 00:00:00");
  assert.deepEqual(secondsToSUT(550000000), "011.000 00:00:00");
  assert.deepEqual(secondsToSUT(10550000000), "211.000 00:00:00");
});
QUnit.test("defaultZeroes", function ( assert ){
  assert.deepEqual(defaultZeros(1, 0, false), "1");
  assert.deepEqual(defaultZeros(2, 1, false), "02");
  assert.deepEqual(defaultZeros(10, 1, false), "10");
  assert.deepEqual(defaultZeros(1, 2, true), "001");
  assert.deepEqual(defaultZeros(40, 2, false), "040");
  assert.deepEqual(defaultZeros(500, 2, true), "500");
  //handling negative values
  assert.deepEqual(defaultZeros(-242, 2, true), "-242");
  assert.deepEqual(defaultZeros(-45, 2, true), "-045");
  assert.deepEqual(defaultZeros(-4, 2, true), "-004");
  assert.deepEqual(defaultZeros(-45, 2, false), "045");
  assert.deepEqual(defaultZeros(-4, 2, false), "004");
  assert.deepEqual(defaultZeros(-42, 1, false), "-42");
  assert.deepEqual(defaultZeros(-2, 1, true), "-02");
  assert.deepEqual(defaultZeros(-2, 0, false), "-2");
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
