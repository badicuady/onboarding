<script>
  import { onMount, onDestroy } from "svelte";
  import {
    CacheKeys,
    CacheService,
    UsersService
  } from "../services";

  export let colWidths;
  export let info;
  export let radicalName;
  export let group;
  export let padding;

  const defaultPadding = { 1: 0, 2: 0, 3: 0, 4: 0, ...padding };

  let usersService;
  let userModel;
  let toCheck = new Set();

  const cacheSubscribe = CacheService.subscribe(cache => {
    const token = cache.get(CacheKeys.Token);
    userModel = cache.get(CacheKeys.UserInfo);
    if (token) {
      usersService = new UsersService(token.access_token);
    }
  });

  onMount(async () => {
    if (usersService) {
      const userMandatoryTopics = await usersService.getUserMandatoryTopics(
        userModel.id
      );
      if (userMandatoryTopics && userMandatoryTopics.data) {
        toCheck = userMandatoryTopics.data.reduce(
          (all, e) => all.add(+e.mandatoryTopicsId),
          toCheck
        );
      }
    }
  });

  onDestroy(() => {
    cacheSubscribe();
  });

  const checkboxChange = async e => {
    if (usersService) {
      const mandatoriTopicsId =
        (+e.target.dataset.group - 1) * 10 + +e.target.dataset.id;
      const response = await usersService.updateUserMandatoryTopics(
        userModel.id,
        mandatoriTopicsId,
        !!e.target.checked
      );
    }
  };
</script>

{#if info && info.columns && info.data}
  <table class="table table-hover table-striped">
    <thead class="teal white-text">
      <tr>
        <th scope="col" style="width:{colWidths[0]}%">#</th>
        {#each info.columns as col, ndx}
          <th scope="col" style="width:{colWidths[ndx + 1]}%">{col}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each info.data as row, rowndx}
        <tr>
          <th scope="row" style="width:{colWidths[0]}%">{rowndx + 1}</th>
          {#each row as cell, colndx}
            <td style="width:{colWidths[colndx + 1]}%">{cell}</td>
          {/each}
          <td style="width:{colWidths[colWidths.length - 1]}%">
            <div class="custom-control custom-switch">
              <input
                class="custom-control-input"
                type="checkbox"
                name="{radicalName}_{defaultPadding[group] + rowndx + 1}"
                id="{radicalName}_{defaultPadding[group] + rowndx + 1}"
                checked={toCheck.has((group - 1) * 10 + defaultPadding[group] + rowndx + 1)}
                data-id={defaultPadding[group] + rowndx + 1}
                data-group={group}
                on:change={checkboxChange} />
              <label
                class="custom-control-label"
                for="{radicalName}_{defaultPadding[group] + rowndx + 1}" />
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
