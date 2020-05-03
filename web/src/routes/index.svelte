<script>
  import { onMount, onDestroy } from "svelte";
  import { CacheKeys, CacheService } from "../services";
  import Activities from "../components/Activities.svelte";

  let userModel;

  const cacheSubscribe = CacheService.subscribe(cache => {
    userModel = cache.get(CacheKeys.UserInfo);
  });

  onDestroy(() => {
    cacheSubscribe();
  });
</script>

<Activities
  pageTitle={`Onboarding Form ${userModel.isManager ? "Managers" : "Specialists"}`}
  mode={userModel.isManager ? 'Managers' : 'Specialists'} />
