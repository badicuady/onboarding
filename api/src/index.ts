import { AddressInfo } from "net";
import { app, argv } from "./config";
import fastify from "./controllers";

console.info(`Starting application for «${argv.env}» environment...`);

const start = async () => {
  try {
    await fastify.listen(app[argv.env].SERVER_PORT, "0.0.0.0");
    const address: string | AddressInfo | null = fastify.server.address();
    if (address && typeof address === "object") {
      fastify.log.info(`server listening on ${address.port}`);
    }
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
