const config = require("../config/config");
const j2s = require('joi-to-swagger');
const fs = require('fs');
const path = require('path');


const basename = path.basename(__filename);

// Generate swagger schema
const schemaDefinitions = {};
const SCHEMA_DIRECTORY = `${__dirname}/../validator/schemas`;

fs.readdirSync(SCHEMA_DIRECTORY)
    .filter((file) => {
        return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
    })
    .forEach((file) => {
        const schemas = require(path.join(SCHEMA_DIRECTORY, file));
        Object.entries(schemas).forEach(([key, schema]) => {
            schemaDefinitions[key] = j2s(schema).swagger;
        });
    });

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'JtaLabCo API',
            version: '1.0.0',
            description: 'Welcome to JtaLabCo API Domain. For Subscription to the APIs, please contact your admin.',
        },
        components: {
            responses: {
                xxx: {
                    description: 'Subscribe today to get full api details',
                    schema: {
                        type: "any",
                    },
                }
            },
            securitySchemes: {
                apiKey: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Provide the API Key'
                },
            },
            schemas: schemaDefinitions,
        },
        contact: {
            name: 'Aashish Bhandari',
            email: 'aashish.dux@gmail.com',
        },
        servers: [
            {
                url: `${config.swagger.server}/api`,
            },
        ],
        tags: [
            {
                name: 'Users and Tokens',
            },
            {
                name: 'Customers',
            },
            {
                name: 'Orders'
            }
        ],
    },
    apis: [`${__dirname}/../route/*.js`],
};

module.exports = {
    swaggerOptions,
}