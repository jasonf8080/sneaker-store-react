import { StatusCodes } from "http-status-codes";

const errorHandlerMiddleware = (err, req, res, next) => {
    console.log(err.message)
    const defaultError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Something went wrong try again later'
    }

    if(err.name === 'ValidationError'){
        defaultError.statusCode = StatusCodes.BAD_REQUEST
       // defaultError.msg = err.message
        defaultError.msg = Object.values(err.errors).map((item) => item.message).join(', ')
    }


    if(err.code && err.code === 11000){ //Unique values
        defaultError.statusCode = StatusCodes.BAD_REQUEST,
        defaultError.msg = `Email address already taken`
    }



    res.status(defaultError.statusCode).json({msg: defaultError.msg})
}

export default errorHandlerMiddleware;