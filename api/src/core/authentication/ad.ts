import soap from "soap";

import { app, argv } from "../../config";
import Authentication from "./auth";
import JwtService from "../services/jwtService";
import JwtOptionsModel from "../../models/jwt/jwtOptionsModel";

class ActiveDirectoryAuthentication extends Authentication {
  private _soapClient!: soap.Client;

  constructor(userName: string, password: string, domain: string) {
    super(userName, password, domain);
  }

  async generateSoapClient() {
    if (!this._soapClient) {
      this._soapClient = await soap.createClientAsync(`${app[argv.env].AUTH_LINK}?WSDL`);
    }
  }

  async authenticate() {
    await this.generateSoapClient();
    const params = { domain: this.domain, userName: this.userName, password: this.password };
    const result = await this._soapClient.AuthenticateWindowsUserAsync(params);
	return result.length > 0 
		? ActiveDirectoryAuthentication._jwtService.sign(result[0].AuthenticateWindowsUserResult, ActiveDirectoryAuthentication._jwtOptionsModel) 
		: null;
  }

  static _jwtService = new JwtService();

  static _jwtOptionsModel = new JwtOptionsModel(
	app[argv.env].jwt.JWT_ALGORITHM,
    app[argv.env].jwt.JWT_ISSUER,
    app[argv.env].jwt.JWT_SUBJECT,
    app[argv.env].jwt.JWT_AUDIENCE,
    app[argv.env].jwt.JWT_EXPIRESIN
  );
}

export default ActiveDirectoryAuthentication;
