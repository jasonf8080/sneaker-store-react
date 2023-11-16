import express from 'express';
const app = express();
const router = express.Router();
import { authenticateUser } from '../middleware/auth.js';

//Controllers
import { getAllCartItems, getCartItem, checkIfItemAdded, addCartItem, editCartItem, removeCartItem, removeAllCartItems, checkout } from '../controllers/cartController.js'; 

//router.route('/getAllCartItemsCount').get(authenticateUser, getAllCartItemsCount);
router.route('/getAllCartItems').get(authenticateUser, getAllCartItems);
router.route('/getCartItem/:id').get(authenticateUser, getCartItem);
router.route('/checkIfItemAdded').post(authenticateUser, checkIfItemAdded);
router.route('/addCartItem').post(authenticateUser,addCartItem);
router.route('/editCartItem/:productID').patch(authenticateUser, editCartItem);
router.route('/removeCartItem/:productID/:size').delete(authenticateUser, removeCartItem);
router.route('/removeAllCartItems').delete(authenticateUser, removeAllCartItems);
router.route('/removeAllCartItems').delete(authenticateUser, removeAllCartItems);

router.route('/checkout').post(authenticateUser, checkout);

export default router;