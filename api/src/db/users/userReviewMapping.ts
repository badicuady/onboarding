import { Model, DataTypes, ModelAttributes, InitOptions, SyncOptions } from "sequelize";
import { IUserReview, IUserReviewModel, UserRequiredActionsModel } from "../../models";
import { GenericMapping, GenericDatabase, User, UserRequiredActions } from "..";

class UserReview extends GenericDatabase implements IUserReview {
  id!: number;
  date!: Date;
  performance!: string;
  concerns!: string;
  summary!: string;
  userId!: number;
  alteringUserId!: number;
  objectivesMet!: boolean;
  trainingsMet!: boolean;
  period!: number;
}

class UserReviewMapping extends GenericMapping {
  constructor() {
    super();
  }

  initialize() {
    const modelAttributes: ModelAttributes = {
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      performance: {
        type: new DataTypes.STRING(1000),
        allowNull: true,
      },
      concerns: {
        type: new DataTypes.STRING(1000),
        allowNull: true,
      },
      summary: {
        type: new DataTypes.STRING(1000),
        allowNull: true,
      },
      objectivesMet: {
        type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: true,
      },
      trainingsMet: {
        type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: true,
      },
      period: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    };

    const modelOptions: InitOptions<Model> = {
      sequelize: this._sequelize,
    };

    UserReview.init(modelAttributes, modelOptions);
  }

  async sync(options?: SyncOptions) {
    return await UserReview.sync(options);
  }

  associations(): void {
    UserReview.belongsTo(User, {
      foreignKey: { name: "userId", field: "userId", allowNull: false },
      constraints: true,
    });
    UserReview.belongsTo(User, {
      foreignKey: { name: "alteringUserId", field: "alteringUserId", allowNull: false },
      constraints: true,
    });
    UserReview.hasMany(UserRequiredActions, {
      foreignKey: { name: "userRequiredActionsId", field: "userRequiredActionsId", allowNull: true },
      constraints: true,
    });
  }

  async get(userId: number): Promise<UserReview[]> {
    return await UserReview.findAll({ where: { userId } });
  }

  async create(userObjectiveModel: IUserReviewModel): Promise<[UserReview, boolean]> {
    const where = super.createWhere(userObjectiveModel, ["id", "userId", "period"]);
    const [instance, wasCreated] = await super.genericCreate(UserReview, userObjectiveModel, where);
    return [<UserReview>instance, wasCreated];
  }
}

const userReviewMappingInstance: UserReviewMapping = new UserReviewMapping();
export { IUserReview, UserReview, userReviewMappingInstance as UserReviewMapping };
