import { ServerResponse } from "http";
import GenericController from "./genericController";
import { MandatoryTopicsLkMapping, IMandatoryTopicsLk } from "../db";
import { RouteOptions, FastifyRequestExt, FastifyReply } from "fastify";
import { MandatoryTopicsLkFilter } from "../db/lookups/mandatoryTopicsLkMapping";

class MandatoryTopicsController extends GenericController {
  constructor() {
    super();
  }

  async listMandatoryTopics(filter: MandatoryTopicsLkFilter): Promise<IMandatoryTopicsLk[]> {
    return await MandatoryTopicsLkMapping.list(filter);
  }

  makeAssociations(): void {
    MandatoryTopicsLkMapping.associations();
  }

  async doSync(): Promise<void> {
    await MandatoryTopicsLkMapping.sync({ alter: true });
  }

  async postSyncHook(): Promise<void> {
    await MandatoryTopicsLkMapping.prepareData();
  }
}

const mandatoryTopicsController = new MandatoryTopicsController();

const mandatoryTopicsLkModelSchema = {
  type: "object",
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    description: { type: "string" },
	tools: { type: "string" },
	group: { type: "number" },
    forSpecialist: { type: "boolean" },
    forManager: { type: "boolean" },
    timespanId: { type: "number" },
    responsibleId: { type: "number" },
  },
};

const MandatoryTopicsControllerRoutes: RouteOptions[] = [
  {
    method: "GET",
    url: "/api/mandatorytopics",
    schema: {
      tags: ["dictionaries"],
      querystring: { forSpecialist: { type: "boolean" }, forManager: { type: "boolean" } },
      response: {
        "200": {
          type: "array",
          items: { ...mandatoryTopicsLkModelSchema },
        },
        "4xx": {
          type: "string",
        },
      },
      security: [{ oauth: [] }],
    },
    preHandler: GenericController.authentication,
    handler: async (request: FastifyRequestExt, reply: FastifyReply<ServerResponse>) => {
      const filter: MandatoryTopicsLkFilter = {
        forSpecialist: request.query.forSpecialist,
        forManager: request.query.forManager,
      };
      const mandatoryTopics = await mandatoryTopicsController.listMandatoryTopics(filter);
      reply.send(mandatoryTopics);
    },
  },
];

export default MandatoryTopicsControllerRoutes;
export { mandatoryTopicsController as MandatoryTopicsController };
