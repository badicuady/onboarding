import { Model, DataTypes, ModelAttributes, InitOptions, BulkCreateOptions, SyncOptions } from "sequelize";
import { mandatoryTopicsLkMappingData } from "./mandatoryTopicsLkMappingData";
import { GenericMapping, UserMandatoryTopics, TimespanLk } from "..";
import { ResponsibleLk } from "./responsibleLkMapping";

export type MandatoryTopicsLkFilter = {
  forSpecialist?: boolean;
  forManager?: boolean;
};

interface IMandatoryTopicsLk {
  id?: number;
  name: string;
  description: string;
  tools: string;
  group: number;
  forManager: boolean;
  forSpecialist: boolean;
  timespanId: number;
  responsibleId: number;
}

class MandatoryTopicsLk extends Model implements IMandatoryTopicsLk {
  id!: number;
  name!: string;
  description!: string;
  tools!: string;
  group!: number;
  forManager!: boolean;
  forSpecialist!: boolean;
  timespanId!: number;
  responsibleId!: number;
}

class MandatoryTopicsLkMappings extends GenericMapping {
  constructor() {
    super();
  }

  initialize(): void {
    const modelAttributes: ModelAttributes = {
      name: {
        type: new DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: new DataTypes.STRING(500),
        allowNull: true,
      },
      tools: {
        type: new DataTypes.STRING(500),
        allowNull: true,
      },
      group: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 1,
      },
      forManager: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      forSpecialist: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    };

    const modelOptions: InitOptions<Model> = {
      sequelize: this._sequelize,
    };

    MandatoryTopicsLk.init(modelAttributes, modelOptions);
  }

  associations(): void {
    MandatoryTopicsLk.belongsTo(TimespanLk, {
      foreignKey: { name: "timespanId", field: "timespanId", allowNull: true },
      constraints: true,
    });
    MandatoryTopicsLk.belongsTo(ResponsibleLk, {
      foreignKey: { name: "responsibleId", field: "responsibleId", allowNull: true },
      constraints: true,
    });
    MandatoryTopicsLk.hasMany(UserMandatoryTopics, {
      foreignKey: { name: "mandatoryTopicsId", field: "mandatoryTopicsId", allowNull: true },
      constraints: true,
    });
  }

  async sync(options?: SyncOptions) {
    return await MandatoryTopicsLk.sync(options);
  }

  async prepareData(): Promise<IMandatoryTopicsLk[]> {
    const options: BulkCreateOptions = {
      updateOnDuplicate: [
        "name",
        "description",
        "tools",
        "group",
        "timespanId",
        "responsibleId",
        "forManager",
        "forSpecialist",
      ],
    };
    const records: IMandatoryTopicsLk[][] = mandatoryTopicsLkMappingData;
    const allRecords = records.reduce((all, e) => all.concat(e), []);
    allRecords.forEach((e, ndx) => (e.id = ndx + 1));

    return await MandatoryTopicsLk.bulkCreate(allRecords, options);
  }

  async list(filter: MandatoryTopicsLkFilter): Promise<IMandatoryTopicsLk[]> {
    const where: any = {};
    if (filter.forManager !== undefined && filter.forManager !== null && typeof(filter.forManager) === "boolean") {
      where.forManager = filter.forManager;
    }
    if (filter.forSpecialist !== undefined && filter.forSpecialist !== null && typeof(filter.forSpecialist) === "boolean") {
      where.forSpecialist = true;
    }
    return await MandatoryTopicsLk.findAll({
      where: where,
    });
  }
}

const mandatoryTopicsLkMappingsInstance: MandatoryTopicsLkMappings = new MandatoryTopicsLkMappings();
export { IMandatoryTopicsLk, MandatoryTopicsLk, mandatoryTopicsLkMappingsInstance as MandatoryTopicsLkMapping };
