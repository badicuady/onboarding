import { Model, DataTypes, ModelAttributes, InitOptions, SyncOptions } from "sequelize";
import { IUserObjectives, IUserObjectivesModel } from "../../models";
import { GenericMapping, GenericDatabase, User } from "..";

class UserObjectives extends GenericDatabase implements IUserObjectives {
  id!: number;
  description!: string;
  deadline!: Date;
  responsible!: string;
  type!: number;
  userId!: number;
}

class UserObjectivesMapping extends GenericMapping {
  constructor() {
    super();
  }

  initialize() {
    const modelAttributes: ModelAttributes = {
      description: {
        type: new DataTypes.STRING(500),
        allowNull: false,
      },
      deadline: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      responsible: {
        type: new DataTypes.STRING(100),
        allowNull: false,
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

    UserObjectives.init(modelAttributes, modelOptions);
  }

  async sync(options?: SyncOptions) {
    return await UserObjectives.sync(options);
  }

  associations(): void {
    UserObjectives.belongsTo(User, {
      foreignKey: { name: "userId", field: "userId", allowNull: false },
      constraints: true,
    });
    UserObjectives.belongsTo(User, {
      foreignKey: { name: "alteringUserId", field: "alteringUserId", allowNull: false },
      constraints: true,
    });
  }

  async get(userId: number): Promise<UserObjectives[]> {
    return await UserObjectives.findAll({ where: { userId } });
  }

  async create(userObjectivesModel: IUserObjectivesModel): Promise<[UserObjectives, boolean]> {
	const where = super.createWhere(userObjectivesModel, ["id", "userId", "alteringUserId"]);
    const [instance, wasCreated] = await super.genericCreate(UserObjectives, userObjectivesModel, where);
    return [<UserObjectives>instance, wasCreated];
  }

  async delete(userObjectivesModel: IUserObjectivesModel): Promise<boolean | null> {
    const where = super.createWhere(userObjectivesModel, ["id"]);
    const instance = await UserObjectives.findOne({ where });
    if (instance) {
      await instance.destroy();
      return true;
    }
    return null;
  }
}

const userObjectiveMappingInstance: UserObjectivesMapping = new UserObjectivesMapping();
export { IUserObjectives, UserObjectives, userObjectiveMappingInstance as UserObjectivesMapping };
