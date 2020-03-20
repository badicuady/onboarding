import crypto from "crypto";
import { Model, DataTypes, CreateOptions, ModelAttributes, InitOptions } from "sequelize";

import { app, argv } from "../config";
import GenericMapping from "./genericMapping";
import { UserRole, IUserModel } from "../models/userModel";

interface IUser extends Model {
	id: number;
    firstName: string;
    lastName: string;
    role: UserRole;
    userName: string;
    password: string;
    domain: string;
    hash: string;
    generateHash(val: string | NodeJS.ArrayBufferView): string;
}

class UserMapping extends GenericMapping {
  private static User = class extends Model implements IUser {
    id!: number;
    firstName!: string;
    lastName!: string;
    role: UserRole = UserRole.Employee;
    userName!: string;
    password!: string;
    domain!: string;
    hash!: string;

    generateHash(val: string | NodeJS.ArrayBufferView) {
      return crypto
        .createHmac(app[argv.env].CRYPTO_ALGOTITHM, app[argv.env].CRYPTO_SECRET)
        .update(val)
        .digest("hex");
    }
  };

  constructor() {
    super();
  }

  initialize() {
    const UserRoleIntEnum: DataTypes.EnumDataTypeOptions<string> = {
      values: Object.keys(UserRole)
        .filter(k => Number.isInteger(+k))
        .map(k => parseInt(k, 10).toString())
    };

    const modelAttributes: ModelAttributes = {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      firstName: {
        type: new DataTypes.STRING(100),
        field: "first_name",
        allowNull: false
      },
      lastName: {
        type: new DataTypes.STRING(100),
        field: "last_name",
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM(UserRoleIntEnum),
        field: "role",
        allowNull: false,
        defaultValue: UserRole.Employee.toString()
      },
      userName: {
        type: new DataTypes.STRING(50),
        field: "user_name",
        allowNull: false
      },
      domain: {
        type: new DataTypes.STRING(50),
        field: "domain",
        allowNull: false
      },
      hash: {
        type: new DataTypes.STRING(100),
        field: "hash",
        allowNull: false
      }
    };

    const modelOptions: InitOptions<Model> = {
      sequelize: this._sequelize,
      hooks: {
        beforeCreate: this._updateHash,
        beforeUpdate: this._updateHash
      }
    };

    UserMapping.User.init(modelAttributes, modelOptions);
  }

  async sync(force: boolean = true) {
    return await UserMapping.User.sync({ force });
  }

  async create(userModel: IUserModel) {
    const searchUser = await this._findUser(userModel);
    if (searchUser) {
      throw new Error(`User «${userModel.userName}» allready exists!`);
    }
    return await UserMapping.User.create(userModel);
  }

  async list(offset: number, limit: number) {
    offset = offset || 0;
    limit = limit || 10;
    return await UserMapping.User.findAll({ offset, limit });
  }

  async find(model: any) {
    return await this._findUser(model);
  }

  private async _findUser(model: any) {
    return await UserMapping.User.findOne({ where: { userName: model.userName } });
  }

  private _updateHash(attributes: IUser, _: CreateOptions) {
    if (attributes.changed("password")) {
      attributes.hash = attributes.generateHash(attributes.password);
    }
  }
}

export default UserMapping;
