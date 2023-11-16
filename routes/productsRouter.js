import express from 'express';
const app = express();
const router = express.Router();





//Controllers 
import { getAllProducts, getSingleProduct } from '../controllers/productsController.js';

// router.route('/getAllBrands').get(getAllBrands)
router.route('/getAllProducts').get(getAllProducts)
router.route('/getSingleProduct/:id').get(getSingleProduct)



export default router;