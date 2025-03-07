import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

const idSchema = z.number().int().positive();

const userCore = {
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  birthDate: z.string().datetime(),
};


export const createUserSchema = z.object({
  ...userCore,
  password: passwordSchema,
});


export const createUserResponseSchema = z.object({
  id: idSchema,
  ...userCore,
});


export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(), 
});


export const loginResponseSchema = z.object({
  accessToken: z.string(),
});


export const updateUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  birthDate: z.string().datetime().optional(),
});


export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;


export const userSchemas = [
  {
    $id: "createUserSchema",
    type: "object",
    properties: {
      email: { type: "string", format: "email" },
      firstName: { type: "string" },
      lastName: { type: "string" },
      birthDate: { type: "string", format: "date-time" },
      password: { type: "string", minLength: 8 },
    },
    required: ["email", "firstName", "lastName", "birthDate", "password"],
  },
  {
    $id: "updateUserSchema",
    type: "object",
    properties: {
      firstName: { type: "string" },
      lastName: { type: "string" },
      birthDate: { type: "string", format: "date-time" },
    },
    required: [],
  },
  {
    $id: "createUserResponseSchema",
    type: "object",
    properties: {
      id: { type: "integer" },
      email: { type: "string", format: "email" },
      firstName: { type: "string" },
      lastName: { type: "string" },
      birthDate: { type: "string", format: "date-time" },
    },
  },
  {
    $id: "loginSchema",
    type: "object",
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string" }, 
    },
    required: ["email", "password"],
  },
  {
    $id: "loginResponseSchema",
    type: "object",
    properties: {
      accessToken: { type: "string" },
    },
  },
];
