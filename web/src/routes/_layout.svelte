<script context="module">
  import { afterUpdate } from "svelte";
  import config from "../config";
  import { CacheKeys, SessionService } from "../services";
  import Navigation from "../components/Navigation.svelte";
  import Footer from "../components/Footer.svelte";
  import User from "../models/user.js";

  export async function preload(page, session) {
    if (!config.useLogin) {
      session[CacheKeys.UserInfo] = config.testUser;
    }

    const user = session[CacheKeys.UserInfo];
    const rex = new RegExp(`\/${config.loginSegment}`, "gim");
    const isNotLogin = page.path.replace(rex, "").length !== 0;

    if (isNotLogin && config.useLogin && !user) {
      return this.redirect(302, config.loginSegment);
    }
    return new Promise(resolve => resolve({ user }));
  }
</script>

<script>
  export let segment;
  export let user;
  let userModel;
  const sessionService = new SessionService();

  afterUpdate(() => {
    (function(_) {
      _(function() {
        _(document).ready(function() {
          _("input[data-bootstrap-switch]").each(function() {
            _(this).bootstrapSwitch("state", _(this).prop("checked"));
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
    }
  });
</script>

<Navigation {segment} bind:user={userModel} />

<slot />

<Footer {segment} bind:user={userModel} />
