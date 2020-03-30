import { DBClient } from "./dbClient";
import { GenericMapping, GenericDatabase } from "./genericMapping";
import { IUser, User, UserMapping } from "./userMapping";
import { IDepartmentLk, DepartmentLk, DepartmentLkMapping } from "./departmentLkMapping"
import { ITimespanLk, TimespanLk, TimespanLkMapping } from "./timespanLkMapping";
import { IResponsibleLk, ResponsibleLk, ResponsibleLkMapping } from "./responsibleLkMapping"
import { IMandatoryTopicsLk, MandatoryTopicsLk, MandatoryTopicsLkMapping } from "./topics/mandatoryTopicsLkMapping";
import { IUserMandatoryTopics, UserMandatoryTopics, UserMandatoryTopicsMapping } from "./topics/userMandatoryTopicsMapping";
import { IUserSpecificTopics, UserSpecificTopics, UserSpecificTopicsMapping } from "./topics/userSpecificTopicsMapping";
import { IUserFeedback, UserFeedback, UserFeedbackMapping } from "./userFeedbackMapping";


export { 
	DBClient, 
	GenericMapping, GenericDatabase,
	IUser, User, UserMapping, 
	IDepartmentLk, DepartmentLk, DepartmentLkMapping,
	ITimespanLk, TimespanLk, TimespanLkMapping,
	IResponsibleLk, ResponsibleLk, ResponsibleLkMapping,
	IMandatoryTopicsLk, MandatoryTopicsLk, MandatoryTopicsLkMapping,
	IUserMandatoryTopics, UserMandatoryTopics, UserMandatoryTopicsMapping, 
	IUserSpecificTopics, UserSpecificTopics, UserSpecificTopicsMapping,
	IUserFeedback, UserFeedback, UserFeedbackMapping
 };
