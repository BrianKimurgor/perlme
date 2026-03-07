import swaggerJSDoc from "swagger-jsdoc";

const swaggerSpec = swaggerJSDoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "PerlMe API",
            version: "1.0.0",
            description: "PerlMe Backend API Documentation",
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Local",
            },
            {
                url: process.env.API_BASE_URL,
                description: "Production",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },

    // 👇 WHERE YOUR ROUTES LIVE
    apis: [
        "./src/Auth/**/*.ts",
        "./src/Services/**/*.ts",
        "./src/Middlewares/**/*.ts",
    ],
});

export default swaggerSpec;
