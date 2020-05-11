import { AddressInfo } from "net";
import { app, argv } from "./config";
import fastify from "./controllers";
import GenericController from "./controllers/genericController";
import { MandatoryTopicsController } from "./controllers/mandatoryTopicsController";
import { UserController } from "./controllers/usersController";
import { DepartmentsController } from "./controllers/departmentsController";
import { TimespansController } from "./controllers/timespansController";
import { ResponsiblesController } from "./controllers/responsiblesController";
import Extensions from "./core/common/extensions";

import { DBClient } from "./db/dbClient";

/**
 * add only controllers that have implemented methods: makeAssociations, doSync, postSyncHook
 */
const controllers = [
  DepartmentsController,
  TimespansController,
  ResponsiblesController,
  MandatoryTopicsController,
  UserController
];

const connectToDatabase = async (): Promise<void> => {
  try {
	controllers.forEach(c => c.makeAssociations());
	await Extensions.asyncForEach(controllers, async (c: GenericController) => await c.doSync());
	await Extensions.asyncForEach(controllers, async (c: GenericController) => await c.postSyncHook());
  } catch (err) {
    fastify.log.error(err);
  }
};

const start = async () => {
  try {
	console.log(`Starting application for «${argv.env}» environment...`);

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
