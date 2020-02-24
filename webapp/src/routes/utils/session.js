import send from "@polka/send-type";
import { CacheKeys } from "../../services";

export async function post(req, res) {
  const key = CacheKeys.UserInfo;
  req.session[key] = { ...req.session[key], ...req.body[key] };
  send(res, 200, { success: true });
}
