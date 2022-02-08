/* eslint-disable */
import fetch from 'node-fetch';
import axios from "axios";
import qs from "qs";
import buffer from '@turf/buffer';
import { point } from '@turf/helpers';
import bbox from '@turf/bbox';
import area from '@turf/area';
import bboxPolygon from '@turf/bbox-polygon';
import { toMercator, toWgs84 } from '@turf/projection';
import { response } from 'express';
import { token } from 'morgan';


async function requestAuthToken(Id, Secret) {
  
  try {
  const response = await axios({
    method: 'post',
    url: 'https://services.sentinel-hub.com/oauth/token',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: `grant_type=client_credentials&client_id=${encodeURIComponent(
      Id,
    )}&client_secret=${encodeURIComponent(Secret)}`,
  });
  const access_token = await response.data.access_token
  // console.log(access_token)
  return access_token

  } catch (err) {
    console.log(err);
  }
}

const client_id = "9671cc49-79be-46b2-9746-566f5db1304e"
const client_secret = "J+HmLAh:XkANGXF<:L|cnUcHgOT3J0:/QO{3.aWV"

//get max NDVI for every 30 days and year, and a bounding box)
export async function maxNDVIMonthly(lng, lat, from_date, to_date, buff) { 
    const coords = point([lng, lat])

    buff = (buffer(coords, buff/1000, {units: 'kilometers'}))
    const geometry = bbox(buff)

    console.log("bbox:"+geometry)
    console.log("to_date:"+from_date)
    console.log("from_date:"+to_date)

    const token = await requestAuthToken(client_id, client_secret)

    const response = await fetch("https://services.sentinel-hub.com/api/v1/statistics", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + String(token)
    },
    body: JSON.stringify({ 
    "input": {
    "bounds": {
      "bbox": geometry
    },
    "data": [
      {
        "dataFilter": {
          "mosaickingOrder": "leastCC"
        },
        "type": "sentinel-2-l2a"
      }
    ]
  },
  "aggregation": {
    "timeRange": {
      "from": from_date + "T00:00:00Z",
      "to": to_date + "T23:59:59Z"
    },
    "aggregationInterval": {
      "of": "P30D",
      "lastIntervalBehavior": "SHORTEN"
    },
    "resx": 10,
    "resy": 10,
    "evalscript": `
   //VERSION=3
function setup() {
    return {
        input: [{
        bands: [
            "B04",
            "B08",
            "SCL",
            "dataMask"
        ]
        }],
        mosaicking: "ORBIT",
    output: [
      {
        id: "data",
        bands: ["monthly_max_ndvi"]
      },
      {
        id: "dataMask",
        bands: 1
      }]
    };
    }

    function evaluatePixel(samples) {
       var max = 0;
    var hasData = 0;
    for (var i=0;i<samples.length;i++) {
      if (samples[i].dataMask == 1 && samples[i].SCL != 6 && samples[i].B04+samples[i].B08 != 0 ){
        hasData = 1;
        var ndvi = (samples[i].B08 - samples[i].B04)/(samples[i].B08 + samples[i].B04);
        max = ndvi > max ? ndvi:max;
      }
    }
    
    return {
        data: [max],
        dataMask: [hasData]
    };
    }

        `
    }
})
}); 
    return response.json()
    

}
//function getting NDVI monthly (30 days aggregate period), on a buffered point (between 100m, 500m and 1000m)

export async function monthlyNDVI(lat, lng, from_date, to_date, buff) { 

    const coords = point([lng, lat])

    buff = (buffer(coords, buff/1000, {units: 'kilometers'})) 

    const geometry = bbox(buff)

    console.log("bbox:"+geometry)
    console.log("to_date:"+to_date)
    console.log("from_date:"+from_date)

    const token = await requestAuthToken(client_id, client_secret)

    const response = await fetch("https://services.sentinel-hub.com/api/v1/statistics", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + String(token)
    },
    body: JSON.stringify({ 
    "input": {
    "bounds": {
      "bbox": geometry
    },
    "data": [
      {
        "dataFilter": {
          "mosaickingOrder": "leastCC"
        },
        "type": "sentinel-2-l2a"
      }
    ]
  },
  "aggregation": {
    "timeRange": {
      "from": from_date +"T00:00:00Z",
      "to":to_date + "T23:59:59Z"
    },
    "aggregationInterval": {
      "of": "P30D",
      "lastIntervalBehavior": "SHORTEN"
    },
    "evalscript": `
   //VERSION=3

function setup() {
  return {
    input: [{
      bands: [
        "B04",
        "B08",
        "SCL",
        "dataMask"
      ]
    }],
    output: [
      {
        id: "data",
        bands: 1
      },
      {
        id: "dataMask",
        bands: 1
      }]
  }
}

function validate (samples) {
  var scl = samples.SCL;

  if (scl === 1) { // SC_SATURATED_DEFECTIVE
        return false;
  } else if (scl === 3) { // SC_CLOUD_SHADOW
        return false;
  } else if (scl === 8) { // SC_CLOUD_MEDIUM_PROBA
        return false;
  } else if (scl === 9) { // SC_CLOUD_HIGH_PROBA
        return false;
  } else if (scl === 10) { // SC_THIN_CIRRUS
        return false;
  } else if (scl === 11) { // SC_SNOW_ICE
    return false;
  }  else {
  return true;
  }
}

function evaluatePixel(samples) {
    let ndvi = (samples.B08 - samples.B04)/(samples.B08 + samples.B04)
    
    var validNDVIMask = 1
    if (samples.B08 + samples.B04 == 0 ){
        validNDVIMask = 0
    }
    
    var noWaterMask = 1
    if (samples.SCL == 6 ){
        noWaterMask = 0
    }

    // var cloudMask = 1
    // if (samples.SCL == 8) { 
    //   cloudMask = 0 
    // } else if (samples.SCL == 9) { 
    //   cloudMask = 0
    // } else if (samples.SCL == 10) { 
    //   cloudMask = 0
    // } else if (samples.SCL == 11) { 
    //   cloudMask = 0
    // }

    var isValid = validate(samples);

    if (isValid) {
      return {
        data: [ndvi],
        // Exclude nodata pixels, pixels where ndvi is not defined and water pixels from statistics:
        dataMask: [samples.dataMask * validNDVIMask * noWaterMask]
      }
    }
  
    // return {
    //     data: [ndvi],
    //     // Exclude nodata pixels, pixels where ndvi is not defined and water pixels from statistics:
    //     dataMask: [samples.dataMask * validNDVIMask * noWaterMask * cloudMask]
    // }
}

        `
    }
})
}); 
    
    return response.json()
    

}

//function getting NDVI (avg?) for last x days (x-days to now), on a buffered point (between 100m, 500m and 1000m)

export async function avgNDVI(lat, lng, to_date, from_date, buff) { 
    //convert to point
    const coords = point([lng, lat])
    //make buffer around point
    buff = (buffer(coords, buff/2, {units: 'meters'})) //divided by 2 to counter act distortions? Buffer is doubling the bbox size in area
    //create bounding bux around buffer as aoi for sentinel hub
    const geometry = bbox(buff)
    //calculate buffer area
    const areaBuff = area(buff)/1e+6
    console.log("areaBuff:" + areaBuff)
    //Make polygon of bounding box to calculate bbox area
    const poly = bboxPolygon(geometry)
    const areaBbox = area(poly)/1e+6
    console.log("areaBbox:" + areaBbox)

    console.log("bbox:"+geometry)
    console.log("to_date:"+to_date)
    console.log("from_date:"+from_date)

    const token = await requestAuthToken(client_id, client_secret)

    const response = await fetch("https://services.sentinel-hub.com/api/v1/statistics", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + String(token)
    },
    body: JSON.stringify({ 
    "input": {
    "bounds": {
      "bbox": geometry
    },
    "data": [
      {
        "dataFilter": {
          "mosaickingOrder": "leastCC"
        },
        "type": "sentinel-2-l2a"
      }
    ]
  },
  "aggregation": {
    "timeRange": {
      "from": from_date,
      "to":to_date
    },
    "aggregationInterval": {
      "of": "P1D"
    },

    "evalscript": `
   //VERSION=3

function setup() {
  return {
    input: [{
      bands: [
        "B04",
        "B08",
        "SCL",
        "dataMask"
      ]
    }],
    output: [
      {
        id: "data",
        bands: 2
      },
      {
        id: "dataMask",
        bands: 1
      }]
  }
}

function evaluatePixel(samples) {
    let ndvi = (samples.B08 - samples.B04)/(samples.B08 + samples.B04)
    
    var validNDVIMask = 1
    if (samples.B08 + samples.B04 == 0 ){
        validNDVIMask = 0
    }
    
    var noWaterMask = 1
    if (samples.SCL == 6 ){
        noWaterMask = 0
    }
    
    // High Probability SCL cloud mask
    var cloudMask = 1
    if (samples.SCL == 9) { 
      cloudMask = 0 
    // } else if (samples.SCL == 8) { 
    //   cloudMask = 0
    // } else if (samples.SCL == 10) { 
    //   cloudMask = 0
    // } else if (samples.SCL == 11) { 
    //   cloudMask = 0
    }


  
    return {
        data: [ndvi],
        // Exclude nodata pixels, pixels where ndvi is not defined, water pixels and cloudy pixels from statistics:
        dataMask: [samples.dataMask * validNDVIMask * noWaterMask * cloudMask]
    }
}

        `
    }
})
}); 
    
    return response.json()
    
}


export async function maxNDVI(lat, lng, to_date, from_date, buff) { 

    //convert to point
    const coords = point([lng, lat])
    //make buffer around point
    buff = (buffer(coords, buff/2, {units: 'meters'})) //divided by 2 to counter act distortions? Buffer is doubling the bbox size in area
    //create bounding box around buffer as aoi for sentinel hub
    const geometry = bbox(buff)
    //calculate buffer area
    const areaBuff = area(buff)/1e+6
    console.log("areaBuff:" + areaBuff)
    //Make polygon of bounding box to calculate bbox area
    const poly = bboxPolygon(geometry)
    const areaBbox = area(poly)/1e+6
    console.log("areaBbox:" + areaBbox)

    console.log("bbox:"+geometry)
    console.log("to_date:"+to_date)
    console.log("from_date:"+from_date)

    const token = await requestAuthToken(client_id, client_secret)

    const response = await fetch("https://services.sentinel-hub.com/api/v1/statistics", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + String(token)
    },
    body: JSON.stringify({ 
    "input": {
    "bounds": {
      "bbox": geometry
    },
    "data": [
      {
        "dataFilter": {
          "mosaickingOrder": "leastCC"
        },
        "type": "sentinel-2-l2a"
      }
    ]
  },
  "aggregation": {
    "timeRange": {
      "from": from_date,
      "to":to_date
    },
    "aggregationInterval": {
      "of": "P1D",
      "lastIntervalBehavior": "SHORTEN"
    },
    "evalscript": `
   //VERSION=3


function setup() {
  return {
    input: [{
      bands: [
        "B04",
        "B08",
        "SCL",
        "dataMask"
      ]
    }],
    mosaicking: "ORBIT",
    output: [
      {
        id: "data",
        bands: 1
      },
      {
        id: "dataMask",
        bands: 1
      }]
  }
}


function evaluatePixel(samples) {

  // High Probability SCL cloud mask
  // var cloudMask = 1
  // var scl = sample.SCL;
  // var clm = sample.CLM;

  // if (clm === 1 || clm === 255) {
  //       cloudMask = 0;
  // } else if (scl === 1) { // SC_SATURATED_DEFECTIVE
  //      cloudMask = 0;
  // } else if (scl === 3) { // SC_CLOUD_SHADOW
  //       cloudMask = 0;
  // } else if (scl === 8) { // SC_CLOUD_MEDIUM_PROBA
  //       cloudMask = 0;
  // } else if (scl === 9) { // SC_CLOUD_HIGH_PROBA
  //       cloudMask = 0;
  // } else if (scl === 10) { // SC_THIN_CIRRUS
  //       cloudMask = 0;
  // } else if (scl === 11) { // SC_SNOW_ICE
  //   cloudMask = 0;
  // }

  var max = 0
  var hasData = 0
  for (var i=0; i < samples.length; i++) {
    if (samples[i].dataMask == 1 && samples[i].SCL != 1 && samples[i].SCL != 6 && samples[i].SCL != 8 && samples[i].SCL != 9 && samples[i].B04+samples[i].B08 != 0 ){
      hasData = 1
      var ndvi = (samples[i].B08 - samples[i].B04)/(samples[i].B08 + samples[i].B04);
      // max = ndvi > max ? ndvi:max;

    }
  }   
///changed max ndvi to ndvi
    return {
      data: [ndvi],
      dataMask: [hasData]
    }
}

        `
    }
})
}); 
    
    return response.json()
    

}