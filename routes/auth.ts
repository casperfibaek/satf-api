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
  
  const satf_token = req.headers.authorization
  const [userId, token] = satf_token.split(':')

  const decodedToken:any = jwt.verify(token, credentials.admin_key);
  const funcName = (req.url.split('/')[1].split('?')[0])

  const validatedToken = userId === decodedToken.userId
  const validatedFunctionPermissions = await validatePermissionLevel(satf_token, funcName)

  console.log('satf_token:', satf_token)
  console.log('funcName:', funcName)
  console.log(validatedToken, validatedFunctionPermissions)


  try {
    if (validatedToken && validatedFunctionPermissions) {
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
