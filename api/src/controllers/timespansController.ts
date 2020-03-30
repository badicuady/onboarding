import { ServerResponse } from "http";
import GenericController from "./genericController";
import { TimespanLkMapping, ITimespanLk } from "../db";
import { RouteOptions, FastifyRequestExt, FastifyReply } from "fastify";

class TimespansController extends GenericController {
  constructor() {
    super();
  }

  makeAssociations():void {
    TimespanLkMapping.associations();
  }

  async doSync(): Promise<void> {
    await TimespanLkMapping.sync({ alter: true });
  }

  async postSyncHook(): Promise<void> {
	await TimespanLkMapping.prepareData();
  }

  async listTimespans(): Promise<ITimespanLk[]> {
    return await TimespanLkMapping.list();
  }
}

const timespansController = new TimespansController();

const timespansLkModelSchema = {
  type: "object",
  properties: {
    id: { type: "number" },
	name: { type: "string" },
	description: { type: "string" },
	value: { type: "number" }
  }
};

const timespansControllerRoutes: RouteOptions[] = [
  {
    method: "GET",
    url: "/api/timespans",
    schema: {
      tags: ["dictionaries"],
      response: {
        "200": {
          type: "array",
          items: { ...timespansLkModelSchema }
        },
        "4xx": {
          type: "string"
        }
      },
      security: [{ oauth: [] }]
    },
    preHandler: GenericController.authentication,
    handler: async (request: FastifyRequestExt, reply: FastifyReply<ServerResponse>) => {
      const timespans = await timespansController.listTimespans();
      reply.send(timespans);
    }
  }
];

export default timespansControllerRoutes;
export { timespansController as TimespansController };
