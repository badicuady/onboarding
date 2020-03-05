class Authentication {
  protected userName: string;
  protected password: string;
  protected domain: string;

  constructor(userName: string, password: string, domain: string) {
    this.userName = userName;
    this.password = password;
    this.domain = domain;
  }

  authenticate() {
    throw new Error("Override method «authenticate»!");
  }
}

export default Authentication;
