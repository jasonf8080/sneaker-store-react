import jwt from 'jsonwebtoken'
import { UnAuthenticatedError } from "../errors/index.js";




export const authenticateUser = async(req, res, next) => {
   const token = req.cookies.token;

   if(!token){
      throw new UnAuthenticatedError('Authentication failed!')
   }

   //Setup req.user
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET); //decodes the random string into the userID
        req.user = {userID: payload.userID}
        next()
    } catch (error) {
        console.log(error)
       throw new Error('Unauthorized to perform this action')
    }

}