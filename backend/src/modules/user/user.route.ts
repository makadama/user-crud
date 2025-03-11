import { FastifyInstance } from "fastify"; 
import { registerUserHandler, loginUserHandler, getAllUsersHandler, getUserByIdHandler, updateUserHandler, deleteUserHandler } from "./user.controller";

async function userRoutes(server: FastifyInstance) {
    server.post('/register', {
        schema: {
            body: { $ref: "createUserSchema" },
            response: { 201: { $ref: "createUserResponseSchema" } },
        },
    }, registerUserHandler);

    server.post('/login', {
        schema: {
            body: { $ref: "loginSchema" },
            response: { 200: { $ref: "loginResponseSchema" } },
        },
    }, loginUserHandler);

    server.get('/', {
        preHandler: server.authenticate,
        schema: {
            querystring: {
                type: "object",
                properties : {
                    page: {type: "integer", minimum: 1, default: 1},
                    limit: {type: "integer", minimum: 1, default: 10},
                }
            },
            response: { 200: { type: "object",  properties: {
                users: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "integer" },
                        email: { type: "string", format: "email" },
                        firstName: { type: "string" },
                        lastName: { type: "string" },
                        birthDate: { type: "string", format: "date-time" },
                      },
                    },
                  },
                total: { type: "integer" },
                page: { type: "integer" },
                limit: { type: "integer" },
                totalPages: { type: "integer" },
              }, } 
            },
        },
    }, getAllUsersHandler);

    server.get('/:id', {
        preHandler: server.authenticate,
        schema: {
            params: { type: "object", properties: { id: { type: "integer" } }, required: ["id"] },
            response: { 200: { $ref: "createUserResponseSchema" } },
        },
    }, getUserByIdHandler);

    server.put('/:id', {
        preHandler: server.authenticate,
        schema: {
            params: { type: "object", properties: { id: { type: "integer" } }, required: ["id"] },
            body: { $ref: "updateUserSchema" },
            response: { 200: { $ref: "createUserResponseSchema" } },
        },
    }, updateUserHandler);

    server.delete('/:id', {
        preHandler: server.authenticate,
        schema: {
            params: { type: "object", properties: { id: { type: "integer" } }, required: ["id"] },
            response: { 204: { description: "User deleted successfully" } },
        },
    }, deleteUserHandler);
}

export default userRoutes;
