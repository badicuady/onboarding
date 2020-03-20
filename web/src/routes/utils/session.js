import send from "@polka/send-type";
import { CacheKeys } from "../../services";

export async function post(req, res) {
  const key = CacheKeys.UserInfo;

  if (typeof req.body[key] === "function") {
	req.body[key] = req.body[key].call(null);
  }

  if (typeof req.session[key] === "object" && typeof req.body[key] === "object") {
	req.session[key] = { ...req.session[key], ...req.body[key] };
  }

  if (!req.session[key] || !req.body[key] || typeof req.body[key] !== "object") {
	req.session[key] = req.body[key];
  }
  
  send(res, 200, { success: true });
}
