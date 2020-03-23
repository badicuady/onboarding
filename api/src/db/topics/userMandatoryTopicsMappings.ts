import { Model, DataTypes, ModelAttributes, InitOptions, SyncOptions } from "sequelize";
import GenericMapping from "../genericMapping";
import { MandatoryTopicsLk, IMandatoryTopicsLk } from "./mandatoryTopicsLkMappings";
import { User } from "../userMapping";

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

  async create(userMandatoryTopics: IUserMandatoryTopics): Promise<[UserMandatoryTopics, boolean]> {
    const where = {
      mandatoryTopicsId: userMandatoryTopics.mandatoryTopicsId || 0,
      userId: userMandatoryTopics.userId || 0
    };

    let instanceUserMandatoryTopics, wasCreated;
    [instanceUserMandatoryTopics, wasCreated] = await UserMandatoryTopics.findOrCreate({
      where,
      defaults: userMandatoryTopics
    });
    if (!wasCreated) {
      const [rowsUpdated, allInstancesUserMandatoryTopics] = await UserMandatoryTopics.update(userMandatoryTopics, {
        where,
        limit: 1
      });
      instanceUserMandatoryTopics =
        rowsUpdated === 1 && allInstancesUserMandatoryTopics.length
          ? allInstancesUserMandatoryTopics[0]
          : instanceUserMandatoryTopics;
    }
    return [instanceUserMandatoryTopics, wasCreated];
  }
}

const userMandatoryTopicsMappingsInstance: UserMandatoryTopicsMappings = new UserMandatoryTopicsMappings();
export {
  IUserMandatoryTopics,
  UserMandatoryTopics,
  userMandatoryTopicsMappingsInstance as UserMandatoryTopicsMappings
};
