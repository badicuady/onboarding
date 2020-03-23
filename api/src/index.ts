import { AddressInfo } from "net";
import { app, argv } from "./config";
import fastify from "./controllers";
import GenericController, { IGenericController } from "./controllers/genericController";
import { MandatoryTopicsController } from "./controllers/mandatoryTopicsController";
import { UserController } from "./controllers/usersController";
import Extensions from "./core/common/extensions";

console.info(`Starting application for «${argv.env}» environment...`);

const connectToDatabase = async (): Promise<void> => {
  try {
    /**
     * add only controllers that have implemented methods: makeAssociations, doSync, postSyncHook
     */
    const controllers = [MandatoryTopicsController, UserController];
    controllers.forEach(c => c.makeAssociations());
    await Extensions.AsyncForEach(controllers, async (c: GenericController) => await c.doSync());
    await Extensions.AsyncForEach(controllers, async (c: GenericController) => await c.postSyncHook());
  } catch (err) {
    fastify.log.error(err);
  }
};

const start = async () => {
  try {
    await connectToDatabase();
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
