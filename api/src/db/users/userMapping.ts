import { Model, DataTypes, ModelAttributes, InitOptions, SyncOptions } from "sequelize";
import { UserRole, IUserModel, IUser } from "../../models";
import {
  GenericMapping,
  GenericDatabase,
  UserMandatoryTopics,
  UserSpecificTopics,
  UserFeedback,
  UserObjectives,
  UserReview,
  UserRequiredActions,
} from "..";
import { DepartmentLk } from "../lookups/departmentLkMapping";

class User extends GenericDatabase implements IUser {
  id!: number;
  firstName!: string;
  lastName!: string;
  role: UserRole = UserRole.Employee;
  userName!: string;
  startDate!: Date | null;
}

class UserMapping extends GenericMapping {
  constructor() {
    super();
  }

  initialize() {
    const modelAttributes: ModelAttributes = {
      firstName: {
        type: new DataTypes.STRING(100),
        allowNull: false,
      },
      lastName: {
        type: new DataTypes.STRING(100),
        allowNull: false,
      },
      role: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: UserRole.Employee,
      },
      userName: {
        type: new DataTypes.STRING(50),
        allowNull: false,
      },
      startDate: {
        type: new DataTypes.DATEONLY(),
        allowNull: true,
      },
    };

    const modelOptions: InitOptions<Model> = {
      sequelize: this._sequelize,
    };

    User.init(modelAttributes, modelOptions);
  }

  async sync(options?: SyncOptions) {
    return await User.sync(options);
  }

  associations(): void {
    User.hasMany(UserMandatoryTopics, {
      foreignKey: { name: "userId", field: "userId", allowNull: false },
      constraints: true,
    });
    User.hasMany(UserMandatoryTopics, {
      foreignKey: { name: "alteringUserId", field: "alteringUserId", allowNull: false },
      constraints: true,
    });

    User.hasMany(UserSpecificTopics, {
      foreignKey: { name: "userId", field: "userId", allowNull: false },
      constraints: true,
    });
    User.hasMany(UserSpecificTopics, {
      foreignKey: { name: "alteringUserId", field: "alteringUserId", allowNull: false },
      constraints: true,
    });

    User.hasMany(UserFeedback, {
      foreignKey: { name: "userId", field: "userId", allowNull: false },
      constraints: true,
    });
    User.hasMany(UserFeedback, {
      foreignKey: { name: "alteringUserId", field: "alteringUserId", allowNull: false },
      constraints: true,
    });

    User.hasMany(UserObjectives, {
      foreignKey: { name: "userId", field: "userId", allowNull: false },
      constraints: true,
    });
    User.hasMany(UserObjectives, {
      foreignKey: { name: "alteringUserId", field: "alteringUserId", allowNull: false },
      constraints: true,
    });

    User.hasMany(UserReview, {
      foreignKey: { name: "userId", field: "userId", allowNull: false },
      constraints: true,
    });
    User.hasMany(UserReview, {
      foreignKey: { name: "alteringUserId", field: "alteringUserId", allowNull: false },
      constraints: true,
    });

    User.hasMany(UserRequiredActions, {
      foreignKey: { name: "userId", field: "userId", allowNull: false },
      constraints: true,
    });
    User.hasMany(UserRequiredActions, {
      foreignKey: { name: "alteringUserId", field: "alteringUserId", allowNull: false },
      constraints: true,
    });

    User.belongsTo(DepartmentLk, {
      foreignKey: { name: "departmentId", field: "departmentId", allowNull: true },
      constraints: true,
    });
  }

  async createOrUpdate(userModel: IUserModel): Promise<[User, boolean]> {
    const columns = [];
    const possibleColumns = ["id", "userName"];
    for (let i = 0; i < possibleColumns.length; ++i) {
      const key = possibleColumns[i];
      if (userModel[key]) {
        columns.push(key);
      }
    }

    const where = super.createWhere(userModel, columns);
    const [instance, wasCreated] = await super.genericCreate(User, userModel, where);
    return [<User>instance, wasCreated];
  }

  async list(model: IUserModel, offset: number, limit: number) {
    offset = offset || 0;
    limit = limit || 10;
    return await User.findAll({
      offset,
      limit,
      where: { ...(model.toPlainObject && model.toPlainObject()) },
    });
  }

  async find(model: IUserModel) {
    return await this._findUser(model);
  }

  private async _findUser(model: IUserModel) {
    return await User.findOne({ where: { userName: model.userName || "" } });
  }
}

const userMappingInstance: UserMapping = new UserMapping();
export { IUser, User, userMappingInstance as UserMapping };
