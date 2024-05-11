const express = require('express');
const isAuthenticated = require('../middlewares/authentication');
const isAuthorized = require('../middlewares/authorization');
const validator = require('../validator/index');
const { UserRoles } = require('../config/role');
const OrderController = require('../controllers/orderController');
const { createOrder, updateOrder } = require('../validator/schemas/orderSchema');

const router = express.Router();
const orderController = new OrderController();

/**
 * @swagger
 * /orders/register:
 *   post:
 *     summary: Create a new order
 *     tags:
 *       - Orders
 *     security:
 *       - apiKey: []
 *     requestBody:
 *       description: Order Information
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createOrder'
 *     responses:
 *       xxx:
 *         $ref: '#/components/responses/xxx'
 *
 */
router.post('/register', isAuthenticated(), isAuthorized(UserRoles.ADMIN, UserRoles.STAFF), validator(createOrder), orderController.register);

/**
 * @swagger
 * /orders/list/{customerUUID}:
 *   get:
 *     summary: Fetch all orders for a customer by the customer_uuid
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: customerUUID
 *         schema:
 *           type: uuid
 *     security:
 *       - apiKey: []
 *     responses:
 *       xxx:
 *         $ref: '#/components/responses/xxx'
 *
 */
router.get('/list/:customerUUID', isAuthenticated(), isAuthorized(UserRoles.ADMIN, UserRoles.STAFF), orderController.listAllOrdersByCustomer);

/**
 * @swagger
 * /orders/list:
 *   get:
 *     summary: Fetch all orders
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: query
 *         name: expand
 *         schema:
 *           type: boolean
 *           description: Should return customer info as well or not.
 *     security:
 *       - apiKey: []
 *     responses:
 *       xxx:
 *         $ref: '#/components/responses/xxx'
 *
 */
router.get('/list', isAuthenticated(), isAuthorized(UserRoles.ADMIN, UserRoles.STAFF), orderController.listAllOrders);

/**
 * @swagger
 * /orders/{uuid}:
 *   patch:
 *     summary: Update an existing order
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: uuid
 *     security:
 *       - apiKey: []
 *     requestBody:
 *       description: URL Token receivied in Email
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/updateOrder'
 *     responses:
 *       xxx:
 *         $ref: '#/components/responses/xxx'
 *
 */
router.patch('/:uuid', isAuthenticated(), isAuthorized(UserRoles.ADMIN, UserRoles.STAFF), validator(updateOrder), orderController.update);

/**
 * @swagger
 * /orders/{uuid}:
 *   get:
 *     summary: Get an Order by uuid
 *     tags:
 *       - Orders
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
router.get('/:uuid', isAuthenticated(), isAuthorized(UserRoles.ADMIN, UserRoles.STAFF), orderController.get);

/**
 * @swagger
 * /orders/{uuid}:
 *   delete:
 *     summary: Remove an Order.
 *     tags:
 *       - Orders
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
router.delete('/:uuid', isAuthenticated(), isAuthorized(UserRoles.ADMIN), orderController.remove);

module.exports = router;