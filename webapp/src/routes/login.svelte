<script>
  import { onMount } from "svelte";
  import { goto } from "@sapper/app";
  import config from "../config";
  import {
    SessionService,
    AdminService,
    CacheKeys
  } from "../services/index.js";
  import ObjectCreator, { DefinitionType } from "../common/objectCreator.js";

  const sessionService = new SessionService();
  let loginParams;
  let iFrameSrc;
  let isLoggedIn = false;

  onMount(() => {
    window.addEventListener("message", receiveMessage);
    const encodedParams = Object.assign({}, config.loginParams);
    encodedParams.redirect_uri = encodeURIComponent(
      (window.location.origin ? window.location.origin : config.baseUrl) +
        config.loginRedirect
    );
    iFrameSrc = `${config.loginPage}?${encodeParams(encodedParams)}`;
  });

  const encodeParams = params =>
    JSON.stringify(params)
      .replace(/[\{\}\"]/gim, "")
      .replace(/\:/gim, "=")
      .replace(/\,/gim, "&");

  const createObject = (keyName, value) =>
    ObjectCreator.createObjectProperty({}, keyName, DefinitionType.A, {
      ...value
    });

  const saveUserInfo = async token => {
    const adminService = new AdminService(token);
    const userInfo = await adminService.info();
    if (userInfo.status === 200) {
      const userInfoObj = createObject(CacheKeys.UserInfo, userInfo.data);
      await sessionService.update(userInfoObj);
    }
  };

  const receiveMessage = async event => {
    if (event && event.data && event.data.access_token) {
      isLoggedIn = true;
      await saveUserInfo(event.data.access_token);
      goto("/");
    }
  };

  const loginOutside = async () => {
    window.open(iFrameSrc, "_blank");
  };
</script>

{#if !isLoggedIn}
  <div class="d-flex">
    <div class="mx-auto my-5">
      <img
        src="img/onboarding_1.jpg"
        alt="logo"
        class="img-responsive img-circle shaddow-lg" />
    </div>
  </div>
  <div class="d-flex">
    <div class="m-auto my-5">
      <button
        type="button"
        class="btn btn-block btn-lg button-login rounded shaddow-md"
        on:click={loginOutside}>
        <span>Continue with</span>
        <img src="img/sampleOne_logo.svg" alt="logo s1" class="s1" />
      </button>
    </div>
  </div>
{/if}
