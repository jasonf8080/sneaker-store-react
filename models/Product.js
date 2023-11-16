import mongoose, { Schema } from "mongoose";


//    "brand": "jordan",
//    "title": "Jordan 1 Bred",
//    "price": 490,
//   "id": "2",
//   "colors": [],
//   "primary": "",

const ProductSchema = new mongoose.Schema({
    brand: {
        type: String,
    },

    title: {
        type: String
    },

    price: {
        type: Number
    }, 

   colors: {
    type: Array
   },

   primary: {
    type: String
   }, 

   imageID: {
    type: String
   }

    
})

export default mongoose.model('Product', ProductSchema)