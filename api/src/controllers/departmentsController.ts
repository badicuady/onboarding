import { ServerResponse } from "http";
import GenericController from "./genericController";
import { DepartmentLkMapping, IDepartmentLk } from "../db";
import { RouteOptions, FastifyRequestExt, FastifyReply } from "fastify";

class DepartmentsController extends GenericController {
  constructor() {
    super();
  }

  makeAssociations():void {
    DepartmentLkMapping.associations();
  }

  async doSync(): Promise<void> {
    await DepartmentLkMapping.sync({ alter: true });
  }

  async postSyncHook(): Promise<void> {
	await DepartmentLkMapping.prepareData();
  }

  async listDepartments(): Promise<IDepartmentLk[]> {
    return await DepartmentLkMapping.list();
  }
}

const departmentsController = new DepartmentsController();

const departmentsLkModelSchema = {
  type: "object",
  properties: {
    id: { type: "number" },
    name: { type: "string" }
  }
};

const departmentsControllerRoutes: RouteOptions[] = [
  {
    method: "GET",
    url: "/api/departments",
    schema: {
      tags: ["dictionaries"],
      response: {
        "200": {
          type: "array",
          items: { ...departmentsLkModelSchema }
        },
        "4xx": {
          type: "string"
        }
      },
      security: [{ oauth: [] }]
    },
    preHandler: GenericController.authentication,
    handler: async (request: FastifyRequestExt, reply: FastifyReply<ServerResponse>) => {
      const departments = await departmentsController.listDepartments();
      reply.send(departments);
    }
  }
];

export default departmentsControllerRoutes;
export { departmentsController as DepartmentsController };
