<script>
  export let segment;
  export let user;
  $: seg = segment || "home";
</script>

{#if user && user.fullName}
  <footer class="main-footer">
    <div class="container">
      <div class="row">
        <div class="col-lg-6">
          Copyright © {new Date().getFullYear()} Ipsos Interactive Services.
        </div>
        <div class="col-lg-6 text-right">{seg}</div>
      </div>
    </div>
  </footer>
{/if}
