import { app, argv, fastify } from "./index";
import fastifyCors from 'fastify-cors';

class AppConfig {
  static swaggerConfig() {
    return {
      routePrefix: "/swagger",
      swagger: {
        info: {
          title: "OnBoarding API Core",
          description: "testing the fastify swagger api",
          version: "0.1.0"
        },
        externalDocs: {
          url: "https://swagger.io",
          description: "Find more info here"
        },
        host: `${app[argv.env].SERVER_HOST}:${app[argv.env].SERVER_PORT}`,
        schemes: ["http"],
        consumes: ["application/json"],
        produces: ["application/json"],
        tags: [
          { name: "test", description: "Methods used only for DEMO purposes" },
          { name: "user", description: "Methods used for user endpoints" }
        ],
        securityDefinitions: {
          oauth: {
            type: "oauth2",
            authorizationUrl: `http://web.onboarding.com:4123/login`,
            flow: "implicit"
          }
        }
      },
      exposeRoute: true
    };
  }

  static corsConfig() {
	  return {
		"origin": "*",
		"methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"]
	  }
  }
}

export default AppConfig;
