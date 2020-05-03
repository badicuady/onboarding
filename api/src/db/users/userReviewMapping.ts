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
}

class UserReviewMapping extends GenericMapping {
  constructor() {
    super();
  }

  initialize() {
    const modelAttributes: ModelAttributes = {
      date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      performance: {
        type: new DataTypes.STRING(1000),
        allowNull: false
      },
      concerns: {
        type: new DataTypes.STRING(1000),
        allowNull: false
      },
      summary: {
        type: new DataTypes.STRING(1000),
        allowNull: false
      },
      objectivesMet: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      trainingsMet: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      }
    };

    const modelOptions: InitOptions<Model> = {
      sequelize: this._sequelize
    };

    UserReview.init(modelAttributes, modelOptions);
  }

  async sync(options?: SyncOptions) {
    return await UserReview.sync(options);
  }

  associations(): void {
    UserReview.belongsTo(User, {
      foreignKey: { name: "userId", field: "userId", allowNull: false },
      constraints: true
    });
    UserReview.belongsTo(User, {
      foreignKey: { name: "alteringUserId", field: "alteringUserId", allowNull: false },
      constraints: true
	});
	UserReview.hasMany(UserRequiredActions, {
		foreignKey: { name: "userRequiredActionsId", field: "userRequiredActionsId", allowNull: false },
		constraints: true
	  });
  }

  async get(userId: number): Promise<UserReview[]> {
    return await UserReview.findAll({ where: { userId } });
  }

  async create(userObjectiveModel: IUserReviewModel): Promise<[UserReview, boolean]> {
    const where = {
      id: userObjectiveModel.id || 0,
      userId: userObjectiveModel.userId || 0
    };
    const [instance, wasCreated] = await super.genericCreate(UserReview, userObjectiveModel, where);
    return [<UserReview>instance, wasCreated];
  }
}

const userReviewMappingInstance: UserReviewMapping = new UserReviewMapping();
export { IUserReview, UserReview, userReviewMappingInstance as UserReviewMapping };
