import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import Extensions from "../common/extensions";

class JwtService {
  sign(payload: string | object | Buffer, options?: jwt.SignOptions | undefined): string {
    return jwt.sign(Extensions.toSimplePlainObject(payload), JwtService._privateKey, options);
  }

  verify(token: string, options?: jwt.VerifyOptions | undefined): string | object {
    return jwt.verify(token, JwtService._publicKey, options);
  }

  decode(token: string): null | { [key: string]: any } | string {
    return jwt.decode(token, { complete: true });
  }

  private static _privateKey: string = fs.readFileSync(path.resolve("./dist/", "./config/keys/private.key"), "utf8");
  private static _publicKey: string = fs.readFileSync(path.resolve("./dist/", "./config/keys/public.key"), "utf8");
}

export default JwtService;
