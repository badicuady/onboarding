<script>
  import { onDestroy } from "svelte";
  import config from "../config";
  import Layout from "../components/Layout.svelte";
  import { OpenTableItemType } from "../models/enums.js";
  import OpenActivitiesTable from "../components/OpenActivitiesTable.svelte";
  import Review from "../components/Review.svelte";
  import {
    CacheService,
    CacheKeys,
    StateService,
    StateInfo
  } from "../services";

  let usersService;
  let userModel;

  const readUserObjectives = async () => {
    if (usersService) {
      const userObjectivesInfo = await usersService.getUserObjectives(
        userModel.id
      );

      if (userObjectivesInfo && userObjectivesInfo.data) {
        for (let type = 0; type < partOneInfo.length; type++) {
          const tmpUserObjectivesInfo = userObjectivesInfo.data
            .filter(e => e.type === type + 1)
            .map(e => ({
              id: e.id,
              cells: [
                e.description,
                new Date(e.deadline).toLocaleDateString(),
                e.responsible
              ]
            }));
          partOneInfo[type].info.data = [...tmpUserObjectivesInfo];
        }
        partOneInfo = [...partOneInfo]; // trigger the update
      }
    }
  };

  const addNewObjective = async (e, type) => {
    if (usersService && e.detail.inputs) {
      const firstKey = Object.keys(e.detail.inputs)[0];
      const radical = firstKey.substring(0, firstKey.lastIndexOf("-"));
      const userObjectivesInfo = await usersService.insertUserObjectives(
        userModel.id,
        e.detail.inputs[`${radical}-0`],
        e.detail.inputs[`${radical}-1`],
        e.detail.inputs[`${radical}-2`],
        type
      );
      if (userObjectivesInfo && userObjectivesInfo.data) {
        partOneInfo[type - 1].info.data.push({
          id: userObjectivesInfo.data.id,
          cells: [
            userObjectivesInfo.data.description,
            new Date(userObjectivesInfo.data.deadline).toLocaleDateString(),
            userObjectivesInfo.data.responsible
          ]
        });
        partOneInfo = [...partOneInfo]; // trigger the update
      }
    }
  };

  const deleteObjectives = async (e, type) => {
    if (usersService) {
      const userObjectivesInfo = await usersService.deleteUserObjectives(
        userModel.id,
        e.detail.id
      );
      if (userObjectivesInfo && userObjectivesInfo.status === 204) {
        partOneInfo[type - 1].info.data = [
          ...partOneInfo[type - 1].info.data.filter(
            el => +el.id !== e.detail.id
          )
        ];
        partOneInfo = [...partOneInfo]; // trigger the update
      }
    }
  };

  const itemBlurReview = async (e, type) => {
    if (usersService) {
      const userObjectivesInfo = await usersService.upsertUserReview(
        userModel.id,
        userModel.id,
        e.detail.inputs[`${e.detail.uniqueId}-date`],
        e.detail.inputs[`${e.detail.uniqueId}-performance`],
        e.detail.inputs[`${e.detail.uniqueId}-concerns`],
        e.detail.inputs[`${e.detail.uniqueId}-summary`],
        false,
        false,
        type
      );
    }
  };

  const readInfo = async () => {
    await readUserObjectives();
  };

  const cacheSubscribe = CacheService.subscribe(cache => {
    if (!userModel) {
      userModel = cache.get(CacheKeys.UserInfo) || {};
    }
  });

  const stateSubscribe = StateService.subscribe(async state => {
    if (!usersService) {
      usersService = state.getService(StateInfo.Services.Users);
      await readInfo();
    }
  });

  onDestroy(() => {
    cacheSubscribe();
    stateSubscribe();
  });

  const partOneColumnVals = [
    OpenTableItemType.single,
    OpenTableItemType.date,
    OpenTableItemType.single
  ];
  const partOneColumns = ["Deadline", "Responsible for support", "Close"];
  const objectives = {
    columns: ["Objective Description", ...partOneColumns],
    data: [],
    columnVals: [...partOneColumnVals]
  };
  const developmentPlan = {
    columns: ["Development need", ...partOneColumns],
    data: [],
    columnVals: [...partOneColumnVals]
  };

  let partOneInfo = [
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

  const reviewActions = {
    columns: ["Required actions", "Review Date", "Delete"],
    data: [
      { id: 1, cells: ["Action 1", "2020-03-01"] },
      { id: 2, cells: ["Action 2", "2020-03-01"] }
    ],
    columnVals: [OpenTableItemType.single, OpenTableItemType.date]
  };

  const firstReviewData = [
    {
      question:
        "Have the objectives identified for this period of the probation been met?",
      actions: Object.assign({}, reviewActions)
    },
    {
      question:
        "Have the training / development needs identified for this period of the probation been addressed?",
      actions: Object.assign({}, reviewActions)
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
            <a href="##" on:click={config.preventEvent}>probationaryplan</a>
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
                          value={userModel.name} />
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
                          value={userModel.title} />
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
                          value={userModel.manager} />
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
                      <label for="end-date" class="col-3 col-form-label">
                        End date
                      </label>
                      <div class="col-9">
                        <input
                          id="end-date"
                          name="end-date"
                          type="date"
                          class="form-control"
                          readonly
                          value={new Date(Date.now() + 3600 * 24 * 30)
                            .toISOString()
                            .slice(0, 10)} />
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
                          value={userModel.department} />
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
              {#each partOneInfo as cardInfo, ndx (cardInfo)}
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
                        showDone={false}
                        on:addNewRow={e => addNewObjective(e, ndx + 1)}
                        on:deleteClicked={e => deleteObjectives(e, ndx + 1)} />
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
                      reviewData={firstReviewData}
                      on:itemBlur={e => itemBlurReview(e, 1)} />
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
                      reviewData={secondReviewData}
                      on:itemBlur={e => itemBlurReview(e, 3)} />
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
                      reviewData={finalReviewData}
                      on:itemBlur={e => itemBlurReview(e, 3)} />
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
