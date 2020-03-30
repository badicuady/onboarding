<script>
  import { OpenTableItemType } from "../models/enums.js";

  export let info = {};
  export let colWidths;
  export let switchName;
  export let showDone = true;
  export let showClose = true;
  export let showAddNew = true;

  const rowValsHeaders = info.rowValsHeaders ? info.rowValsHeaders : [""];

  const validate = e => {
    console.log(e);
  };
</script>

{#if info && info.columns && info.columnVals}
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
        {#each info.data as row, rowndx}
          <tr>
            <th scope="row" style="width:{colWidths[0]}%">{rowndx + 1}</th>
            {#each row as cell, colndx}
              <td style="width:{colWidths[colndx + 1]}%">{cell}</td>
            {/each}
            {#if showDone}
              <td style="width:{colWidths[colWidths.length - 2]}%">
                <div class="custom-control custom-switch">
                  <input
                    class="custom-control-input"
                    type="checkbox"
                    id="{switchName}_{rowndx}"
                    name="{switchName}_{rowndx}"
                    data-id={rowndx} />
                  <label
                    class="custom-control-label"
                    for="{switchName}_{rowndx}" />
                </div>
              </td>
            {/if}
            {#if showClose}
              <td style="width:{colWidths[colWidths.length - 1]}%">
                <button
                  type="button"
                  class="close text-danger float-none mx-auto d-block"
                  aria-label="Close">
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
                    id="{switchName}-select-{ndx}-{ndxvals}">
                    {#each vals as item, itemndx}
                      <option
                        value={item.key}
                        data-index={itemndx}
                        disabled={(item.value || '').length === 0}
                        selected={(item.value || '').length === 0}>
                        {item.value}
                      </option>
                    {/each}
                  </select>
                {:else if vals === OpenTableItemType.single}
                  <input
                    type="text"
                    class="form-control"
                    name="{switchName}-input-text-{ndx}-{ndxvals}"
                    id="{switchName}-input-text-{ndx}-{ndxvals}" />
                {:else if vals === OpenTableItemType.multi}
                  <textarea
                    class="form-control"
                    name="{switchName}-text-{ndx}-{ndxvals}"
                    id="{switchName}-text-{ndx}-{ndxvals}" />
                {:else if vals === OpenTableItemType.check}
                  <div class="custom-control custom-switch">
                    <input
                      type="checkbox"
                      class="custom-control-input"
                      name="{switchName}-checkbox-{ndx}-{ndxvals}"
                      id="{switchName}-checkbox-{ndx}-{ndxvals}"
                      data-id="{ndx}-{ndxvals}" />
                    <label
                      class="custom-control-label"
                      for="{switchName}-checkbox-{ndx}-{ndxvals}" />
                  </div>
                {:else if vals === OpenTableItemType.date}
                  <input
                    type="date"
                    class="form-control"
                    name="{switchName}-date-{ndx}-{ndxvals}"
                    id="{switchName}-date-{ndx}-{ndxvals}" />
                {/if}
              </td>
            {/each}
            {#if showDone}
              <td style="width:{colWidths[colWidths.length - 2]}%">
                <div class="custom-control custom-switch">
                  <input
                    class="custom-control-input"
                    type="checkbox"
                    id="{switchName}_{info.data.length + 1}"
                    name="{switchName}_{info.data.length + 1}"
                    data-id={info.data.length + 1} />
                  <label
                    class="custom-control-label"
                    for="{switchName}_{info.data.length + 1}" />
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
      class="btn btn-primary btn-block btn-sm mt-3"
      on:click={validate}>
      Add new row
    </button>
  {/if}
{/if}
