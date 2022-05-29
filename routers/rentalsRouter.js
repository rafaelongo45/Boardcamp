import { Router } from 'express';

import { validateIds } from '../middlewares/validateIds.js';
import { getMetricsQuery } from '../middlewares/metricsQuery.js';
import { getRentalsQuery } from '../middlewares/rentalsQuery.js';
import { deleteRental, getRentalMetrics, getRentals, postRental, returnRental } from '../controllers/rentalsController.js';

const rentalsRouter = Router();

rentalsRouter.get('/rentals/metrics', getMetricsQuery, getRentalMetrics);
rentalsRouter.get('/rentals', getRentalsQuery, getRentals);

rentalsRouter.post('/rentals', validateIds, postRental);
rentalsRouter.post('/rentals/:id/return', returnRental);

rentalsRouter.delete('/rentals/:id' , deleteRental)

export default rentalsRouter;