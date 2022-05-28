import { Router } from 'express';

import { validateIds } from '../middlewares/validateIds.js';
import { deleteRental, getRentals, postRental, returnRental } from '../controllers/rentalsController.js';

const rentalsRouter = Router();

rentalsRouter.get('/rentals', getRentals); //TODO: Checar rota toda

rentalsRouter.post('/rentals', validateIds, postRental);
rentalsRouter.post('/rentals/:id/return', returnRental);

rentalsRouter.delete('/rentals/:id' , deleteRental)

export default rentalsRouter;