<script>
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  import { OpenTableItemType } from "../models/enums.js";
  import OpenActivitiesTable from "../components/OpenActivitiesTable.svelte";

  export let reviewData;
  export let reviewUniqueId;
  export let inputs = {};

  const dispatch = createEventDispatcher();
  inputs[`${reviewUniqueId}-date`] = new Date().toISOString().slice(0, 10);
  let showFurtherActions = reviewData.map(e => !!e);

  const itemBlur = e => {
    dispatch("itemBlur", { original: e, uniqueId: reviewUniqueId, inputs });
  };
</script>

<form>
  <div class="form-group row">
    <label for="{reviewUniqueId}-date" class="col-3 col-form-label">Date</label>
    <div class="col-9">
      <input
        id="{reviewUniqueId}-date"
        name="{reviewUniqueId}-date"
        type="date"
        class="form-control"
        bind:value={inputs[`${reviewUniqueId}-date`]} />
    </div>
  </div>

  <div class="form-group">
    <label for="{reviewUniqueId}-performance" class="col-form-label">
      If any areas of performance, conduct or attendance require improvement
      please provide details below:
    </label>
    <textarea
      id="{reviewUniqueId}-performance"
      name="{reviewUniqueId}-performance"
      class="form-control"
      bind:value={inputs[`${reviewUniqueId}-performance`]}
      on:blur={itemBlur} />
  </div>

  <div class="form-group">
    <label for="{reviewUniqueId}-concerns" class="col-form-label">
      If concerns have been identified, please summarise how these will be
      addressed during the remaining period of probation:
    </label>
    <textarea
      id="{reviewUniqueId}-concerns"
      name="{reviewUniqueId}-concerns"
      class="form-control"
      bind:value={inputs[`${reviewUniqueId}-concerns`]}
      on:blur={itemBlur} />
  </div>

  <div class="form-group">
    <label for="{reviewUniqueId}-sumarise" class="col-form-label">
      Summarise the employee's performance and progress over the period:
    </label>
    <textarea
      id="{reviewUniqueId}-sumarise"
      name="{reviewUniqueId}-sumarise"
      class="form-control"
      bind:value={inputs[`${reviewUniqueId}-sumarise`]}
      on:blur={itemBlur} />
  </div>

  <div class="container">
    {#each reviewData as data, ndx}
      <div class="row my-2 py-3">
        <div class="col-5">
          <div class="form-group row">
            <label
              for="{reviewUniqueId}-action-{ndx}"
              class="col-8 colcol-form-label">
              {data.question}
            </label>
            <div class="col-4">
              <div class="custom-control custom-switch">
                <input
                  class="custom-control-input"
                  type="checkbox"
                  id="{reviewUniqueId}-action-{ndx}"
                  name="{reviewUniqueId}-action-{ndx}"
                  data-id={ndx}
                  bind:checked={showFurtherActions[ndx]} />
                <label
                  class="custom-control-label"
                  for="{reviewUniqueId}-action-{ndx}" />
              </div>
            </div>
          </div>
        </div>
        <div class="col-7">
          {#if !showFurtherActions[ndx]}
            <div in:fade out:fade>
              <p>
                <label>If NO, what further action is required?</label>
              </p>
              <OpenActivitiesTable
                switchName="{reviewUniqueId}-action-{ndx}"
                info={data.actions}
                colWidths={[5, 50, 35, 10]}
                showDone={false} />
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</form>
