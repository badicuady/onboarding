import fromEntries from "object.fromentries";
import jwt from "jsonwebtoken";

import _fastify from "fastify";
import _yargs from "yargs";
import AppConfig from "./appConfig";

export const argv = fromEntries(
  Object.entries(_yargs.argv).map(e => {
    const key: string = e[0];
    const val: string = typeof e[1] === "string" ? e[1] : "";
    return [key, val];
  })
);

export interface IDBConfig {
  DB_SERVER: string | "localhost";
  DB_PORT: number | 5432;
  DB_DATABASE: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_DIALECT: "mysql" | "mariadb" | "sqlite" | "postgres" | "mssql";
}

export interface IJWTConfig {
  JWT_ISSUER: string;
  JWT_SUBJECT: string;
  JWT_AUDIENCE: string;
  JWT_EXPIRES_IN: string;
  JWT_ALGORITHM: jwt.Algorithm;
}

export interface IADConfig {
	AD_URL:string;
	AD_BASE: string;
}

export interface IAppConfigItem {
  SERVER_HOST: string;
  SERVER_PORT: number;
  SERVER_PROTOCOL: string;
  CRYPTO_ALGORITHM: string;
  CRYPTO_SECRET: string;
  AUTH_LINK: string;
  KEYS_PATH: string;
  db: IDBConfig;
  jwt: IJWTConfig;
  ad: IADConfig;
}

export interface IAppConfig {
	[index: string]: IAppConfigItem;
}

export const app: IAppConfig = {
  dev: {
    SERVER_HOST: "api.onboarding.com",
    SERVER_PORT: parseInt(process.env.PORT || "", 10) || 3123,
    SERVER_PROTOCOL: "http",
    CRYPTO_ALGORITHM: "sha512",
    CRYPTO_SECRET: "123456",
	AUTH_LINK: "http://web.onboarding.com:4123/login",
	KEYS_PATH: "./src",
    db: {
      DB_SERVER: "localhost",
      DB_PORT: 5432,
      DB_DATABASE: "postgres",
      DB_USERNAME: "postgres",
      DB_PASSWORD: "docker",
      // 'mysql'|'mariadb'|'sqlite'|'postgres'|'mssql'
      DB_DIALECT: "postgres"
    },
    jwt: {
      JWT_ISSUER: "Ipsos Interactive Services",
      JWT_SUBJECT: "adrian.badicu@ipsos.com",
      JWT_AUDIENCE: "HR",
      JWT_EXPIRES_IN: "1h",
      JWT_ALGORITHM: "RS256"
	},
	ad: {
		AD_URL: 'ldap://ipsosgroup.ipsos.com', // You can use DNS as well, like domain.local
    	AD_BASE: 'dc=ipsosgroup,dc=ipsos,dc=com'
	}
  },
  localdocker: {
    SERVER_HOST: "api.onboarding.com",
    SERVER_PORT: parseInt(process.env.PORT || "", 10) || 3123,
    SERVER_PROTOCOL: "http",
    CRYPTO_ALGORITHM: "sha512",
    CRYPTO_SECRET: "123456",
	AUTH_LINK: "http://web.onboarding.com:4123/login",
	KEYS_PATH: "./",
    db: {
      DB_SERVER: "onboarding-database",
      DB_PORT: 5432,
      DB_DATABASE: "postgres",
      DB_USERNAME: "postgres",
      DB_PASSWORD: "docker",
      // 'mysql'|'mariadb'|'sqlite'|'postgres'|'mssql'
      DB_DIALECT: "postgres"
    },
    jwt: {
      JWT_ISSUER: "Ipsos Interactive Services",
      JWT_SUBJECT: "adrian.badicu@ipsos.com",
      JWT_AUDIENCE: "HR",
      JWT_EXPIRES_IN: "1h",
      JWT_ALGORITHM: "RS256"
	},
	ad: {
		AD_URL: 'ldap://ipsosgroup.ipsos.com', // You can use DNS as well, like domain.local
    	AD_BASE: 'dc=ipsosgroup,dc=ipsos,dc=com'
	}
  },
  docker: {
    SERVER_HOST: "onboardingapitest.ipsosinteractive.com",
    SERVER_PORT: parseInt(process.env.PORT || "", 10) || 443,
    SERVER_PROTOCOL: "https",
    CRYPTO_ALGORITHM: "sha512",
    CRYPTO_SECRET: "123456",
	AUTH_LINK: "https://onboardingtest.ipsosinteractive.com/login",
	KEYS_PATH: "./",
    db: {
      DB_SERVER: "onboarding-database",
      DB_PORT: 5432,
      DB_DATABASE: "postgres",
      DB_USERNAME: "postgres",
      DB_PASSWORD: "docker",
      // 'mysql'|'mariadb'|'sqlite'|'postgres'|'mssql'
      DB_DIALECT: "postgres"
    },
    jwt: {
      JWT_ISSUER: "Ipsos Interactive Services",
      JWT_SUBJECT: "adrian.badicu@ipsos.com",
      JWT_AUDIENCE: "HR",
      JWT_EXPIRES_IN: "1h",
      JWT_ALGORITHM: "RS256"
    },
	ad: {
		AD_URL: 'ldap://ipsosgroup.ipsos.com', // You can use DNS as well, like domain.local
    	AD_BASE: 'dc=ipsosgroup,dc=ipsos,dc=com'
	}
  }
};

export const fastify = _fastify({ logger: true });

export { AppConfig };
