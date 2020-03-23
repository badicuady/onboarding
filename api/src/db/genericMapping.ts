import { Sequelize, SyncOptions } from "sequelize";
import { app, argv } from "../config";
import { DBClient } from "./index";

class GenericMapping {
  protected _sequelize: Sequelize;

  constructor() {
    this._sequelize = DBClient.instance(app[argv.env].db);
    this.initialize();
  }

  initialize():void {
    throw new Error("Override method [initialize]!");
  }

  sync(options:SyncOptions | undefined):void {
    throw new Error("Override method [sync]!");
  }

  associations():void {
	throw new Error("Override method «associations»!");
  }
}

export default GenericMapping;
