import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    userID:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'userID required']
    },

    productID:{
        type: mongoose.Types.ObjectId,
        ref: 'Product',
    },

    
    rating:{
        type: Number,
        required: [true, 'Please provide a rating']
    }, 
    
    review:{
        type: String,
        required: [true, 'Please provide a review']
    },

    name: {
        type: String,
        required: true
    }
    
}, {timestamps: true})

export default mongoose.model('Review', ReviewSchema)