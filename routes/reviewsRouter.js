import express from 'express';
const app = express();
const router = express.Router();

import { authenticateUser } from '../middleware/auth.js';




//Controllers 
import { getAllReviews, createReview, getSingleReview, editReview, deleteReview } from '../controllers/reviewController.js';

// router.route('/getAllProducts').get(getAllProducts)
// router.route('/getSingleProduct/:id').get(getSingleProduct)

router.route('/getAllReviews/:id').get(getAllReviews);
router.route('/createReview/:productID').post(authenticateUser, createReview);
router.route('/getSingleReview/:productID').get(authenticateUser, getSingleReview);
router.route('/editReview/:productID').patch(authenticateUser, editReview);
router.route('/deleteReview/:productID').delete(authenticateUser, deleteReview);



export default router;