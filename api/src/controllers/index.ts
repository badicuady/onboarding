import * as fastifySwagger from "fastify-swagger";
import * as fastifyCors from "fastify-cors";
import * as fastifyTimeout from "fastify-server-timeout";

import { RouteOptions } from "fastify";

import { fastify, AppConfig } from "../config";
import TestControllerRoutes from "./testController";
import AuthControllerRoutes from "./authController";
import UsersControllerRoutes from "./usersController";
import DepartmentsControllerRoutes from "./departmentsController";
import MandatoryTopicsRoutes from "./mandatoryTopicsController";
import TimespansControllerRoutes from "./timespansController";
import ResponsiblesControllerRoutes from "./responsiblesController";

fastify.register(fastifySwagger.default, AppConfig.swaggerConfig());
fastify.register(fastifyCors.default, AppConfig.corsConfig());
fastify.register(fastifyTimeout.default, { serverTimeout: 1000 });

const addRoute = (route: RouteOptions) => {
  fastify.route(route);
};
[
  TestControllerRoutes,
  AuthControllerRoutes,
  UsersControllerRoutes,
  DepartmentsControllerRoutes,
  MandatoryTopicsRoutes,
  TimespansControllerRoutes,
  ResponsiblesControllerRoutes
].forEach(route => route.forEach(addRoute));

/**
 * Add decorator for request, needed to authentication
 */
fastify.decorateRequest("user", null);

export default fastify;
