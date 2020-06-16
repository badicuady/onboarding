import { Model, DataTypes, ModelAttributes, InitOptions, SyncOptions } from "sequelize";
import { IUserRequiredActions, IUserRequiredActionsModel } from "../../models";
import { GenericMapping, GenericDatabase, User, UserReview } from "..";

class UserRequiredActions extends GenericDatabase implements IUserRequiredActions {
  id!: number;
  action!: string;
  date!: Date;
  userReviewId!: number;
  type!: number;
  alteringUserId!: number;
}

class UserRequiredActionsMapping extends GenericMapping {
  constructor() {
    super();
  }

  initialize() {
    const modelAttributes: ModelAttributes = {
      action: {
        type: new DataTypes.STRING(1000),
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    };

    const modelOptions: InitOptions<Model> = {
      sequelize: this._sequelize,
    };

    UserRequiredActions.init(modelAttributes, modelOptions);
  }

  async sync(options?: SyncOptions) {
    return await UserRequiredActions.sync(options);
  }

  associations(): void {
    UserRequiredActions.belongsTo(UserReview, {
      foreignKey: { name: "userRequiredActionsId", field: "userRequiredActionsId", allowNull: false },
      constraints: true,
    });
    UserRequiredActions.belongsTo(User, {
      foreignKey: { name: "alteringUserId", field: "alteringUserId", allowNull: false },
      constraints: true,
    });
    UserRequiredActions.belongsTo(User, {
      foreignKey: { name: "userId", field: "userId", allowNull: false },
      constraints: true,
    });
  }

  async get(userRequiredActionsId: number): Promise<UserRequiredActions[]> {
    return await UserRequiredActions.findAll({ where: { userRequiredActionsId } });
  }

  async create(userRequiredActionsModel: IUserRequiredActionsModel): Promise<[UserRequiredActions, boolean]> {
    const where = super.createWhere(userRequiredActionsModel, ["id", "action", "alteringUserId", "userId", "type", "period", "userRequiredActionsId"]);
    const [instance, wasCreated] = await super.genericCreate(UserRequiredActions, userRequiredActionsModel, where);
    return [<UserRequiredActions>instance, wasCreated];
  }

  async delete(userRequiredActionsModel: IUserRequiredActionsModel): Promise<boolean | null> {
    const where = {
      id: userRequiredActionsModel.id || 0
    };
    const instance = await UserRequiredActions.findOne({ where });
    if (instance) {
      await instance.destroy();
      return true;
    }
    return null;
  }
}

const userRequiredActionsMappingInstance: UserRequiredActionsMapping = new UserRequiredActionsMapping();
export { IUserRequiredActions, UserRequiredActions, userRequiredActionsMappingInstance as UserRequiredActionsMapping };
