<script>
  import { onMount } from "svelte";
  import config from "../config";
  import Layout from "../components/Layout.svelte";

  const init = () => {
    const ctx = document.getElementById("raport1").getContext("2d");
    const chart = new Chart(ctx, {
      // The type of chart we want to create
      type: "line",

      // The data for our dataset
      data: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July"
        ],
        datasets: [
          {
            label: "My First dataset",
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 132)",
            data: [0, 10, 5, 2, 20, 30, 45]
          }
        ]
      },

      // Configuration options go here
      options: {
        responsive: true,
        tooltips: {
          mode: "index"
        }
      }
    });
  };

  onMount(init);
</script>

<svelte:head>
  <title>Reports</title>
</svelte:head>

<Layout>
  <div slot="content-header" class="container">
    <div class="row">
      <div class="col-lg-6">
        <h1 class="m-0 text-dark">Reports</h1>
      </div>
      <div class="col-sm-6">
        <ol class="breadcrumb float-sm-right">
          <li class="breadcrumb-item">
            <a href="##" on:click={config.preventEvent}>reports</a>
          </li>
          <li class="breadcrumb-item active">Onboarding Form</li>
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
              Report
            </div>
          </div>
          <div class="card-body">
            <p>
              <canvas id="raport1" class="col-lg-12" />
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</Layout>
