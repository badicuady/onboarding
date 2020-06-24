import { Model, BulkCreateOptions, SyncOptions, ModelAttributes, DataTypes, InitOptions } from "sequelize";
import { GenericMapping, GenericDatabase } from "..";
import { User } from "../users/userMapping";

interface IDepartmentLk {
  id?: number;
  name: string;
}

class DepartmentLk extends GenericDatabase implements IDepartmentLk {
  id!: number;
  name!: string;
}

class DepartmentLkMapping extends GenericMapping {
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
    };

    const modelOptions: InitOptions<Model> = {
      sequelize: this._sequelize,
    };

    DepartmentLk.init(modelAttributes, modelOptions);
  }

  associations(): void {
    DepartmentLk.hasMany(User, {
      foreignKey: { name: "departmentId", field: "departmentId", allowNull: true },
      constraints: true,
    });
  }

  async sync(options?: SyncOptions) {
    return await DepartmentLk.sync(options);
  }

  async prepareData(): Promise<IDepartmentLk[]> {
    const options: BulkCreateOptions = {
      updateOnDuplicate: ["name"],
    };
    const records: IDepartmentLk[] = [
      { name: "Global Scripting (EU)" },
      { name: "DP, Coding & DV" },
      { name: "Client Service & Quotation EU" },
      { name: "Field Coordination" },
      { name: "Development" },
      { name: "Global Scripting (NA)" },
      { name: "Project Management" },
      { name: "Global Panels" },
      { name: "Product Operations" },
      { name: "Competence" },
      { name: "Sampling" },
      { name: "Client Service & Quotation NA" },
      { name: "Knowledge Panel" },
      { name: "Client Service & Quotation" },
      { name: "Global QA & Support" },
      { name: "SMX" },
      { name: "Sample Supply" },
      { name: "Products & Platforms" },
      { name: "ASI Research" },
      { name: "Total Ops. Products" },
      { name: "Custom Panels" },
      { name: "Production Support" },
      { name: "NCBS" },
      { name: "Vendor Management" },
      { name: "Global" },
      { name: "Communication" },
    ];
    records.forEach((e, ndx) => (e.id = ndx + 1));
    return await DepartmentLk.bulkCreate(records, options);
  }

  async list(): Promise<IDepartmentLk[]> {
    return await DepartmentLk.findAll({ order: ["name"] });
  }
}

const departmentLkMappingInstance: DepartmentLkMapping = new DepartmentLkMapping();
export { IDepartmentLk, DepartmentLk, departmentLkMappingInstance as DepartmentLkMapping };
