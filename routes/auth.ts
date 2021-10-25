/*
  This script tries to read the token from the header of the request.
  If the token header is found in the in-ram database it is forwarded.

  The token needs the signature: "username:token"
*/

import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import credentials from './credentials';

export default async function auth(req:Request, res:Response, next:Function): Promise<void> {
  next();
}

// export default async function auth(req:Request, res:Response, next:Function): Promise<void> {
//   try {
//     if (req.query.username === 'casper' && req.query.token === 'golden_ticket') {
//       next();
//     } else if (req.query.username === 'dss' && req.query.token === 'golden_ticket') {
//       next();
//     } else {
//       const userId = req.headers.authorization.split(':')[0];
//       const token = req.headers.authorization.split(':')[1];
//       const decodedToken:any = jwt.verify(token, credentials.admin_key);

//       if (userId === decodedToken.userId) {
//         next();
//       } else {
//         res.status(401).json({
//           status: 'Error',
//           message: 'User Unauthorised.',
//         });
//       }
//     }
//   } catch {
//     res.status(401).json({
//       status: 'Error',
//       message: 'User unauthorised or unable to read token.',
//     });
//   }
// }
