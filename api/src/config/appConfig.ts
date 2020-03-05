import { app, argv } from "./index";

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
            authorizationUrl: `http://${app[argv.env].SERVER_HOST}:${app[argv.env].SERVER_PORT}/login`,
            flow: "implicit"
          }
        }
      },
      exposeRoute: true
    };
  }

  static oauth2Config(host: string, port: string, protocol: string) {
    return {
      name: "ipsosOauth2",
      credentials: {
        client: {
          id: "unique_id_for_app",
          secret: "unique_secret_for_app"
        },
        auth: {
          authorizeHost: "https://sample.ipsos.com",
          authorizePath: "/#/login",
          tokenHost: "https://api.sample.ipsos.com",
          tokenPath: "/token"
        }
      },
	  startRedirectPath: "/login",
	  // callbackUri: `${protocol || "http"}://${host || "localhost"}:${port || "3000"}/swagger/static/oauth2-redirect.html`
	  callbackUri: `${protocol || "http"}://${host || "localhost"}:${port || "3000"}/callback`
    };
  }
}

export default AppConfig;
