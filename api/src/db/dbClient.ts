import { Sequelize } from "sequelize";
import { IDBConfig } from "../config";

class DBClient {
  private static sequelize: Sequelize;

  static instance(info: IDBConfig): Sequelize {
    if (!info) {
      throw new Error("DB «info» is not initialized!");
    }
    if (!DBClient.sequelize) {
      const connectionString: string = `${info.DB_DIALECT}://${info.DB_USERNAME}:${info.DB_PASSWORD}@${info.DB_SERVER}:${info.DB_PORT}/${info.DB_DATABASE}`;
      console.log(`Connecting to ... ${connectionString}`);
      DBClient.sequelize = new Sequelize(connectionString, { logging: console.log });
    }
    return DBClient.sequelize;
  }
}

export { DBClient };
