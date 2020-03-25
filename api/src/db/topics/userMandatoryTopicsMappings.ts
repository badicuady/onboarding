import { Model, DataTypes, ModelAttributes, InitOptions, SyncOptions } from "sequelize";
import GenericMapping from "../genericMapping";
import { MandatoryTopicsLk } from "./mandatoryTopicsLkMappings";
import { User } from "../userMapping";
import { IUserMandatoryTopicsModel } from "../../models/topics/userMandatoryTopicsModel";
import { IGenericModel } from "../../models/genericModel";

interface IUserMandatoryTopics extends Model {
  id?: number;
  done: boolean;
  mandatoryTopicsId?: number;
  userId?: number;
}

class UserMandatoryTopics extends Model implements IUserMandatoryTopics {
  id!: number;
  done!: boolean;
}

class UserMandatoryTopicsMappings extends GenericMapping {
  constructor() {
    super();
  }

  initialize() {
    const modelAttributes: ModelAttributes = {
      done: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    };

    const modelOptions: InitOptions<Model> = {
      sequelize: this._sequelize
    };

    UserMandatoryTopics.init(modelAttributes, modelOptions);
  }

  associations(): void {
    UserMandatoryTopics.belongsTo(MandatoryTopicsLk, {
      foreignKey: { name: "mandatoryTopicsId", field: "mandatoryTopicsId", allowNull: false },
      constraints: true
    });
    UserMandatoryTopics.belongsTo(User, {
      foreignKey: { name: "userId", field: "userId", allowNull: false },
      constraints: true
    });
  }

  async sync(options?: SyncOptions) {
    return await UserMandatoryTopics.sync(options);
  }

  async create(userMandatoryTopicsModel: IUserMandatoryTopicsModel): Promise<[UserMandatoryTopics, boolean]> {
    const plainObjectModel = userMandatoryTopicsModel.toPlainObject && userMandatoryTopicsModel.toPlainObject();
    const where = {
      mandatoryTopicsId: plainObjectModel.mandatoryTopicsId || 0,
      userId: plainObjectModel.userId || 0
    };

    let instanceUserMandatoryTopics, wasCreated;
    [instanceUserMandatoryTopics, wasCreated] = await UserMandatoryTopics.findOrCreate({
      where,
      defaults: plainObjectModel
    });
    if (!wasCreated) {
      const [rowsUpdated, allInstancesUserMandatoryTopics] = await UserMandatoryTopics.update(plainObjectModel, {
        where,
		limit: 1,
		returning: true
      });
      instanceUserMandatoryTopics =
        rowsUpdated === 1 && allInstancesUserMandatoryTopics && allInstancesUserMandatoryTopics.length
          ? allInstancesUserMandatoryTopics[0]
          : instanceUserMandatoryTopics;
    }
    return [instanceUserMandatoryTopics, wasCreated];
  }

  async get(userId: number): Promise<UserMandatoryTopics[]> {
    return await UserMandatoryTopics.findAll({ where: { userId: userId, done: true } });
  }
}

const userMandatoryTopicsMappingsInstance: UserMandatoryTopicsMappings = new UserMandatoryTopicsMappings();
export {
  IUserMandatoryTopics,
  UserMandatoryTopics,
  userMandatoryTopicsMappingsInstance as UserMandatoryTopicsMappings
};
