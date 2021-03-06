function coinsMovement(params) {

    var countryNames = drawMap(params);

    var cities = $('.city');

    //find neighbors for each city
    for (var i = 0; i < cities.length; i++) {
        cities[i].neighbors = neighbors(cities[i].id);
    }

    //Object containing 'filled' status for each country
    var filled = {};

    countryNames.forEach(function (name, index, arr) {
        filled[name] = false;
    });

    var finish = false;


    var day = 0;  //Days counter

    checkCitiesFilled(cities, countryNames);
    filled = checkCountriesFilled(filled, countryNames, day);
    finish = checkFinish(filled);

    while (finish == false) {
        day++;
        sendCoins(countryNames);

        filled = checkCountriesFilled(filled, countryNames, day);
        finish = checkFinish(filled);
    }

    console.log(filled);
    return filled;
}


/**
 *
 * @param xl {int}
 * @param yl {int}
 * @param xh {int}
 * @param yh {int}
 * @param color {string}
 * @param country {string}
 * @param countryNames {Array}
 */
function createCountry(xl, yl, xh, yh, color, country, countryNames) {

    //check if given coords is correct
    if (checkCoords(xl, yl, xh, yh)) {
        console.log('good');
    } else {
        console.log('bad');
    }


    //draw cities on the map based on given coords
    for (var i = xl; i <= xh; i++) {
        for (var j = yl; j <= yh; j++) {
            var city = $('#' + i + '-' + j);
            city
                .css('background-color', color)     //color city
                .addClass('city')   //separate cities and empty cells
                .addClass(country)
                .attr('country', country)
                .attr('filled', false);  //is city filled with at least 1 coin of each motif
            var label = '';
            for (var k = 0; k < countryNames.length; k++) {
                //if city belongs to currently processed country give it 1000000 coins, else - 0
                if (city.attr('country') == countryNames[k]) {
                    city.attr(countryNames[k] + '-coins', 1000000);
                } else {
                    city.attr(countryNames[k] + '-coins', 0);
                }

                //create city lable for visualizing
                label += countryNames[k] + '-coins' + '=' + city.attr(countryNames[k] + '-coins') + '\n';
                city.html(label);
            }
        }
    }
}

/**
 * Function making 1 day coin transactions for each city
 * @param countryNames
 */
function sendCoins(countryNames) {
    var cities = $('.city');


    calculateTransactionAmount(cities, countryNames);


    makeTransaction(cities, countryNames);


    checkCitiesFilled(cities, countryNames)

}


/**
 * define transaction amount for each motif based on current balance
 * @param cities {Array}
 * @param countryNames {Array}
 */
function calculateTransactionAmount(cities, countryNames) {
    var overallTransactionAmount = 0;
    for (var i = 0; i < cities.length; i++) {
        countryNames.forEach(function (country, index, arr) {
            $(cities[i]).attr(country + '-transaction-amount', Math.floor($(cities[i]).attr(country + '-coins') / 1000));
            overallTransactionAmount += Math.floor($(cities[i]).attr(country + '-coins') / 1000);
        });
    }

    return overallTransactionAmount;
}

//
/**
 * make transaction based on previously counted transaction amounts
 * @param cities {Array}
 * @param countryNames {Array}
 */
function makeTransaction(cities, countryNames) {

    for (var i = 0; i < cities.length; i++) {
        cities[i].neighbors.forEach(function (neighbor, index, arr) {
            countryNames.forEach(function (country, index, arr) {
                var neighborCoins = parseInt(neighbor.attr(country + '-coins'));
                var ownCoins = parseInt($(cities[i]).attr(country + '-coins'));
                var transactionAmount = parseInt($(cities[i]).attr(country + '-transaction-amount'));

                neighbor.attr(country + '-coins', neighborCoins + transactionAmount);
                $(cities[i]).attr(country + '-coins', ownCoins - transactionAmount);
            });
        });
    }
}

/**
 * check if each city is filled
 * @param cities {Array}
 * @param countryNames {Array}
 */
function checkCitiesFilled(cities, countryNames) {

    for (var i = 0; i < cities.length; i++) {
        var label = '';
        var cityFilled = true;
        for (var k = 0; k < countryNames.length; k++) {
            label += countryNames[k] + '-coins' + '=' + $(cities[i]).attr(countryNames[k] + '-coins') + '\n';

            if ($(cities[i]).attr(countryNames[k] + '-coins') == 0) {
                cityFilled = false;
            }
        }
        //update labels
        $(cities[i]).html(label);

        $(cities[i]).attr('filled', cityFilled);
    }
}

/**
 * Check is every city in country has at least one coin of each motif
 * If so - write current day into 'filled' obj
 * @param filled {Object}
 * @param countryNames {Array}
 * @param day {int}
 * @returns {Object}
 */
function checkCountriesFilled(filled, countryNames, day) {
    countryNames.forEach(function (country, index, arr) {
        var cities = $('.' + country);
        var countryFilled = true;
        for (var j = 0; j < cities.length; j++) {
            if ($(cities[j]).attr('filled') == 'false') {
                countryFilled = false;
            }
        }
        if (countryFilled == true && filled[country] == false) {
            filled[country] = day;
        }
    });

    return filled;
}

/**
 *
 * @param filled {Object}
 * @returns {boolean}
 */
function checkFinish(filled) {
    var finish = true;

    for (var prop in filled) {
        if (!filled.hasOwnProperty(prop)) {
            //The current property is not a direct property of p
            continue;
        }
        if (filled[prop] === false) {
            finish = false;
        }
    }

    return finish;
}


/**
 * take a look in each direction from current position to define if neighbor present
 * @param cityId {int}
 * @returns {Array}
 */
function neighbors(cityId) {
    var coords = cityId.split('-');

    var neighbors = [];

    if ($('#' + (parseInt(coords[0]) + 1) + '-' + (parseInt(coords[1]))).hasClass('city')) {
        neighbors.push($('#' + (parseInt(coords[0]) + 1) + '-' + (parseInt(coords[1]))));
    }
    if ($('#' + (parseInt(coords[0]) - 1) + '-' + (parseInt(coords[1]))).hasClass('city')) {
        neighbors.push($('#' + (parseInt(coords[0]) - 1) + '-' + (parseInt(coords[1]))));
    }
    if ($('#' + (parseInt(coords[0])) + '-' + (parseInt(coords[1]) + 1)).hasClass('city')) {
        neighbors.push($('#' + (parseInt(coords[0])) + '-' + (parseInt(coords[1]) + 1)));
    }
    if ($('#' + (parseInt(coords[0])) + '-' + (parseInt(coords[1]) - 1)).hasClass('city')) {
        neighbors.push($('#' + (parseInt(coords[0])) + '-' + (parseInt(coords[1]) - 1)));
    }

    return neighbors;
}


/**
 *
 * @param params {Array}
 * @returns {Array}
 */
function drawMap(params) {
    //Drawing map
    var body = $('#area');
    body.empty();
    for (var i = 1; i < 11; i++) {
        var row = $('<tr></tr>');
        row.appendTo(body);
        for (var j = 1; j < 11; j++) {
            row.append('<td id="' + i + '-' + j + '" style="width:90px; height: 90px; border: 1px solid black"></td>');
        }
    }

    var countries = [];
    var countryNames = [];
    params.forEach(function (item, index, array) {
        var values = item.split(' ');
        countries.push({
            'name': values[0],
            'xl': values[1],
            'yl': values[2],
            'xh': values[3],
            'yh': values[4],
            'color': getRandomColor()
        });
        countryNames.push(values[0]);
    });


    //Create three countries with given coords, color and name.
    countries.forEach(function (country, index, array) {
        createCountry(country.xl, country.yl, country.xh, country.yh, country.color, country.name, countryNames);
    });

    return countryNames;
}


/**
 * check if given coords is correct
 * @param xl {int}
 * @param yl {int}
 * @param xh {int}
 * @param yh {int}
 * @returns {boolean}
 */
function checkCoords(xl, yl, xh, yh) {
    var args = Array.prototype.slice.call(arguments);
    var ok = true;
    args.forEach(function (item, index, arr) {
        if (item < 1 || item > 10) {
            ok = false;
        }
    });

    if (xl > xh || yl > yh) {
        ok = false;
    }

    return ok;
}

/**
 * returns random hex color
 * @returns {string}
 */
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}