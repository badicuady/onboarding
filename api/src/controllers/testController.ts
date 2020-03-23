import { ServerResponse } from "http";
import { RouteOptions, FastifyReply, FastifyRequestExt } from "fastify";
import GenericController from "./genericController";

class TestController extends GenericController {
  constructor() {
    super();
  }

  async testing() {
    return this;
  }
}

const testController = new TestController();

const TestControllerRoutes: RouteOptions[] = [
  {
    method: "GET",
    url: "/api/test",
    schema: {
      tags: ["test"],
      description: "This is a simple GET example",
      summary: "qwerty",
      response: {
        "200": {
          type: "object",
          properties: {
            test: { type: "string" }
          }
        },
        "4xx": {
          type: "string"
        }
      }
    },
    handler: async (request: FastifyRequestExt, reply: FastifyReply<ServerResponse>) => {
      const test = await testController.testing();
      reply.send(test);
    }
  },
  {
    method: "GET",
    url: "/api/test/auth",
    schema: {
      tags: ["test"],
      response: {
        "200": {
          type: "object",
          properties: {
            test: { type: "string" },
            user: {
              type: "object",
              minProperties: 1,
              properties: {
                employeeID: { type: "number" },
                mail: { type: "string", format: "email" }
              },
              additionalProperties: true
            }
          }
        },
        "4xx": {
          type: "string"
        }
      },
      security: [{ oauth: [] }]
    },
    preHandler: GenericController.authentication,
    handler: async (request: FastifyRequestExt, reply: FastifyReply<ServerResponse>) => {
      const test = await testController.testing();
      reply.send({ ...test, user: request.user.payload });
    }
  }
];

export default TestControllerRoutes;
export { testController as TestController };