import { IGenericModel, GenericModel } from "..";

export interface IUserObjective {
  id?: number;
  description?: string;
  deadline?: Date;
  responsible?: string;
  userId?: number;
}

export interface IUserObjectiveModel extends IGenericModel, IUserObjective {}

const UserObjectiveModel = () => {
  /**
   * Implementing the private pattern
   */
  const _privateFields: WeakMap<IUserObjective, IUserObjective> = new WeakMap();

  return class UserObjectiveModel extends GenericModel implements IUserObjectiveModel {
    constructor(userObjectiveModel: IUserObjective) {
      super();
      _privateFields.set(this, {});
      if (userObjectiveModel) {
        this.setup(userObjectiveModel);
      }
    }

    get description(): string | undefined {
      return _privateFields.get(this)?.description;
    }
    set description(description) {
      _privateFields.set(this, { ..._privateFields.get(this), description });
    }

    get deadline(): Date | undefined {
      return _privateFields.get(this)?.deadline;
    }
    set deadline(deadline) {
      _privateFields.set(this, { ..._privateFields.get(this), deadline });
    }

    get responsible(): string | undefined {
      return _privateFields.get(this)?.responsible;
    }
    set responsible(responsible) {
      _privateFields.set(this, { ..._privateFields.get(this), responsible });
    }

    get userId(): number | undefined {
      return _privateFields.get(this)?.userId;
    }
    set userId(userId) {
      _privateFields.set(this, { ..._privateFields.get(this), userId });
    }

    setup(model: IUserObjective) {
      if (!this.validate(model)) {
        throw new Error(`The model is not valid: «${model}»`);
      }
      _privateFields.set(this, {
        deadline: model.deadline || new Date(Date.now() + 30 * 24 * 3600 * 1000),
        description: model.description || "",
        responsible: model.responsible || "",
        userId: model.userId || 0
      });
    }
  };
};

export default UserObjectiveModel();
