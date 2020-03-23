import { ServerResponse } from "http";
import GenericController from "./genericController";
import { MandatoryTopicsLkMappings, IMandatoryTopicsLk } from "../db";
import { RouteOptions, FastifyRequestExt, FastifyReply } from "fastify";

class MandatoryTopicsController extends GenericController {

  constructor() {
    super();
  }

  async listMandatoryTopics(): Promise<IMandatoryTopicsLk[]> {
    return await MandatoryTopicsLkMappings.list();
  }

  makeAssociations():void {
    MandatoryTopicsLkMappings.associations();
  }

  async doSync(): Promise<void> {
    await MandatoryTopicsLkMappings.sync({ alter: true });
  }

  async postSyncHook(): Promise<void> {
	await MandatoryTopicsLkMappings.prepareData();
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
      tags: ["mandatorytopics"],
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
