import { ServerResponse } from "http";
import GenericController from "./genericController";
import { MandatoryTopicsLkMapping, IMandatoryTopicsLk } from "../db";
import { RouteOptions, FastifyRequestExt, FastifyReply } from "fastify";

class MandatoryTopicsController extends GenericController {

  constructor() {
    super();
  }

  async listMandatoryTopics(): Promise<IMandatoryTopicsLk[]> {
    return await MandatoryTopicsLkMapping.list();
  }

  makeAssociations():void {
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
    description: { type: "string" }
  }
};

const MandatoryTopicsControllerRoutes: RouteOptions[] = [
  {
    method: "GET",
    url: "/api/mandatorytopics",
    schema: {
      tags: ["dictionaries"],
      response: {
        "200": {
          type: "array",
          items: { ...mandatoryTopicsLkModelSchema }
        },
        "4xx": {
          type: "string"
        }
      },
      security: [{ oauth: [] }]
    },
    preHandler: GenericController.authentication,
    handler: async (request: FastifyRequestExt, reply: FastifyReply<ServerResponse>) => {
      const mandatoryTopics = await mandatoryTopicsController.listMandatoryTopics();
      reply.send(mandatoryTopics);
    }
  }
];

export default MandatoryTopicsControllerRoutes;
export { mandatoryTopicsController as MandatoryTopicsController };
