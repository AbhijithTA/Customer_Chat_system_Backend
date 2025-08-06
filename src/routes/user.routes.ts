import express from 'express';
import { authorize, protect } from '../middlewares/auth.middleware';
import { getUsersByRole } from '../controllers/user.controllers';
 
const router = express.Router();

//get only for admin
router.get('/',protect,authorize('admin'),getUsersByRole);

export default router;