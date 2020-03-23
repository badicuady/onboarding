import crypto from "crypto";
import { Model, DataTypes, CreateOptions, ModelAttributes, InitOptions, SyncOptions } from "sequelize";

import { app, argv } from "../config";
import GenericMapping from "./genericMapping";
import { UserRole, IUserModel } from "../models/userModel";
import { UserMandatoryTopics } from "./topics/userMandatoryTopicsMappings";

interface IUser extends Model {
  id?: number;
  firstName: string;
  lastName: string;
  role: UserRole;
  userName: string;
}

class User extends Model<any, any> implements IUser {
  id!: number;
  firstName!: string;
  lastName!: string;
  role: UserRole = UserRole.Employee;
  userName!: string;
}

class UserMapping extends GenericMapping {
  constructor() {
    super();
  }

  initialize() {
    const modelAttributes: ModelAttributes = {
      firstName: {
        type: new DataTypes.STRING(100),
        allowNull: false
      },
      lastName: {
        type: new DataTypes.STRING(100),
        allowNull: false
      },
      role: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: UserRole.Employee
      },
      userName: {
        type: new DataTypes.STRING(50),
        allowNull: false
      }
    };

    const modelOptions: InitOptions<Model> = {
      sequelize: this._sequelize
    };

    User.init(modelAttributes, modelOptions);
  }

  async sync(options?: SyncOptions) {
    return await User.sync();
  }

  associations(): void {
    User.hasMany(UserMandatoryTopics, {
      foreignKey: { name: "userId", field: "userId", allowNull: false },
      constraints: true
    });
  }

  async createOrUpdate(userModel: IUserModel) {
    return await User.findOrCreate({
      where: {
        userName: userModel.userName || ""
      },
      defaults: userModel
    });
  }

  async list(offset: number, limit: number) {
    offset = offset || 0;
    limit = limit || 10;
    return await User.findAll({ offset, limit });
  }

  async find(model: any) {
    return await this._findUser(model);
  }

  private async _findUser(model: any) {
    return await User.findOne({ where: { userName: model.userName } });
  }
}

const userMappingInstance: UserMapping = new UserMapping();
export { IUser, User, userMappingInstance as UserMapping };
