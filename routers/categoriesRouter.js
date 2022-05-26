import { Router } from 'express';

import { validateCategoryName } from '../middlewares/validateCategoryName.js';
import { getCategories, postCategory } from '../controllers/categoriesController.js';

const categoriesRouter = Router();

categoriesRouter.get('/categories', getCategories);
categoriesRouter.post('/categories', validateCategoryName, postCategory);

export default categoriesRouter;