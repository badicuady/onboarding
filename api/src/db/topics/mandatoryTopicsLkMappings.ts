import { Model, DataTypes, ModelAttributes, InitOptions, BulkCreateOptions, SyncOptions } from "sequelize";
import GenericMapping from "../genericMapping";
import { UserMandatoryTopics } from "./userMandatoryTopicsMappings";

interface IMandatoryTopicsLk {
  id?: number;
  name: string;
  description: string;
}

class MandatoryTopicsLk extends Model implements IMandatoryTopicsLk {
  id!: number;
  name!: string;
  description!: string;
}

class MandatoryTopicsLkMappings extends GenericMapping {
  constructor() {
    super();
  }

  initialize(): void {
    const modelAttributes: ModelAttributes = {
      name: {
        type: new DataTypes.STRING(100),
        allowNull: false
      },
      description: {
        type: new DataTypes.STRING(500),
        allowNull: true
      }
    };

    const modelOptions: InitOptions<Model> = {
      sequelize: this._sequelize
    };

    MandatoryTopicsLk.init(modelAttributes, modelOptions);
  }

  associations(): void {
    MandatoryTopicsLk.hasMany(UserMandatoryTopics, {
      foreignKey: { name: "mandatoryTopicsId", field: "mandatoryTopicsId", allowNull: false },
      constraints: true
    });
  }

  async sync(options?: SyncOptions) {
    return await MandatoryTopicsLk.sync(options);
  }

  async list(): Promise<IMandatoryTopicsLk[]> {
    return await MandatoryTopicsLk.findAll();
  }

  async prepareData(): Promise<IMandatoryTopicsLk[]> {
    const options: BulkCreateOptions = {
      ignoreDuplicates: true
    };
    const records: IMandatoryTopicsLk[] = [
      { name: "welcomePackage", description: "Welcome package" },
      { name: "locationTour", description: "Location tour" },
      { name: "buddyIntroduction", description: "Buddy Introduction" },
      { name: "companyPresentation", description: "IIS Romania presentation" },
      { name: "orientationProgram", description: "New Hire Orientation Program" },
      { name: "discoverIpsos", description: "Discover Ipsos" },
      { name: "socialResponsibility", description: "Corporate Social Responsibility – Abridged version" },
      { name: "workplace behavior", description: "Appropriate workplace behavior" },
      { name: "greenBook", description: "Green Book Presentation" },
      { name: "keyContacts", description: "Introduction key contacts" }
    ];
    records.forEach((e, ndx) => (e.id = ndx + 1));

    return await MandatoryTopicsLk.bulkCreate(records, options);
  }
}

const mandatoryTopicsLkMappingsInstance: MandatoryTopicsLkMappings = new MandatoryTopicsLkMappings();
export { IMandatoryTopicsLk, MandatoryTopicsLk, mandatoryTopicsLkMappingsInstance as MandatoryTopicsLkMappings };
