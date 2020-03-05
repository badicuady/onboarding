import SessionService from "./session.service.js";
import AdminService from "./admin.service.js";
import CacheService, { CacheKeys } from "./cache.service.js";

const services = {
  sessionService: SessionService,
  adminService: AdminService,
  cacheService: CacheService
};

export default services;
export { CacheKeys, SessionService, AdminService, CacheService };
