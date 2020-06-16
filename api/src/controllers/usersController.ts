import { ServerResponse } from "http";
import { FastifyRequestExt, FastifyReply, RouteOptions } from "fastify";

import { IGenericModel } from "../models/genericModel";
import {
  IUserModel,
  UserModel,
  IUserMandatoryTopicsModel,
  UserMandatoryTopicsModel,
  IUserSpecificTopicsModel,
  IUserFeedbackModel,
  UserFeedbackModel,
  UserObjectivesModel,
  UserSpecificTopicsModel,
  IUserReviewModel,
  UserReviewModel,
  IUserObjectivesModel,
  IUserRequiredActionsModel,
  UserRequiredActionsModel,
} from "../models";

import GenericController from "./genericController";
import {
  User,
  UserMapping,
  UserMandatoryTopicsMapping,
  UserMandatoryTopics,
  UserSpecificTopicsMapping,
  UserSpecificTopics,
  UserFeedback,
  UserFeedbackMapping,
  UserObjectives,
  UserObjectivesMapping,
  UserReviewMapping,
  UserReview,
  UserRequiredActions,
  UserRequiredActionsMapping,
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
    UserObjectivesMapping.associations();
    UserReviewMapping.associations();
    UserRequiredActionsMapping.associations();
  }

  async doSync(): Promise<void> {
    await Promise.all([
      UserMapping.sync({ alter: true }),
      UserMandatoryTopicsMapping.sync({ alter: true }),
      UserSpecificTopicsMapping.sync({ alter: true }),
      UserFeedbackMapping.sync({ alter: true }),
      UserObjectivesMapping.sync({ alter: true }),
      UserReviewMapping.sync({ alter: true }),
      UserRequiredActionsMapping.sync({ alter: true }),
    ]);
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

  async updateSpecificTopicsUser(userSpecificTopicModel: IUserSpecificTopicsModel): Promise<UserSpecificTopics | null> {
    return await UserSpecificTopicsMapping.update(userSpecificTopicModel);
  }

  async deleteSpecificTopicsUser(userSpecificTopicModel: IUserSpecificTopicsModel): Promise<boolean | null> {
    return await UserSpecificTopicsMapping.delete(userSpecificTopicModel);
  }

  async getUserFeedback(userId: number): Promise<UserFeedback[]> {
    return await UserFeedbackMapping.get(userId);
  }

  async addOrUpdateFeedbackUser(userFeedbackModel: IUserFeedbackModel): Promise<[UserFeedback, boolean]> {
    return await UserFeedbackMapping.create(userFeedbackModel);
  }

  async getUserObjectives(userId: number): Promise<UserObjectives[]> {
    return await UserObjectivesMapping.get(userId);
  }

  async addOrUpdateObjectivesUser(userObjectiveModel: IUserObjectivesModel): Promise<[UserObjectives, boolean]> {
    return await UserObjectivesMapping.create(userObjectiveModel);
  }

  async deleteObjectivesUser(userObjectivesModel: IUserObjectivesModel): Promise<boolean | null> {
    return await UserObjectivesMapping.delete(userObjectivesModel);
  }

  async getUserReview(userId: number): Promise<UserReview[]> {
    return await UserReviewMapping.get(userId);
  }

  async addOrUpdateReviewUser(userReviewModel: IUserReviewModel): Promise<[UserReview, boolean]> {
    return await UserReviewMapping.create(userReviewModel);
  }

  async getUserRequiredActions(userRequiredActionId: number): Promise<UserRequiredActions[]> {
    return await UserRequiredActionsMapping.get(userRequiredActionId);
  }

  async addOrUpdateRequiredActionsUser(
    userRequiredActionsModel: IUserRequiredActionsModel
  ): Promise<[UserRequiredActions, boolean]> {
    return await UserRequiredActionsMapping.create(userRequiredActionsModel);
  }

  async deleteRequiredActionsUser(userRequiredActionsModel: IUserRequiredActionsModel): Promise<boolean | null> {
    return await UserRequiredActionsMapping.delete(userRequiredActionsModel);
  }
}

const userController = new UsersController();

const paramsIdSchema = {
  type: "object",
  properties: {
    id: { type: "number" },
  },
};

const userModelSchema = {
  type: "object",
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    userName: { type: "string" },
    role: { type: "string" },
  },
};

const userMandatoryTopicsModelSchema = {
  type: "object",
  properties: {
	id: { type: "number" },
	userId: { type: "number" },
	alteringUserId: { type: "number" },
    mandatoryTopicsId: { type: "number" },
    done: { type: "boolean" },
  },
};

const userSpecificTopicsModelSchema = {
  type: "object",
  properties: {
	id: { type: "number" },
	userId: { type: "number" },
	alteringUserId: { type: "number" },
    specificTopicName: { type: "string" },
    specificTopicMaterials: { type: "string" },
    timespanId: { type: "number" },
    responsibleId: { type: "number" },
    done: { type: "boolean" },
    type: { type: "number", minimum: 1, maximum: 2 },
  },
};

const userSpecificTopicsModelPatchSchema = {
  type: "object",
  properties: {
	id: { type: "number" },
	userId: { type: "number" },
	alteringUserId: { type: "number" },
    done: { type: "boolean" },
  },
};

const userSpecificTopicsModelDeleteSchema = {
  type: "object",
  properties: {
	id: { type: "number" },
	userId: { type: "number" },
	alteringUserId: { type: "number" },
  },
};

const userFeedbackModelSchema = {
  type: "object",
  properties: {
	id: { type: "number" },
	userId: { type: "number" },
	alteringUserId: { type: "number" },
    userType: { type: "number" },
    feedback: { type: "string" },
    period: { type: "number" },
    type: { type: "number" },
  },
};

const userObjectiveModelSchema = {
  type: "object",
  properties: {
	id: { type: "number" },
	userId: { type: "number" },
	alteringUserId: { type: "number" },
    description: { type: "string" },
    deadline: { type: "string", format: "date" },
    responsible: { type: "string" },
    type: { type: "number" },
  },
};

const userReviewModelSchema = {
  type: "object",
  properties: {
	id: { type: "number" },
	userId: { type: "number" },
	alteringUserId: { type: "number" },
    date: { type: "string", format: "date" },
    performance: { type: "string" },
    concerns: { type: "string" },
    summary: { type: "string" },
    objectivesMet: { type: "boolean" },
    trainingsMet: { type: "boolean" },
    period: { type: "number", minimum: 1, maximum: 3 },
  },
};

const userRequiredActionsModelSchema = {
  type: "object",
  properties: {
	id: { type: "number" },
    userId: { type: "number" },
    alteringUserId: { type: "number" },
    action: { type: "string" },
    date: { type: "string", format: "date" },
	type: { type: "number" },
	userReviewId: { type: "number" }
  },
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
        role: { type: "string" },
      },
      response: {
        "200": {
          type: "array",
          items: { ...userModelSchema },
        },
        "4xx": {
          type: "string",
        },
      },
      security: [{ oauth: [] }],
    },
    preHandler: GenericController.authentication,
    handler: async (request: FastifyRequestExt, reply: FastifyReply<ServerResponse>) => {
      const users = await userController.listUsers(
        new UserModel({
          firstName: request.query.firstName,
          lastName: request.query.lastName,
          userName: request.query.userName,
          role: request.query.role,
        }),
        request.query.offset,
        request.query.limit
      );
      reply.send(users.map((e) => e.toJSON()));
    },
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
          type: "string",
        },
      },
      security: [{ oauth: [] }],
    },
    preHandler: GenericController.authentication,
    handler: async (request: FastifyRequestExt, reply: FastifyReply<ServerResponse>) => {
      const userModel = new UserModel(request.body);
      const [user] = await userController.createOrUpdateUser(userModel);
      reply.send(user.toJSON());
    },
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
          type: "string",
        },
      },
      security: [{ oauth: [] }],
    },
    preHandler: GenericController.authentication,
    handler: async (request: FastifyRequestExt, reply: FastifyReply<ServerResponse>) => {
      const userMandatoryTopics = await userController.getMandatoryTopicsUser(request.query.userId);
      reply.send(userMandatoryTopics.map((e) => e.toJSON()));
    },
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
          type: "string",
        },
      },
      security: [{ oauth: [] }],
    },
    preHandler: GenericController.authentication,
    handler: async (request: FastifyRequestExt, reply: FastifyReply<ServerResponse>) => {
      const userMandatoryTopicsModel = new UserMandatoryTopicsModel(request.body);
	  const [userMandatoryTopics] = await userController.addOrUpdateMandatoryTopicsUser(userMandatoryTopicsModel);
      reply.send(userMandatoryTopics.toJSON());
    },
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
          type: "string",
        },
      },
      security: [{ oauth: [] }],
    },
    preHandler: GenericController.authentication,
    handler: async (request: FastifyRequestExt, reply: FastifyReply<ServerResponse>) => {
      const userSpecificTopics = await userController.getSpecificTopicsUser(request.query.userId);
      reply.send(userSpecificTopics.map((e) => e.toJSON()));
    },
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
          type: "string",
        },
      },
      security: [{ oauth: [] }],
    },
    preHandler: GenericController.authentication,
    handler: async (request: FastifyRequestExt, reply: FastifyReply<ServerResponse>) => {
      const userSpecificTopicsModel = new UserSpecificTopicsModel(request.body);
      const [userSpecificTopics] = await userController.addOrUpdateSpecificTopicsUser(userSpecificTopicsModel);
      reply.send(userSpecificTopics.toJSON());
    },
  },
  {
    method: "PATCH",
    url: "/api/user/specifictopics/:id",
    schema: {
      tags: ["user"],
      body: { ...userSpecificTopicsModelPatchSchema },
      params: { ...paramsIdSchema },
      response: {
        "200": { ...userSpecificTopicsModelSchema },
        "4xx": {
          type: "string",
        },
      },
      security: [{ oauth: [] }],
    },
    preHandler: GenericController.authentication,
    handler: async (request: FastifyRequestExt, reply: FastifyReply<ServerResponse>) => {
      const userSpecificTopicsModel = new UserSpecificTopicsModel(request.body);
      userSpecificTopicsModel.id = request.params.id;
      const userSpecificTopics = await userController.updateSpecificTopicsUser(userSpecificTopicsModel);
      if (userSpecificTopics) {
        reply.send(userSpecificTopics.toJSON());
      } else {
        reply.status(404).send(undefined);
      }
    },
  },
  {
    method: "DELETE",
    url: "/api/user/specifictopics/:id",
    schema: {
      tags: ["user"],
      body: { ...userSpecificTopicsModelDeleteSchema },
      params: { ...paramsIdSchema },
      response: {
        "204": { type: "boolean" },
        "4xx": {
          type: "string",
        },
      },
      security: [{ oauth: [] }],
    },
    preHandler: GenericController.authentication,
    handler: async (request: FastifyRequestExt, reply: FastifyReply<ServerResponse>) => {
      const userSpecificTopicsModel = new UserSpecificTopicsModel(request.body);
      userSpecificTopicsModel.id = request.params.id;
      const deleteResult = await userController.deleteSpecificTopicsUser(userSpecificTopicsModel);
      if (deleteResult === true) {
        reply.status(204).send(deleteResult);
      } else {
        reply.status(404).send(undefined);
      }
    },
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
          type: "string",
        },
      },
      security: [{ oauth: [] }],
    },
    preHandler: GenericController.authentication,
    handler: async (request: FastifyRequestExt, reply: FastifyReply<ServerResponse>) => {
      const userFeedback = await userController.getUserFeedback(request.query.userId);
      reply.send(userFeedback.map((e) => e.toJSON()));
    },
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
          type: "string",
        },
      },
      security: [{ oauth: [] }],
    },
    preHandler: GenericController.authentication,
    handler: async (request: FastifyRequestExt, reply: FastifyReply<ServerResponse>) => {
      const userFeedbackModel = new UserFeedbackModel(request.body);
      const [userFeedback] = await userController.addOrUpdateFeedbackUser(userFeedbackModel);
      reply.send(userFeedback.toJSON());
    },
  },
  {
    method: "GET",
    url: "/api/user/objectives",
    schema: {
      tags: ["user"],
      querystring: { userId: { type: "number" } },
      response: {
        "200": { type: "array", items: { ...userObjectiveModelSchema } },
        "4xx": {
          type: "string",
        },
      },
      security: [{ oauth: [] }],
    },
    preHandler: GenericController.authentication,
    handler: async (request: FastifyRequestExt, reply: FastifyReply<ServerResponse>) => {
      const userObjective = await userController.getUserObjectives(request.query.userId);
      reply.send(userObjective.map((e) => e.toJSON()));
    },
  },
  {
    method: "POST",
    url: "/api/user/objectives",
    schema: {
      tags: ["user"],
      body: { ...userObjectiveModelSchema },
      response: {
        "200": { ...userObjectiveModelSchema },
        "4xx": {
          type: "string",
        },
      },
      security: [{ oauth: [] }],
    },
    preHandler: GenericController.authentication,
    handler: async (request: FastifyRequestExt, reply: FastifyReply<ServerResponse>) => {
      const userObjectiveModel = new UserObjectivesModel(request.body);
      const [userObjective] = await userController.addOrUpdateObjectivesUser(userObjectiveModel);
      reply.send(userObjective.toJSON());
    },
  },
  {
    method: "DELETE",
    url: "/api/user/objectives/:id",
    schema: {
      tags: ["user"],
      params: { id: { type: "number" } },
      response: {
        "204": { type: "boolean" },
        "4xx": {
          type: "string",
        },
      },
      security: [{ oauth: [] }],
    },
    preHandler: GenericController.authentication,
    handler: async (request: FastifyRequestExt, reply: FastifyReply<ServerResponse>) => {
      const userObjectivesModel = new UserObjectivesModel(request.body);
      userObjectivesModel.id = request.params.id;
      const deleteResult = await userController.deleteObjectivesUser(userObjectivesModel);
      if (deleteResult === true) {
        reply.status(204).send(deleteResult);
      } else {
        reply.status(404).send(undefined);
      }
    },
  },
  {
    method: "GET",
    url: "/api/user/review",
    schema: {
      tags: ["user"],
      querystring: { userId: { type: "number" } },
      response: {
        "200": { type: "array", items: { ...userReviewModelSchema } },
        "4xx": {
          type: "string",
        },
      },
      security: [{ oauth: [] }],
    },
    preHandler: GenericController.authentication,
    handler: async (request: FastifyRequestExt, reply: FastifyReply<ServerResponse>) => {
      const userReview = await userController.getUserReview(request.query.userId);
      reply.send(userReview.map((e) => e.toJSON()));
    },
  },
  {
    method: "POST",
    url: "/api/user/review",
    schema: {
      tags: ["user"],
      body: { ...userReviewModelSchema },
      response: {
        "200": { ...userReviewModelSchema },
        "4xx": {
          type: "string",
        },
      },
      security: [{ oauth: [] }],
    },
    preHandler: GenericController.authentication,
    handler: async (request: FastifyRequestExt, reply: FastifyReply<ServerResponse>) => {
      const userReviewModel = new UserReviewModel(request.body);
      const [userReview] = await userController.addOrUpdateReviewUser(userReviewModel);
      reply.send(userReview.toJSON());
    },
  },
  {
    method: "GET",
    url: "/api/user/review/requiredactions",
    schema: {
      tags: ["user"],
      querystring: { userRequiredActionsId: { type: "number" } },
      response: {
        "200": { type: "array", items: { ...userRequiredActionsModelSchema } },
        "4xx": {
          type: "string",
        },
      },
      security: [{ oauth: [] }],
    },
    preHandler: GenericController.authentication,
    handler: async (request: FastifyRequestExt, reply: FastifyReply<ServerResponse>) => {
      const userRequiredActions = await userController.getUserRequiredActions(request.query.userRequiredActionsId);
      reply.send(userRequiredActions.map((e) => e.toJSON()));
    },
  },
  {
    method: "POST",
    url: "/api/user/review/requiredactions",
    schema: {
      tags: ["user"],
      body: { ...userRequiredActionsModelSchema },
      response: {
        "200": { ...userRequiredActionsModelSchema },
        "4xx": {
          type: "string",
        },
      },
      security: [{ oauth: [] }],
    },
    preHandler: GenericController.authentication,
    handler: async (request: FastifyRequestExt, reply: FastifyReply<ServerResponse>) => {
      const userRequiredActionsModel = new UserRequiredActionsModel(request.body);
      const [userRequiredActions] = await userController.addOrUpdateRequiredActionsUser(userRequiredActionsModel);
      reply.send(userRequiredActions.toJSON());
    },
  },
  {
    method: "DELETE",
    url: "/api/user/review/requiredactions/:id",
    schema: {
      tags: ["user"],
      params: { id: { type: "number" } },
      response: {
        "204": { type: "boolean" },
        "4xx": {
          type: "string",
        },
      },
      security: [{ oauth: [] }],
    },
    preHandler: GenericController.authentication,
    handler: async (request: FastifyRequestExt, reply: FastifyReply<ServerResponse>) => {
      const userRequiredActionsModel = new UserRequiredActionsModel(request.body);
      userRequiredActionsModel.id = request.params.id;
      const deleteResult = await userController.deleteRequiredActionsUser(userRequiredActionsModel);
      if (deleteResult === true) {
        reply.status(204).send(deleteResult);
      } else {
        reply.status(404).send(undefined);
      }
    },
  },
];

export default UsersControllerRoutes;
export { userController as UserController };
