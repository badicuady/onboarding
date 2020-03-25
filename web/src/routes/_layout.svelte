<script context="module">
  import { afterUpdate } from "svelte";
  import config from "../config";
  import { CacheKeys, SessionService, CacheService } from "../services";
  import Utilities from "../common/utilities.js";
  import Navigation from "../components/Navigation.svelte";
  import Footer from "../components/Footer.svelte";
  import Loading from "../components/Loading.svelte";
  import User from "../models/user.js";

  export async function preload(page, session) {
    if (!config.useLogin) {
      session[CacheKeys.UserInfo] = config.testUser;
    }

	const user = session[CacheKeys.UserInfo];
	const token = session[CacheKeys.Token];
    const rex = new RegExp(`\/${config.loginSegment}`, "gim");
    const isNotLogin = page.path.replace(rex, "").length !== 0;
    if (isNotLogin && config.useLogin && !user) {
      return this.redirect(302, config.loginSegment);
    }
    return new Promise(resolve => resolve({ user, token }));
  }
</script>

<script>
  export let segment;
  export let user;
  export let token;

  let userModel;
  const sessionService = new SessionService();

  afterUpdate(() => {
    (function($) {
      $(function() {
        $(document).ready(function() {
          $("input[data-bootstrap-switch]").each(function() {
            $(this).bootstrapSwitch("state", $(this).prop("checked"));
          });
        });
      });
    })(window.$);
  });

  sessionService.subscribe(session => {
    userModel = null;
    if (session[CacheKeys.UserInfo]) {
	  user = session[CacheKeys.UserInfo];
	  userModel = new User(user);
	  CacheService.setOrUpdateValue(CacheKeys.UserInfo, user, new Date(Date.now() + 3600 * 1000));
	}
	if (session[CacheKeys.Token]) {
	  token = session[CacheKeys.Token];
	  CacheService.setOrUpdateValue(CacheKeys.Token, token, new Date(Date.now() + 3600 * 1000));
    }
  });
</script>

<Loading />

<Navigation {segment} bind:user={userModel} />

<slot />

<Footer {segment} bind:user={userModel} />
