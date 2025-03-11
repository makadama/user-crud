import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import fjwt, { JWT } from "@fastify/jwt";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import cors from "@fastify/cors";
import pino from "pino";
import userRoutes from "./modules/user/user.route";
import { userSchemas } from "./modules/user/user.schema";
import { version } from "../package.json";
import dotenv from "dotenv";

dotenv.config();

declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT;
  }
  export interface FastifyInstance {
    authenticate: any;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      id: number;
      email: string;
      name: string;
    };
  }
}

function buildServer() {
  const server = Fastify({
    logger: {
      level: "info", 
    },
  });
  
  
  /*server.register(cors, {
    origin: ["http://localhost:3000"],
    credentials: true,
  });*/

  server.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  });
  


  server.register(fjwt, {
    secret: process.env.JWT_SECRET || "my_secret",
    sign: {
      expiresIn: "1h"
    }
  });

  server.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (e) {
        reply.status(401).send({ error: "Unauthorized" }); 
      }
    }
  );

  server.get("/healthcheck", async function (_, reply) {
    return reply.send({ status: "OK" });
  });

  server.addHook("preHandler", (req, reply, next) => {
    req.jwt = server.jwt;
    return next();
  });


  if (userSchemas.length > 0) {
    for (const schema of userSchemas) {
      server.addSchema(schema);
    }
  } else {
    console.warn("Warning: No schemas found in `userSchemas`.");
  }

  server.register(swagger, {
    openapi: {
      info: {
        title: "Fastify API",
        description: "API for some products",
        version,
      },
    },
  });

  server.register(swaggerUi, {
    routePrefix: "/docs",
    staticCSP: true,
  });

  server.register(userRoutes, { prefix: "api/users" });

  return server;
}

export default buildServer;
