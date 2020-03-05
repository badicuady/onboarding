declare module "fastify-oauth2" {
  import { FastifyInstance, FastifyRequest, FastifyReply, FastifyError } from "fastify";
  import { Server, IncomingMessage, ServerResponse } from "http";

  function oauthPlugin(fastify: FastifyInstance<Server, IncomingMessage, ServerResponse>, options: Record<string, any>, next: (err?: FastifyError) => void): void;

  namespace oauthPlugin {
    function startRedirectHandler(request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>): void;

    function getAccessTokenFromAuthorizationCodeFlow(request: FastifyRequest<IncomingMessage>, callback?: (err?: FastifyError) => void): void | Promise<Record<string, any>>;

    function getAccessTokenFromAuthorizationCodeFlowCallbacked(request: FastifyRequest<IncomingMessage>, callback: (err?: FastifyError) => void): Promise<Record<string, any>>;

    function getNewAccessTokenUsingRefreshToken(refreshToken: string, params: Record<string, any>, callback?: (err?: FastifyError) => void): any;

    function getNewAccessTokenUsingRefreshTokenCallbacked(refreshToken: string, params: Record<string, any>, callback: (err?: FastifyError) => void): any;

    type options = {
      name: string;
      scope: string[];
      credentials: Credentials;
      callbackUri: string;
      callbackUriParams: Record<string, any>;
      generateStateFunction: Function;
      checkStateFunction: Function;
      startRedirectPath: string;
    };

    type Configuration = {
      authorizeHost: string;
      authorizePath: string;
      tokenHost: string;
      tokenPath: string;
    };

    type Credentials = {
      client: {
        id: string;
        secret: string;
      };
      auth: {
        authorizeHost: string;
        authorizePath: string;
        tokenHost: string;
        tokenPath: string;
      };
    };

    const oauth2: any;

    const FACEBOOK_CONFIGURATION: Configuration;
    const GITHUB_CONFIGURATION: Configuration;
    const LINKEDIN_CONFIGURATION: Configuration;
    const GOOGLE_CONFIGURATION: Configuration;
    const MICROSOFT_CONFIGURATION: Configuration;
    const SPOTIFY_CONFIGURATION: Configuration;
    const VKONTAKTE_CONFIGURATION: Configuration;
  }

  export = oauthPlugin;
}
