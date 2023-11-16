import Product from '../models/Product.js'
import {BadRequestError, NotFoundError, UnAuthenticatedError} from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';

// const getAllBrands = async(req, res) => {
  
//     let brands = await Product.find({})
//     brands = brands.map((item) => item.brand);
//     brands = ['all', ...new Set(brands)]

//     res.status(StatusCodes.OK).json({brands})
// }

const getAllProducts = async(req, res) => {
    const {title, brand, primary, price, sort, page} = req.query;
    //eventually add in filters, with a redux slice
   
    let brands = await Product.find({})
    brands = brands.map((item) => item.brand);
    brands = ['all', ...new Set(brands)]



    const totalBrands =  await Promise.all(brands.map(async (item) => {
        let counts = [];
        let count;
        if(item === 'all'){
              count = await Product.countDocuments({});
        } else {
              count = await Product.countDocuments({ brand: item });
        }

       
        counts.push({ brand: item, count });
        return counts
    }));

     
    let queryObject = {}

    if(title){
        queryObject.title = { $regex: title, $options: 'i'};
    }

    if(brand && brand !== 'all'){
        queryObject.brand = brand;
    }
    
    if(price){
        let prices = price.replaceAll('$', '')
        prices = prices.split('-');
        queryObject.price = ({ $gte :  Number(prices[0]), $lte : Number(prices[1])});
    }

    if(primary){
        queryObject.primary = primary
    }


    let filterProducts = Product.find(queryObject);

    if(sort && sort === 'lowest'){
        filterProducts = filterProducts.sort('price')
    }

    if(sort && sort === 'highest'){
         filterProducts = filterProducts.sort('-price')
    }

    if(sort && sort === 'a-z'){
        filterProducts = filterProducts.sort('title')
    }

     if(sort && sort === 'z-a'){
         filterProducts = filterProducts.sort('-title')
    }

    const currentPage = Number(page) || 1;
    const limit = 10;
    const skip = (currentPage - 1) * limit; //Start value for new page

    console.log(filterProducts)

    

    filterProducts = filterProducts.skip(skip).limit(limit)

    const products = await filterProducts;


    //Total Sneakers
    const totalProducts = await Product.countDocuments(queryObject)
    //Number of Pages
    const numberOfPages = Math.ceil(totalProducts / limit)
  
    

    res.status(200).json({brands, totalBrands, products, currentPage, numberOfPages,  totalProducts})
}

const getSingleProduct = async(req, res) => {
    const {id} = req.params;

    const product = await Product.findOne({_id: id});

     const relatedProducts = await Product.find({ brand: product.brand, _id: { $ne: id } }).limit(3);

     const filteredRelatedProducts = relatedProducts.filter((relatedProduct) => {
            return relatedProduct._id.toString() !== id;
    });


    if(!product){
        throw new BadRequestError('No Product Found')
    }

    res.status(200).json({product, relatedProducts: filteredRelatedProducts})
}

export {getAllProducts, getSingleProduct}