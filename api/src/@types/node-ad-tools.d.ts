import ldap from 'ldapjs';

declare class ActiveDirectory {
	constructor(params: { url:string, base:string, suffix?:string, searchOptions?:any, idleTimeout?:number, tlsOptions?:any });

	_bind(client:ldap.Client, username:string, password:string):Promise<any>;

	_search(client:ldap.Client, customBase:string, search:ldap.SearchOptions):Promise<any>;

	loginUser(username:string, password:string, customBase?:string, customSearch?:ldap.SearchOptions): 
		Promise<{ success: boolean, entry: ldap.SearchEntry | undefined, message: string | undefined, error: string | undefined }>

	getAllGroups(username:string, password:string, customBase?:string, detailed?:boolean):
		Promise<{ success: boolean, entry: ldap.SearchEntry | undefined, message: string | undefined, error: string | undefined }>;

	getAllUsers(username:string, password:string, customBase?:string, formatted?:boolean):
		Promise<{ success: boolean, entry: ldap.SearchEntry | undefined, message: string | undefined, error: string | undefined }>;

	static resolveBindError(error:Error): string;

	static resolveGroups(entry:any): string[];

	static resolveGUID(entry:any):string;

	static createUserObj(entry:any):any;

	static detectLogonType(username:string): "userPrincipalName" | "distinguishedName" | "sAMAccountName";

	static convertToDate(date:string): Date;

	static cleanSama(sAMA:string):string;
}