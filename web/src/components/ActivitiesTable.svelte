<script>
  export let colWidths;
  export let info;
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
            <input
              class="invisible"
              type="checkbox"
              name="welcomeToIss_{rowndx}"
              data-bootstrap-switch
              data-off-color="danger"
              data-on-color="success"
              data-on-text="Yes"
              data-off-text="No" />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
