import { ActiveDirectory } from "node-ad-tools";

import { app, argv } from "../../config";
import { UserMapping } from "../../db";
import UserModel, { IUserModel } from "../../models/userModel";
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
    "mailNickname"
  ];

  private _adClient!: ActiveDirectory;

  constructor(userName: string, password: string, domain?: string) {
    super(userName, password, domain);
    this._adClient = new ActiveDirectory({
      url: app[argv.env].ad.AD_URL,
      base: app[argv.env].ad.AD_BASE
    });
  }

  async authenticate() {
    const userResource = await this._adClient.loginUser(this.userName, this.password);
    const user = ActiveDirectory.createUserObj(userResource.entry);
    const props = this.allowedAttributes.reduce(
      (obj, key) => ({ ...obj, [key]: userResource.entry ? userResource.entry.object[key] : null }),
      {}
    );
	const userModel = { ...user, ...props };
	await this._saveUser(new UserModel(userModel).toPlainObject());
    return userModel
      ? ActiveDirectoryAuthentication._jwtService.sign(
          userModel,
          ActiveDirectoryAuthentication._jwtOptionsModel.toPlainObject()
        )
      : null;
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
