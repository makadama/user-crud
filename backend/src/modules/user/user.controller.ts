import { FastifyReply, FastifyRequest } from "fastify";
import { createUser, getAllUsers, getUserById, updateUser, deleteUser, findUserByEmail } from "./user.service";
import { CreateUserInput, UpdateUserInput, LoginInput } from "./user.schema";
import { verifyPassword } from "../../utils/hash";

export async function registerUserHandler(request: FastifyRequest<{ Body: CreateUserInput }>, response: FastifyReply) {
    try {
        const user = await createUser(request.body);
        return response.code(201).send(user);
    } catch (error) {
        return response.code(400).send({ error: "User already exists" });
    }
}


export async function loginUserHandler(
    request: FastifyRequest<{ Body: LoginInput }>,
    response: FastifyReply
) {
    try {
        const { email, password } = request.body;
        const user = await findUserByEmail(email);

        if (!user) {
            return response.code(401).send({ message: "Invalid email or password" });
        }


        const correctPassword = await verifyPassword(password, user.password);
        if (!correctPassword) {
            return response.code(401).send({ message: "Invalid email or password" });
        }


        const token = request.jwt.sign({ id: user.id, email: user.email });

        return response.code(200).send({ accessToken: token });
    } catch (error) {
        console.error("Error during login:", error);
        return response.code(500).send({ error: "Internal Server Error" });
    }
}


export async function getAllUsersHandler(request: FastifyRequest, response: FastifyReply) {
    const users = await getAllUsers();
    return response.send(users);
}


export async function getUserByIdHandler(request: FastifyRequest<{ Params: { id: string } }>, response: FastifyReply) {
    const userId = parseInt(request.params.id);
    if (isNaN(userId)) return response.code(400).send({ error: "Invalid user ID" });

    const user = await getUserById(userId);
    if (!user) return response.code(404).send({ error: "User not found" });

    return response.send(user);
}

export async function updateUserHandler(
    request: FastifyRequest<{ Params: { id: string }, Body: UpdateUserInput }>,
    response: FastifyReply
) {
    const userId = parseInt(request.params.id);
    if (isNaN(userId)) return response.code(400).send({ error: "Invalid user ID" });

    try {
        const updatedUser = await updateUser(userId, request.body);
        return response.send(updatedUser);
    } catch {
        return response.code(400).send({ error: "Failed to update user" });
    }
}


export async function deleteUserHandler(request: FastifyRequest<{ Params: { id: string } }>, response: FastifyReply) {
    const userId = parseInt(request.params.id);
    if (isNaN(userId)) return response.code(400).send({ error: "Invalid user ID" });

    try {
        await deleteUser(userId);
        return response.code(204).send();
    } catch {
        return response.code(400).send({ error: "Failed to delete user" });
    }
}
