QUnit.test( "secondsToSUT", function( assert ) {
  assert.equal(secondsToSUT(10), "000.000 00:00:10");
  assert.equal(secondsToSUT(100), "000.000 00:01:00");
  assert.equal(secondsToSUT(10000), "000.000 01:00:00");
});
QUnit.test("defaultZeroes", function ( assert ){
  assert.equal(defaultZeros(1, 0), "1");
  assert.equal(defaultZeros(2, 1), "02");
  assert.equal(defaultZeros(10, 1), "10");
  assert.equal(defaultZeros(1, 2), "001");
  assert.equal(defaultZeros(40, 2), "040");
  assert.equal(defaultZeros(500, 2), "500");
});
