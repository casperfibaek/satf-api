/*
  This script tries to read the token from the header of the request.
  If the token header is found in the in-ram database it is forwarded.

  The token needs the signature: "username:token"
  */
  import pg from 'pg';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import credentials from './credentials';

interface JwtPayload {
  userName: string,
  userId: string,
}

const pool = new pg.Pool(credentials);

export default async function auth(req:Request, res:Response, next:Function): Promise<void> {
 
  const urlPath = req.url.split('/')[1].split('?')[0];
  if (urlPath === undefined || urlPath === '') {
    res.status(401).json({
      status: 'Error',
      message: 'Unable to read URL',
    });
  }

  const funcLevel = getFunctionLevel(urlPath);

  if (funcLevel === 0) {
    //'authorization not needed, authorization passed';
    return next();
    } else if (funcLevel === -1) {
    res.status(401).json({
      status: 'Error',
      message: 'Unable to find function',
    });
  } 
  /// so the user requests a function that requires a token, and they provide a token that is 'validish'
  /// we need to check the token is valid and the user has the correct level

  try {
    const satf_token = req.headers.authorization;
    const [userId, token] = satf_token.split(':');
    const decodedToken = jwt.verify(token, credentials.admin_key) as JwtPayload;
    console.log('decodedToken:', decodedToken);
    const isTokenValidated = userId === decodedToken.userId;
    const validatedFunctionPermissions = await validatePermissionLevel(satf_token, urlPath);

    // console.log('satf_token:', satf_token);
    // console.log('funcName:', funcName);
    // console.log(validatedToken, validatedFunctionPermissions);

    if (isTokenValidated && validatedFunctionPermissions) {
      return next();
    } else {
      res.status(401).json({
        status: 'Error',
        message: 'User Unauthorised.',
      });
    }
  } catch {
    res.status(401).json({
      status: 'Error',
      message: 'User unauthorised or unable to read token.',
    });
  }
}

const getFunctionLevel = (functionName: string): Number => {
  const functionLookup = {
    api_version: 0,
    latlng_to_what3words: 0,
    what3words_to_latlng: 0,
    latlng_to_pluscode: 0,
    pluscode_to_latlng: 0,
    population_density_walk: 0,
    population_density_bike: 0,
    population_density_car: 0,
    pop_density_isochrone_walk: 1,
    pop_density_isochrone_bike: 1,
    pop_density_isochrone_car: 1,
    isochrone_walk: 1,
    isochrone_bike: 1,
    isochrone_car: 1,
    nightlights: 1,
    demography: 1,
    population_density_buffer: 0,
    population_buffer: 1,
    urban_status: 0,
    urban_status_simple: 0,
    admin_level_1: 0,
    admin_level_2: 0,
    admin_level_2_fuzzy_tri: 0,
    admin_level_2_fuzzy_lev: 0,
    nearest_placename: 0,
    nearest_poi: 0,
    nearest_poi_location: 1,
    nearest_bank: 0,
    nearest_bank_distance: 0,
    nearest_bank_location: 1,
    nearest_waterbody: 0,
    nearest_waterbody_location: 1,
    get_banks: 1,
    a_to_b_time_distance_walk: 1,
    a_to_b_time_distance_bike: 1,
    a_to_b_time_distance_car: 1,
    network_coverage: 1,
    oci_coverage: 1,
    mce_coverage: 1,
    get_forecast: 1,
    get_api_isochrone: 1,
    get_api_directions: 1,
    login_user_get: 0,
    login_user: 0,
    create_user: 2,
    delete_user: 2,
    // error_log: 0,
    NDVI_monthly: 1,
    avg_NDVI: 1,
    vegetation_monitoring: 1,
    get_user_layer_metadata: 1,
    get_layer_geoms: 1,
    delete_layer: 1,
    update_layer_data: 1,
    create_layer: 1,
  };
  if (!(functionName in functionLookup)) {
    return -1;
  }
  
  return functionLookup[functionName];
  
};

const getUserLevel = async (token: string): Promise<Number> => {
  console.log('getUserLevel:', token);
  const [userName, _] = token.split(':');
  if (userName === 'guest_satf') {
    return 0;
  }
  const dbQuery = `SELECT level FROM organizations org
         LEFT JOIN users u ON org.org_name=u.org
         WHERE username = '${userName}'`;
  try {
    const dbResponse = await pool.query(dbQuery);
    // console.log(dbResponse)
    const { level } = dbResponse.rows[0];

    // console.log('level:', level)
    return level;
  } catch (err) {
    // console.log(err);
  }
};

export async function validatePermissionLevel(token: string, functionName: string): Promise<boolean> {
  const userLevel = await getUserLevel(token);
  if (userLevel >= getFunctionLevel(functionName)) {
    return true;
  }
  return false;
}
