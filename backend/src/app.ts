import buildServer from "./server";
import dotenv from "dotenv";

dotenv.config(); 

const server = buildServer();

async function main() {
  try {
    const address = await server.listen({ port: 4000, host: "0.0.0.0" });
    console.log(`Server running at ${address}`);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Unexpected Error:", err);
});
