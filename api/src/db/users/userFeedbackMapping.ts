import { Model, DataTypes, ModelAttributes, InitOptions, SyncOptions } from "sequelize";
import { IUserFeedback, IUserFeedbackModel, UserFeedbackModel } from "../../models";
import { GenericMapping, GenericDatabase, User } from "..";

class UserFeedback extends GenericDatabase implements IUserFeedback {
  id!: number;
  feedback!: string;
  userId!: number;
  userType!: number;
  type!: number;
  period!: number;
  alteringUserId!: number;
}

class UserFeedbackMapping extends GenericMapping {
  constructor() {
    super();
  }

  initialize() {
    const modelAttributes: ModelAttributes = {
      feedback: {
        type: new DataTypes.STRING(1000),
        allowNull: false,
      },
      userType: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      period: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    };

    const modelOptions: InitOptions<Model> = {
      sequelize: this._sequelize,
    };

    UserFeedback.init(modelAttributes, modelOptions);
  }

  async sync(options?: SyncOptions) {
    return await UserFeedback.sync(options);
  }

  associations(): void {
    UserFeedback.belongsTo(User, {
      foreignKey: { name: "userId", field: "userId", allowNull: false },
      constraints: true,
    });
    UserFeedback.belongsTo(User, {
      foreignKey: { name: "alteringUserId", field: "alteringUserId", allowNull: false },
      constraints: true,
    });
  }

  async get(userId: number): Promise<UserFeedback[]> {
    return await UserFeedback.findAll({ where: { userId } });
  }

  async create(userFeedbackModel: IUserFeedbackModel): Promise<[UserFeedback, boolean]> {
    const where = super.createWhere(userFeedbackModel, [
      "id",
      "userId",
      "alteringUserId",
      "type",
      "period",
      "userType",
    ]);
    const [instance, wasCreated] = await super.genericCreate(UserFeedback, userFeedbackModel, where);
    return [<UserFeedback>instance, wasCreated];
  }
}

const userFeedbackMappingInstance: UserFeedbackMapping = new UserFeedbackMapping();
export { IUserFeedback, UserFeedback, userFeedbackMappingInstance as UserFeedbackMapping };
