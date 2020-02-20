<script>
  import { onMount, onDestroy } from "svelte";
  import { goto } from "@sapper/app";
  import config from "../config";
  import services from "../services/index.mjs";
  const sessionService = new services.sessionService();

  const encodedParams = JSON.stringify(config.loginParams)
    .replace(/[\{\}\"]/gim, "")
    .replace(/\:/gim, "=")
    .replace(/\,/gim, "&");
  const iFrameSrc = `${config.loginPage}?${encodedParams}`;

  let loginWindow = null;

  onMount(async () => {
    window.addEventListener("message", receiveMessage);
  });

  onDestroy(async () => {
    loginWindow = null;
  });

  const receiveMessage = async event => {
    await sessionService.update({
      data: { user: { ...event.data } }
    });
    goto("/");
  };

  const loginOutside = async () => {
    loginWindow = window.open(iFrameSrc, "Login");
  };
</script>

{#if !loginWindow}
  <div>
    <img src="onboarding_1.jpg" alt="logo" class="logo" />
    <button class="button-login" on:click={loginOutside}>
      <span>Continue with</span>
      <img src="sampleOne_logo.svg" alt="logo s1" class="s1" />
    </button>
  </div>
{/if}
