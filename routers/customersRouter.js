import { Router } from "express";

import { validateCustomerData, isCpfRegistered, validateUniqueCpf } from "../middlewares/validateCustomer.js";
import { getCustomers, getSpecificCustomer, postCustomer, updateCustomer } from "../controllers/customersController.js";

const customersRouter = Router();

customersRouter.get('/customers', getCustomers)
customersRouter.get('/customers/:id', getSpecificCustomer)

customersRouter.post('/customers', validateCustomerData, isCpfRegistered, postCustomer)

customersRouter.put('/customers/:id', validateCustomerData, validateUniqueCpf, updateCustomer)

export default customersRouter;