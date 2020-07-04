<script>
  import config from "../config";
  import Layout from "../components/Layout.svelte";
  import { contacts } from "../services/activities.service";

  $: contacts1 = contacts.slice(0, Math.ceil(contacts.length / 2))
  $: contacts2 = contacts.slice(Math.ceil(contacts.length / 2), contacts.length)
</script>

<Layout>
  <div slot="content-header" class="container">
    <div class="row">
      <div class="col-6">
        <h1 class="m-0 text-dark">Contacts</h1>
      </div>
      <div class="col-6">
        <ol class="breadcrumb float-right">
          <li class="breadcrumb-item">
            <a href="##" on:click={config.preventEvent}>contacts</a>
          </li>
          <li class="breadcrumb-item active">Contacts</li>
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
              Meet the HR team
            </div>
          </div>
          <div class="card-body row">
            <div class="col-12 col-lg-6 pr-lg-3">
              <ul class="list-unstyled">
                {#each contacts1 as contact, ndx (contact)}
                  <li
                    class={(ndx < contacts.length - 1 ? 'mb-5 ' : '') + 'media'}>
                    <img
                      class="mr-3 img-thumbnail rounded-circle"
                      src={contact.image}
                      alt={contact.name}
                      width="96"
                      height="96" />
                    <div class="media-body">
                      <h5 class="mt-0 mb-1">{contact.name}</h5>
                      <h6 class="mt-0 mb-1 font-weight-bold">
                        <a href="mailto:{contact.email}">{contact.email}</a>
                      </h6>
                      <div>{contact.description}</div>
                    </div>
                  </li>
                {/each}
              </ul>
            </div>
            <div class="col-12 mt-5 col-lg-6 pl-lg-3 mt-lg-0">
              <ul class="list-unstyled">
                {#each contacts2 as contact, ndx (contact)}
                  <li
                    class={(ndx < contacts.length - 1 ? 'mb-5 ' : '') + 'media'}>
                    <img
                      class="mr-3 img-thumbnail rounded-circle"
                      src={contact.image}
                      alt={contact.name}
                      width="96"
                      height="96" />
                    <div class="media-body">
                      <h5 class="mt-0 mb-1">{contact.name}</h5>
                      <h6 class="mt-0 mb-1 font-weight-bold">
                        <a href="mailto:{contact.email}">{contact.email}</a>
                      </h6>
                      {contact.description}
                    </div>
                  </li>
                {/each}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</Layout>
