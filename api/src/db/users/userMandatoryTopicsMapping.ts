import { Model, DataTypes, ModelAttributes, InitOptions, SyncOptions } from "sequelize";
import { GenericMapping, MandatoryTopicsLk, User, GenericDatabase } from "..";
import { IUserMandatoryTopicsModel, IUserMandatoryTopics } from "../../models";

class UserMandatoryTopics extends GenericDatabase implements IUserMandatoryTopics {
  id!: number;
  done!: boolean;
}

class UserMandatoryTopicsMapping extends GenericMapping {
  constructor() {
    super();
  }

  initialize() {
    const modelAttributes: ModelAttributes = {
      done: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    };

    const modelOptions: InitOptions<Model> = {
      sequelize: this._sequelize,
    };

    UserMandatoryTopics.init(modelAttributes, modelOptions);
  }

  associations(): void {
    UserMandatoryTopics.belongsTo(MandatoryTopicsLk, {
      foreignKey: { name: "mandatoryTopicsId", field: "mandatoryTopicsId", allowNull: false },
      constraints: true,
    });
    UserMandatoryTopics.belongsTo(User, {
      foreignKey: { name: "userId", field: "userId", allowNull: false },
      constraints: true,
    });
    UserMandatoryTopics.belongsTo(User, {
      foreignKey: { name: "alteringUserId", field: "alteringUserId", allowNull: false },
      constraints: true,
    });
  }

  async sync(options?: SyncOptions) {
    return await UserMandatoryTopics.sync(options);
  }

  async create(userMandatoryTopicsModel: IUserMandatoryTopicsModel): Promise<[UserMandatoryTopics, boolean]> {
    const where = super.createWhere(userMandatoryTopicsModel, ["id", "userId", "alteringUserId", "mandatoryTopicsId"]);
    const [instance, wasCreated] = await super.genericCreate(UserMandatoryTopics, userMandatoryTopicsModel, where);
    return [<UserMandatoryTopics>instance, wasCreated];
  }

  async get(userId: number): Promise<UserMandatoryTopics[]> {
    return await UserMandatoryTopics.findAll({ where: { userId: userId, done: true } });
  }
}

const userMandatoryTopicsMappingsInstance: UserMandatoryTopicsMapping = new UserMandatoryTopicsMapping();
export { IUserMandatoryTopics, UserMandatoryTopics, userMandatoryTopicsMappingsInstance as UserMandatoryTopicsMapping };
