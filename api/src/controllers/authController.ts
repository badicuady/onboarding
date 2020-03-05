import { ServerResponse } from "http";
import { FastifyReply, FastifyRequest, RouteOptions } from "fastify";
import axios from "axios";

import ActiveDirectoryAuthentication from "../core/authentication/ad";
import GenericController from "./genericController";
import { app, argv } from "../config";

class AuthController extends GenericController {
  constructor() {
    super();
  }

  async token(userName: string, password: string, domain: string): Promise<string> {
    const adAuth = new ActiveDirectoryAuthentication(userName, password, domain);
    const result = await adAuth.authenticate();
    return JSON.stringify(result);
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
        userName: { type: "string" },
        password: { type: "string" },
        domain: { type: "string" }
      },
      response: {
        "200": {
          type: "string"
        },
        "4xx": {
          type: "string"
        }
      }
    },
    handler: async (request: FastifyRequest, reply: FastifyReply<ServerResponse>) => {
      const token = await authController.token(request.body.userName, request.body.password, request.body.domain);
      reply.send(token);
    }
  },
  // callback
  {
    method: "GET",
    url: "/callback",
    schema: {
      hide: true // hide it from swagger
    },
    handler: async (request: FastifyRequest, reply: FastifyReply<ServerResponse>) => {
      const response = await axios.request({
        baseURL: "https://api.sample.ipsos.com/",
        method: "get",
        url: "/admin/UserInfo/a",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${request.query.access_token}`
        }
	  });
	  const token = ActiveDirectoryAuthentication._jwtService.sign(response.data, ActiveDirectoryAuthentication._jwtOptionsModel.toPlainObject());
	  const redirect:string = `${app[argv.env].SERVER_PROTOCOL}://${app[argv.env].SERVER_HOST}:${app[argv.env].SERVER_PORT.toString()}`+
	  	"/swagger/static/oauth2-redirect.html" +
	  	`?access_token=${encodeURIComponent(token)}`
	  reply.redirect(redirect);
    }
  }
];

export default AuthControllerRoutes;
