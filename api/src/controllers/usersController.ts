import { ServerResponse } from "http";
import { FastifyRequestExt, FastifyReply, RouteOptions } from "fastify";

import GenericController from "./genericController";
import UserMapping from "../db/userMapping";
import UserModel from "../models/userModel";

class UsersController extends GenericController {
  private _userMapping: UserMapping;

  constructor() {
    super();
    this._userMapping = new UserMapping();
  }

  async listUsers(offset: number, limit: number) {
    offset = offset || 0;
    limit = limit || 10;
    return await this._userMapping.list(offset, limit);
  }

  async findUser(userName: string) {
    return await this._userMapping.find(userName);
  }

  async createUser(userModel: any) {
    return await this._userMapping.create(userModel);
  }
}

const userController = new UsersController();

const userModelSchema = {
  type: "object",
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    userName: { type: "string" },
    domain: { type: "string" },
    hash: { type: "string" },
    role: { type: "string" }
  }
};

const UsersControllerRoutes: RouteOptions[] = [
  // getUsers
  {
    method: "GET",
    url: "/api/users",
    schema: {
      tags: ["user"],
      querystring: {
        offset: { type: "integer" },
        limit: { type: "integer" }
      },
      response: {
        "200": {
          type: "array",
          items: [{ ...userModelSchema }]
        },
        "4xx": {
          type: "string"
        }
      },
      security: [
        {
          oauth: []
        }
      ]
    },
    preHandler: GenericController.authentication,
    handler: async (request: FastifyRequestExt, reply: FastifyReply<ServerResponse>) => {
      const users = await userController.listUsers(request.query.offset, request.query.limit);
      reply.send(users);
    }
  },
  // getUser
  {
    method: "GET",
    url: "/api/users/:userName",
    schema: {
      tags: ["user"],
      params: {
        type: "object",
        properties: {
          userName: { type: "string" }
        }
      },
      response: {
        "200": { ...userModelSchema },
        "4xx": {
          type: "string"
        }
      },
      security: [
        {
          oauth: []
        }
      ]
    },
    preHandler: GenericController.authentication,
    handler: async (request: FastifyRequestExt, reply: FastifyReply<ServerResponse>) => {
      const user = await userController.findUser(request.params.userName);
      reply.send(user);
    }
  },
  // setUser
  {
    method: "POST",
    url: "/api/users",
    schema: {
      tags: ["user"],
      body: { ...userModelSchema },
      response: {
        "200": { ...userModelSchema },
        "4xx": {
          type: "string"
        }
      },
      security: [
        {
          oauth: []
        }
      ]
    },
    preHandler: GenericController.authentication,
    handler: async (request: FastifyRequestExt, reply: FastifyReply<ServerResponse>) => {
      const userModel = new UserModel(request.body);
      const user = await userController.createUser(userModel);
      reply.send(user);
    }
  }
];

export default UsersControllerRoutes;
