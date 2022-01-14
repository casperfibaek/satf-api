/* eslint-disable */
import fetch from 'node-fetch';
import axios from "axios";
import qs from "qs";
import buffer from '@turf/buffer';
import { point } from '@turf/helpers';
import bbox from '@turf/bbox';


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
      "of": "P30D"
    },
    "width": 512,
    "height": 343.697,
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

//function getting NDVI (avg?) for last x days (x-days to now), on a buffered point (between 100m, 500m and 1000m)

export async function avgNDVI(lat, lng, to_date, from_date, buff) { 

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
    let ndvi = (samples.B08 - samples.B04)/(samples.B08 + samples.B04)
    
    var validNDVIMask = 1
    if (samples.B08 + samples.B04 == 0 ){
        validNDVIMask = 0
    }
    
    var noWaterMask = 1
    if (samples.SCL == 6 ){
        noWaterMask = 0
    }

    return {
        data: [ndvi],
        // Exclude nodata pixels, pixels where ndvi is not defined and water pixels from statistics:
        dataMask: [samples.dataMask * validNDVIMask * noWaterMask]
    }
}

        `
    }
})
}); 
    
    return response.json()
    

}



// export async function NDVIImage() { 
//     // const bbox:Number = geometry

//     const response = await fetch("https://services.sentinel-hub.com/api/v1/statistics", {
//     method: "POST",
//     headers: {
//         "Content-Type": "application/json",
//         "Authorization": "Bearer eyJraWQiOiJzaCIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJjNmE3OTU2OS01NGQyLTRhNGEtOGE3OC1hNTliMGI3OGE2MDYiLCJhdWQiOiIwZjYxZDM4NS01YzhiLTQ0ZjktYTE1NC0yYWRmNTFkNTAxNDEiLCJqdGkiOiJmMTIwMGJjNC00MmMwLTRmNWUtOTBhZC1kMTUwOWJkNWNjMWYiLCJleHAiOjE2Mzg5OTczMDgsIm5hbWUiOiJBbmEgRmVybmFuZGVzIiwiZW1haWwiOiJhZmVyQG5pcmFzLmRrIiwiZ2l2ZW5fbmFtZSI6IkFuYSIsImZhbWlseV9uYW1lIjoiRmVybmFuZGVzIiwic2lkIjoiZGUwNmIxZWUtY2MwNi00YjFmLThmYTQtMDE2MTcyOWIwMWQ2IiwiZGlkIjoxLCJhaWQiOiI0NjZiMTE0Ny01YjliLTQ5ZmMtYmM4ZC1lN2YwMTk5ODdlNjkiLCJkIjp7IjEiOnsicmEiOnsicmFnIjoxfSwidCI6MTEwMDB9fX0.x45fWeUMJRoeb6mvTF19ncfncAGzbVhf8_EQJJANh_ZLEQdyuUvi1AV3tT4mzlh9g3x2S7pdBipkjHO6ksgaUOB3Kt16Sm4FJDDBa5qpzAgqWo4UBtVhjifMPsq-Esjb1xcIciMvTR8QbUtVqqX0GhJ6CjO-gPUa3s35oPhkiqiX9fWZ8PvMNkrMLgGIaYoKToHjCfGHpL9aPy5NRA49ro6urmVwcZnkmbClhRQ8mnYa6bvGJlkgQF1vNDGxqNNknk7Lie_Guwm8Dl2SuoVS-RMC-OA-BTVBXsW5CV9uFO_GKXyzy3CMViDc7yFnmWBloAgFkKxZaL9XJAKaUsvnmw"
//     },
//     body: JSON.stringify({ 
//     "input": {
//     "bounds": {
//       "bbox": bbox
//     },
//     "data": [
//       {
//         "dataFilter": {
//           "maxCloudCoverage": 10,
//           "mosaickingOrder": "leastCC"
//         },
//         "type": "sentinel-2-l2a"
//       }
//     ]
//   },
//   "aggregation": {
//     "timeRange": {
//       "from": from_date + "T00:00:00Z",
//       "to": to_date + "T23:59:59Z"
//     },
//     "aggregationInterval": {
//       "of": "P30D"
//     },
//     "width": 512,
//     "height": 343.697,
//     "evalscript": `
//    //VERSION=3
// function setup() {
//     return {
//         input: [{
//         bands: [
//             "B04",
//             "B08",
//             "SCL",
//             "dataMask"
//         ]
//         }],
//         mosaicking: "ORBIT",
//     output: [
//       {
//         id: "data",
//         bands: ["monthly_max_ndvi"]
//       },
//       {
//         id: "dataMask",
//         bands: 1
//       }]
//     };
//     }

//     function evaluatePixel(samples) {
//        var max = 0;
//     var hasData = 0;
//     for (var i=0;i<samples.length;i++) {
//       if (samples[i].dataMask == 1 && samples[i].SCL != 6 && samples[i].B04+samples[i].B08 != 0 ){
//         hasData = 1;
//         var ndvi = (samples[i].B08 - samples[i].B04)/(samples[i].B08 + samples[i].B04);
//         max = ndvi > max ? ndvi:max;
//       }
//     }
    
//     return {
//         data: [max],
//         dataMask: [hasData]
//     };
//     }

//         `
//     }
// })
// });    
//     return response.json()
    

// }


// module.exports = maxNDVIMonthly();
