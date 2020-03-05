import { Sequelize } from "sequelize";
import { app, argv } from "../config";
import DBClient from "./index";

class GenericMapping {
  protected _sequelize: Sequelize;

  constructor() {
    this._sequelize = DBClient.instance(app[argv.env].db);
    this.initialize();
    this.sync(true);
  }

  initialize() {
    throw new Error("Override method «initialize»!");
  }

  sync(force: boolean) {
    throw new Error("Override method «sync»!");
  }
}

export default GenericMapping;
