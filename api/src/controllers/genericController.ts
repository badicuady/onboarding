import { ServerResponse } from "http";
import ActiveDirectoryAuthentication from "../core/authentication/ad";
import { FastifyRequestExt, FastifyReply } from "fastify";

class GenericController {
  protected test: string;

  constructor() {
    this.test = "test";
  }

  public static validate(headers: any) {
    if (!headers || !headers.authorization) {
      throw new Error("This is call needs authorization. Please provide the [Authorization] header!");
    }
    const token = headers.authorization.replace("Bearer ", "");
    try {
      return ActiveDirectoryAuthentication._jwtService.decode(token);
    } catch (e) {
      console.error(e);
      throw new Error(`There was an error on decoding the token!`);
    }
  }

  public static async authentication(request: FastifyRequestExt, response: FastifyReply<ServerResponse>) {
	try {
	  request.user = GenericController.validate(request.headers);
	} catch (err) {
	  response.status(401).send(err);
	}
  }
}

export default GenericController;
