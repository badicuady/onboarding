import _fastify from "fastify";
import * as fastifySwagger from "fastify-swagger";
import * as fastifyCors from "fastify-cors";
import { RouteOptions } from "fastify";

import { fastify, AppConfig } from "../config";
import TestControllerRoutes from "./testController";
import AuthControllerRoutes from "./authController";
import UsersControllerRoutes from "./usersController";
import MandatoryTopicsRoutes from "./mandatoryTopicsController";

fastify.register(fastifySwagger.default, AppConfig.swaggerConfig());
fastify.register(fastifyCors.default, AppConfig.corsConfig());

const addRoute = (route: RouteOptions) => {
  fastify.route(route);
};
[TestControllerRoutes, AuthControllerRoutes, UsersControllerRoutes, MandatoryTopicsRoutes].forEach(route => route.forEach(addRoute));

/**
 * Add decorator for request, needed to authentication
 */
fastify.decorateRequest("user", null);

export default fastify;
