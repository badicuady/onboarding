import { ServerResponse } from "http";
import ActiveDirectoryAuthentication from "../core/authentication/ad";
import { FastifyRequestExt, FastifyReply } from "fastify";

export interface IGenericController<> {
  makeAssociations(): void;
  doSync(): Promise<void>;
  postSyncHook(): Promise<any> | undefined;
}

abstract class GenericController implements IGenericController {
  protected test: string;

  constructor() {
    this.test = "test";
  }

  // do not mark this as abstract; it should be virtual and not called when not needed; but when needed is should alert the user
  makeAssociations(): void { throw new Error("Override method [makeAssociations]!"); }

  // do not mark this as abstract; it should be virtual and not called when not needed; but when needed is should alert the user
  async doSync(): Promise<void> { throw new Error("Override method [doSync]"); }

  // this should be virtual; TS does not know about virtual
  async postSyncHook():Promise<void> { return undefined; }

  static validate(headers: any): null | { [key: string]: any } | string {
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

  static async authentication(request: FastifyRequestExt, response: FastifyReply<ServerResponse>) {
    try {
      request.user = GenericController.validate(request.headers);
    } catch (err) {
      response.status(401).send(err);
    }
  }
}

export default GenericController;
