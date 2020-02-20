<script context="module">
  export async function preload(page, session) {
    const { data } = session;
    if (page.path.replace(/\/login/gim, "").length !== 0) {
      if (!data.user) {
        return this.redirect(302, "/login");
      }
    }
  }
</script>

<script>
  import { onMount, onDestroy } from "svelte";
  import Nav from "../components/Nav.svelte";
  import services from "../services/index.mjs";
  const sessionService = new services.sessionService();

  export let segment;
  let user;
  let sessionUnsubscribe;

  onMount(async () => {
    sessionService.subscribe(s => {
      user = s.data.user;
    });
  });

  onDestroy(async () => {
    sessionService.unsubscribe();
  });
</script>

<style>
  main {
    position: relative;
    max-width: 56em;
    background-color: white;
    padding: 2em;
    margin: 0 auto;
    box-sizing: border-box;
  }
</style>

{#if user}
  <div>User: {user.enc_key}</div>
  <Nav {segment} />
{/if}

<main>
  <slot />
</main>
