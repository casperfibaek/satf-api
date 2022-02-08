/*
  This script tries to read the token from the header of the request.
  If the token header is found in the in-ram database it is forwarded.

  The token needs the signature: "username:token"
*/

import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import credentials from './credentials';
import validatePermissionLevel from './permissions'; './permissions'
// export default async function auth(req:Request, res:Response, next:Function): Promise<void> {
//   next();
// }

export default async function auth(req:Request, res:Response, next:Function): Promise<void> {
  
  try {
    let token
    if (req.headers.authorization) {
      token = req.headers.authorization
      console.log('token:', token)
    } else {
      token = 'guest_satf:guest_satf' 
    }

    const funcName = (req.url.split('/')[1].split('?')[0])
    console.log(funcName)

    // const decodedToken:any = jwt.verify(token, credentials.admin_key);

    if (await validatePermissionLevel(token, funcName)) {
      next();
    } else {
      res.status(401).json({
        status: 'Error',
        message: 'User Unauthorised.',
      });
    }
  }
   catch {
    res.status(401).json({
      status: 'Error',
      message: 'User unauthorised or unable to read token.',
    });
  }
}
