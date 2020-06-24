import ActiveDirectory, { ActiveDirectoryResponse } from "./activeDirectory";

import { app, argv, testUser } from "../../config";
import { UserMapping, User } from "../../db";
import UserModel, { IUserModel, IActiveDirectoryUserModel } from "../../models/users/userModel";
import Authentication from "./auth";
import JwtService from "../services/jwtService";
import JwtOptionsModel from "../../models/jwt/jwtOptionsModel";

class ActiveDirectoryAuthentication extends Authentication {
  private readonly allowedAttributes: string[] = [
    "title",
    "description",
    "postalCode",
    "physicalDeliveryOfficeName",
    "telephoneNumber",
    "givenName",
    "displayName",
    "co",
    "department",
    "company",
    "streetAddress",
    "directReports",
    "employeeID",
    "userPrincipalName",
    "mail",
    "manager",
    "mailNickname",
  ];

  private _adClient!: ActiveDirectory;

  constructor(userName: string, password: string, domain?: string) {
    super(userName, password, domain);
    this._adClient = new ActiveDirectory({
      url: app[argv.env].ad.AD_URL,
      base: app[argv.env].ad.AD_BASE,
      idleTimeout: 1000,
    });
  }

  async authenticate(): Promise<string> {
    console.info(`Authenticating user: [${this.userName}]...`);
    let userModel: IUserModel | IActiveDirectoryUserModel | undefined = { ...testUser };

    if (!app[argv.env].USE_TEST_USER) {
      const userResource = await this._adClient.loginUser(this.userName, this.password);
      console.info(`Authenticated resource: ${userResource.success}`);
      if (userResource.entry) {
        userModel = this._normalizeUserModel(userResource);
      }
    }

    if (userModel) {
      const userModelDb = await this._persistUser(userModel);
      const plainUserModelDb = <IUserModel>userModelDb.toJSON();
      return this._generateToken({ ...userModel, id: plainUserModelDb.id, password: this.password }) || "";
	}
	
	return "";
  }

  async searchUser(searchUser: string): Promise<User | undefined> {
    const userResource = await this._adClient.searchUser(this.userName, this.password, searchUser);
    const userModel = this._normalizeUserModel(userResource);
    if (userModel) return await this._persistUser(userModel);
  }

  private async _saveUser(user: IUserModel) {
    return await UserMapping.createOrUpdate(user);
  }

  private _normalizeUserModel(userResource: ActiveDirectoryResponse): IUserModel | undefined {
    if (userResource.entry) {
      const user = ActiveDirectory.createUserObj(userResource.entry);
      const props = this.allowedAttributes.reduce(
        (obj, key) => ({ ...obj, [key]: userResource.entry ? userResource.entry.object[key] : null }),
        {}
      );
      return { ...user, ...props };
    }
  }

  private async _persistUser(userModel: IUserModel): Promise<User> {
    const [userModelDb] = await this._saveUser(new UserModel(userModel));
    return userModelDb;
  }

  private _generateToken(userModel: IUserModel) {
    return userModel
      ? ActiveDirectoryAuthentication._jwtService.sign(
          userModel,
          ActiveDirectoryAuthentication._jwtOptionsModel.toPlainObject()
        )
      : null;
  }

  static _jwtService = new JwtService();

  static _jwtOptionsModel = new JwtOptionsModel(
    app[argv.env].jwt.JWT_ALGORITHM,
    app[argv.env].jwt.JWT_ISSUER,
    app[argv.env].jwt.JWT_SUBJECT,
    app[argv.env].jwt.JWT_AUDIENCE,
    app[argv.env].jwt.JWT_EXPIRES_IN
  );
}

export default ActiveDirectoryAuthentication;
