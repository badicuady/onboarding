import Extensions from "../../core/common/extensions";
import { Model, DataTypes, ModelAttributes, InitOptions, SyncOptions } from "sequelize";
import { GenericMapping, TimespanLk, ResponsibleLk, User } from "..";
import { IUserSpecificTopicsModel, IUserSpecificTopics } from "../../models";

class UserSpecificTopics extends Model implements IUserSpecificTopics {
  id!: number;
  specificTopicName!: string;
  specificTopicMaterials!: string;
  done!: boolean;
  type!: number;
}

class UserSpecificTopicsMapping extends GenericMapping {
  constructor() {
    super();
  }

  initialize() {
    const modelAttributes: ModelAttributes = {
      specificTopicName: {
        type: new DataTypes.STRING(100),
        allowNull: false,
      },
      specificTopicMaterials: {
        type: new DataTypes.STRING(200),
        allowNull: false,
      },
      done: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    };

    const modelOptions: InitOptions<Model> = {
      sequelize: this._sequelize,
    };

    UserSpecificTopics.init(modelAttributes, modelOptions);
  }

  associations(): void {
    UserSpecificTopics.belongsTo(User, {
      foreignKey: { name: "userId", field: "UserId", allowNull: false },
      constraints: true,
    });
    UserSpecificTopics.belongsTo(TimespanLk, {
      foreignKey: { name: "timespanId", field: "timespanId", allowNull: false },
      constraints: true,
    });
    UserSpecificTopics.belongsTo(ResponsibleLk, {
      foreignKey: { name: "responsibleId", field: "responsibleId", allowNull: false },
      constraints: true,
    });
  }

  async sync(options?: SyncOptions) {
    return await UserSpecificTopics.sync(options);
  }

  async get(userId: number): Promise<UserSpecificTopics[]> {
    return await UserSpecificTopics.findAll({ where: { userId: userId } });
  }

  async create(userSpecificTopicsModel: IUserSpecificTopicsModel): Promise<[UserSpecificTopics, boolean]> {
    const where = {
      id: userSpecificTopicsModel.id || 0,
      userId: userSpecificTopicsModel.userId || 0,
    };

    const [instance, wasCreated] = await super.genericCreate(UserSpecificTopics, userSpecificTopicsModel, where);
    return [<UserSpecificTopics>instance, wasCreated];
  }

  async update(userSpecificTopicsModel: IUserSpecificTopicsModel): Promise<UserSpecificTopics | null> {
	const where = super.createWhere(userSpecificTopicsModel, ["id", "userId"]);
    const instance = await UserSpecificTopics.findOne({ where });
    if (instance) {
	  Extensions.updateObjectWithModel(instance, userSpecificTopicsModel);
      instance.save();
      return instance;
    }
    return null;
  }

  async delete(userSpecificTopicsModel: IUserSpecificTopicsModel): Promise<boolean | null> {
    const where = {
      id: userSpecificTopicsModel.id || 0,
      userId: userSpecificTopicsModel.userId || 0,
    };
    const instance = await UserSpecificTopics.findOne({ where });
    if (instance) {
      await instance.destroy();
      return true;
    }
    return null;
  }
}

const userSpecificTopicsMappingInstance: UserSpecificTopicsMapping = new UserSpecificTopicsMapping();
export { IUserSpecificTopics, UserSpecificTopics, userSpecificTopicsMappingInstance as UserSpecificTopicsMapping };
