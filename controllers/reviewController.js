import Review from "../models/Review.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

import { StatusCodes } from "http-status-codes"
import {BadRequestError, NotFoundError, UnAuthenticatedError} from '../errors/index.js';
import mongoose from "mongoose";

const getAllReviews = async(req, res) => {
    // const {id: productID} = req.params;
    // let results = Review.find({productID});

    // //reviews, totalReviews, overallRating, groupedRatings, numberOfPages
    // let overallRating = await Review.aggregate([
    //     {$match: {productID: mongoose.Types.ObjectId(productID)}},
    //     {$group: {_id: '$productID', average:{ $avg: '$rating' } }}
    // ]);


    //  let groupedRatings = await Review.aggregate([
    //     { $match: {productID: mongoose.Types.ObjectId(productID)}},
    //     { $group: {_id: '$rating', count:{$sum: 1}} },
    //     { $sort: {'_id': 1}}
    // ])

    // const page = Number(req.query.page) || 1;
    // const limit = 4;
    // const skip = (page - 1) * limit;


    // results = results.limit(limit).skip(skip);

    // const reviews = await results;

    // const totalReviews = await Review.countDocuments({productID});
    // const numberOfPages = Math.ceil(totalReviews / limit)
    

    // res.status(StatusCodes.OK).json({reviews, totalReviews, numberOfPages, groupedRatings, overallRating})
    const {id} = req.params

    let results =  Review.find({productID: id});

    let overallRating = await Review.aggregate([
        {$match: {productID: mongoose.Types.ObjectId(id)}},
        {$group: {_id: '$productID', average:{$avg: '$rating'}}}
    ]);


  if(overallRating[0]){
    overallRating = overallRating[0].average.toFixed(1);
  } else {
    overallRating = 'N/A'
  }
   
    

    let groupedRatings = await Review.aggregate([
        {$match: {productID: mongoose.Types.ObjectId(id)}},
        {$group: {_id: '$rating', count:{$sum: 1}}},
        {$sort: {'_id': 1}}
    ])

    //let positiveRatings = await

    const page = Number(req.query.page) || 1
    const limit = 4;
    const skip = (page - 1) * limit;
    

    results = results.limit(limit).skip(skip).sort('-updatedAt');

    const reviews = await results

    const totalReviews = await Review.countDocuments({productID: id})
    const positiveReviews = await Review.countDocuments({productID: id ,rating: { $gt: 3.9 } })

    const numberOfPages = Math.ceil(totalReviews / limit);

    res.status(StatusCodes.OK).json({reviews, totalReviews, numberOfPages, positiveReviews, overallRating, groupedRatings});
  

}

const createReview = async(req, res) => {
    const {rating, review} = req.body;
    const {productID} = req.params

    if(!rating){
        throw new BadRequestError('Please provide a rating')
    }

    if(!review){
        throw new BadRequestError('Please provide a review')
    }

    const user = await User.findOne({_id: req.user.userID})
    if(!user){
        throw new BadRequestError('User not found')
    }

    const name = `${user.name} ${user.lastName}`;

    const reviewAlreadyExists = await Review.findOne({productID, userID: req.user.userID})
    if(reviewAlreadyExists){
        throw new BadRequestError('Review already exists. Do you wish to edit your review?')
    }

    //  if(reviewAlreadyExists){
    //      throw new BadRequestError('Review already exists. Do you wish to edit your review?')
    //  }

    const newReview = await Review.create({rating, review, productID, userID: req.user.userID, name})
    //name, rating, review
//     const {review, rating} = req.body;
//     const {id: productID} = req.params;

//     //console.log(req.user)

//     if(!rating || !review){
//     throw new BadRequestError('Please provide a rating and review')
//     }

//    const reviewAlreadyExists = await Review.findOne({userID: req.user.userID, productID});
//    if(reviewAlreadyExists){
//     throw new BadRequestError('You have already review this product')
//    }

//    const product = await Product.findOne({_id: productID});
//    if(!product){
//     throw new BadRequestError('Product does not exist')
//    }

//    const user = await User.findOne({_id: req.user.userID});
//    if(!user){
//     throw new BadRequestError('User not found')
//    }

//    const username = `${user.name} ${user.lastName}`

//    const newReview = await Review.create({
//     userID: req.user.userID,
//     productID,
//     rating, 
//     review,
//     username
//    })

//    res.status(StatusCodes.CREATED).json({msg: 'Review has successfully been submitted'})
    res.status(StatusCodes.CREATED).json({message: 'Your review has successfully been submitted!'})
}


// const getSingleReview = async(req, res) => {
//     //  const {productID} = req.params;

//     //  const userReview = await Review.findOne({productID, userID: req.user.userID});
//     //  if(!userReview){
//     //     throw new NotFoundError('Review not founddd!')
//     //  } 

     
//     // const review = userReview.review;
//     // const rating = userReview.rating

//     //  res.status(StatusCodes.OK).json({rating, review});
// }


const getSingleReview = async(req, res) => {
    const {productID} = req.params;
    
    
    const review = await Review.findOne({productID, userID: req.user.userID})
    if(!review){
        throw new BadRequestError('Review not found!')
    }

    res.status(StatusCodes.OK).json({review});
}

const editReview = async(req, res) => {

    const {productID} = req.params;
    const {rating, review} = req.body;

    if(!rating){
        throw new BadRequestError('Please provide a rating')
    }

    if(!review){
        throw new BadRequestError('Please provide a review')
    }

    const existingReview = await Review.findOne({productID, userID: req.user.userID});
    if(!existingReview){
        throw new BadRequestError('Review not found!')
    }

    existingReview.rating = rating;
    existingReview.review = review;

    await existingReview.save()

    res.status(StatusCodes.OK).json({message: 'Your review has successfully been modified'})

}


const deleteReview = async(req, res) => {
    const {productID} = req.params;

    const review = await Review.findOneAndRemove({productID, userID: req.user.userID});
    if(!review){
        throw new NotFoundError('Review not found!')
    }

    res.status(StatusCodes.OK).json({message: 'Review has been successfully deleted!'})
}



export {getAllReviews, createReview, getSingleReview, editReview, deleteReview}