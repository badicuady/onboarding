import { FastifyRequest } from 'fastify';

declare module "fastify" {
	interface User {
		employeeDirectoryLink: string;
		name: string;
		fullName: string;
		firstName: string;
		lastName: string;
		type: string;
		roles: { names: string[] };
		email: string;
		employeeDirectoryId: number;
	}

	interface Token {
		header: { alg: string, typ: string };
		payload: User;
		signature: string;
	}

	interface FastifyRequestExt extends FastifyRequest {
		[index:string]:any;
	}
}
