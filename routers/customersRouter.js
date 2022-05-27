import { Router } from "express";

import { validateCustomer } from "../middlewares/validateCustomer.js";
import { getCustomers, getSpecificCustomer, postCustomer, updateCustomer } from "../controllers/customersController.js";

const customersRouter = Router();

customersRouter.get('/customers', getCustomers)
customersRouter.get('/customers/:id', getSpecificCustomer)

customersRouter.post('/customers', validateCustomer, postCustomer)

customersRouter.put('/customers/:id', validateCustomer, updateCustomer)

export default customersRouter;