import { StatusCodes } from "http-status-codes"
import mongoose from "mongoose"
import BadRequestError from "../errors/bad-request.js"
import CartItem from "../models/CartItem.js"
import Product from "../models/Product.js"



const getAllCartItems = async(req, res) => {//Get all cart items from that user
    const cartItems = await CartItem.find({userID: req.user.userID})

      
   const totalItems = cartItems.reduce((accumulator, currentItem) => {
     return accumulator + currentItem.amount;
   }, 0);


   const totalPrice = cartItems.reduce((accumulator, currentItem) => {
     return accumulator + (currentItem.amount * currentItem.price);
   }, 0);


    //aggregate amounts 
   
    res.status(StatusCodes.OK).json({cartItems, totalItems, totalPrice})
}



const getCartItem = async(req, res) => {
    const {id} = req.params;

    const cartItem = await CartItem.findOne({_id: id});
    if(!cartItem){
        throw new BadRequestError('Item not found')
    }

    res.status(StatusCodes.OK).json({cartItem})
}

// const getCartItemCount = async(req, res) => {
//    // const totalCartItems = await CartItem.countDocuments({userID: req.user.userID});

//    let totalCartItems = await CartItem.aggregate([
//     {$match: {userID: mongoose.Types.ObjectId(req.user.userID)}},
//     { $group: {_id: '$amount', count:{$sum: 1}} },
//    ])

  
//    const totalItemCount = totalCartItems.reduce((accumulator, currentItem) => {
//      return accumulator + currentItem.count;
//    }, 0);


//     res.status(StatusCodes.OK).json({totalItemCount});
// }

const checkIfItemAdded = async(req, res) => {
    const {size, productID} = req.body;
    console.log(size, productID)
    const itemAdded = await CartItem.findOne({userID: req.user.userID, size: size, productID});

    if(!itemAdded){
        res.status(StatusCodes.OK).json({duplicateItem: false})
    } else {
        res.status(StatusCodes.OK).json({duplicateItem: true})
    }

}

const addCartItem = async(req, res) => {
    const {sneakerID, size, amount} = req.body;

    if(!size){
        throw new BadRequestError('Please select a size')
    }
    
    const sneaker = await Product.findOne({_id: sneakerID});
    if(!sneaker){
        throw new BadRequestError('Sneaker not found')
    }

    const cartItem = await CartItem.create({
        userID: req.user.userID,
        productID: sneaker._id,
        imageID: sneaker.imageID,
        title: sneaker.title,
        price: sneaker.price,
        size,
        amount
    })

    res.status(StatusCodes.CREATED).json({cartItem})
}


const editCartItem = async(req, res) => {
     const {productID} = req.params;
     const {type, amount, size} = req.body;
     const cartItem = await CartItem.findOne({userID: req.user.userID, productID, size});
     

     if(!cartItem){
        throw new BadRequestError('Cart item not found')
     }


     if(type === 'decrease'){
        cartItem.amount = cartItem.amount - 1
     } 


     if(type === 'increase' || type === 'duplicateItem'){  
        cartItem.amount = cartItem.amount + amount
     }

     await cartItem.save()


    res.status(StatusCodes.OK).json({message: 'Cart item edited', cartItem})

}

const removeCartItem = async(req, res) => {
    const {productID, size} = req.params;
    const cartItem = await CartItem.findOneAndDelete({userID: req.user.userID, productID, size});

    if(!cartItem){
        throw new BadRequestError('Cart item has not been found')
    }

    res.status(StatusCodes.OK).json({message: 'Item has been removed!'})
}

const removeAllCartItems = async(req, res) => {
   
    const cartItems = await CartItem.deleteMany({userID: req.user.userID})

    res.status(StatusCodes.OK).json({message: 'All clear'})
}

const checkout = async(req, res) => {
   
    const {cardNumber, expires, cvv, amount} = req.body;
    if(!expires){
        throw BadRequestError('Please provide card expiration date')
    }

    if(!cvv){
        throw BadRequestError('Please provide card cvv')
    }

    res.json({message: 'Your payment has successfully been submitted'})
}

export {getAllCartItems, getCartItem, checkIfItemAdded, addCartItem, editCartItem, removeCartItem, removeAllCartItems, checkout};

