import SessionService from "./session.service.js";
import AdminService from "./admin.service.js";
import CacheService, { CacheKeys } from "./cache.service.js";
import ApiService from "./api.service.js";

const services = {
  sessionService: SessionService,
  adminService: AdminService,
  cacheService: CacheService,
  apiService: ApiService
};

export default services;
export { CacheKeys, SessionService, AdminService, CacheService, ApiService };
