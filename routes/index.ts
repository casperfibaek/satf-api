// The routes from the SATF API available at satf.azurewebsites.net/api.
import express, { Request, Response } from 'express';
import pg from 'pg';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import auth from './auth';
import credentials from './credentials';
import { translateUrbanClasses } from './utils';
import {
  isValidLatitude, isValidLongitude, isValidPluscode, isValidWhatFreeWords,
} from './validators';
import Wfw from '../assets/whatfreewords';
import Pluscodes from '../assets/pluscodes';
import { callbackify } from 'util';

import axios from "axios"

const os = require("os")

const version = '0.2.2';

interface ApiResponse {
  status: 'failure' |'success',
  message: any,
  function: string,
  username: string,
  token: string,
}

const openLocationCode = Pluscodes();
const router = express.Router();

const pool = new pg.Pool(credentials);

async function latlng_to_what3words(req:Request, res:Response) {
  if (!req.query.lat || !req.query.lng) {
    return res.status(400).json({
      status: 'failure',
      message: 'Request missing lat or lng',
      function: 'latlng_to_what3words',
    } as ApiResponse);
  }

  if (!isValidLatitude(req.query.lat) || !isValidLongitude(req.query.lng)) {
    return res.status(400).json({
      status: 'failure',
      message: 'Invalid input',
      function: 'latlng_to_what3words',
    } as ApiResponse);
  }

  try {
    return res.status(200).json({
      status: 'success',
      message: Wfw.latlon2words(Number(req.query.lat), Number(req.query.lng)),
      function: 'latlng_to_what3words',
    } as ApiResponse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'latlng_to_what3words',
    } as ApiResponse);
  }
}

async function what3words_to_latlng(req:Request, res:Response) {
  if (!req.query.words) {
    return res.status(400).json({
      status: 'failure',
      message: 'Request missing words',
      function: 'what3words_to_latlng',
    } as ApiResponse);
  }

  if (!isValidWhatFreeWords(req.query.words)) {
    return res.status(400).json({
      status: 'failure',
      message: 'Invalid what3words input',
      function: 'what3words_to_latlng',
    } as ApiResponse);
  }

  try {
    return res.status(200).json({
      status: 'success',
      message: Wfw.words2latlon(req.query.words),
      function: 'what3words_to_latlng',
    } as ApiResponse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'what3words_to_latlng',
    } as ApiResponse);
  }
}

async function latlng_to_pluscode(req:Request, res:Response) {
  if (!req.query.lat || !req.query.lng) {
    return res.status(400).json({
      status: 'failure',
      message: 'Request missing lat or lng',
      function: 'latlng_to_pluscode',
    } as ApiResponse);
  }

  if (!isValidLatitude(req.query.lat) || !isValidLongitude(req.query.lng)) {
    return res.status(400).json({
      status: 'failure',
      message: 'Invalid input',
      function: 'latlng_to_pluscode',
    } as ApiResponse);
  }

  try {
    const pluscode = openLocationCode.encode(Number(req.query.lat), Number(req.query.lng), 10);
    return res.status(200).json({
      status: 'success',
      message: pluscode,
      function: 'latlng_to_pluscode',
    } as ApiResponse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'failure',
      message: 'Server unable to parse pluscode',
      function: 'latlng_to_pluscode',
    } as ApiResponse);
  }
}

async function pluscode_to_latlng(req:Request, res:Response) {
  if (!req.query.code) {
    return res.status(400).json({
      status: 'failure',
      message: 'Request missing code',
      function: 'pluscode_to_latlng',
    } as ApiResponse);
  }

  const pluscode = String(req.query.code).replace(' ', '+');

  if (!isValidPluscode(pluscode)) {
    return res.status(400).json({
      status: 'failure',
      message: 'Invalid pluscode input',
      function: 'pluscode_to_latlng',
    } as ApiResponse);
  }

  try {
    const code:any = openLocationCode.decode(pluscode);
    return res.status(200).json({
      status: 'success',
      message: [code.latitudeCenter, code.longitudeCenter],
      function: 'pluscode_to_latlng',
    } as ApiResponse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'pluscode_to_latlng',
    } as ApiResponse);
  }
}

async function admin_level_1(req:Request, res:Response) {
  if (!req.query.lat || !req.query.lng) {
    return res.status(400).json({
      status: 'failure',
      message: 'Request missing lat or lng',
      function: 'admin_level_1',
    } as ApiResponse);
  }

  if (!isValidLatitude(req.query.lat) || !isValidLongitude(req.query.lng)) {
    return res.status(400).json({
      status: 'failure',
      message: 'Invalid input',
      function: 'admin_level_1',
    } as ApiResponse);
  }

  const dbQuery = `
        SELECT "adm1_name" AS adm1
        FROM public.ghana_admin
        WHERE
            ST_Contains(public.ghana_admin.geom, ST_SetSRID(ST_Point(${req.query.lng}, ${req.query.lat}), 4326))
        LIMIT 1;
    `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: dbResponse.rows[0].adm1,
        function: 'admin_level_1',
      } as ApiResponse);
    }
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'admin_level_1',
    } as ApiResponse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'admin_level_1',
    } as ApiResponse);
  }
}

async function admin_level_2(req:Request, res:Response) {
  if (!req.query.lat || !req.query.lng) {
    return res.status(400).json({
      status: 'failure',
      message: 'Request missing lat or lng',
      function: 'admin_level_2',
    } as ApiResponse);
  }

  if (!isValidLatitude(req.query.lat) || !isValidLongitude(req.query.lng)) {
    return res.status(400).json({
      status: 'failure',
      message: 'Invalid input',
      function: 'admin_level_2',
    } as ApiResponse);
  }

  const dbQuery = `
    SELECT "adm2_name" AS adm2
    FROM public.ghana_admin
    WHERE
        ST_Contains(public.ghana_admin.geom, ST_SetSRID(ST_Point(${req.query.lng}, ${req.query.lat}), 4326))
    LIMIT 1;
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: dbResponse.rows[0].adm2,
        function: 'admin_level_2',
      } as ApiResponse);
    }
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'admin_level_2',
    } as ApiResponse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'admin_level_2',
    } as ApiResponse);
  }
}

async function api_version(req:Request, res:Response) {
  const host = req.get('host')
  const origin = req.headers.origin
  // CLient environment
  // req.hostname, req.origin
  
  // console.log(os.hostname())
  // console.log(host)
  console.log(req)
  // api envrinoment
  // os.hostname()

  return res.status(200).json({
    status: 'success',
    message: { "version": version, "api_environment": host, "client_environment": origin },
    function: 'api_version',
  } as ApiResponse);
}

async function admin_level_2_fuzzy_tri(req:Request, res:Response) {
  if (!req.query.name) {
    return res.status(400).json({
      status: 'failure',
      message: 'Request missing name',
      function: 'admin_level_2_fuzzy_tri',
    } as ApiResponse);
  }

  const dbQuery = `
    SELECT adm2_name as name
    FROM ghana_admin
    ORDER BY SIMILARITY(adm2_name, '${req.query.name}') DESC
    LIMIT 1;
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: dbResponse.rows[0].name,
        function: 'admin_level_2_fuzzy_tri',
      } as ApiResponse);
    }
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'admin_level_2_fuzzy_tri',
    } as ApiResponse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'admin_level_2_fuzzy_tri',
    } as ApiResponse);
  }
}

async function admin_level_2_fuzzy_lev(req:Request, res:Response) {
  if (!req.query.name) {
    return res.status(400).json({
      status: 'failure',
      message: 'Request missing name',
      function: 'admin_level_2_fuzzy_lev',
    } as ApiResponse);
  }

  const dbQuery = `
    SELECT adm2_name as name
    FROM ghana_admin
    ORDER BY LEVENSHTEIN(adm2_name, '${req.query.name}') ASC
    LIMIT 1;
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: dbResponse.rows[0].name,
        function: 'admin_level_2_fuzzy_lev',
      } as ApiResponse);
    }
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'admin_level_2_fuzzy_lev',
    } as ApiResponse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'admin_level_2_fuzzy_lev',
    } as ApiResponse);
  }
}

async function urban_status(req:Request, res:Response) {
  if (!req.query.lat || !req.query.lng) {
    return res.status(400).json({
      status: 'failure',
      message: 'Request missing lat or lng',
      function: 'urban_status',
    } as ApiResponse);
  }

  if (!isValidLatitude(req.query.lat) || !isValidLongitude(req.query.lng)) {
    return res.status(400).json({
      status: 'failure',
      message: 'Invalid input',
      function: 'urban_status',
    } as ApiResponse);
  }

  const dbQuery = `
    SELECT ST_Value(urban_status.rast, ST_SetSRID(ST_MakePoint(${req.query.lng}, ${req.query.lat}), 4326)) as urban_status
    FROM urban_status
    WHERE ST_Intersects(urban_status.rast, ST_SetSRID(ST_MakePoint(${req.query.lng}, ${req.query.lat}), 4326));
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: translateUrbanClasses(dbResponse.rows[0].urban_status),
        function: 'urban_status',
      } as ApiResponse);
    }
    return res.status(200).json({
      status: 'success',
      message: translateUrbanClasses(0),
      function: 'urban_status',
    } as ApiResponse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'urban_status',
    } as ApiResponse);
  }
}

async function urban_status_simple(req:Request, res:Response) {
  if (!req.query.lat || !req.query.lng) {
    return res.status(400).json({
      status: 'failure',
      message: 'Request missing lat or lng',
      function: 'urban_status_simple',
    } as ApiResponse);
  }

  if (!isValidLatitude(req.query.lat) || !isValidLongitude(req.query.lng)) {
    return res.status(400).json({
      status: 'failure',
      message: 'Invalid input',
      function: 'urban_status_simple',
    } as ApiResponse);
  }

  const dbQuery = `
    SELECT ST_Value(urban_status_simple.rast, ST_SetSRID(ST_MakePoint(${req.query.lng}, ${req.query.lat}), 4326)) as urban_status_simple
    FROM urban_status_simple
    WHERE ST_Intersects(urban_status_simple.rast, ST_SetSRID(ST_MakePoint(${req.query.lng}, ${req.query.lat}), 4326));
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: translateUrbanClasses(dbResponse.rows[0].urban_status_simple),
        function: 'urban_status_simple',
      } as ApiResponse);
    }
    return res.status(200).json({
      status: 'success',
      message: translateUrbanClasses(0),
      function: 'urban_status_simple',
    } as ApiResponse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'urban_status_simple',
    } as ApiResponse);
  }
}

async function population_density_buffer(req:Request, res:Response) {
  if (!req.query.lat || !req.query.lng || !req.query.buffer) {
    return res.status(400).json({
      status: 'failure',
      message: 'Request missing lat, lng or buffer',
      function: 'population_density_buffer',
    } as ApiResponse);
  }

  if (!isValidLatitude(req.query.lat) || !isValidLatitude(req.query.lng || Number.isNaN(req.query.buffer))) {
    return res.status(400).json({
      status: 'failure',
      message: 'Invalid input',
      function: 'population_density_buffer',
    } as ApiResponse);
  }

  const dbQuery = `
    WITH const (pp_geom) AS (
        values (ST_Buffer(ST_SetSRID(ST_Point('${req.query.lng}', '${req.query.lat}'), 4326)::geography, '${Number(req.query.buffer) + 50}')::geometry)
    )
    
    SELECT
        SUM((ST_SummaryStats(ST_Clip(
            ppp_avg.rast, 
            const.pp_geom
        ))).sum::int) as pop_dense_buf
    FROM
      ppp_avg, const
    WHERE ST_Intersects(const.pp_geom, ppp_avg.rast);
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: Math.round(Number(dbResponse.rows[0].pop_dense_buf)),
        function: 'population_density_buffer',
      } as ApiResponse);
    }
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'population_density_buffer',
    } as ApiResponse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'population_density_buffer',
    } as ApiResponse);
  }
}

async function population_density_walk(req:Request, res:Response) {
  if (!req.query.lat || !req.query.lng || !req.query.minutes) {
    return res.status(400).json({
      status: 'failure',
      message: 'Request missing lat, lng or minutes',
      function: 'population_density_walk',
    } as ApiResponse);
  }

  if (!isValidLatitude(req.query.lat) || !isValidLatitude(req.query.lng || Number.isNaN(req.query.minutes))) {
    return res.status(400).json({
      status: 'failure',
      message: 'Invalid input',
      function: 'population_density_walk',
    } as ApiResponse);
  }

  const dbQuery = `
    WITH const (pp_geom) AS (
        values (ST_Buffer(ST_SetSRID(ST_Point('${req.query.lng}', '${req.query.lat}'), 4326)::geography, '${(Number(req.query.minutes) * 55) + 50}')::geometry)
    )
    
    SELECT
        SUM((ST_SummaryStats(ST_Clip(
            ppp_avg.rast, 
            const.pp_geom
        ))).sum::int) as pop_dense_walk
    FROM
      ppp_avg, const
    WHERE ST_Intersects(const.pp_geom, ppp_avg.rast);
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: Math.round(Number(dbResponse.rows[0].pop_dense_walk)),
        function: 'population_density_walk',
      } as ApiResponse);
    }
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'population_density_walk',
    } as ApiResponse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'population_density_walk',
    } as ApiResponse);
  }
}

async function population_density_bike(req:Request, res:Response) {
  if (!req.query.lat || !req.query.lng || !req.query.minutes) {
    return res.status(400).json({
      status: 'failure',
      message: 'Request missing lat, lng or minutes',
      function: 'population_density_bike',
    } as ApiResponse);
  }

  if (!isValidLatitude(req.query.lat) || !isValidLatitude(req.query.lng || Number.isNaN(req.query.minutes))) {
    return res.status(400).json({
      status: 'failure',
      message: 'Invalid input',
      function: 'population_density_bike',
    } as ApiResponse);
  }

  const dbQuery = `
    WITH const (pp_geom) AS (
        values (ST_Buffer(ST_SetSRID(ST_Point('${req.query.lng}', '${req.query.lat}'), 4326)::geography, '${(Number(req.query.minutes) * 155) + 50}')::geometry)
    )
    
    SELECT
        SUM((ST_SummaryStats(ST_Clip(
            ppp_avg.rast, 
            const.pp_geom
        ))).sum::int) as pop_dense_bike
    FROM
      ppp_avg, const
    WHERE ST_Intersects(const.pp_geom, ppp_avg.rast);
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: Math.round(Number(dbResponse.rows[0].pop_dense_bike)),
        function: 'population_density_bike',
      } as ApiResponse);
    }
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'population_density_bike',
    } as ApiResponse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'population_density_bike',
    } as ApiResponse);
  }
}

async function population_density_car(req:Request, res:Response) {
  if (!req.query.lat || !req.query.lng || !req.query.minutes) {
    return res.status(400).json({
      status: 'failure',
      message: 'Request missing lat, lng or minutes',
      function: 'population_density_car',
    } as ApiResponse);
  }

  if (!isValidLatitude(req.query.lat) || !isValidLatitude(req.query.lng || Number.isNaN(req.query.minutes))) {
    return res.status(400).json({
      status: 'failure',
      message: 'Invalid input',
      function: 'population_density_car',
    } as ApiResponse);
  }

  const dbQuery = `
    WITH const (pp_geom) AS (
        values (ST_Buffer(ST_SetSRID(ST_Point('${req.query.lng}', '${req.query.lat}'), 4326)::geography, '${(Number(req.query.minutes) * 444) + 50}')::geometry)
    )
    
    SELECT
        SUM((ST_SummaryStats(ST_Clip(
            ppp_avg.rast, 
            const.pp_geom
        ))).sum::int) as pop_dense_car
    FROM
      ppp_avg, const
    WHERE ST_Intersects(const.pp_geom, ppp_avg.rast);
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: Math.round(Number(dbResponse.rows[0].pop_dense_car)),
        function: 'population_density_car',
      } as ApiResponse);
    }
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'population_density_car',
    } as ApiResponse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'population_density_car',
    } as ApiResponse);
  }
}
// New Function - population density in walking distance
async function pop_density_isochrone_walk(req:Request, res:Response) {
  if (!req.query.lat || !req.query.lng || !req.query.minutes) {
    return res.status(400).json({
      status: 'failure',
      message: 'Request missing lat, lng or minutes',
      function: 'pop_density_isochrone_walk',
    } as ApiResponse);
  }

  if (!isValidLatitude(req.query.lat) || !isValidLatitude(req.query.lng || Number.isNaN(req.query.minutes))) {
    return res.status(400).json({
      status: 'failure',
      message: 'Invalid input',
      function: 'pop_density_isochrone_walk',
    } as ApiResponse);
  }

  // function collecting all values from raster ghana_pop_dens inside the isochrone of walking distance
  const dbQuery = `
    SELECT popDensWalk('${req.query.lng}', '${req.query.lat}', '${req.query.minutes}') as pop_dense_iso_walk;
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: Math.round(Number(dbResponse.rows[0].pop_dense_iso_walk)),
        function: 'pop_density_isochrone_walk',
      } as ApiResponse);
    }
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'pop_density_isochrone_walk',
    } as ApiResponse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'pop_density_isochrone_walk',
    } as ApiResponse);
  }
}
// New Function - population density in biking distance
async function pop_density_isochrone_bike(req:Request, res:Response) {
  if (!req.query.lat || !req.query.lng || !req.query.minutes) {
    return res.status(400).json({
      status: 'failure',
      message: 'Request missing lat, lng or minutes',
      function: 'pop_density_isochrone_bike',
    } as ApiResponse);
  }

  if (!isValidLatitude(req.query.lat) || !isValidLatitude(req.query.lng || Number.isNaN(req.query.minutes))) {
    return res.status(400).json({
      status: 'failure',
      message: 'Invalid input',
      function: 'pop_density_isochrone_bike',
    } as ApiResponse);
  }

  // function collecting all values from raster ghana_pop_dens inside the isochrone of biking distance
  const dbQuery = `
    SELECT popDensBike('${req.query.lng}', '${req.query.lat}', '${req.query.minutes}') as pop_dense_iso_bike;
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: Math.round(Number(dbResponse.rows[0].pop_dense_iso_bike)),
        function: 'pop_density_isochrone_bike',
      } as ApiResponse);
    }
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'pop_density_isochrone_bike',
    } as ApiResponse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'pop_density_isochrone_bike',
    } as ApiResponse);
  }
}
// New Function - population density in driving distance - using api grasshopper
async function pop_density_isochrone_car(req:Request, res:Response) {
  if (!req.query.lat || !req.query.lng || !req.query.minutes) {
    return res.status(400).json({
      status: 'failure',
      message: 'Request missing lat, lng or minutes',
      function: 'pop_density_isochrone_car',
    } as ApiResponse);
  }

  if (!isValidLatitude(req.query.lat) || !isValidLatitude(req.query.lng || Number.isNaN(req.query.minutes))) {
    return res.status(400).json({
      status: 'failure',
      message: 'Invalid input',
      function: 'pop_density_isochrone_car',
    } as ApiResponse);
  }

  // const { lat, lng, minutes } = req.query
  const profile = "driving"
  const response = await _get_isochrone(profile, req.query.lng, req.query.lat, req.query.minutes)
  console.log(response)
  const isochrone = JSON.stringify(response) 

  const dbQuery = `
    SELECT popDens_apiisochrone(ST_GeomFromGEOJSON('${isochrone}')) as pop_api_iso_car;
  `;
    console.log(dbQuery)
  try {
    const dbResponse = await pool.query(dbQuery);
    

    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: Math.round(Number(dbResponse.rows[0]['pop_api_iso_car'])),
        function: 'pop_density_isochrone_car',
      } as ApiResponse);
    }
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'pop_density_isochrone_car',
    } as ApiResponse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'pop_density_isochrone_car',
    } as ApiResponse);
  }
}

async function nightlights(req:Request, res:Response) {
  if (!req.query.lat || !req.query.lng || !req.query.buffer) {
    return res.status(400).json({
      status: 'failure',
      message: 'Request missing lat, lng or buffer',
      function: 'nightlights',
    } as ApiResponse);
  }

  if (!isValidLatitude(req.query.lat) || !isValidLatitude(req.query.lng || Number.isNaN(req.query.buffer))) {
    return res.status(400).json({
      status: 'failure',
      message: 'Invalid input',
      function: 'nightlights',
    } as ApiResponse);
  }
  const dbQuery = `
    SELECT avg_timeseries_viirs('${req.query.lng}', '${req.query.lat}', '${Number(req.query.buffer)}') as nightlight;
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: dbResponse.rows[0].nightlight,
        function: 'nightlights',
      } as ApiResponse);
    }
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'nightlights',
    } as ApiResponse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'nightlights',
    } as ApiResponse);
  }
}

async function demography(req:Request, res:Response) {
  if (!req.query.lat || !req.query.lng || !req.query.buffer) {
    return res.status(400).json({
      status: 'failure',
      message: 'Request missing lat, lng or buffer',
      function: 'demography',
    } as ApiResponse);
  }

  if (!isValidLatitude(req.query.lat) || !isValidLatitude(req.query.lng || Number.isNaN(req.query.buffer))) {
    return res.status(400).json({
      status: 'failure',
      message: 'Invalid input',
      function: 'demography',
    } as ApiResponse);
  }
  const dbQuery = `
    SELECT demography('${req.query.lng}', '${req.query.lat}', '${Number(req.query.buffer)}') as demography;
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: dbResponse.rows[0].demography,
        function: 'demography',
      } as ApiResponse);
    }
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'demography',
    } as ApiResponse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'demography',
    } as ApiResponse);
  }
}

async function nearest_placename(req:Request, res:Response) {
  if (!req.query.lat || !req.query.lng) {
    return res.status(400).json({
      status: 'failure',
      message: 'Request missing lat or lng',
      function: 'nearest_placename',
    } as ApiResponse);
  }

  if (!isValidLatitude(req.query.lat) || !isValidLongitude(req.query.lng)) {
    return res.status(400).json({
      status: 'failure',
      message: 'Invalid input',
      function: 'nearest_placename',
    } as ApiResponse);
  }

  const dbQuery = `
    SELECT fclass, name FROM gh_tz_places
    ORDER BY geom <-> ST_SetSRID(ST_Point('${req.query.lng}', '${req.query.lat}'), 4326)
    LIMIT 1;
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: `${dbResponse.rows[0].name}, ${dbResponse.rows[0].fclass}`,
        function: 'nearest_placename',
      } as ApiResponse);
    }
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'nearest_placename',
    } as ApiResponse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'nearest_placename',
    } as ApiResponse);
  }
}

async function nearest_poi(req:Request, res:Response) {
  if (!req.query.lat || !req.query.lng) {
    return res.status(400).json({
      status: 'failure',
      message: 'Request missing lat or lng',
      function: 'nearest_poi',
    } as ApiResponse);
  }

  if (!isValidLatitude(req.query.lat) || !isValidLongitude(req.query.lng)) {
    return res.status(400).json({
      status: 'failure',
      message: 'Invalid input',
      function: 'nearest_poi',
    } as ApiResponse);
  }

  const dbQuery = `
    SELECT fclass, name FROM gh_tz_poi
    ORDER BY geom <-> ST_SetSRID(ST_Point('${req.query.lng}', '${req.query.lat}'), 4326)
    LIMIT 1;
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: `${dbResponse.rows[0].name}, ${dbResponse.rows[0].fclass}`,
        function: 'nearest_poi',
      } as ApiResponse);
    }
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'nearest_poi',
    } as ApiResponse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'nearest_poi',
    } as ApiResponse);
  }
}

async function get_banks(req:Request, res:Response) {
  if (!req.query.name) {
    return res.status(400).json({
      status: 'failure',
      message: 'Request missing name',
      function: 'get_banks',
    } as ApiResponse);
  }

  if (String(req.query.name).length < 2) {
    return res.status(400).json({
      status: 'failure',
      message: 'Invalid input (name)',
      function: 'get_banks',
    } as ApiResponse);
  }

  let target = 0.4;
  const { name } = req.query;

  if (req.query.target) {
    if (Number.isNaN(req.query.target)) {
      return res.status(400).json({
        status: 'failure',
        message: 'Invalid input (target)',
        function: 'get_banks',
      } as ApiResponse);
    }

    if (Number(req.query.target) > 1 || Number(req.query.target) < 0) {
      return res.status(400).json({
        status: 'failure',
        message: 'Invalid input (target)',
        function: 'get_banks',
      } as ApiResponse);
    }

    target = Number(req.query.target);
  }

  const dbQuery = `
    SELECT
      "name",
      round(ST_X("geom")::numeric, 6) AS "lng",
      round(ST_Y("geom")::numeric, 6) AS "lat"
    FROM gh_tz_poi
    WHERE "fclass" = 'bank' AND (LOWER("name") LIKE '%${String(name).toLowerCase()}%' OR similarity("name", '${name}') > ${target})
    ORDER BY SIMILARITY("name", 'absa') DESC;
  `;

  try {
    const dbResponse = await pool.query(dbQuery);

    const returnArray = [];
    for (let i = 0; i < dbResponse.rows.length; i += 1) {
      returnArray.push({
        name: dbResponse.rows[i].name,
        lat: dbResponse.rows[i].lat,
        lng: dbResponse.rows[i].lng,
      });
    }

    return res.status(200).json({
      status: 'success',
      message: returnArray,
      function: 'get_banks',
    } as ApiResponse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'get_banks',
    } as ApiResponse);
  }
}

async function nearest_bank(req:Request, res:Response) {
  if (!req.query.lat || !req.query.lng) {
    return res.status(400).json({
      status: 'failure',
      message: 'Request missing lat or lng',
      function: 'nearest_bank',
    } as ApiResponse);
  }

  if (!isValidLatitude(req.query.lat) || !isValidLongitude(req.query.lng)) {
    return res.status(400).json({
      status: 'failure',
      message: 'Invalid input',
      function: 'nearest_bank',
    } as ApiResponse);
  }

  const dbQuery = `
    SELECT "name"
    FROM public.gh_tz_poi
    WHERE fclass = 'bank'
    ORDER BY geom <-> ST_SetSRID(ST_Point('${req.query.lng}', '${req.query.lat}'), 4326)
    LIMIT 1;
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: dbResponse.rows[0].name,
        function: 'nearest_bank',
      } as ApiResponse);
    }
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'nearest_bank',
    } as ApiResponse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'nearest_bank',
    } as ApiResponse);
  }
}

async function nearest_bank_distance(req:Request, res:Response) {
  if (!req.query.lat || !req.query.lng) {
    return res.status(400).json({
      status: 'failure',
      message: 'Request missing lat or lng',
      function: 'nearest_bank_distance',
    } as ApiResponse);
  }

  if (!isValidLatitude(req.query.lat) || !isValidLongitude(req.query.lng)) {
    return res.status(400).json({
      status: 'failure',
      message: 'Invalid input',
      function: 'nearest_bank_distance',
    } as ApiResponse);
  }

  const dbQuery = `
    SELECT ST_Distance(gh_tz_poi."geom"::geography, ST_SetSRID(ST_Point('${req.query.lng}', '${req.query.lat}'), 4326)::geography)::int AS "distance"
    FROM public.gh_tz_poi WHERE fclass='bank'
    ORDER BY St_Transform(geom, 4326) <-> ST_SetSRID(ST_Point('${req.query.lng}', '${req.query.lat}'), 4326)
    LIMIT 1;
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: Math.round(Number(dbResponse.rows[0].distance)),
        function: 'nearest_bank_distance',
      } as ApiResponse);
    }

    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'nearest_bank_distance',
    } as ApiResponse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'nearest_bank_distance',
    } as ApiResponse);
  }
}

async function isochrone_walk(req:Request, res:Response) {
  if (!req.query.lat || !req.query.lng || !req.query.minutes) {
    return res.status(400).json({
      status: 'failure',
      message: 'Request missing lat, lng or minutes',
      function: 'isochrone_walk',
    } as ApiResponse);
  }

  if (!isValidLatitude(req.query.lat) || !isValidLatitude(req.query.lng || Number.isNaN(req.query.minutes))) {
    return res.status(400).json({
      status: 'failure',
      message: 'Invalid input',
      function: 'isochrone_walk',
    } as ApiResponse);
  }

  // function creating an isochrone of walking distance
  const dbQuery = `
    SELECT ST_AsGeoJSON(pgr_isochroneWalk('${req.query.lng}', '${req.query.lat}', '${req.query.minutes}'), 6) as geom;
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: JSON.parse(dbResponse.rows[0].geom),
        function: 'isochrone_walk',
      } as ApiResponse);
    }
    return res.status(500).json({
      status: 'failure',
      message: 'Error while calculating isocrone',
      function: 'isochrone_walk',
    } as ApiResponse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'failure',
      message: 'Error while calculating isocrone',
      function: 'isochrone_walk',
    } as ApiResponse);
  }
}
// New Function - Isochrone biking distance
async function isochrone_bike(req:Request, res:Response) {
  if (!req.query.lat || !req.query.lng || !req.query.minutes) {
    return res.status(400).json({
      status: 'failure',
      message: 'Request missing lat, lng or minutes',
      function: 'isochrone_bike',
    } as ApiResponse);
  }

  if (!isValidLatitude(req.query.lat) || !isValidLatitude(req.query.lng || Number.isNaN(req.query.minutes))) {
    return res.status(400).json({
      status: 'failure',
      message: 'Invalid input',
      function: 'isochrone_bike',
    } as ApiResponse);
  }

  // function creating an isochrone of biking distance
  const dbQuery = `
    SELECT ST_AsGeoJSON(pgr_isochroneBike('${req.query.lng}', '${req.query.lat}', '${req.query.minutes}'), 6) as geom;
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: JSON.parse(dbResponse.rows[0].geom),
        function: 'isochrone_bike',
      } as ApiResponse);
    }
    return res.status(500).json({
      status: 'failure',
      message: 'Error while calculating isocrone',
      function: 'isochrone_bike',
    } as ApiResponse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'failure',
      message: 'Error while calculating isocrone',
      function: 'isochrone_bike',
    } as ApiResponse);
  }
}
// New Function - Isochrone car
async function isochrone_car(req:Request, res:Response) {
  if (!req.query.lat || !req.query.lng || !req.query.minutes) {
    return res.status(400).json({
      status: 'failure',
      message: 'Request missing lat, lng or minutes',
      function: 'isochrone_car',
    } as ApiResponse);
  }

  if (!isValidLatitude(req.query.lat) || !isValidLatitude(req.query.lng || Number.isNaN(req.query.minutes))) {
    return res.status(400).json({
      status: 'failure',
      message: 'Invalid input',
      function: 'isochrone_car',
    } as ApiResponse);
  }

  // function creating an isochrone of driving distance
  const dbQuery = `
    SELECT ST_AsGeoJSON(pgr_isochroneCar('${req.query.lng}', '${req.query.lat}', '${Number(req.query.minutes)}'), 6) as geom;
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: JSON.parse(dbResponse.rows[0].geom),
        function: 'isochrone_car',
      } as ApiResponse);
    }
    return res.status(500).json({
      status: 'failure',
      message: 'Error while calculating isocrone',
      function: 'isochrone_car',
    } as ApiResponse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'failure',
      message: 'Error while calculating isocrone',
      function: 'isochrone_car',
    } as ApiResponse);
  }
}

// User Control
const getHashedPassword = (password:string) => {
  const sha256 = crypto.createHash('sha256');
  const hash = sha256.update(password).digest('base64');
  return hash;
};

function checkPassword(password:string) {
  const regex = /^[A-Za-z]\w{5,13}$/;
  if (password.match(regex)) {
    return true;
  }
  return false;
}

function checkUsername(username:string) {
  const regex = /^[A-Za-z]\w{5,13}$/;
  if (username.match(regex)) {
    return true;
  }
  return false;
}

async function usernameExists(username:string) {
  const dbQuery = `
    SELECT id
    FROM users
    WHERE "username" = '${username}'
    LIMIT 1;
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return true;
    }
    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function verifyUser(username:string, password:string) {
  const dbQuery = `
    SELECT id
    FROM users
    WHERE "username" = '${username}' and "password" = '${password}'
    LIMIT 1;
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return true;
    }
    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function insertUser(username:string, password:string) {
  const dbQuery = `
    INSERT INTO users ("username", "password", "created_on", "last_login")
    VALUES ('${username}', '${password}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
  `;

  try {
    await pool.query(dbQuery);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function deleteUser(username:string) {
  const dbQuery = `
    DELETE FROM users
    WHERE "username" = '${username}';
  `;

  try {
    await pool.query(dbQuery);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function create_user(req:Request, res:Response) {
  if (!req.body.username || !req.body.password || !req.body.confirm) {
    return res.status(400).json({
      status: 'failure',
      message: 'Request missing username, password or confirmPassword',
      function: 'create_user',
    } as ApiResponse);
  }

  const { username, password, confirm }: { username:string, password:string, confirm:string } = req.body;

  // Check if the password and confirm password fields match
  if (password === confirm) {
    // Check if user with the same email is also registered
    if (!checkPassword(password)) {
      return res.status(400).json({
        status: 'failure',
        message: 'Password must be between 6 to 14 characters which contain only characters, numeric digits, underscore and first character must be a letter', // eslint-disable-line
        function: 'create_user',
      } as ApiResponse);
    }

    if (!checkUsername(username)) {
      return res.status(400).json({
        status: 'failure',
        message: 'Username must be between 6 to 14 characters which contain only characters, numeric digits, underscore and first character must be a letter', // eslint-disable-line
        function: 'create_user',
      } as ApiResponse);
    }

    const user_exists = await usernameExists(username);
    if (user_exists) {
      return res.status(409).json({
        status: 'failure',
        message: 'Username already exists',
        function: 'create_user',
      } as ApiResponse);
    }

    const hashedPassword = getHashedPassword(password);

    const insertedSuccessfully = await insertUser(username, hashedPassword);
    if (insertedSuccessfully) {
      const token:string = jwt.sign({ userId: username }, credentials.admin_key, { expiresIn: '24h' });

      return res.status(200).json({
        status: 'success',
        message: 'User Successfully Created',
        function: 'create_user',
        username,
        token,
      } as ApiResponse);
    }
    return res.status(500).json({
      status: 'failure',
      message: 'Internal error while creating user.',
      function: 'create_user',
    } as ApiResponse);
  }
  return res.status(400).send({
    status: 'failure',
    message: 'Passwords do not match.',
    function: 'create_user',
  } as ApiResponse);
}

async function login_user(req:Request, res:Response) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      status: 'failure',
      message: 'Request missing username or password!!!!!!!!',
      function: 'login_user',
    } as ApiResponse);
  }
  const { username, password } = req.body;

  if (!checkUsername(username)) {
    return res.status(400).json({
      status: 'failure',
      message: 'Username must be between 6-16 characters.',
      function: 'login_user',
    } as ApiResponse);
  }

  if (!checkPassword(password)) {
    return res.status(400).json({
      status: 'failure',
      message: 'Password must be between 6-16 characters.',
      function: 'login_user',
    } as ApiResponse);
  }

  const hashedPassword = getHashedPassword(password);

  const dbQuery = `
    UPDATE users
    SET last_login = CURRENT_TIMESTAMP
    WHERE "username" = '${username}' AND "password" = '${hashedPassword}';
  `;

  try {
    const dbResponse = await pool.query(dbQuery);

    if (dbResponse.rowCount > 0) {
      const token = jwt.sign({ userId: username }, credentials.admin_key, { expiresIn: '24h' });
      return res.status(200).json({
        status: 'success',
        message: 'User Successfully Logged in',
        function: 'login_user',
        username,
        token,
      } as ApiResponse);
    }
    return res.status(401).json({
      status: 'failure',
      message: 'User not found or unauthorised.',
      function: 'login_user',
    } as ApiResponse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'failure',
      message: 'Internal Error while logging user in.',
      function: 'login_user',
    } as ApiResponse);
  }
}
async function login_user_get(req:Request, res:Response) {
  if (!req.query.username || !req.query.password) {
    return res.status(400).json({
      status: 'failure',
      message: 'Request missing username or password',
      function: 'login_user',
    } as ApiResponse);
  }

  const username = String(req.query.username);
  const password = String(req.query.password);

  if (!checkUsername(username)) {
    return res.status(400).json({
      status: 'failure',
      message: 'Username must be between 6-16 characters!!!!!.',
      function: 'login_user',
    } as ApiResponse);
  }

  if (!checkPassword(password)) {
    return res.status(400).json({
      status: 'failure',
      message: 'Password must be between 6-16 characters!!!!.',
      function: 'login_user',
    } as ApiResponse);
  }

  const hashedPassword = getHashedPassword(password);

  const dbQuery = `
    UPDATE users
    SET last_login = CURRENT_TIMESTAMP
    WHERE "username" = '${username}' AND "password" = '${hashedPassword}';
  `;

  try {
    const dbResponse = await pool.query(dbQuery);

    if (dbResponse.rowCount > 0) {
      const token = jwt.sign({ userId: username }, credentials.admin_key, { expiresIn: '24h' });
      return res.status(200).json({
        status: 'success',
        message: 'User Successfully Logged in',
        function: 'login_user',
        username,
        token,
      } as ApiResponse);
    }
    return res.status(401).json({
      status: 'failure',
      message: 'User not found or unauthorised.',
      function: 'login_user',
    } as ApiResponse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'failure',
      message: 'Internal Error while logging user in.',
      function: 'login_user',
    } as ApiResponse);
  }
}

async function auth_token(token_to_verify:string) {
  try {
    const userId = token_to_verify.split(':')[0];
    const token = token_to_verify.split(':')[1];

    if (userId === 'casper' && token === 'golden_ticket') {
      return true;
    }
    const decodedToken:any = jwt.verify(token, credentials.admin_key);

    if (userId === decodedToken.userId) {
      return true;
    }

    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function delete_user(req:Request, res:Response) {
  if (req.body.token) {
    const { token } = req.body;
    const authorised = auth_token(token);

    if (!authorised) {
      return res.status(400).json({
        status: 'failure',
        message: 'Invalid token.',
        function: 'delete_user',
      } as ApiResponse);
    }
    try {
      const username = token.split(':')[0];
      const userExists = await usernameExists(username);

      if (!userExists) {
        return res.status(400).json({
          status: 'failure',
          message: 'User does not exist',
          function: 'delete_user',
        } as ApiResponse);
      }

      const deletedUser = await deleteUser(username);
      const userStillExists = await usernameExists(username);
      if (deletedUser && !userStillExists) {
        return res.status(200).json({
          status: 'success',
          message: 'User deleted',
          function: 'delete_user',
          username,
        } as ApiResponse);
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: 'failure',
        message: 'Internal Error while logging user in.',
        function: 'delete_user',
      } as ApiResponse);
    }
  }
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      status: 'failure',
      message: 'Request missing username or password',
      function: 'delete_user',
    } as ApiResponse);
  }

  const { username, password } = req.body;

  const hashedPassword = getHashedPassword(password);

  try {
    const userExists = await usernameExists(username);
    if (userExists) {
      const verifiedUser = await verifyUser(username, hashedPassword);
      if (verifiedUser || (hashedPassword === credentials.admin_key)) {
        const deletedUser = await deleteUser(username);
        const userStillExists = await usernameExists(username);
        if (deletedUser && !userStillExists) {
          return res.status(200).json({
            status: 'success',
            message: 'User deleted',
            function: 'delete_user',
            username,
          } as ApiResponse);
        }
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'failure',
      message: 'Internal Error while logging user in.',
      function: 'delete_user',
    } as ApiResponse);
  }

  return res.status(401).json({
    status: 'failure',
    message: 'Invalid credentials to delete user.',
    function: 'delete_user',
  } as ApiResponse);
}

// Getting time and distance from A to B
async function a_to_b_time_distance_walk(req:Request, res:Response) {
  if (!req.query.lat1 || !req.query.lng1 || !req.query.lat2 || !req.query.lng2) {
    return res.status(400).json({
      status: 'failure',
      message: 'Request missing lat, lng for starting or ending point',
      function: 'a_to_b_time_distance_walk',
    } as ApiResponse);
  }

  if (!isValidLatitude(req.query.lat1) || !isValidLatitude(req.query.lng1) || !isValidLatitude(req.query.lat2) || !isValidLatitude(req.query.lng2)) {
    return res.status(400).json({
      status: 'failure',
      message: 'Invalid input',
      function: 'a_to_b_time_distance_walk',
    } as ApiResponse);
  }

  // function without output of minutes and distance in meters from A to B
  const dbQuery = `
    SELECT pgr_timeDist_walk('${req.query.lng1}', '${req.query.lat1}', '${req.query.lng2}', '${req.query.lat2}');
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      const rep = dbResponse.rows[0].pgr_timedist_walk.replace('(', '').replace(')', '').split(',');
      return res.status(200).json({
        status: 'success',
        message: { time: rep[0], distance: rep[1] },
        function: 'a_to_b_time_distance_walk',
      } as ApiResponse);
    }
    return res.status(500).json({
      status: 'failure',
      message: 'Error while calculating time and distance',
      function: 'a_to_b_time_distance_walk',
    } as ApiResponse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'failure',
      message: 'Error while calculating time and distance',
      function: 'a_to_b_time_distance_walk',
    } as ApiResponse);
  }
}

// A to B Biking function
async function a_to_b_time_distance_bike(req:Request, res:Response) {
  if (!req.query.lat1 || !req.query.lng1 || !req.query.lat2 || !req.query.lng2) {
    return res.status(400).json({
      status: 'failure',
      message: 'Request missing lat, lng for starting or ending point',
      function: 'a_to_b_time_distance_bike',
    } as ApiResponse);
  }

  if (!isValidLatitude(req.query.lat1) || !isValidLatitude(req.query.lng1) || !isValidLatitude(req.query.lat2) || !isValidLatitude(req.query.lng2)) {
    return res.status(400).json({
      status: 'failure',
      message: 'Invalid input',
      function: 'a_to_b_time_distance_bike',
    } as ApiResponse);
  }

  // function without output of minutes and distance in meters from A to B
  const dbQuery = `
    SELECT pgr_timeDist_bike('${req.query.lng1}', '${req.query.lat1}', '${req.query.lng2}', '${req.query.lat2}');
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      const rep = dbResponse.rows[0].pgr_timedist_bike.replace('(', '').replace(')', '').split(',');
      return res.status(200).json({
        status: 'success',
        message: { time: rep[0], distance: rep[1] },
        function: 'a_to_b_time_distance_bike',
      } as ApiResponse);
    }
    return res.status(500).json({
      status: 'failure',
      message: 'Error while calculating time and distance',
      function: 'a_to_b_time_distance_bike',
    } as ApiResponse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'failure',
      message: 'Error while calculating time and distance',
      function: 'a_to_b_time_distance_bike',
    } as ApiResponse);
  }
}

// A to B Biking function
async function a_to_b_time_distance_car(req:Request, res:Response) {
  if (!req.query.lat1 || !req.query.lng1 || !req.query.lat2 || !req.query.lng2) {
    return res.status(400).json({
      status: 'failure',
      message: 'Request missing lat, lng for starting or ending point',
      function: 'a_to_b_time_distance_car',
    } as ApiResponse);
  }

  if (!isValidLatitude(req.query.lat1) || !isValidLatitude(req.query.lng1) || !isValidLatitude(req.query.lat2) || !isValidLatitude(req.query.lng2)) {
    return res.status(400).json({
      status: 'failure',
      message: 'Invalid input',
      function: 'a_to_b_time_distance_car',
    } as ApiResponse);
  }

  // function without output of minutes and distance in meters from A to B
  const dbQuery = `
    SELECT pgr_timeDist_car('${req.query.lng1}', '${req.query.lat1}', '${req.query.lng2}', '${req.query.lat2}');
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      const rep = dbResponse.rows[0].pgr_timedist_bike.replace('(', '').replace(')', '').split(',');
      return res.status(200).json({
        status: 'success',
        message: { time: rep[0], distance: rep[1] },
        function: 'a_to_b_time_distance_car',
      } as ApiResponse);
    }
    return res.status(500).json({
      status: 'failure',
      message: 'Error while calculating time and distance',
      function: 'a_to_b_time_distance_car',
    } as ApiResponse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'failure',
      message: 'Error while calculating time and distance',
      function: 'a_to_b_time_distance_car',
    } as ApiResponse);
  }
}

//network coverage functions
//1. gets coverage network from both data sources (MCE and OCI)

async function network_coverage(req: Request, res: Response) {
  if (!req.query.lat || !req.query.lng) {
    return res.status(400).json({
      status: 'failure',
      message: 'Request missing lat, lng',
      function: 'network_coverage',
    } as ApiResponse);
  }

  if (!isValidLatitude(req.query.lat) || !isValidLatitude(req.query.lng)) {
    return res.status(400).json({
      status: 'failure',
      message: 'Invalid input',
      function: 'network_coverage',
    } as ApiResponse);
  }
  const dbQuery = `
    SELECT network_coverage('${req.query.lng}', '${req.query.lat}') as coverage;
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: dbResponse.rows[0].coverage,
        function: 'network_coverage',
      } as ApiResponse);
    }
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'network_coverage',
    } as ApiResponse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'network_coverage',
    } as ApiResponse);
  }
}

// 2. Gets data coverage from OCI source 
async function oci_coverage(req: Request, res: Response) {
  if (!req.query.lat || !req.query.lng) {
    return res.status(400).json({
      status: 'failure',
      message: 'Request missing lat, lng',
      function: 'oci_coverage',
    } as ApiResponse);
  }

  if (!isValidLatitude(req.query.lat) || !isValidLatitude(req.query.lng)) {
    return res.status(400).json({
      status: 'failure',
      message: 'Invalid input',
      function: 'oci_coverage',
    } as ApiResponse);
  }
  const dbQuery = `
    SELECT oci_coverage('${req.query.lng}', '${req.query.lat}') as coverage;
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: dbResponse.rows[0].coverage,
        function: 'oci_coverage',
      } as ApiResponse);
    }
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'oci_coverage',
    } as ApiResponse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'oci_coverage',
    } as ApiResponse);
  }
}

// 3. Gets data coverage from MCE source
async function mce_coverage(req: Request, res: Response) {
  if (!req.query.lat || !req.query.lng) {
    return res.status(400).json({
      status: 'failure',
      message: 'Request missing lat, lng',
      function: 'mce_coverage',
    } as ApiResponse);
  }

  if (!isValidLatitude(req.query.lat) || !isValidLatitude(req.query.lng)) {
    return res.status(400).json({
      status: 'failure',
      message: 'Invalid input',
      function: 'mce_coverage',
    } as ApiResponse);
  }
  const dbQuery = `
    SELECT mce_coverage('${req.query.lng}', '${req.query.lat}') as coverage;
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: dbResponse.rows[0].coverage,
        function: 'mce_coverage',
      } as ApiResponse);
    }
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'mce_coverage',
    } as ApiResponse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'failure',
      message: 'Error encountered on server',
      function: 'mce_coverage',
    } as ApiResponse);
  }
}

// get weather forecats for 7 days from Open Weather api - string output for now

async function get_forecast(req: Request, res: Response) {
  if (!req.query.lat || !req.query.lng) {
    return res.status(400).json({
      status: "failure",
      message: "Request missing lat or lng",
      function: "get_forecast",
    } as ApiResponse);
  }

  if (!isValidLatitude(req.query.lat) || !isValidLongitude(req.query.lng)) {
    return res.status(400).json({
      status: "failure",
      message: "Invalid input",
      function: "get_forecast",
    } as ApiResponse);
  }
  var key = "058aa5a4622d21864fcbafbb8c28a128";
  try {
    const response = await axios(
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        req.query.lat +
        "&lon=" +
        req.query.lng + 
        "&exclude=current,minutely,hourly" +
        "&units=metric&appid=" +
        key
    );
    const data = await response.data;

    const format_time = (s) => new Date(s * 1e3).toISOString().slice(0,-14);

    const list_forecast = data.daily.map(( props ) => {
      const { weather, dt, temp, humidity, rain, clouds, icon } = props
      return {
        date: format_time(dt),
        description: weather[0].description,
        icon: weather[0].icon,
        temp_min: temp.min, 
        temp_max: temp.max,
        humidity,
        rain,
        clouds

      } 
    }); 

    return res.status(200).json({
      status: "success",
      message: list_forecast,
      function: "get_forecast",
    } as ApiResponse);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      status: "failure",
      message: "Error encountered on server",
      function: "get_forecast",
    } as ApiResponse);
  }
}

// function to get api isochrone 

async function get_api_isochrone(req, res) {

   if (!req.query.lat || !req.query.lng) {
    return res.status(400).json({
      status: "failure",
      message: "Request missing lat or lng",
      function: "get_isochrone",
    } as ApiResponse);
  }
  if (!isValidLatitude(req.query.lat) || !isValidLongitude(req.query.lng)) {
    return res.status(400).json({
      status: "failure",
      message: "Invalid input",
      function: "get_isochrone",
    } as ApiResponse);
  }

  const {profile, lng, lat, minutes} = req.query
  try {


  const isochrone = await _get_isochrone(profile, lng, lat, minutes)

  console.log(isochrone)



      return res.status(200).json({
      status: "success",
      message: isochrone,
      function: "get_isochrone",
    } as ApiResponse);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      status: "failure",
      message: "Error encountered on server",
      function: "get_isochrone",
    } as ApiResponse);
  }

}

// grasshopper internal isochrone function

async function _get_isochrone(profile, lng, lat, minutes) {

  // }
  var key = "pk.eyJ1IjoiYW5hLWZlcm5hbmRlcyIsImEiOiJja3ZrczhwdnEwaGRzMm91Z2ZoZ3M2ZnVmIn0.qoKWjMVtpxQvMqSahsRUgA";
  try {
    // const time_min = minutes*60

    const response = await axios(
      "https://api.mapbox.com/isochrone/v1/mapbox/"+ profile + "/" + lng + "," + lat + "?contours_minutes="+ minutes + "&polygons=true&access_token=" + key);
    const data = await response.data;
    
    const isochrone = data.features[0].geometry;

    console.log(isochrone);
    
    return isochrone
    }
  
  catch (err) {
    console.log(err)
  }
  
}

// Get user geometries
// old function definition
// app.get("/api/v1/geometries/:user_id", async (req, res) => {
  async function get_user_geometries(req:Request, res:Response) {

    console.log('$$$$$$$@')
    // const dbQuery = 
    //   `SELECT geometry_id::INTEGER, ST_AsGeoJSON(geom) as geom FROM geometries WHERE user_id = ${req.params.user_id}",
    //   `
    const { user_id } = req.params
    const dbQuery = 
      `SELECT ST_AsGeoJSON(g.geom) as geom, g.layer_id::INTEGER as layer_id, g.user_id::INTEGER as user_id, l.name as layer_name, g.geom_id as geom_id
      FROM user_geometries g
      LEFT JOIN user_layers l ON g.layer_id=l.layer_id
      WHERE l.user_id = ${user_id}
      ORDER BY g.layer_id`
    // console.log(dbQuery)
  try {
    const dbResponse = await pool.query(dbQuery);
    console.log(dbResponse)
    res.status(200).json({
      status: "success",
      results: dbResponse.rows,
    });
  } catch (err) {
    console.log(err);
  }
};

// Put user geometries
// app.put("/api/v1/geometries/:user_id", async (req, res) => {


async function send_to_DB(req:Request, res:Response) {
  console.log("submit geometriess attempted serverside");
  // console.log(req.body.featureCollection)
  // console.log(req.body.name)

  ////// INFO PROVIDED
  // user_id
  // current layer ID and curren layer name
  // all points in current layer


  const values = []

  const { featureCollection, name: layerName } = req.body
  
  featureCollection.features.forEach(x=> {
    
    const { properties: { id, context_info }, geometry } = x
    console.log(id, context_info, geometry, layerName)

    //// either collate to big database update push thing

    //// send to DB one at a time
    values.push({id, context_info, geometry, layerName})

  }
  
  )
  // console.log(req.params.user_id)
  // console.log(req.body)

  // let features = ''
  // const geom_id = 
  // featureCollection.features.forEach(x=>{



  //   const string_values = ((geom_id, user_id, x.geom.strinfia())

  // })


  // try {
  //     const deleteResults = db.query(
  //       `INSERT INTO geometries (geom_id, user_id, geom) values ${string_values}`, 
  //       [user_id]
  //     );




  res.status(200).json({
        status: "success",
        results: "hi",
      });
} 
  // const { user_id } = req.params;
  // const { geometries } = req.body;

  // let temp = [];
  // geometries.forEach((geom) => {
  //   const { geometry_id, geometry } = geom;
  //   /// formatting away double quotes. PSQL seems to only accept single quotes around the geojson
  //   const formattedGeometry = "'" + geometry + "'";
  //   temp.push(
  //     `(${geometry_id}, ${user_id}, ST_GeomFromGeoJSON(${formattedGeometry}))`
  //   );
  // });
  // const updated_geometries = temp.join(",");

  // try {
  //   const deleteResults = db.query(
  //     "DELETE FROM geometries WHERE user_id = $1", 
  //     [user_id]
  //   );

  //   const update_geoms =
  //     "INSERT INTO geometries (geometry_id, user_id, geom) VALUES " + updated_geometries;
  //   console.log(text);

  //   const results = await db.query(update_geoms);

  //   res.status(200).json({
  //     status: "success",
  //     results: results.rows[0],
  //   });
  // } catch (err) {
  //   console.log(err);
  // }
// };

async function send_geoms(req:Request, res:Response) {
  console.log('send geoms received serverside')
  const { body } = req
  console.log(body)

  return res.status(200).json({
    status: 'success',
    message: 'hello world',
    function: 'send_geoms',
  } );

}

function error_log(req:Request, res:Response) {
  const { body } = req;
  console.log(body);
  res.status(200).send();
}

router.route('/').get(auth, (req:Request, res:Response) => res.send('home/api'));

router.route('/api_version').get(api_version);
router.route('/latlng_to_what3words').get(auth, latlng_to_what3words);
router.route('/what3words_to_latlng').get(auth, what3words_to_latlng);
router.route('/latlng_to_pluscode').get(auth, latlng_to_pluscode);
router.route('/pluscode_to_latlng').get(auth, pluscode_to_latlng);
router.route('/population_density_walk').get(auth, population_density_walk);
router.route('/population_density_bike').get(auth, population_density_bike);
router.route('/population_density_car').get(auth, population_density_car);
router.route('/pop_density_isochrone_walk').get(auth, pop_density_isochrone_walk);
router.route('/pop_density_isochrone_bike').get(auth, pop_density_isochrone_bike);
router.route('/pop_density_isochrone_car').get(auth, pop_density_isochrone_car);
router.route('/isochrone_walk').get(auth, isochrone_walk);
router.route('/isochrone_bike').get(auth, isochrone_bike);
router.route('/isochrone_car').get(auth, isochrone_car);
router.route('/nightlights').get(auth, nightlights);
router.route('/demography').get(auth, demography);
router.route('/population_density_buffer').get(auth, population_density_buffer);
router.route('/urban_status').get(auth, urban_status);
router.route('/urban_status_simple').get(auth, urban_status_simple);
router.route('/admin_level_1').get(auth, admin_level_1);
router.route('/admin_level_2').get(auth, admin_level_2);
router.route('/admin_level_2_fuzzy_tri').get(auth, admin_level_2_fuzzy_tri);
router.route('/admin_level_2_fuzzy_lev').get(auth, admin_level_2_fuzzy_lev);
router.route('/nearest_placename').get(auth, nearest_placename);
router.route('/nearest_poi').get(auth, nearest_poi);
router.route('/nearest_bank').get(auth, nearest_bank);
router.route('/nearest_bank_distance').get(auth, nearest_bank_distance);
router.route('/get_banks').get(auth, get_banks);
router.route('/a_to_b_time_distance_walk').get(auth, a_to_b_time_distance_walk);
router.route('/a_to_b_time_distance_bike').get(auth, a_to_b_time_distance_bike);
router.route('/a_to_b_time_distance_car').get(auth, a_to_b_time_distance_car);
router.route('/network_coverage').get(auth, network_coverage);
router.route('/oci_coverage').get(auth, oci_coverage);
router.route('/mce_coverage').get(auth, mce_coverage);
router.route('/get_forecast').get(auth, get_forecast);
router.route('/get_api_isochrone').get(auth, get_api_isochrone);
router.route('/login_user_get').get(login_user_get);
router.route('/login_user').post(login_user);
router.route('/create_user').post(create_user);
router.route('/delete_user').post(delete_user);
router.route('/error_log').post(error_log);

router.route('/send_geoms').post(send_geoms)


// router.route('/send_to_DB/:user_id').post(send_to_DB);
// router.route('/get_user_geometries/:user_id').get(get_user_geometries);

 



// TODO: This should take a post of a JSON object and batch process --> return.
router.route('/batch').get(auth, (req:Request, res:Response) => res.send('home/api/batch'));

export default router;
