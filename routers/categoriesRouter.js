import { Router } from 'express';

import { getCatQuery } from '../middlewares/categoriesQuery.js';
import { validateCategoryName } from '../middlewares/validateCategoryName.js';
import { getCategories, postCategory } from '../controllers/categoriesController.js';

const categoriesRouter = Router();

categoriesRouter.get('/categories', getCatQuery, getCategories);
categoriesRouter.post('/categories', validateCategoryName, postCategory);

export default categoriesRouter;