const express = require('express');
const usersAndTokensRoute = require('./usersAndTokensRoute');
const customerRoute = require('./customerRoute');
const orderRoute = require('./orderRoute');

const router = express.Router();

const defaultRoutes = [
    {
        path: '/usersAndTokens',
        route: usersAndTokensRoute,
    },
    {
        path: '/customers',
        route: customerRoute,
    },
    {
        path: '/orders',
        route: orderRoute,
    }
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
