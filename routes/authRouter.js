import express from 'express';
const app = express();
const router = express.Router();

import { authenticateUser } from '../middleware/auth.js';




//Controllers 
import { register, login, logout, getCurrentUser, editUser} from '../controllers/authController.js';

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/getCurrentUser').get(authenticateUser, getCurrentUser)
router.route('/editUser').patch(authenticateUser, editUser)


export default router;