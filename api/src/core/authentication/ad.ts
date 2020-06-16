import ActiveDirectory from "./activeDirectory";

import { app, argv, testUser } from "../../config";
import { UserMapping } from "../../db";
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

  async authenticate() {
    console.info(`Authenticating user: [${this.userName}]...`);
	let userModel:IUserModel | IActiveDirectoryUserModel = { ...testUser };

    if (!app[argv.env].USE_TEST_USER) {
      const userResource = await this._adClient.loginUser(this.userName, this.password);
      console.info(`Authenticated resource: ${userResource.success}`);
      if (userResource.entry) {
        const user = ActiveDirectory.createUserObj(userResource.entry);
        const props = this.allowedAttributes.reduce(
          (obj, key) => ({ ...obj, [key]: userResource.entry ? userResource.entry.object[key] : null }),
          {}
        );
        userModel = { ...user, ...props };
      }
    }

    const [userModelDb] = await this._saveUser(new UserModel(userModel).toPlainObject());
    const plainUserModelDb = <IUserModel>userModelDb.toJSON();
    return userModel
      ? ActiveDirectoryAuthentication._jwtService.sign(
          { ...userModel, id: plainUserModelDb.id },
          ActiveDirectoryAuthentication._jwtOptionsModel.toPlainObject()
        )
      : null;

    return null;
  }

  private async _saveUser(user: IUserModel) {
    return await UserMapping.createOrUpdate(user);
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
