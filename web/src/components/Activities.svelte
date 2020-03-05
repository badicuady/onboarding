<script>
  import { OpenTableItemType } from "../models/enums.js";
  import Layout from "./Layout.svelte";
  import ActivitiesTable from "./ActivitiesTable.svelte";
  import OpenActivitiesTable from "./OpenActivitiesTable.svelte";

  export let mode;
  export let pageTitle;
  export let welcomeToIss;
  export let complianceTopics;
  export let iisAps;
  export let trainings;

  export let topics;
  export let subjects;

  mode = (mode || "").toLowerCase();
  const colWidths = [5, 25, 30, 10, 10, 15, 5];
  const tableCards = [
    { title: "Welcome to IIS", information: welcomeToIss, id: "one" },
    { title: "Compliance Topics", information: complianceTopics, id: "two" },
    { title: "IIS Apps", information: iisAps, id: "three" },
    { title: "Trainings / workshops", information: trainings, id: "four" }
  ];

  const feedbackMonth1 = {
    columns: [
      "Feedback after one month",
      "Employee",
      "Fellow",
      "Line Manager & HR",
      "Other Comments"
    ],
    data: [],
    columnVals: [
      OpenTableItemType.multi,
      OpenTableItemType.multi,
      OpenTableItemType.multi,
      OpenTableItemType.multi
    ],
    rowValsHeaders: ["Strong points", "Week points", "Improvement Area"]
  };

  const feedbackMonth3 = {
    columns: [...feedbackMonth1.columns],
    data: [],
    columnVals: [...feedbackMonth1.columnVals],
    rowValsHeaders: [...feedbackMonth1.rowValsHeaders]
  };
  feedbackMonth3.columns[0] = "Feedback after 3 months";

  const feedbackMonth6 = {
    columns: [...feedbackMonth1.columns],
    data: [],
    columnVals: [...feedbackMonth1.columnVals],
    rowValsHeaders: [...feedbackMonth1.rowValsHeaders]
  };
  feedbackMonth6.columns[0] = "Feedback at the end of 6 months";

  const feedbackAll = [feedbackMonth1, feedbackMonth3, feedbackMonth6];
</script>

<svelte:head>
  <title>{pageTitle}</title>
</svelte:head>

<Layout>
  <div slot="content-header" class="container">
    <div class="row">
      <div class="col-lg-6">
        <h1 class="m-0 text-dark">Onboarding Form</h1>
      </div>
      <div class="col-sm-6">
        <ol class="breadcrumb float-sm-right">
          <li class="breadcrumb-item">
            <a href="#">{mode}</a>
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
              Information
            </div>
          </div>
          <div class="card-body p-0">
            <ol class="mt-2">
              <li>
                The onboarding plan schedule has to be inserted by the line
                manager.
              </li>
              <li>
                For transferred employees, the mandatory topics can be reviewed
                and adapted according to new job requirements.
              </li>
              <li>
                In a final feedback session the line manager and the employee
                evaluate jointly the effectiveness of the proceeded
                trainings/instructions.
              </li>
              <li>
                Training content that was not trained effectively will be
                integrated in an individual development plan.
              </li>
            </ol>
            <form class="form-horizontal">
              <div class="card-body">
                <div class="form-group row">
                  <label for="entryDate" class="col-sm-2 col-form-label">
                    Entry date:
                  </label>
                  <div class="col-sm-10">
                    <input
                      disabled
                      type="date"
                      class="form-control"
                      id="entryDate"
                      value={new Date().toISOString().slice(0, 10)} />
                  </div>
                </div>
                <div class="form-group row">
                  <label for="endOfProbation" class="col-sm-2 col-form-label">
                    End of probation:
                  </label>
                  <div class="col-sm-10">
                    <input
                      disabled
                      type="date"
                      class="form-control"
                      id="endOfProbation"
                      value={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                        .toISOString()
                        .slice(0, 10)} />
                  </div>
                </div>
              </div>
              <!-- /.card-body -->
            </form>
          </div>
        </div>
        <!--card-->

        <div class="card">
          <div class="card-header">
            <div class="card-title">Mandatory topics for {mode} positions</div>
          </div>
          <!-- card-header -->
          <div class="card-body">
            <div id="accordion-{mode}-mandatory">
              {#each tableCards as tableInfo}
                <div class="card">
                  <div class="card-header bg-navy">
                    <h4 class="card-title bg-navy">
                      <a
                        data-toggle="collapse"
                        data-target="#{mode}-collapse-{tableInfo.id}"
                        href="#{mode}-collapse-{tableInfo.id}">
                        {tableInfo.title}
                      </a>
                    </h4>
                  </div>
                  <div
                    data-parent="#accordion-{mode}-mandatory"
                    id="{mode}-collapse-{tableInfo.id}"
                    class="panel-collapse collapse">
                    <div class="card-body table-responsive">
                      <ActivitiesTable
                        info={tableInfo.information}
                        {colWidths} />
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
          <!--card-body -->
        </div>
        <!--card -->

        <div class="card">
          <div class="card-header">
            <div class="card-title">Specific topics for {mode} positions</div>
          </div>
          <!-- card-header -->
          <div class="card-body">
            <div id="accordion-{mode}-specific">
              <div class="card">
                <div class="card-header bg-navy">
                  <h4 class="card-title bg-navy">
                    <a
                      data-toggle="collapse"
                      data-target="#{mode}-collapse-topics"
                      href="#{mode}-collapse-topics">
                      Specific technical topics and trainings (to be prepared by
                      employee and supervisor)
                    </a>
                  </h4>
                </div>
                <div
                  data-parent="#accordion-{mode}-specific"
                  id="{mode}-collapse-topics"
                  class="panel-collapse collapse">
                  <div class="card-body table-responsive">
                    <OpenActivitiesTable
                      switchName="{mode}-topics"
                      info={topics}
                      {colWidths} />
                  </div>
                </div>
              </div>

              <div class="card">
                <div class="card-header bg-navy">
                  <h4 class="card-title bg-navy">
                    <a
                      data-toggle="collapse"
                      data-target="#{mode}-collapse-subjects"
                      href="#{mode}-collapse-subjects">
                      Subjects that are to be integrated in an individual
                      development plan
                    </a>
                  </h4>
                </div>
                <div
                  data-parent="#accordion-{mode}-specific"
                  id="{mode}-collapse-subjects"
                  class="panel-collapse collapse">
                  <div class="card-body table-responsive">
                    <OpenActivitiesTable
                      switchName="{mode}-subjects"
                      info={subjects}
                      {colWidths} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--card-body -->
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">Feedback section for {mode} positions</div>
          </div>
          <!-- card-header -->
          <div class="card-body">
            <div id="accordion-{mode}-feedback">
              {#each feedbackAll as feedback, ndx}
                <div class="card">
                  <div class="card-header bg-navy">
                    <h4 class="card-title bg-navy">
                      <a
                        data-toggle="collapse"
                        data-target="#{mode}-collapse-month-{ndx}"
                        href="#{mode}-collapse-month-{ndx}">
                        {feedback.columns[0]}
                      </a>
                    </h4>
                  </div>
                  <div
                    data-parent="#accordion-{mode}-feedback"
                    id="{mode}-collapse-month-{ndx}"
                    class="panel-collapse collapse">
                    <div class="card-body table-responsive">
                      <OpenActivitiesTable
                        info={feedback}
                        switchName="feedback-{ndx}"
                        colWidths={[5, 19, 19, 19, 19, 19]}
                        showAddNew={false}
                        showClose={false}
                        showDone={false} />
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
          <!--card-body -->
        </div>
        <!--card -->

      </div>
      <!-- col-lg-12 -->
    </div>
    <!-- row -->
  </div>
  <!-- container -->
</Layout>
