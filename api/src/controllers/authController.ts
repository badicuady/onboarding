import { ServerResponse } from "http";
import { FastifyReply, FastifyRequest, RouteOptions, FastifyRequestExt } from "fastify";

import ActiveDirectoryAuthentication from "../core/authentication/ad";
import GenericController from "./genericController";
import Extensions from "../core/common/extensions";

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
    const result = await adAuth.authenticate();
    return {
      access_token: result || "",
      expires_in: 24 * 3600,
    };
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
          client_id: { type: "string" },
        },
      },
      response: {
        "200": {
          type: "object",
          properties: {
            access_token: { type: "string" },
            expires_in: { type: "number" },
          },
        },
        "4xx": {
          type: "string",
        },
      },
    },
    preHandler: async (request: FastifyRequestExt) => {
      if (request.body.grant_type !== "password") {
        throw Error(`Invalid grant type: ${request.body.grant_type}. Must be [password]!`);
      }
    },
    handler: async (request: FastifyRequest, reply: FastifyReply<ServerResponse>) => {
      const token = await authController.token(request.body.username, request.body.password);
      reply.send(token);
    },
  },
  {
    method: "GET",
    url: "/api/users/info",
    schema: {
      tags: ["user"],
      hide: false, // hide it from swagger
      response: {
        "200": {
          type: "object",
          minProperties: 3,
          definitions: {
            fooHeader: {
              $id: "#header",
              type: "object",
              properties: {
                alg: { type: "string" },
                typ: { type: "string" },
              },
            },
            fooPayload: {
              $id: "#payload",
              type: "object",
              properties: {
                groups: { type: "array", items: { type: "string" } },
                phone: { type: "string" },
                name: { type: "string" },
                mail: { type: "string" },
                guid: { type: "string" },
                dn: { type: "string" },
                title: { type: "string" },
                description: { type: "string" },
                postalCode: { type: "string" },
                physicalDeliveryOfficeName: { type: "string" },
                telephoneNumber: { type: "string" },
                givenName: { type: "string" },
                displayName: { type: "string" },
                co: { type: "string" },
                department: { type: "string" },
                company: { type: "string" },
                streetAddress: { type: "string" },
                directReports: { type: "string" },
                employeeID: { type: "string" },
                userPrincipalName: { type: "string" },
                manager: { type: "string" },
                mailNickname: { type: "string" },
                id: { type: "number" },
                iat: { type: "number" },
                exp: { type: "number" },
                aud: { type: "string" },
                iss: { type: "string" },
                sub: { type: "string" },
              },
            },
          },
          properties: {
            header: { $ref: "#header" },
            payload: { $ref: "#payload" },
            signature: { type: "string" },
          },
        },
        "4xx": {
          type: "string",
        },
      },
      security: [{ oauth: [] }],
    },
    preHandler: GenericController.authentication,
    handler: async (request: FastifyRequestExt, reply: FastifyReply<ServerResponse>) => {
      reply.send(Extensions.filterObjectByKeyNameExclude(request.user, ["password"]));
    },
  },
];

export default AuthControllerRoutes;
export { authController as AuthController };
