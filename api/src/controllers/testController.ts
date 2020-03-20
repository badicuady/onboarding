import { ServerResponse } from "http";
import { RouteOptions, FastifyRequest, FastifyReply, FastifyRequestExt, Token } from "fastify";
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
    url: "/api/testauth",
    schema: {
      tags: ["test"],
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
      },
      security: [{
          oauth: []
        }]
    },
    preHandler: GenericController.authentication,
    handler: async (request: FastifyRequestExt, reply: FastifyReply<ServerResponse>) => {
      const test = await testController.testing();
      reply.send(test);
    }
  }
];

export default TestControllerRoutes;
