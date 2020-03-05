import ActiveDirectoryAuthentication from "../core/authentication/ad";
import { FastifyRequestExt } from "fastify";

class GenericController {
  protected test: string;

  constructor() {
    this.test = "test";
  }

  public static validate(headers: any) {
    if (!headers || !headers.authorization) {
      throw new Error("This is call needs authorization. Please provide the «Authorization» header!");
    }
    const token = headers.authorization.replace("Bearer ", "");
    try {
      return ActiveDirectoryAuthentication._jwtService.decode(token);
    } catch (e) {
      console.error(e);
      throw new Error(`There was an error on decoding the token!`);
    }
  }

  public static async authentication(request: FastifyRequestExt) {
    request.token = GenericController.validate(request.headers);
  }
}

export default GenericController;
