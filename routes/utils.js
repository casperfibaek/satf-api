"use strict";
/*
  Utility functions
*/
exports.__esModule = true;
exports.subtractDays = exports.generateGeojson = exports.generatePoint = exports.translateUrbanClasses = void 0;
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
// add days to designated date
function subtractDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
}
exports.subtractDays = subtractDays;
