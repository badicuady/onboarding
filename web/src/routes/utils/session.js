import send from "@polka/send-type";
import { CacheKeys } from "../../services";

export async function post(req, res) {
  const keys = [CacheKeys.UserInfo, CacheKeys.Token];

  for (const key of keys) {
    if (typeof req.body[key] === "function") {
      req.body[key] = req.body[key].call(null);
    }

    if (typeof req.body[key] === "object" && req.body[key] !== null) {
      req.session[key] = { ...req.session[key], ...req.body[key] };
    }

    if (!req.session[key] && (req.body[key] === null || (typeof req.body[key] !== "object" && req.body[key] !== undefined))) {
      req.session[key] = req.body[key];
	}
  }

  send(res, 200, { success: true });
}
