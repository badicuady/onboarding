<script>
  import config from "../config";
  import Layout from "../components/Layout.svelte";
  import { resources } from "../services/activities.service";
</script>

<Layout>
  <div slot="content-header" class="container">
    <div class="row">
      <div class="col-6">
        <h1 class="m-0 text-dark">Resources</h1>
      </div>
      <div class="col-6">
        <ol class="breadcrumb float-right">
          <li class="breadcrumb-item">
            <a href="##" on:click={config.preventEvent}>resources</a>
          </li>
          <li class="breadcrumb-item active">Resources</li>
        </ol>
      </div>
    </div>
  </div>
  <div slot="content" class="container">
    <div class="row">
      <div class="col-lg-12">

        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <i class="fas fa-text-width" />
              List of resources (click to follow the link)
            </div>
          </div>
          <div class="card-body">
            <div class="list-group">
              {#each resources as resource, ndx (resource)}
                <a
                  href={resource.link}
                  target="_blank"
                  class="list-group-item list-group-item-action flex-column
                  align-items-start">
                  <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1 font-weight-bold">{resource.title}&nbsp;{ndx}</h5>
                  </div>
                  <p class="mb-1">{resource.description}</p>
                </a>
              {/each}
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</Layout>
