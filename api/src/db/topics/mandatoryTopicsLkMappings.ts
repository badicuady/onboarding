import { Model, DataTypes, ModelAttributes, InitOptions, BulkCreateOptions, SyncOptions } from "sequelize";
import GenericMapping from "../genericMapping";
import { UserMandatoryTopics } from "./userMandatoryTopicsMappings";

interface IMandatoryTopicsLk {
  id?: number;
  name: string;
  description: string;
  group: number;
}

class MandatoryTopicsLk extends Model implements IMandatoryTopicsLk {
  id!: number;
  name!: string;
  description!: string;
  group!: number;
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
      },
      group: {
        type: DataTypes.SMALLINT.UNSIGNED,
        allowNull: false,
        defaultValue: 1
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
    const records: IMandatoryTopicsLk[][] = [[
      { name: "welcomePackage", description: "Welcome package", group: 1 },
      { name: "locationTour", description: "Location tour", group: 1 },
      { name: "buddyIntroduction", description: "Buddy Introduction", group: 1 },
      { name: "companyPresentation", description: "IIS Romania presentation", group: 1 },
      { name: "orientationProgram", description: "New Hire Orientation Program", group: 1 },
      { name: "discoverIpsos", description: "Discover Ipsos", group: 1 },
      { name: "socialResponsibility", description: "Corporate Social Responsibility – Abridged version", group: 1 },
      { name: "workplace behavior", description: "Appropriate workplace behavior", group: 1 },
      { name: "greenBook", description: "Green Book Presentation", group: 1 },
	  { name: "keyContacts", description: "Introduction key contacts", group: 1 }
	], [
      { name: "healthSafety", description: "Health and Safety at work", group: 2 },
      { name: "jobDescription", description: "Job description discussion", group: 2 },
      { name: "internalRegulation", description: "IIS Internal Regulation and Collective Labour Agreement", group: 2 },
      { name: "presentProbationary", description: "Present the Probationary period goals plan", group: 2 },
      { name: "qualitySecurity", description: "Quality and Info Security Essentials", group: 2 },
      { name: "securityAwareness", description: "Security Awareness 2017", group: 2 },
      { name: "policiesProcedures", description: "Policies & Procedures - Book of Policies", group: 2 },
	  { name: "gdpr", description: "General Data Protection Regulation (GDPR) / Data Privacy", group: 2 }
	], [	  
      { name: "mePlatform", description: "ME Platform", group: 3 },
      { name: "iTime", description: "iTime: Ipsos Time Tracking System", group: 3 },
      { name: "iService", description: "iService", group: 3 },
      { name: "iTalent", description: "iTalent", group: 3 },
	  { name: "itc", description: "Ipsos Training Center", group: 3 }
	], [
      {
        name: "itcFundamentals",
        description: "ITC : Fundamentals Program (Communication / Time Management / Client Service)",
        group: 4
      },
      { name: "clientService", description: "In Class: Client Service", group: 4 },
      { name: "growLeaders", description: "GROW IIS Leaders", group: 4 }
    ]];
	records.forEach((arr) => arr.forEach((e, ndx) => (e.id = (e.group - 1) * 10 + ndx + 1)));
	const allRecords = records.reduce((all, e) => all.concat(e), []);

    return await MandatoryTopicsLk.bulkCreate(allRecords, options);
  }
}

const mandatoryTopicsLkMappingsInstance: MandatoryTopicsLkMappings = new MandatoryTopicsLkMappings();
export { IMandatoryTopicsLk, MandatoryTopicsLk, mandatoryTopicsLkMappingsInstance as MandatoryTopicsLkMappings };
