QUnit.test("testMovement3", function(assert){
	var params = ['France 1 4 4 6', 'Spain 3 1 6 3', 'Portugal 1 1 2 2'];
	var para = coinsMovement(params);
	assert.ok(para.France===1325);
	assert.ok(para.Spain===382);
	assert.ok(para.Portugal===416);
});
QUnit.test("testMovement2", function(assert){
	var params = ['Netherlands 1 3 2 4', 'Belgium 1 1 2 2'];
	var countryName = params[0].split(' ')[0];
	var para = coinsMovement(params);
	assert.ok(para.Netherlands===2);
	assert.ok(para.Belgium===2);
});
QUnit.test("testMovement1", function(assert){
	var params = ['Luxembourg 1 1 1 1'];
	var countryName = params[0].split(' ')[0];
	var para = coinsMovement(params);
	assert.ok(para.Luxembourg===0);
});
