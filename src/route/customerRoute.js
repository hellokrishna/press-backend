const express = require('express');
const { createCustomer, updateCustomer } = require('../validator/schemas/customerSchema');
const CustomerController = require('../controllers/customerController');
const isAuthenticated = require('../middlewares/authentication');
const isAuthorized = require('../middlewares/authorization');
const validator = require('../validator/index');
const { UserRoles } = require('../config/role');

const router = express.Router();
const customerController = new CustomerController();

/**
 * @swagger
 * /customers/register:
 *   post:
 *     summary: Register a new customer
 *     tags:
 *       - Customers
 *     security:
 *       - apiKey: []
 *     requestBody:
 *       description: Customer information
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createCustomer'
 *     responses:
 *       xxx:
 *         $ref: '#/components/responses/xxx'
 *
 */
router.post('/register', isAuthenticated(), isAuthorized(UserRoles.ADMIN, UserRoles.STAFF), validator(createCustomer), customerController.register);

/**
 * @swagger
 * /customers/{uuid}:
 *   patch:
 *     summary: Update an existing customer
 *     tags:
 *       - Customers
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: uuid
 *     security:
 *       - apiKey: []
 *     requestBody:
 *       description: Customer info to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/updateCustomer'
 *     responses:
 *       xxx:
 *         $ref: '#/components/responses/xxx'
 *
 */
router.patch('/:uuid', isAuthenticated(), isAuthorized(UserRoles.ADMIN, UserRoles.STAFF), validator(updateCustomer), customerController.update);

/**
 * @swagger
 * /customers/{uuid}:
 *   get:
 *     summary: Fetch a Customer by UUID
 *     tags:
 *       - Customers
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: uuid
 *     security:
 *       - apiKey: []
 *     responses:
 *       xxx:
 *         $ref: '#/components/responses/xxx'
 *
 */
router.get('/:uuid', isAuthenticated(), isAuthorized(UserRoles.ADMIN, UserRoles.STAFF), customerController.get);

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Fetch all active customers
 *     tags:
 *       - Customers
 *     security:
 *       - apiKey: []
 *     responses:
 *       xxx:
 *         $ref: '#/components/responses/xxx'
 *
 */
router.get('/', isAuthenticated(), isAuthorized(UserRoles.ADMIN, UserRoles.STAFF), customerController.list);


/**
 * @swagger
 * /customers/{uuid}:
 *   delete:
 *     summary: Remove a customer
 *     tags:
 *       - Customers
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: uuid
 *     security:
 *       - apiKey: []
 *     responses:
 *       xxx:
 *         $ref: '#/components/responses/xxx'
 *
 */
router.delete('/:uuid', isAuthenticated(), isAuthorized(UserRoles.ADMIN), customerController.delete);

module.exports = router;