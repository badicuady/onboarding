import * as fastifySwagger from 'fastify-swagger';
import * as fastifyOatuh2 from 'fastify-oauth2';
import { fastify, AppConfig, app, argv } from '../config';
import TestControllerRoutes from './testController';
import AuthControllerRoutes from './authController';
import UsersControllerRoutes from './usersController';

fastify.register(fastifySwagger.default, AppConfig.swaggerConfig());
fastify.register(fastifyOatuh2.default, 
	AppConfig.oauth2Config(app[argv.env].SERVER_HOST,
	app[argv.env].SERVER_PORT.toString(), 
	app[argv.env].SERVER_PROTOCOL));

TestControllerRoutes.forEach((route) => {
    fastify.route(route);
});

AuthControllerRoutes.forEach((route) => {
    fastify.route(route);
});

UsersControllerRoutes.forEach((route) => {
    fastify.route(route);
});

fastify.decorateRequest("token", null);

export default fastify;