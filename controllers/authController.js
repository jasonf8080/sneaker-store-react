import User from "../models/User.js"
import Review from "../models/Review.js"
import { StatusCodes } from "http-status-codes"
import {BadRequestError, NotFoundError, UnAuthenticatedError} from '../errors/index.js';
import attachCookie from "../utils/attachCookie.js";






const register = async(req, res) => {
    const {name, lastName, email, password} = req.body; //All field values that are required

    if(!name || !lastName || !email || !password){ //Missing values
        throw new BadRequestError('Please provide all values')
    }

    const emailAlreadyExists = await User.findOne({email: email}); //Email already exists
    if(emailAlreadyExists){
        throw new BadRequestError('Email already in use')
    }

    if(password.length < 6){
        throw new BadRequestError('Password must be 6 characters or more')
    }

    const user = await User.create({name, lastName, email, password})  //Create user in database

    const token = user.createJWT();  //Sets up a random string of characters based on the userID, and JWT_SECRET in .env
    
    attachCookie({res, token}) //Stores cookie that has an timed expiration in cookies so that other requests can be made only with the token

    res.status(StatusCodes.CREATED).json({user:{
        name: user.name,
        lastName: user.lastName,
        email: user.email
    }, token, message: 'Sign Up Successful! Redirecting...'}) //Sends back the user object to the front end
}

const login = async(req, res) => {
    const {email, password} = req.body; //Required inputs

    if(!email || !password){
        throw new BadRequestError('Please provide all values') //Missing values
    }

    const user = await User.findOne({email}).select('+password'); //Find if the user exists
    if(!user){
        throw new UnAuthenticatedError('User does not exist with this email')
    }

    const isPasswordCorrect = await user.comparePasswords(password) //Method that compares entered password with the actual password
    if(!isPasswordCorrect){
        throw new UnAuthenticatedError('Password is incorrect')
    }

    const token = await user.createJWT() //Get back token
    //user.password = undefined; 

     attachCookie({res, token})

    res.status(StatusCodes.OK).json({user, token, message: 'Login Successful! Redirecting...'})
}



const getCurrentUser = async(req, res) => { 
    //Before getCurrentUser runs, middleware function authenictaeUser needs to run:  
    //router.route('/getCurrentUser').get(authenticateUser, getCurrentUser): checks the request for a token
    //Grabs token from the request
    const user = await User.findOne({_id: req.user.userID}) 

    if(!user){
        throw new BadRequestError('User not found')
    }
    res.status(StatusCodes.OK).json({user})
}

const editUser = async(req, res) => {
     const {name, lastName, email} = req.body;
     

     if(!name || !lastName ||!email){
         throw new BadRequestError('Please provide all values')
     }

     const isValidEmail = email.includes('@');
     if(!isValidEmail){
        throw new BadRequestError('Please provide a valid email address')
     }
     
     const user = await User.findOneAndUpdate({_id: req.user.userID}, {email, name, lastName}, {new: true})

     const reviews = await Review.updateMany({userID: req.user.userID}, {name: `${user.name} ${user.lastName}`}, {new: true})


    
     if(!user){
         throw new NotFoundError('User not found!')
     }


     res.status(StatusCodes.OK).json({user, message: 'Your credentials have successfully been updated'})

} 

const logout = (req, res) => {

    res.cookie('token', null, {  httpOnly: true, expires: new Date(0) });

    res.send('Logout User')
}


export {register, login, logout, getCurrentUser, editUser}