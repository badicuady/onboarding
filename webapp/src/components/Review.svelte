<script>
  import { OpenTableItemType } from "../models/enums.js";
  import OpenActivitiesTable from "../components/OpenActivitiesTable.svelte";

  export let reviewData;
  export let reviewUniqueId;
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
        readonly
        value={new Date().toISOString().slice(0, 10)} />
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
      class="form-control" />
  </div>

  <div class="form-group">
    <label for="{reviewUniqueId}-concerns" class="col-form-label">
      If concerns have been identified, please summarise how these will be
      addressed during the remaining period of probation:
    </label>
    <textarea
      id="{reviewUniqueId}-concerns"
      name="{reviewUniqueId}-concerns"
      class="form-control" />
  </div>

  <div class="form-group">
    <label for="{reviewUniqueId}-sumarise" class="col-form-label">
      Summarise the employee's performance and progress over the period:
    </label>
    <textarea
      id="{reviewUniqueId}-sumarise"
      name="{reviewUniqueId}-sumarise"
      class="form-control" />
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
              <input
                class="invisible"
                type="checkbox"
                id="{reviewUniqueId}-action-{ndx}"
                name="{reviewUniqueId}-action-{ndx}"
                data-bootstrap-switch
                data-off-color="danger"
                data-on-color="success"
                data-on-text="Yes"
                data-off-text="No" />
            </div>
          </div>
        </div>
        <div class="col-7">
          <p>
            <label>If NO, what further action is required?</label>
          </p>
          <OpenActivitiesTable
            switchName="{reviewUniqueId}-action-{ndx}"
            info={data.actions}
            colWidths={[5, 50, 35, 10]}
            showDone={false} />
        </div>
      </div>
    {/each}
  </div>
</form>
