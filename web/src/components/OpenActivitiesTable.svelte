<script>
  import { onDestroy, createEventDispatcher } from "svelte";
  import config from "../config";
  import { OpenTableItemType } from "../models/enums.js";
  import { CacheKeys, CacheService } from "../services";

  export let info = {};
  export let inputs = {};
  export let colWidths;
  export let switchName;
  export let showDone = true;
  export let showClose = true;
  export let showAddNew = true;

  const dispatch = createEventDispatcher();

  let responsibles = [];
  let timespans = [];
  const rowValsHeaders = info.rowValsHeaders ? info.rowValsHeaders : [""];
  const cacheSubscribe = CacheService.subscribe(cache => {
    timespans = cache.get(CacheKeys.Timespans) || {};
    responsibles = cache.get(CacheKeys.Responsibles) || {};
  });

  onDestroy(() => {
    cacheSubscribe();
  });

  const addNewRow = e => {
    dispatch("addNewRow", { original: e, inputs: { ...inputs } });
    for (const ndx in inputs) {
      if (inputs.hasOwnProperty(ndx)) {
        inputs[ndx] = "";
      }
    }
  };

  const doneChange = (e, id) => {
    dispatch("doneChange", { original: e, id });
  };

  const deleteClicked = (e, id) => {
    dispatch("deleteClicked", { original: e, id });
  };

  const itemBlur = (e, type, userType) => {
    dispatch("itemBlur", { original: e, type, userType });
  };
</script>

{#if info && info.columns && info.columnVals && info.data}
  <form>
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
        {#each info.data as row, rowndx (row)}
          <tr data-id={row.id}>
            <th scope="row" style="width:{colWidths[0]}%">{rowndx + 1}</th>
            {#each row.cells as cell, colndx}
              <td style="width:{colWidths[colndx + 1]}%">{cell}</td>
            {/each}
            {#if showDone}
              <td style="width:{colWidths[colWidths.length - 2]}%">
                <div class="custom-control custom-switch">
                  <input
                    class="custom-control-input"
                    type="checkbox"
                    id="{switchName}-{rowndx}"
                    name="{switchName}-{rowndx}"
                    data-id={rowndx}
                    checked={row.done === true}
                    on:change={e => doneChange(e, row.id)} />
                  <label
                    class="custom-control-label"
                    for="{switchName}-{rowndx}" />
                </div>
              </td>
            {/if}
            {#if showClose}
              <td style="width:{colWidths[colWidths.length - 1]}%">
                <button
                  type="button"
                  class="close text-danger float-none mx-auto d-block"
                  aria-label="Close"
                  on:click={e => deleteClicked(e, row.id)}>
                  <h2>
                    <span aria-hidden="true">&times;</span>
                  </h2>
                </button>
              </td>
            {/if}
          </tr>
        {/each}
        {#each rowValsHeaders as header, ndx}
          <tr>
            <th scope="row" style="width:{colWidths[0]}%">
              {info.data.length + ndx + 1}
            </th>
            {#if header}
              <td>{header}</td>
            {/if}
            {#each info.columnVals as vals, ndxvals}
              <td style="width:{colWidths[ndxvals + 1]}%">
                {#if vals instanceof Array}
                  <select
                    placeholder="Select one"
                    class="form-control"
                    name="{switchName}-select-{ndx}-{ndxvals}"
                    id="{switchName}-select-{ndx}-{ndxvals}"
                    bind:value={inputs[`${switchName}-${ndx}-${ndxvals}`]}>
                    <option value="" selected disabled>--</option>
                    {#each vals as item, itemndx}
                      <option
                        value={item.key}
                        data-index={itemndx}
                        disabled={(item.value || '').length === 0}>
                        {item.value}
                      </option>
                    {/each}
                  </select>
                {:else if vals === OpenTableItemType.single}
                  <input
                    type="text"
                    class="form-control"
                    name="{switchName}-input-text-{ndx}-{ndxvals}"
                    id="{switchName}-input-text-{ndx}-{ndxvals}"
                    bind:value={inputs[`${switchName}-${ndx}-${ndxvals}`]} />
                {:else if vals === OpenTableItemType.multi}
                  <textarea
                    class="form-control"
                    name="{switchName}-text-{ndx}-{ndxvals}"
                    id="{switchName}-text-{ndx}-{ndxvals}"
                    bind:value={inputs[`${switchName}-${ndx}-${ndxvals}`]}
                    on:blur={e => itemBlur(e, ndx, ndxvals)} />
                {:else if vals === OpenTableItemType.check}
                  <div class="custom-control custom-switch">
                    <input
                      type="checkbox"
                      class="custom-control-input"
                      name="{switchName}-checkbox-{ndx}-{ndxvals}"
                      id="{switchName}-checkbox-{ndx}-{ndxvals}"
                      data-id="{ndx}-{ndxvals}"
                      bind:checked={inputs[`${switchName}-${ndx}-${ndxvals}`]} />
                    <label
                      class="custom-control-label"
                      for="{switchName}-checkbox-{ndx}-{ndxvals}" />
                  </div>
                {:else if vals === OpenTableItemType.date}
                  <input
                    type="date"
                    class="form-control"
                    name="{switchName}-date-{ndx}-{ndxvals}"
                    id="{switchName}-date-{ndx}-{ndxvals}"
                    bind:value={inputs[`${switchName}-${ndx}-${ndxvals}`]} />
                {/if}
              </td>
            {/each}
            {#if showDone}
              <td style="width:{colWidths[colWidths.length - 2]}%">
                <div class="custom-control custom-switch">
                  <input
                    class="custom-control-input"
                    type="checkbox"
                    id="{switchName}-done-{ndx}-{colWidths.length - 3}"
                    name="{switchName}-done-{ndx}-{colWidths.length - 3}"
                    data-id="{ndx}-{colWidths.length - 3}"
                    bind:checked={inputs[`${switchName}-${ndx}-${colWidths.length - 3}`]} />
                  <label
                    class="custom-control-label"
                    for="{switchName}-done-{ndx}-{colWidths.length - 3}" />
                </div>
              </td>
            {/if}
            {#if showClose}
              <td style="width:{colWidths[colWidths.length - 1]}%">&nbsp;</td>
            {/if}
          </tr>
        {/each}
      </tbody>
    </table>
  </form>
  {#if showAddNew}
    <button
      type="button"
      class="btn btn-block btn-sm mt-3 {config.buttonClassColor}"
      on:click={addNewRow}>
      Add new row
    </button>
  {/if}
{/if}
