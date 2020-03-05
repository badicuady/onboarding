import crypto from "crypto";
import { Model, DataTypes, CreateOptions, ModelAttributes, InitOptions } from "sequelize";

import { app, argv } from "../config";
import GenericMapping from "./genericMapping";
import { UserRole } from "../models/userModel";

class User extends Model {
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
}

class UserMapping extends GenericMapping {
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

    User.init(modelAttributes, modelOptions);
  }

  async sync(force: boolean = true) {
    return await User.sync({ force });
  }

  async create(userModel: any) {
    const searchUser = await this._findUser(userModel);
    if (searchUser) {
      throw new Error(`User «${userModel.userName}» allready exists!`);
    }
    return await User.create(userModel);
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

  private _updateHash(attributes: User, _: CreateOptions) {
    if (attributes.changed("password")) {
      attributes.hash = attributes.generateHash(attributes.password);
    }
  }
}

export default UserMapping;
