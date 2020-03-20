<script>
  import Layout from "../components/Layout.svelte";
  import { OpenTableItemType } from "../models/enums.js";
  import OpenActivitiesTable from "../components/OpenActivitiesTable.svelte";
  import Review from "../components/Review.svelte";
  import { CacheService, CacheKeys } from "../services";

  let userInfo;
  CacheService.subscribe(cache => {
	userInfo = cache.get(CacheKeys.UserInfo);
  });

  const objectives = {
    columns: [
      "Objective Description",
      "Deadline",
      "Responsible for support",
      "Close"
    ],
    data: [
      ["Objective 1", "2020-03-01", "Cineva CuHalva"],
      ["Objective 2", "2020-03-01", "Cineva CuHalva"]
    ],
    columnVals: [
      OpenTableItemType.single,
      OpenTableItemType.date,
      OpenTableItemType.single
    ]
  };

  const developmentPlan = {
    columns: [
      "Development need",
      "Deadline",
      "Responsible for support",
      "Close"
    ],
    data: [
      ["Development 1", "2020-03-01", "Cineva CuHalva"],
      ["Development 2", "2020-03-01", "Cineva CuHalva"]
    ],
    columnVals: [
      OpenTableItemType.single,
      OpenTableItemType.date,
      OpenTableItemType.single
    ]
  };

  const partOneInfo = [
    {
      title: "Objectives",
      headline: `The line manager should identify specific objectives for the employee for the first three months / four months.
		  These will be statements of what should be achieved during the probationary period, 
		  including indicators of success and timescales for achievement.`,
      info: objectives,
      uniqueId: "objectives"
    },
    {
      title: "Development Plan",
      headline: `To support the employee in achieving these objectives, the line manager should identify 
		any training and development needs and specify how and when these needs will be addressed 
		during the probationary period.`,
      info: developmentPlan,
      uniqueId: "development-plan"
    }
  ];

  const firstReviewAction1 = {
    columns: ["Required actions", "Review Date", "Delete"],
    data: [["Action 1", "2020-03-01"], ["Action 2", "2020-03-01"]],
    columnVals: [OpenTableItemType.single, OpenTableItemType.date]
  };

  const firstReviewData = [
    {
      question:
        "Have the objectives identified for this period of the probation been met?",
      actions: Object.assign({}, firstReviewAction1)
    },
    {
      question:
        "Have the training / development needs identified for this period of the probation been addressed?",
      actions: Object.assign({}, firstReviewAction1)
    }
  ];

  const secondReviewData = [
    Object.assign({}, firstReviewData[0]),
    Object.assign({}, firstReviewData[1])
  ];

  const finalReviewData = [
    Object.assign({}, firstReviewData[0]),
    Object.assign({}, firstReviewData[1])
  ];
</script>

<svelte:head>
  <title>Probationary period goals</title>
</svelte:head>

<Layout>
  <div slot="content-header" class="container">
    <div class="row">
      <div class="col-lg-6">
        <h1 class="m-0 text-dark">Probationary period plan</h1>
      </div>
      <div class="col-sm-6">
        <ol class="breadcrumb float-sm-right">
          <li class="breadcrumb-item">
            <a href="#">golas</a>
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
          <div class="card-body">
            <p>
              This form should be completed during the employee's probationary
              period. The line manager should ensure the employee is given a
              copy of this document at each stage of their probationary period
              and should retain the original to monitor progress against set
              objectives at follow-up meetings.
            </p>
            <form>
              <div class="container">
                <div class="row">
                  <div class="col-7">
                    <div class="form-group row">
                      <label for="employee-name" class="col-3 col-form-label">
                        Employee Name
                      </label>
                      <div class="col-9">
                        <input
                          id="employee-name"
                          name="employee-name"
                          type="text"
                          class="form-control"
                          readonly
						  value={userInfo.name} />
                      </div>
                    </div>
                    <div class="form-group row">
                      <label for="job-title" class="col-3 col-form-label">
                        Job Title
                      </label>
                      <div class="col-9">
                        <input
                          id="job-title"
                          name="job-title"
                          type="text"
                          class="form-control"
                          readonly
						  value={userInfo.title} />
                      </div>
                    </div>
                    <div class="form-group row">
                      <label for="line-manager" class="col-3 col-form-label">
                        Line Manager
                      </label>
                      <div class="col-9">
                        <input
                          id="line-manager"
                          name="line-manager"
                          type="text"
                          class="form-control"
                          readonly
						  value={userInfo.manager} />
                      </div>
                    </div>
                  </div>
                  <div class="col-5">
                    <div class="form-group row">
                      <label for="start-date" class="col-3 col-form-label">
                        Start date
                      </label>
                      <div class="col-9">
                        <input
                          id="start-date"
                          name="start-date"
                          type="date"
                          class="form-control"
                          readonly
                          value={new Date().toISOString().slice(0, 10)} />
                      </div>
                    </div>
                    <div class="form-group row">
                      <label for="department" class="col-3 col-form-label">
                        Department
                      </label>
                      <div class="col-9">
                        <input
                          id="department"
                          name="department"
                          type="text"
                          class="form-control"
                          readonly
						  value={userInfo.department} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </form>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <i class="fas fa-text-width" />
              Part One: Initial meeting
            </div>
          </div>
          <div class="card-body">
            <p>
              This section should be completed by the line manager within 3 days
              of the employee commencing their employment.
            </p>

            <div id="accordion-part-one">
              {#each partOneInfo as cardInfo}
                <div class="card">
                  <div class="card-header bg-navy">
                    <h4 class="card-title bg-navy">
                      <a
                        data-toggle="collapse"
                        data-target="#part-one-collapse-{cardInfo.uniqueId}"
                        href="#part-one-collapse-{cardInfo.uniqueId}">
                        {cardInfo.title}
                      </a>
                    </h4>
                  </div>
                  <div
                    data-parent="#accordion-part-one"
                    id="part-one-collapse-{cardInfo.uniqueId}"
                    class="panel-collapse collapse">
                    <div class="card-body table-responsive">
                      <p>{cardInfo.headline}</p>
                      <OpenActivitiesTable
                        switchName={cardInfo.title.toLowerCase()}
                        info={cardInfo.info}
                        colWidths={[5, 45, 20, 20, 10]}
                        showDone={false} />
                    </div>
                  </div>
                </div>
              {/each}
            </div>

          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <i class="fas fa-text-width" />
              Part Two: Review
            </div>
          </div>
          <div class="card-body">
            <div id="accordion-part-two">

              <div class="card">
                <div class="card-header bg-navy">
                  <h4 class="card-title bg-navy">
                    <a
                      data-toggle="collapse"
                      data-target="#part-one-collapse-first-review"
                      href="#part-one-collapse-first-review">
                      First Review (after one month)
                    </a>
                  </h4>
                </div>
                <div
                  data-parent="#accordion-part-two"
                  id="part-one-collapse-first-review"
                  class="panel-collapse collapse">
                  <div class="card-body table-responsive">
                    <p>
                      This is a gateway review which employee must pass through.
                      In the event that there are major concerns at this time
                      then HR advice should be sought, and options discussed.
                      The line manager and HR should continue to monitor the
                      situation. In all other circumstances the objectives
                      should be reviewed and updated as necessary and feedback
                      provided to the employee on their performance.
                    </p>
                    <Review
                      reviewUniqueId="first-review"
                      reviewData={firstReviewData} />
                  </div>
                </div>
              </div>

              <div class="card">
                <div class="card-header bg-navy">
                  <h4 class="card-title bg-navy">
                    <a
                      data-toggle="collapse"
                      data-target="#part-one-collapse-second-review"
                      href="#part-one-collapse-second-review">
                      Second Review (after two month)
                    </a>
                  </h4>
                </div>
                <div
                  data-parent="#accordion-part-two"
                  id="part-one-collapse-second-review"
                  class="panel-collapse collapse">
                  <div class="card-body table-responsive">
                    <Review
                      reviewUniqueId="second-review"
                      reviewData={secondReviewData} />
                  </div>
                </div>
              </div>

              <div class="card">
                <div class="card-header bg-navy">
                  <h4 class="card-title bg-navy">
                    <a
                      data-toggle="collapse"
                      data-target="#part-one-collapse-final-review"
                      href="#part-one-collapse-final-review">
                      Final Review (at the end of probation period)
                    </a>
                  </h4>
                </div>
                <div
                  data-parent="#accordion-part-two"
                  id="part-one-collapse-final-review"
                  class="panel-collapse collapse">
                  <div class="card-body table-responsive">
                    <p>
                      This is the final review before an employee is provided
                      with formal written confirmation they have successfully
                      passed their probationary period. If the probation is
                      successful, the objectives can be updated and transferred
                      to the employee’s annual appraisal.
                    </p>
                    <Review
                      reviewUniqueId="final-review"
                      reviewData={finalReviewData} />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</Layout>
