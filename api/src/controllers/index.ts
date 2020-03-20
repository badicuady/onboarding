import * as fastifySwagger from 'fastify-swagger';
import * as fastifyOatuh2 from 'fastify-oauth2';
import * as fastifyCors from 'fastify-cors';

import { fastify, AppConfig, app, argv } from '../config';
import TestControllerRoutes from './testController';
import AuthControllerRoutes from './authController';
import UsersControllerRoutes from './usersController';

fastify.register(fastifySwagger.default, AppConfig.swaggerConfig());
fastify.register(fastifyCors.default, AppConfig.corsConfig());

//*
TestControllerRoutes.forEach((route) => {
    fastify.route(route);
});

AuthControllerRoutes.forEach((route) => {
    fastify.route(route);
});

UsersControllerRoutes.forEach((route) => {
    fastify.route(route);
});
//*/

fastify.decorateRequest("user", null);

export default fastify;
