import mongoose from "mongoose";


const CartItemSchema = new mongoose.Schema({
    userID:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'userID required']
    },

    productID:{
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: [true, 'productID required']
    },

    imageID:{
        type: Number,
        ref: 'Product',
        required:[true, 'imageID required']
    },

    title: {
        type: String,
        ref: 'Product',
        required: [true, 'title required']
    },

    price: {
        type: Number,
        ref: 'Product',
        required: [true, 'price required']
    },

    size: {
        type: String
    },

    amount: {
        type: Number
    },

})

export default mongoose.model('CartItem', CartItemSchema)