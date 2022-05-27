import { Router } from 'express';

import { postRental } from '../controllers/rentalsController.js';
import { validateIds } from '../middlewares/validateIds.js';

const rentalsRouter = Router();

rentalsRouter.post('/rentals', validateIds, postRental)

export default rentalsRouter;