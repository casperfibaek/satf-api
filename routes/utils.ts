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

export var toHHMMSS = (secs) => {
    var sec_num = parseInt(secs, 10)
    var hours   = Math.floor(sec_num / 3600)
    var minutes = Math.floor(sec_num / 60) % 60
    var seconds = sec_num % 60

    return [hours,minutes,seconds]
        .map(v => v < 10 ? "0" + v : v)
        .filter((v,i) => v !== "00" || i > 0)
        .join(":")
}


export function sum(a) {
    return a.reduce((acc, val) => acc + val)
}

export function mean(a) {
    return sum(a) / a.length
}

export function stddev(arr) {
    const arr_mean = mean(arr)
    const r = function(acc, val) {
        return acc + ((val - arr_mean) * (val - arr_mean))
    }
    return Math.sqrt(arr.reduce(r, 0.0) / arr.length)
}

// Javascript adaptation from https://stackoverflow.com/questions/22583391/peak-signal-detection-in-realtime-timeseries-data

export function smoothed_z_score(y, params) {
    var p = params || {}
    // init cooefficients
    const lag = p.lag || 5
    const threshold = p.threshold || 3.5
    const influence = p.influece || 0.5

    if (y === undefined || y.length < lag + 2) {
        throw ` ## y data array to short(${y.length}) for given lag of ${lag}`
    }
    //console.log(`lag, threshold, influence: ${lag}, ${threshold}, ${influence}`)

    // init variables
    var signals = Array(y.length).fill(0)
    var filteredY = y.slice(0)
    const lead_in = y.slice(0, lag)
    //console.log("1: " + lead_in.toString())

    var avgFilter = []
    avgFilter[lag - 1] = mean(lead_in)
    var stdFilter = []
    stdFilter[lag - 1] = stddev(lead_in)
    //console.log("2: " + stdFilter.toString())

    for (var i = lag; i < y.length; i++) {
        //console.log(`${y[i]}, ${avgFilter[i-1]}, ${threshold}, ${stdFilter[i-1]}`)
        if (Math.abs(y[i] - avgFilter[i - 1]) > (threshold * stdFilter[i - 1])) {
            if (y[i] > avgFilter[i - 1]) {
                signals[i] = +1 // positive signal
            } else {
                signals[i] = -1 // negative signal
            }
            // make influence lower
            filteredY[i] = influence * y[i] + (1 - influence) * filteredY[i - 1]
        } else {
            signals[i] = 0 // no signal
            filteredY[i] = y[i]
        }

        // adjust the filters
        const y_lag = filteredY.slice(i - lag, i)
        avgFilter[i] = mean(y_lag)
        stdFilter[i] = stddev(y_lag)
    }

    return signals // outputs a vector which is a sequence of "0", "1" or "-1". Zero represents no peak, -1 a negative peak or 1 a positive peak
}