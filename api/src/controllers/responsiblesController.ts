import { ServerResponse } from "http";
import GenericController from "./genericController";
import { ResponsibleLkMapping, IResponsibleLk } from "../db";
import { RouteOptions, FastifyRequestExt, FastifyReply } from "fastify";

class ResponsiblesController extends GenericController {
  constructor() {
    super();
  }

  makeAssociations():void {
    ResponsibleLkMapping.associations();
  }

  async doSync(): Promise<void> {
    await ResponsibleLkMapping.sync({ alter: true });
  }

  async postSyncHook(): Promise<void> {
	await ResponsibleLkMapping.prepareData();
  }

  async listTimespans(): Promise<IResponsibleLk[]> {
    return await ResponsibleLkMapping.list();
  }
}

const responsiblesController = new ResponsiblesController();

const responsiblesLkModelSchema = {
  type: "object",
  properties: {
    id: { type: "number" },
	name: { type: "string" },
	description: { type: "string" }
  }
};

const responsiblesControllerRoutes: RouteOptions[] = [
  {
    method: "GET",
    url: "/api/responsibles",
    schema: {
      tags: ["dictionaries"],
      response: {
        "200": {
          type: "array",
          items: { ...responsiblesLkModelSchema }
        },
        "4xx": {
          type: "string"
        }
      },
      security: [{ oauth: [] }]
    },
    preHandler: GenericController.authentication,
    handler: async (request: FastifyRequestExt, reply: FastifyReply<ServerResponse>) => {
      const responsibles = await responsiblesController.listTimespans();
      reply.send(responsibles);
    }
  }
];

export default responsiblesControllerRoutes;
export { responsiblesController as ResponsiblesController };
