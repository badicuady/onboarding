<script>
  import { createEventDispatcher } from "svelte";
  import {
    CacheKeys,
    CacheService,
    StateService,
    StateInfo
  } from "../services";

  export let colWidths;
  export let info;
  export let details = new Set();

  const data = info.information;
  const columns = info.columns;
  const radicalName = info.radicalName;
  const group = info.group;

  const dispatch = createEventDispatcher();

  const doneChange = e => {
    dispatch("doneChange", { original: e });
  };
</script>

{#if columns && data}
  <table class="table table-hover table-striped">
    <thead class="teal white-text">
      <tr>
        <th scope="col" style="width:{colWidths[0]}%">#</th>
        {#each columns as col, ndx}
          <th scope="col" style="width:{colWidths[ndx + 1]}%">{col}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each data as row, rowndx (row)}
        <tr>
          <th scope="row" style="width:{colWidths[0]}%">{rowndx + 1}</th>
          {#each row.data as cell, colndx (cell)}
            <td style="width:{colWidths[colndx + 1]}%">{@html cell}</td>
          {/each}
          <td style="width:{colWidths[colWidths.length - 1]}%">
            <div class="custom-control custom-switch">
              <input
                class="custom-control-input"
                type="checkbox"
                name="{radicalName}_{rowndx + 1}"
                id="{radicalName}_{rowndx + 1}"
                checked={details.has(row.id)}
                data-id={row.id}
                data-group={group}
                on:change={doneChange} />
              <label
                class="custom-control-label"
                for="{radicalName}_{rowndx + 1}" />
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
