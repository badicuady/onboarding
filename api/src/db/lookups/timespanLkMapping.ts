import { Model, BulkCreateOptions, SyncOptions, ModelAttributes, DataTypes, InitOptions } from "sequelize";
import { GenericMapping, UserSpecificTopics } from "..";
import { MandatoryTopicsLk } from "./mandatoryTopicsLkMapping";

interface ITimespanLk {
  id?: number;
  name: string;
  description: string;
  value: number;
}

class TimespanLk extends Model<any, any> implements ITimespanLk {
  id!: number;
  name!: string;
  description!: string;
  value!: number;
}

class TimespanLkMapping extends GenericMapping {
  constructor() {
    super();
  }

  initialize(): void {
    const modelAttributes: ModelAttributes = {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrementIdentity: true,
        primaryKey: true,
        unique: true,
      },
      name: {
        type: new DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: new DataTypes.STRING(200),
        allowNull: true,
      },
      value: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    };

    const modelOptions: InitOptions<Model> = {
      sequelize: this._sequelize,
    };

    TimespanLk.init(modelAttributes, modelOptions);
  }

  associations(): void {
    TimespanLk.hasMany(MandatoryTopicsLk, {
      foreignKey: { name: "timespanId", field: "timespanId", allowNull: true },
      constraints: true,
    });
    TimespanLk.hasMany(UserSpecificTopics, {
      foreignKey: { name: "timespanId", field: "timespanId", allowNull: true },
      constraints: true,
    });
  }

  async sync(options?: SyncOptions) {
    return await TimespanLk.sync(options);
  }

  async prepareData(): Promise<ITimespanLk[]> {
    const options: BulkCreateOptions = {
      updateOnDuplicate: ["name", "description", "value"],
    };
    const records: ITimespanLk[] = [
      { name: "firstDay", description: "First day", value: 24 * 60 * 60 * 1000 },
      { name: "firstThreeDays", description: "First three days", value: 3 * 24 * 60 * 60 * 1000 },
      { name: "firstWeek", description: "First week", value: 7 * 24 * 60 * 60 * 1000 },
      { name: "firstTwoWeeks", description: "First two weeks", value: 2 * 7 * 24 * 60 * 60 * 1000 },
      { name: "firstMonth", description: "First month", value: 4 * 7 * 24 * 60 * 60 * 1000 },
      { name: "firstTwoMonths", description: "First two months", value: 2 * 4 * 7 * 24 * 60 * 60 * 1000 },
      { name: "firstThreeMonths", description: "First three months", value: 3 * 4 * 7 * 24 * 60 * 60 * 1000 },
      { name: "firstSixMonths", description: "First six months", value: 6 * 4 * 7 * 24 * 60 * 60 * 1000 },
    ];
    records.forEach((e, ndx) => (e.id = ndx + 1));
    return await TimespanLk.bulkCreate(records, options);
  }

  async list(): Promise<ITimespanLk[]> {
    return await TimespanLk.findAll({ order: ["name"] });
  }
}

const timespanLkMappingInstance: TimespanLkMapping = new TimespanLkMapping();
export { ITimespanLk, TimespanLk, timespanLkMappingInstance as TimespanLkMapping };
