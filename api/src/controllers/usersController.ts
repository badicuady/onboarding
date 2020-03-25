import { ServerResponse } from "http";
import { FastifyRequestExt, FastifyReply, RouteOptions } from "fastify";

import GenericController from "./genericController";
import { User, UserMapping, UserMandatoryTopicsMappings, IUserMandatoryTopics } from "../db";
import UserModel, { IUserModel } from "../models/userModel";
import { UserMandatoryTopics } from "../db";
import { IGenericModel } from "../models/genericModel";
import UserMandatoryTopicsModel, { IUserMandatoryTopicsModel } from "../models/topics/userMandatoryTopicsModel";

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

  async listUsers(user: IUserModel & IGenericModel, offset: number, limit: number): Promise<User[]> {
    offset = offset || 0;
    limit = limit || 10;
    return await UserMapping.list(user, offset, limit);
  }

  async findUser(user: IUserModel): Promise<User | null> {
    return await UserMapping.find(user);
  }

  async createOrUpdateUser(userModel: IUserModel): Promise<[User, boolean]> {
    return await UserMapping.createOrUpdate(userModel);
  }

  async getMandatoryTopicsUser(userId: number): Promise<UserMandatoryTopics[]> {
    return await UserMandatoryTopicsMappings.get(userId);
  }

  async addOrUpdateMandatoryTopicsUser(
    userMandatoryTopic: IUserMandatoryTopicsModel
  ): Promise<[UserMandatoryTopics, boolean]> {
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
        limit: { type: "integer" },
        firstName: { type: "string" },
        lastName: { type: "string" },
        userName: { type: "string" },
        role: { type: "string" }
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
      const users = await userController.listUsers(
        new UserModel({
          firstName: request.query.firstName,
          lastName: request.query.lastName,
          userName: request.query.userName,
          role: request.query.role
        }),
        request.query.offset,
        request.query.limit
      );
      reply.send(users.map(e => e.toJSON()));
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
      reply.send(user.toJSON());
    }
  },
  {
    method: "GET",
    url: "/api/user/mandatorytopics",
    schema: {
      tags: ["user"],
      querystring: { userId: { type: "number" } },
      response: {
        "200": { type: "array", items: { ...userMandatoryTopicsModelSchema } },
        "4xx": {
          type: "string"
        }
      },
      security: [{ oauth: [] }]
    },
    preHandler: GenericController.authentication,
    handler: async (request: FastifyRequestExt, reply: FastifyReply<ServerResponse>) => {
      const userMandatoryTopics = await userController.getMandatoryTopicsUser(request.query.userId);
      reply.send(userMandatoryTopics.map(e => e.toJSON()));
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
      const userMandatoryTopicsModel = new UserMandatoryTopicsModel(request.body);
      const [userMandatoryTopics, wasInserterd] = await userController.addOrUpdateMandatoryTopicsUser(
        userMandatoryTopicsModel
      );
      reply.send(userMandatoryTopics.toJSON());
    }
  }
];

export default UsersControllerRoutes;
export { userController as UserController };
