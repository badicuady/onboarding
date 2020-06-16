<script>
  export let segment;
  export let user;
  $: seg = segment || "home";
</script>

{#if user && user.displayName && segment !== 'login'}
  <footer class="main-footer">
    <div class="container">
      <div class="row">
        <div class="col-lg-6">
          Copyright © {new Date().getFullYear()} Ipsos Interactive Services.
        </div>
        <div class="col-lg-6 text-right">
          <div class="float-right">
            <a href="/contact">Contact</a>
          </div>
		  <div class="float-right mr-3">{seg}</div>
        </div>
      </div>
    </div>
  </footer>
{/if}
