QUnit.test("Test coins movement for 3 countries", function (assert) {
    var params = ['France 1 4 4 6', 'Spain 3 1 6 3', 'Portugal 1 1 2 2'];
    var result = coinsMovement(params);
    assert.deepEqual(result.France, 1325, 'France - 1325');
    assert.deepEqual(result.Spain, 382, 'Spain - 382');
    assert.deepEqual(result.Portugal, 416, 'Portugal - 416');
});
QUnit.test("Test coins movement for 2 countries", function (assert) {
    var params = ['Netherlands 1 3 2 4', 'Belgium 1 1 2 2'];
    var result = coinsMovement(params);
    assert.deepEqual(result.Netherlands, 2, 'Netherlands - 2');
    assert.deepEqual(result.Belgium, 2, 'Belgium - 2');
});
QUnit.test("Test coins movement for 1 country", function (assert) {
    var params = ['Luxembourg 1 1 1 1'];
    var result = coinsMovement(params);
    assert.deepEqual(result.Luxembourg, 0, 'Luxembourg - 1');
});

//CheckCoords Test
QUnit.test("Test check coords", function (assert) {
    assert.deepEqual(checkCoords(1,4,4,6), true, 'Coords 1 4 4 6 - correct');
    assert.deepEqual(checkCoords(1,1,1,1), true, 'Coords 1 1 1 1 - correct');
    assert.deepEqual(checkCoords(1,4,4,1), false, 'Coords 1 4 4 1 - incorrect');
    assert.deepEqual(checkCoords(4,4,1,6), false, 'Coords 4 4 1 6 - incorrect');
    assert.deepEqual(checkCoords(4,4,1,1), false, 'Coords 4 4 1 1 - incorrect');
});

//Neighbors Test
QUnit.test("Test neighbors recognition on 3 countries map", function (assert) {
    drawMap(['France 1 4 4 6', 'Spain 3 1 6 3', 'Portugal 1 1 2 2']);
    assert.deepEqual(neighbors('1-1').length, 2, '1-1 should have 2 neighbors');
    assert.deepEqual(neighbors('4-2').length, 4, '4-2 should have 4 neighbors');
    assert.deepEqual(neighbors('4-4').length, 3, '4-4 should have 3 neighbors');
    assert.deepEqual(neighbors('6-7').length, 0, '6-7 should have no neighbors');
});

//Test CheckFinish
QUnit.test("Test finish check", function (assert) {
    assert.deepEqual(checkFinish({'Country': 2, 'Country2': 500}), true, 'All values are true = true');
    assert.deepEqual(checkFinish({'Country': false, 'Country2': 500}), false, 'One value is false = false');
    assert.deepEqual(checkFinish({'Country': false, 'Country2': false}), false, 'All values are false = false');
});

//Test Transaction amount calculation
QUnit.test("Test transaction amount for 3 countries", function (assert) {
    var params = ['France 1 4 4 6', 'Spain 3 1 6 3', 'Portugal 1 1 2 2'];
    var countryNames = drawMap(params);
    var cities = $('.city');
    assert.deepEqual(calculateTransactionAmount(cities, countryNames), 28000, 'For 3 countries - 28000');
});
QUnit.test("Test transaction amount for 2 countries", function (assert) {
    var params = ['Netherlands 1 3 2 4', 'Belgium 1 1 2 2'];
    var countryNames = drawMap(params);
    var cities = $('.city');
    assert.deepEqual(calculateTransactionAmount(cities, countryNames), 8000, 'For 2 countries - 8000');
});
QUnit.test("Test transaction amount for 1 country", function (assert) {
    var params = ['Luxembourg 1 1 1 1'];
    var countryNames = drawMap(params);
    var cities = $('.city');
    assert.deepEqual(calculateTransactionAmount(cities, countryNames), 1000, 'For 1 country - 1000');
});
