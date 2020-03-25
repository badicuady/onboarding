class AuthService {
	constructor(authorization) {
		this.authorization = authorization;
		this.config = {
			headers: {
				"Authorization": `Bearer ${this.authorization}`
			}
		};
	}
}

export default AuthService;