import { Sequelize } from "sequelize";
import { IDBConfig } from "../config";

class DBClient {
  private static sequelize: Sequelize;

  static instance(info: IDBConfig | null = null): Sequelize {
    if (!DBClient.sequelize) {
      if (!info) {
        throw new Error("DB «info» is not initialized!");
      }
      if (!DBClient.sequelize) {
        const connectionString: string = `${info.DB_DIALECT}://${info.DB_USERNAME}:${info.DB_PASSWORD}@${info.DB_SERVER}:${info.DB_PORT}/${info.DB_DATABASE}`;
        console.log(`Connecting to ... ${connectionString}`);
        DBClient.sequelize = new Sequelize(connectionString, { logging: console.log });
      }
    }
    return DBClient.sequelize;
  }

  static async test(): Promise<void> {
    try {
	  console.log("Testing connection to the database...");
	  const seq = DBClient.instance();
      await DBClient.instance().authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
	}
	console.log("CEVA!");
  }
}

export { DBClient };
