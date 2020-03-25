import jwt from "jsonwebtoken";
import GenericModel, { IGenericModel } from "../genericModel";

export interface IJwtOptionsModel extends IGenericModel {
  issuer?: string;
  subject?: string;
  audience?: string;
  expiresIn?: string;
  algorithm?: jwt.Algorithm;
}

class JwtOptionsModel extends GenericModel {
  private _issuer: string = "";
  private _subject: string = "";
  private _audience: string = "";
  private _expiresIn: string = "";
  private _algorithm: jwt.Algorithm = "HS256";

  constructor(algorithm?: jwt.Algorithm | IJwtOptionsModel, issuer?: string, subject?: string, audience?: string, expiresIn?: string, ) {
    super();
    const model: IJwtOptionsModel = typeof algorithm === "object" ? algorithm : { issuer, subject, audience, expiresIn, algorithm };
    this.setup(model);
  }

  get issuer() {
    return this._issuer;
  }
  set issuer(issuer) {
    this._issuer = issuer;
  }

  get subject() {
    return this._subject;
  }
  set subject(subject) {
    this._subject = subject;
  }

  get audience() {
    return this._audience;
  }
  set audience(audience) {
    this._audience = audience;
  }

  get expiresIn() {
    return this._expiresIn;
  }
  set expiresIn(expiresIn) {
    this._expiresIn = expiresIn;
  }

  get algorithm() {
    return this._algorithm;
  }
  set algorithm(algorithm) {
    this._algorithm = algorithm;
  }

  setup(model: IJwtOptionsModel) {
    if (!this.validate(model)) {
      throw new Error(`The model is not valid: «${model}»`);
    }
    this._issuer = model.issuer || "";
    this._subject = model.subject || "";
    this._audience = model.audience || "";
    this._expiresIn = model.expiresIn || "";
    this._algorithm = model.algorithm || "HS256";
  }
}

export default JwtOptionsModel;
