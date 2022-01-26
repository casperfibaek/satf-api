"use strict";
/*
  Utility functions
*/
exports.__esModule = true;
exports.smoothed_z_score = exports.stddev = exports.mean = exports.sum = exports.subtractDays = exports.generateGeojson = exports.generatePoint = exports.translateUrbanClasses = void 0;
function translateUrbanClasses(klass) {
    if (Number.isNaN(klass)) {
        return 'Unknown';
    }
    if (Number(klass) === 0) {
        return 'Rural';
    }
    if (Number(klass) === 1) {
        return 'Suburban';
    }
    if (Number(klass) === 2) {
        return 'Urban';
    }
    if (Number(klass) === 3) {
        return 'Dense Urban';
    }
    return 'Rural';
}
exports.translateUrbanClasses = translateUrbanClasses;
function generatePoint(coords, properties) {
    if (properties === void 0) { properties = {}; }
    var geometry = {
        type: 'Point',
        coordinates: coords.slice().reverse()
    };
    return {
        type: 'Feature',
        properties: properties,
        geometry: geometry
    };
}
exports.generatePoint = generatePoint;
// Generate a geojson from an array
function generateGeojson(geometryArray, propertiesArray) {
    var collection = {
        type: 'FeatureCollection',
        features: []
    };
    for (var i = 0; i < geometryArray.length; i += 1) {
        var geometry = geometryArray[i];
        var properties = propertiesArray[i] ? propertiesArray[i] : {};
        if (typeof geometry[0] === 'number' && typeof geometry[1] === 'number' && geometry.length === 2) {
            collection.features.push(generatePoint(geometry, properties));
        }
    }
    return collection;
}
exports.generateGeojson = generateGeojson;
// subtract days to designated date
function subtractDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
}
exports.subtractDays = subtractDays;
function sum(a) {
    return a.reduce(function (acc, val) { return acc + val; });
}
exports.sum = sum;
function mean(a) {
    return sum(a) / a.length;
}
exports.mean = mean;
function stddev(arr) {
    var arr_mean = mean(arr);
    var r = function (acc, val) {
        return acc + ((val - arr_mean) * (val - arr_mean));
    };
    return Math.sqrt(arr.reduce(r, 0.0) / arr.length);
}
exports.stddev = stddev;
// Javascript adaptation from https://stackoverflow.com/questions/22583391/peak-signal-detection-in-realtime-timeseries-data
function smoothed_z_score(y, params) {
    var p = params || {};
    // init cooefficients
    var lag = p.lag || 5;
    var threshold = p.threshold || 3.5;
    var influence = p.influece || 0.5;
    if (y === undefined || y.length < lag + 2) {
        throw " ## y data array to short(" + y.length + ") for given lag of " + lag;
    }
    //console.log(`lag, threshold, influence: ${lag}, ${threshold}, ${influence}`)
    // init variables
    var signals = Array(y.length).fill(0);
    var filteredY = y.slice(0);
    var lead_in = y.slice(0, lag);
    //console.log("1: " + lead_in.toString())
    var avgFilter = [];
    avgFilter[lag - 1] = mean(lead_in);
    var stdFilter = [];
    stdFilter[lag - 1] = stddev(lead_in);
    //console.log("2: " + stdFilter.toString())
    for (var i = lag; i < y.length; i++) {
        //console.log(`${y[i]}, ${avgFilter[i-1]}, ${threshold}, ${stdFilter[i-1]}`)
        if (Math.abs(y[i] - avgFilter[i - 1]) > (threshold * stdFilter[i - 1])) {
            if (y[i] > avgFilter[i - 1]) {
                signals[i] = +1; // positive signal
            }
            else {
                signals[i] = -1; // negative signal
            }
            // make influence lower
            filteredY[i] = influence * y[i] + (1 - influence) * filteredY[i - 1];
        }
        else {
            signals[i] = 0; // no signal
            filteredY[i] = y[i];
        }
        // adjust the filters
        var y_lag = filteredY.slice(i - lag, i);
        avgFilter[i] = mean(y_lag);
        stdFilter[i] = stddev(y_lag);
    }
    return signals; // outputs a vector which is a sequence of "0", "1" or "-1". Zero represents no peak, -1 a negative peak or 1 a positive peak
}
exports.smoothed_z_score = smoothed_z_score;
