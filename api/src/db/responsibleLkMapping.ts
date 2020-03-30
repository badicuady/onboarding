import { Model, BulkCreateOptions, SyncOptions, ModelAttributes, DataTypes, InitOptions } from "sequelize";
import { GenericMapping, UserSpecificTopics } from "./";

interface IResponsibleLk {
  id?: number;
  name: string;
  description: string;
}

class ResponsibleLk extends Model<any, any> implements IResponsibleLk {
  id!: number;
  name!: string;
  description!: string;
}

class ResponsibleLkMapping extends GenericMapping {
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
        unique: true
      },
      name: {
        type: new DataTypes.STRING(100),
        allowNull: false
      },
      description: {
        type: new DataTypes.STRING(200),
        allowNull: true
      }
    };

    const modelOptions: InitOptions<Model> = {
      sequelize: this._sequelize
    };

    ResponsibleLk.init(modelAttributes, modelOptions);
  }

  associations(): void {
    ResponsibleLk.hasMany(UserSpecificTopics, {
      foreignKey: { name: "responsibleId", field: "responsibleId", allowNull: false },
      constraints: true
    });
  }

  async sync(options?: SyncOptions) {
    return await ResponsibleLk.sync(options);
  }

  async prepareData(): Promise<IResponsibleLk[]> {
    const options: BulkCreateOptions = {
      ignoreDuplicates: true
    };
    const records: IResponsibleLk[] = [
		{ name: "administrativeOffice", description: "Administrative Office" },
		{ name: "lineManager", description: "Line Manager" },
		{ name: "ldSpecialist", description: "LD Specialist" },
		{ name: "hrGeneralist", description: "HR Generalist" },
		{ name: "hrAdmin", description: "HR Admin" },
		{ name: "qualityTeam", description: "Quality Team" },
		{ name: "dpoRomania", description: "DPO Romania" },
		{ name: "lineManagerOrLDSpecialist", description: "Line Manager / LD Specialist" }
    ];
    records.forEach((e, ndx) => (e.id = ndx + 1));
    return await ResponsibleLk.bulkCreate(records, options);
  }

  async list(): Promise<IResponsibleLk[]> {
    return await ResponsibleLk.findAll({ order: ["name"] });
  }
}

const responsibleLkMappingInstance: ResponsibleLkMapping = new ResponsibleLkMapping();
export { IResponsibleLk, ResponsibleLk, responsibleLkMappingInstance as ResponsibleLkMapping };
