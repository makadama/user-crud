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
        schema: {
            response: { 200: { type: "array", items: { $ref: "createUserResponseSchema" } } },
        },
    }, getAllUsersHandler);

    server.get('/:id', {
        schema: {
            params: { type: "object", properties: { id: { type: "integer" } }, required: ["id"] },
            response: { 200: { $ref: "createUserResponseSchema" } },
        },
    }, getUserByIdHandler);

    server.put('/:id', {
        schema: {
            params: { type: "object", properties: { id: { type: "integer" } }, required: ["id"] },
            body: { $ref: "updateUserSchema" },
            response: { 200: { $ref: "createUserResponseSchema" } },
        },
    }, updateUserHandler);

    server.delete('/:id', {
        schema: {
            params: { type: "object", properties: { id: { type: "integer" } }, required: ["id"] },
            response: { 204: { description: "User deleted successfully" } },
        },
    }, deleteUserHandler);
}

export default userRoutes;
