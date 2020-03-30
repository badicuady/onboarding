import { ServerResponse } from "http";
import { FastifyRequestExt, FastifyReply, RouteOptions } from "fastify";

import { IGenericModel } from "../models/genericModel";
import {
  IUserModel,
  UserModel,
  IUserMandatoryTopicsModel,
  UserMandatoryTopicsModel,
  IUserFeedbackModel
} from "../models";
import UserFeedbackModel, { IUserSpecificTopicsModel } from "../models/topics/userSpecificTopicsModel";

import GenericController from "./genericController";
import {
  User,
  UserMapping,
  UserMandatoryTopicsMapping,
  UserMandatoryTopics,
  UserSpecificTopicsMapping,
  UserSpecificTopics,
  UserFeedback,
  UserFeedbackMapping
} from "../db";

class UsersController extends GenericController {
  constructor() {
    super();
  }

  makeAssociations(): void {
    UserMapping.associations();
    UserMandatoryTopicsMapping.associations();
	UserSpecificTopicsMapping.associations();
	UserFeedbackMapping.associations();
  }

  async doSync(): Promise<void> {
    await UserMapping.sync({ alter: true });
    await UserMandatoryTopicsMapping.sync({ alter: true });
	await UserSpecificTopicsMapping.sync({ alter: true });
	await UserFeedbackMapping.sync({ alter: true });
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
    return await UserMandatoryTopicsMapping.get(userId);
  }

  async addOrUpdateMandatoryTopicsUser(
    userMandatoryTopicModel: IUserMandatoryTopicsModel
  ): Promise<[UserMandatoryTopics, boolean]> {
    return await UserMandatoryTopicsMapping.create(userMandatoryTopicModel);
  }

  async getSpecificTopicsUser(userId: number): Promise<UserSpecificTopics[]> {
    return await UserSpecificTopicsMapping.get(userId);
  }

  async addOrUpdateSpecificTopicsUser(
    userSpecificTopicModel: IUserSpecificTopicsModel
  ): Promise<[UserSpecificTopics, boolean]> {
    return await UserSpecificTopicsMapping.create(userSpecificTopicModel);
  }

  async getUserFeedback(userId: number): Promise<UserFeedback[]> {
    return await UserFeedbackMapping.get(userId);
  }

  async addOrUpdateFeedbackUser(userFeedbackModel: IUserFeedbackModel): Promise<[UserFeedback, boolean]> {
    return await UserFeedbackMapping.create(userFeedbackModel);
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

const userSpecificTopicsModelSchema = {
  type: "object",
  properties: {
    userId: { type: "number" },
    specificTopicName: { type: "string" },
    specificTopicMaterials: { type: "string" },
    timespanId: { type: "number" },
    responsibleId: { type: "number" },
    done: { type: "boolean" }
  }
};

const userFeedbackModelSchema = {
  type: "object",
  properties: {
    userId: { type: "number" },
    userType: { type: "number" },
    feedback: { type: "string" },
    type: { type: "number" },
    period: { type: "number" }
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
        "200": { ...userMandatoryTopicsModelSchema },
        "4xx": {
          type: "string"
        }
      },
      security: [{ oauth: [] }]
    },
    preHandler: GenericController.authentication,
    handler: async (request: FastifyRequestExt, reply: FastifyReply<ServerResponse>) => {
      const userMandatoryTopicsModel = new UserMandatoryTopicsModel(request.body);
      const [userMandatoryTopics] = await userController.addOrUpdateMandatoryTopicsUser(userMandatoryTopicsModel);
      reply.send(userMandatoryTopics.toJSON());
    }
  },
  {
    method: "GET",
    url: "/api/user/specifictopics",
    schema: {
      tags: ["user"],
      querystring: { userId: { type: "number" } },
      response: {
        "200": { type: "array", items: { ...userSpecificTopicsModelSchema } },
        "4xx": {
          type: "string"
        }
      },
      security: [{ oauth: [] }]
    },
    preHandler: GenericController.authentication,
    handler: async (request: FastifyRequestExt, reply: FastifyReply<ServerResponse>) => {
      const userSpecificTopics = await userController.getSpecificTopicsUser(request.query.userId);
      reply.send(userSpecificTopics.map(e => e.toJSON()));
    }
  },
  {
    method: "POST",
    url: "/api/user/specifictopics",
    schema: {
      tags: ["user"],
      body: { ...userSpecificTopicsModelSchema },
      response: {
        "200": { ...userSpecificTopicsModelSchema },
        "4xx": {
          type: "string"
        }
      },
      security: [{ oauth: [] }]
    },
    preHandler: GenericController.authentication,
    handler: async (request: FastifyRequestExt, reply: FastifyReply<ServerResponse>) => {
      const userSpecificTopicsModel = new UserFeedbackModel(request.body);
      const [userMandatoryTopics] = await userController.addOrUpdateSpecificTopicsUser(userSpecificTopicsModel);
      reply.send(userMandatoryTopics.toJSON());
    }
  },
  {
    method: "GET",
    url: "/api/user/feedback",
    schema: {
      tags: ["user"],
      querystring: { userId: { type: "number" } },
      response: {
        "200": { type: "array", items: { ...userFeedbackModelSchema } },
        "4xx": {
          type: "string"
        }
      },
      security: [{ oauth: [] }]
    },
    preHandler: GenericController.authentication,
    handler: async (request: FastifyRequestExt, reply: FastifyReply<ServerResponse>) => {
      const userFeedback = await userController.getUserFeedback(request.query.userId);
      reply.send(userFeedback.map(e => e.toJSON()));
    }
  },
  {
    method: "POST",
    url: "/api/user/feedback",
    schema: {
      tags: ["user"],
      body: { ...userFeedbackModelSchema },
      response: {
        "200": { ...userFeedbackModelSchema },
        "4xx": {
          type: "string"
        }
      },
      security: [{ oauth: [] }]
    },
    preHandler: GenericController.authentication,
    handler: async (request: FastifyRequestExt, reply: FastifyReply<ServerResponse>) => {
      const userFeedbackModel = new UserFeedbackModel(request.body);
      const [userFeedback] = await userController.addOrUpdateFeedbackUser(userFeedbackModel);
      reply.send(userFeedback.toJSON());
    }
  }
];

export default UsersControllerRoutes;
export { userController as UserController };
