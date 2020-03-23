import { ServerResponse } from "http";
import { FastifyReply, FastifyRequest, RouteOptions, FastifyRequestExt } from "fastify";

import ActiveDirectoryAuthentication from "../core/authentication/ad";
import GenericController from "./genericController";

type TokenPasswordFlowResponse = {
  access_token?: string;
  expires_in?: number;
  error?: Error;
};

class AuthController extends GenericController {
  constructor() {
    super();
  }

  async token(userName: string, password: string): Promise<TokenPasswordFlowResponse> {
    const adAuth = new ActiveDirectoryAuthentication(userName, password);
    try {
      const result = await adAuth.authenticate();
      return {
        access_token: result || "",
        expires_in: 24 * 3600
      };
    } catch (err) {
      return {
        error: err
      };
    }
  }
}

const authController = new AuthController();

const AuthControllerRoutes: RouteOptions[] = [
  // token
  {
    method: "POST",
    url: "/token",
    schema: {
      hide: true, // hide it from swagger
      body: {
        type: "object",
        properties: {
          grant_type: { const: "password" },
          username: { type: "string", format: "email" },
          password: { type: "string" },
          client_id: { type: "string" }
        }
      },
      response: {
        "200": {
          type: "object",
          properties: {
            access_token: { type: "string" },
            expires_in: { type: "number" },
            error: { type: "object" }
          }
        },
        "4xx": {
          type: "string"
        }
      }
    },
    preHandler: async (request: FastifyRequestExt, response: FastifyReply<ServerResponse>) => {
      if (request.body.grant_type !== "password") {
        throw Error(`Invalid grant type: ${request.body.grant_type}. Must be [password]!`);
      }
    },
    handler: async (request: FastifyRequest, reply: FastifyReply<ServerResponse>) => {
      const token = await authController.token(request.body.username, request.body.password);
      reply.send(token);
    }
  },
  // callback
  {
    method: "GET",
    url: "/user/info",
    schema: {
      tags: ["user"],
      hide: true, // hide it from swagger
      response: {
        "200": {
          type: "object",
          minProperties: 1,
          properties: {
            employeeID: { type: "number" },
            mail: { type: "string", format: "email" }
          },
          additionalProperties: true
        },
        "4xx": {
          type: "string"
        }
      }
    },
    preHandler: GenericController.authentication,
    handler: async (request: FastifyRequestExt, reply: FastifyReply<ServerResponse>) => {
      reply.send(request.user);
    }
  }
];

export default AuthControllerRoutes;
export { authController as AuthController };
