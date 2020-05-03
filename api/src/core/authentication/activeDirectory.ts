import tls from "tls";
import ldap from "ldapjs";

interface LDAPError extends Error {
  lde_message: string;
}

type LDAPReconnectOptions = {
  failAfter: number;
};

type LDAPSettings = {
  url: string;
  idleTimeout: number;
  tlsOptions: tls.TlsOptions;
  timeout: number;
  connectTimeout: number;
  queueTimeout: number;
  reconnect: LDAPReconnectOptions;
};

type ActiveDirectoryConstructorInitializer = {
  url?: string;
  suffix?: string;
  base?: string;
  searchOptions?: ldap.SearchOptions;
  idleTimeout?: number;
  tlsOptions?: tls.TlsOptions;
  reconnect?: LDAPReconnectOptions;
};

type ActiveDirectoryUserModel = {
  groups: string[];
  phone: string;
  name: string;
  mail: string;
  guid: string;
  dn: string;
};

/** This class will authenticate a user to AD and return basic user information */
class ActiveDirectory {
  private base: string;
  private searchOptions: ldap.SearchOptions;
  private ldapjsSettings: LDAPSettings;
  /**
   * Create a new Active Directory object for managing AD connections
   * @param {string} url URL / IP of the Active Directory server
   * @param {string} base The default base to use when one is not provided on a method
   * @param {object} [searchOptions] The search options passed down to ldapjs, see http://ldapjs.org/client.html#search for details.
   * @param {string} [searchOptions.scope='sub'] What scope should the Active Directory be searched in
   * @param {string} [searchOptions.filter=(objectclass=*)] A string version of an LDAP filter
   * @param {number} [searchOptions.sizeLimit=0] Maximum number of entries to return, 0 = unlimited
   * @param {number} idleTimeout How long to wait idle before timing out
   * @param {object} tlsOptions The NodeJS TLS options object, see https://nodejs.org/api/tls.html#tls_tls_connect_options_callback for details.
   * @param {object} reconnect The reconnect option. Used to configure failAfter option. After this many times the connection will fail, if is not successfully
   */
  constructor(initializer: ActiveDirectoryConstructorInitializer) {
    // Switching to proper name base, leaving suffix as backwards compat until v2
    this.base = initializer.base || "";
    if (initializer.suffix && !initializer.base) {
      console.log("Deprecation warning: API suffix was renamed to base, suffix param will be removed in v2.");
      this.base = initializer.suffix || "";
    }

    this.searchOptions = initializer.searchOptions || { scope: "sub" };

    this.ldapjsSettings = {
      url: initializer.url || "",
      idleTimeout: initializer.idleTimeout || 3000,
      tlsOptions: initializer.tlsOptions || {},
      timeout: initializer.idleTimeout || 3000,
      connectTimeout: initializer.idleTimeout || 3000,
      queueTimeout: initializer.idleTimeout || 3000,
      reconnect: initializer.reconnect || {
        failAfter: 1
      }
    };
  }

  /**
   * Turns AD bind errors into friendlier error messages
   * @param {string} error Error returned from ldapjs / AD when attempting to bind
   * @returns {string} Error explanation string
   */
  static resolveBindError(error: LDAPError): string {
    if (error.name !== "InvalidCredentialsError" || !error.lde_message) return "Unknown Auth Error";

    if (error.lde_message.indexOf("775") !== -1) return "Account is locked out";

    return "Invalid username or password";
  }

  /**
   * Resolves AD group membership
   * @param {object} entry This is an entry returned from loginAdUser
   * @returns {string[]} An array of string group names
   */
  static resolveGroups(entry: ldap.SearchEntry): string[] {
    if (typeof entry.object !== "object") throw new Error("Invalid entry, entry.object must be an object");

    const memberOf = entry.object.memberOf;
    if (memberOf === undefined) {
      return [];
    } else if (typeof memberOf === "string") {
      // If only 1 OU ldapjs returns it as a string
      return memberOf
        .split(",")
        .filter(item => item.indexOf("CN=") !== -1)
        .map(item => item.split("CN=")[1]);
    } else if (Array.isArray(memberOf)) {
      return memberOf.map(group => group.split(",")[0].split("CN=")[1]);
    }

    return [];
  }

  /**
   * Locates objectGUID and then formats it
   * @param {object} entry This is an entry returned from loginAdUser
   * @returns {string} Formatted GUID string
   */
  static resolveGUID(entry: ldap.SearchEntry): string {
    if (!Array.isArray(entry.attributes)) throw new Error("Attributes must be an array");

    if (entry.attributes) {
      const objectGUID = entry.attributes.find(attribute => attribute.json.type === "objectGUID");

      if (objectGUID) {
        const binaryGUID = objectGUID.buffers[0];
        const guidFormat = [
          [3, 2, 1, 0],
          [5, 4],
          [7, 6],
          [8, 9],
          [10, 11, 12, 13, 14, 15]
        ];
        const guidArray = guidFormat.map(part => {
          const stringPart = part.map(byte => {
            // If less than 16 add a 0 to the end
            const byteString =
              binaryGUID[byte] < 16 ? `0${binaryGUID[byte].toString(16)}` : binaryGUID[byte].toString(16);
            return byteString;
          });
          return `${stringPart.join("")}`;
        });
        return guidArray.join("-");
      }
    }
    return "";
  }

  /**
   * Creates a standard user object from ldapjs entry response
   * @param {object} entry This is an entry returned from loginAdUser
   * @returns {object} User object { groups: Array, phone: string, name: string, mail: string, guid: string }
   */
  static createUserObj(entry: ldap.SearchEntry): ActiveDirectoryUserModel {
    if (typeof entry !== "object") throw new Error("Entry must be an object");

    return {
      groups: ActiveDirectory.resolveGroups(entry),
      phone: <string>entry.object.telephoneNumber || "",
      name: <string>entry.object.name || "",
      mail: <string>entry.object.mail || "",
      guid: ActiveDirectory.resolveGUID(entry),
      dn: entry.objectName || ""
    };
  }

  /**
   * Detects what type of account name this is or defaults to userLogonName
   * @param {string} username The user name being used to bind
   * @returns {string} Returns userPrincipalName || distinguishedName || sAMAccountName
   */
  static detectLogonType(username: string): string {
    if (username.indexOf("@") !== -1) {
      return "userPrincipalName";
    } else if (username.toUpperCase().indexOf("DC=") !== -1) {
      return "distinguishedName";
    } else {
      return "sAMAccountName";
    }
  }

  /**
   * Converts the ActiveDirectory / LDAP fields whenCreated & whenChanged to JS dates
   * @param {string} date
   * @returns {Date} ISO formatted date
   */
  static convertToDate(date: string): Date {
    const year = date.slice(0, 4);
    const month = date.slice(4, 6);
    const day = date.slice(6, 8);
    const hour = date.slice(8, 10);
    const min = date.slice(10, 12);
    const sec = date.slice(12, 14);

    return new Date(`${year}-${month}-${day}T${hour}:${min}:${sec}.000Z`);
  }

  /**
   * Cleans sAMAccountName
   * @param {string} sAMA
   * @returns {string} sAMAccountName
   */
  static cleanSama(sAMA: string): string {
    const parts = sAMA.split("\\"); // Extracts any appended domain
    return parts[parts.length - 1]; // This returns 0 if there was no domain provided or returns 1 if domain was provided
  }

  /**
   * Performs a bind on the client passed in
   * @param {ldap.Client} client LDAPjs client obj
   * @param {string} username Username to bind with
   * @param {string} password Password to bind with
   * @returns {Promise} Resolves with LDAPjs response
   * @throws {Error} If username or password are not a string
   */
  _bind(client: ldap.Client, username: string, password: string): Promise<any> {
    if (typeof username !== "string" || typeof password !== "string") {
      const err = <LDAPError>new Error("Username and password must be a string");
      err.name = "InvalidCredentialsError";
      err.lde_message = "Username and password must be a string";
      throw err;
    }

    return new Promise((resolve, reject) => {
      client.bind(username, password, (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(res);
      });
    });
  }

  /**
   * Performs a search on a client
   * @param {ldap.Client} client LDAPjs client obj
   * @param {string} base The base to perform the search on
   * @param {object} search The search options to use
   */
  _search(client: ldap.Client, customBase?: string, search?: ldap.SearchOptions) {
    return new Promise((resolve, reject) => {
      const base = typeof customBase === "string" && customBase ? customBase : this.base;

      let accumulator: ldap.SearchEntry[] = [];
      //TODO Add check if client is bind
      client.search(base, search || {}, (err, res) => {
        if (err) {
          reject(err);
          return;
        }

        res.on("searchEntry", entry => {
          accumulator.push(entry);
        });

        res.on("end", () => {
          resolve(accumulator);
        });

        res.on("error", error => {
          reject(error);
        });
      });
    });
  }

  /**
   * Performs a query to ldap
   * @param {string} username Username to bind with
   * @param {string} password Password to bind with
   * @param {string} action The action performed
   * @param {string} customBase Override the default class base, if not passed the class base is used.
   * @param {string} search The search options to use
   * @param {function} onSuccess The function that will create the response object
   * @returns {Promise} Resolves with LDAPjs response
   */
  _query(
    username: string,
    password: string,
    action: string,
    customBase: string | undefined,
    search: ldap.SearchOptions,
    onSuccess: Function
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const client = ldap.createClient(this.ldapjsSettings);

        // Return errors
        client.on("error", error => {
          client.unbind();
          reject({ success: false, message: `Error resolving ${action}`, error });
        });

        // Bind to AD - error thrown if invalid login
        this._bind(client, username, password)
          .then(() => {
            // Search AD for user
            this._search(client, customBase, search)
              .then(records => {
                resolve({ success: true, ...onSuccess(records) });
              })
              .catch(err => {
                reject({ success: false, message: ActiveDirectory.resolveBindError(err), error: err });
              });
          })
          .catch(err => {
            reject({ success: false, message: ActiveDirectory.resolveBindError(err), error: err });
          });
      } catch (err) {
        reject({ success: false, message: ActiveDirectory.resolveBindError(err), error: err });
      }
    });
  }

  /**
   * Attempts to authenticate 1 user to AD using their UPN.
   * If the ldap client has an error a user friendly message is in message and the full error is in error.
   * @param {string} username This must be the UPN
   * @param {string} password The users password
   * @param {string} customBase Override the default class base, if not passed the class base is used.
   * @param {object} customSearch A custom search string, e.g. (userPrincipalName=test@domain.local)
   * @returns {Promise<any>} Promise resolves as an obj { success: true, entry: {} || undefined } || { success: false, message: 'error', error: 'ldapjs error' }
   */
  loginUser(
    username: string,
    password: string,
    customBase?: string,
    customSearch?: object
  ): Promise<{ success: boolean; entry?: ldap.SearchEntry; message?: string; error?: Error }> {
    const usernameType = ActiveDirectory.detectLogonType(username);
    const searchUser = usernameType === "sAMAccountName" ? ActiveDirectory.cleanSama(username) : username;
    const search = {
      ...this.searchOptions,
      filter: `(${usernameType}=${searchUser})`,
      ...customSearch // Overrides any other search options
    };
    const resultObject = (records: ldap.SearchEntry[]) => ({ entry: records[0] });
    return this._query(username, password, "account", customBase, search, resultObject);
  }

  /**
   * Attempts to get all groups from AD that the user has permissions to read and match filter.
   * @param {string} username This must be the UPN
   * @param {string} password The users password
   * @param {string} customBase Override the default class base, if not passed the class base is used.
   * @param {boolean} detailed Indicates if you want the detailed groups objects with name, dn, guid, description, created, and changed values
   * @returns {Promise<any>} Promise resolves as an obj { success: true, groups: [string] } || { success: false, message: 'error', error: 'ldapjs error' }
   */
  getAllGroups(
    username: string,
    password: string,
    customBase?: string,
    detailed?: boolean
  ): Promise<{ success: boolean; groups?: string[]; message?: string; error?: Error }> {
    // For backwards compatibility until v2
    if (detailed === undefined && typeof customBase === "boolean") detailed = customBase;
    const attributes = detailed ? ["name", "dn", "objectGUID", "description", "whenCreated", "whenChanged"] : "name";
    const customSearch = {
      ...this.searchOptions,
      filter: `(objectCategory=group)`,
      attributes
    };

    const getDetails = (records: ldap.SearchEntry[]) =>
      records.map(entry => ({
        name: entry.object.name,
        dn: entry.object.dn,
        guid: ActiveDirectory.resolveGUID(entry),
        description: entry.object.description,
        created: ActiveDirectory.convertToDate(<string>entry.object.whenCreated),
        changed: ActiveDirectory.convertToDate(<string>entry.object.whenChanged)
      }));
    const resultObject = (records: ldap.SearchEntry[]) => ({
      groups: detailed ? getDetails(records) : records.map(entry => entry.object.name)
    });
    return this._query(username, password, "groups", customBase, customSearch, resultObject);
  }

  /**
   * Attempts to get all users from AD that the user has permissions to read and match filter.
   * @param {string} username This must be the UPN
   * @param {string} password The users password
   * @param {string} customBase Override the default class base, if not passed the class base is used.
   * @param {boolean} formatted Indicates if you;d like your response formatted as user objects
   * @returns {Promise<object>} Promise resolves as an obj { success: true, users: [object] } || { success: false, message: 'error', error: 'ldapjs error' }
   */
  getAllUsers(
    username: string,
    password: string,
    customBase?: string,
    formatted?: boolean
  ): Promise<{ success: boolean; users?: ActiveDirectoryUserModel[]; message?: string; error?: Error }> {
    // For backwards compatibility until v2
    if (formatted === undefined && typeof customBase === "boolean") {
      formatted = customBase;
    }
    const customSearch = {
      ...this.searchOptions,
      filter: `(&(objectClass=user)(objectCategory=person))`
    };
    const resultObject = (records: ldap.SearchEntry[]) => ({
      users: formatted ? records.map(entry => ActiveDirectory.createUserObj(entry)) : records
    });
    return this._query(username, password, "users", customBase, customSearch, resultObject);
  }
}

export default ActiveDirectory;
