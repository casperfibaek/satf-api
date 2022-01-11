/*
  Utility functions
*/

export function translateUrbanClasses(klass:number) { // eslint-disable-line import/prefer-default-export
  if (Number.isNaN(klass)) { return 'Unknown'; }
  if (Number(klass) === 0) { return 'Rural'; }
  if (Number(klass) === 1) { return 'Suburban'; }
  if (Number(klass) === 2) { return 'Urban'; }
  if (Number(klass) === 3) { return 'Dense Urban'; }
  return 'Rural';
}

export function generatePoint(coords:number[], properties:any = {}) {
  const geometry = {
    type: 'Point',
    coordinates: coords.slice().reverse(),
  };

  return {
    type: 'Feature',
    properties,
    geometry,
  };
}

// Generate a geojson from an array
export function generateGeojson(geometryArray:number[][], propertiesArray:any[]) {
  const collection = {
    type: 'FeatureCollection',
    features: [],
  };

  for (let i = 0; i < geometryArray.length; i += 1) {
    const geometry = geometryArray[i];
    const properties = propertiesArray[i] ? propertiesArray[i] : {};

    if (typeof geometry[0] === 'number' && typeof geometry[1] === 'number' && geometry.length === 2) {
      collection.features.push(generatePoint(geometry, properties));
    }
  }

  return collection;
}

// subtract days to designated date

export function subtractDays(date:any, days:any) {
  var result = new Date(date);
  result.setDate(result.getDate() - days); 
 
  return result;
}