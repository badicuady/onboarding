import { Model, DataTypes, ModelAttributes, InitOptions, SyncOptions } from "sequelize";
import { IUserObjective, IUserObjectiveModel } from "../../models";
import { GenericMapping, GenericDatabase, User } from "..";

class UserObjective extends GenericDatabase implements IUserObjective {
  id!: number;
  description!: string;
  deadline!: Date;
  responsible!: string;
  userId!: number;
}

class UserObjectiveMapping extends GenericMapping {
  constructor() {
    super();
  }

  initialize() {
    const modelAttributes: ModelAttributes = {
      description: {
        type: new DataTypes.STRING(500),
        allowNull: false
      },
      deadline: {
        type: DataTypes.DATE,
        allowNull: false
      },
      responsible: {
        type: new DataTypes.STRING(100),
        allowNull: false
      }
    };

    const modelOptions: InitOptions<Model> = {
      sequelize: this._sequelize
    };

    UserObjective.init(modelAttributes, modelOptions);
  }

  async sync(options?: SyncOptions) {
    return await UserObjective.sync(options);
  }

  associations(): void {
    UserObjective.belongsTo(User, {
      foreignKey: { name: "userId", field: "userId", allowNull: false },
      constraints: true
    });
  }

  async get(userId: number): Promise<UserObjective[]> {
    return await UserObjective.findAll({ where: { userId } });
  }

  async create(userObjectiveModel: IUserObjectiveModel): Promise<[UserObjective, boolean]> {
    const where = {
      id: userObjectiveModel.id || 0,
      userId: userObjectiveModel.userId || 0
    };
    const [instance, wasCreated] = await super.genericCreate(UserObjective, userObjectiveModel, where);
    return [<UserObjective>instance, wasCreated];
  }
}

const userObjectiveMappingInstance: UserObjectiveMapping = new UserObjectiveMapping();
export { IUserObjective, UserObjective, userObjectiveMappingInstance as UserObjectiveMapping };
