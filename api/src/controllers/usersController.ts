import { ServerResponse } from "http";
import { FastifyRequestExt, FastifyReply, RouteOptions } from "fastify";

import GenericController from "./genericController";
import { IUser, User, UserMapping, UserMandatoryTopicsMappings, IUserMandatoryTopics } from "../db";
import UserModel, { IUserModel } from "../models/userModel";
import { UserMandatoryTopics } from "../db";

class UsersController extends GenericController {
  constructor() {
    super();
  }

  makeAssociations(): void {
    UserMapping.associations();
    UserMandatoryTopicsMappings.associations();
  }

  async doSync(): Promise<void> {
    await UserMapping.sync({ alter: true });
    await UserMandatoryTopicsMappings.sync({ alter: true });
  }

  async listUsers(offset: number, limit: number): Promise<IUser[]> {
    offset = offset || 0;
    limit = limit || 10;
    return await UserMapping.list(offset, limit);
  }

  async findUser(userName: string): Promise<IUser | null> {
    return await UserMapping.find(userName);
  }

  async createOrUpdateUser(userModel: IUserModel): Promise<[User, boolean]> {
    return await UserMapping.createOrUpdate(userModel);
  }

  async updateMandatoryTopicsUser(userMandatoryTopic:IUserMandatoryTopics): Promise<[UserMandatoryTopics, boolean]> {
    return await UserMandatoryTopicsMappings.create(userMandatoryTopic);
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

const userMandatoryTopicsModelSchema = {
  type: "object",
  properties: {
    userId: { type: "number" },
    mandatoryTopicsId: { type: "number" },
    done: { type: "boolean" }
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
          items: { ...userModelSchema }
        },
        "4xx": {
          type: "string"
        }
      },
      security: [{ oauth: [] }]
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
      security: [{ oauth: [] }]
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
      security: [{ oauth: [] }]
    },
    preHandler: GenericController.authentication,
    handler: async (request: FastifyRequestExt, reply: FastifyReply<ServerResponse>) => {
      const userModel = new UserModel(request.body);
      const [user] = await userController.createOrUpdateUser(userModel);
      reply.send(user);
    }
  },
  {
    method: "POST",
    url: "/api/user/mandatorytopics",
    schema: {
	  tags: ["user"],
	  body: { ...userMandatoryTopicsModelSchema },
      response: {
        "200": { type: "object" },
        "4xx": {
          type: "string"
        }
      },
      security: [{ oauth: [] }]
    },
    preHandler: GenericController.authentication,
    handler: async (request: FastifyRequestExt, reply: FastifyReply<ServerResponse>) => {
	  const [userMandatoryTopics, wasInserterd] = await userController.updateMandatoryTopicsUser(<IUserMandatoryTopics>request.body);
      reply.send(userMandatoryTopics);
    }
  }
];

export default UsersControllerRoutes;
export { userController as UserController };
