import { Sequelize } from "sequelize";
import { IDBConfig } from "../config";

class DBClient {
  private static sequelize: Sequelize;

  static instance(info: IDBConfig): Sequelize {
    if (!info) {
      throw new Error("DB «info» is not initialized!");
    }
    console.log(`Connecting to ... ${info.DB_DIALECT}://${info.DB_USERNAME}:${info.DB_PASSWORD}@${info.DB_SERVER}:${info.DB_PORT}/${info.DB_DATABASE}`);
    if (!DBClient.sequelize) {
	  DBClient.sequelize = new Sequelize(`${info.DB_DIALECT}://` + 
		  `${info.DB_USERNAME}:${info.DB_PASSWORD}@` + 
		  `${info.DB_SERVER}:${info.DB_PORT}/${info.DB_DATABASE}`);
    }
    return DBClient.sequelize;
  }
}

export default DBClient;
