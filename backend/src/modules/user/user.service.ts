import prisma from "../../utils/prisma";
import { CreateUserInput, UpdateUserInput } from "./user.schema";
import { hashPassword } from "../../utils/hash";



export async function createUser(input: CreateUserInput) {
    const { password, email, ...rest } = input;


    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new Error("User already exists");
    }


    const hashedPassword = await hashPassword(password);

    try {
        const user = await prisma.user.create({
            data: { ...rest, email, password: hashedPassword },
        });

        return { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, birthDate: user.birthDate };
    } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to create user");
    }
}


export async function findUserByEmail(email: string) {
    try {
        return await prisma.user.findUnique({
            where: { email },
        });
    } catch (error) {
        console.error("Database lookup error:", error);
        return null; 
    }
}


export async function getAllUsers(page: number, limit: number) {
    const skip = (page - 1) * limit; 
    const totalUsers = await prisma.user.count(); 
    const users = await prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { id: "asc" },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            birthDate: true,
        },
    });

    return {
        users,
    total: totalUsers,
    page,
    limit,
    totalPages: Math.ceil(totalUsers / limit),
  };
}


export async function getUserById(userId: number) {
    return prisma.user.findUnique({
        where: { id: userId },
    });
}


export async function updateUser(userId: number, updates: UpdateUserInput) {
    return prisma.user.update({
        where: { id: userId },
        data: updates,
    });
}


export async function deleteUser(userId: number) {
    return prisma.user.delete({
        where: { id: userId },
    });
}
