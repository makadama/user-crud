import { FastifyReply, FastifyRequest } from "fastify";
import { createUser, getAllUsers, getUserById, updateUser, deleteUser, findUserByEmail } from "./user.service";
import { CreateUserInput, UpdateUserInput, LoginInput } from "./user.schema";
import { verifyPassword } from "../../utils/hash";


/**
 * Handles user registration.
 * 
 * @param request - Fastify request containing user registration data.
 * @param response - Fastify response object.
 * @returns A newly created user object or an error message.
 */
export async function registerUserHandler(request: FastifyRequest<{ Body: CreateUserInput }>, response: FastifyReply) {
    try {
        const user = await createUser(request.body);
        return response.code(201).send(user);
    } catch (error) {
        return response.code(400).send({ error: `User already exists ${request.body}`});
    }
}

/**
 * Handles user login.
 * 
 * @param request - Fastify request containing login credentials.
 * @param response - Fastify response object.
 * @returns A JWT access token and user data if credentials are valid.
 */
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


        const token = request.jwt.sign({ id: user.id, email: user.email }, { expiresIn: "1h" });

        return response.code(200).send({ accessToken: token , id: user.id, email: user.email, firstName: user.firstName });
    } catch (error) {
        console.error("Error during login:", error);
        return response.code(500).send({ error: "Internal Server Error" });
    }
}


/**
 * Retrieves all users with pagination support.
 * 
 * @param request - Fastify request containing optional page and limit query parameters.
 * @param response - Fastify response object.
 * @returns A paginated list of users.
 */
export async function getAllUsersHandler(request: FastifyRequest<{ Querystring: { page?: string; limit?: string } }>, response: FastifyReply) {
    try {
        const page = parseInt(request.query.page as string, 10) || 1;
        const limit = parseInt(request.query.limit as string, 10) || 10;
        const usersData = await getAllUsers(page, limit);
        return response.send(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
        return response.code(500).send({ error: "Failed to fetch users" });
      }
}


/**
 * Retrieves a specific user by their ID.
 * 
 * @param request - Fastify request containing the user ID as a path parameter.
 * @param response - Fastify response object.
 * @returns The user object if found, otherwise an error message.
 */
export async function getUserByIdHandler(request: FastifyRequest<{ Params: { id: string } }>, response: FastifyReply) {
    const userId = parseInt(request.params.id);
    if (isNaN(userId)) return response.code(400).send({ error: "Invalid user ID" });

    const user = await getUserById(userId);
    if (!user) return response.code(404).send({ error: "User not found" });

    return response.send(user);
}

/**
 * Updates a user's information.
 * 
 * @param request - Fastify request containing user ID as a path parameter and updated data in the body.
 * @param response - Fastify response object.
 * @returns The updated user object or an error message.
 */
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

/**
 * Deletes a user by ID.
 * 
 * @param request - Fastify request containing user ID as a path parameter.
 * @param response - Fastify response object.
 * @returns HTTP 204 No Content if successful, or an error message.
 */
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
