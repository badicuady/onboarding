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
  let activeUserId;
  let entryDate = null;
  $: endDate = entryDate
    ? new Date(new Date(entryDate).getTime() + 3 * 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10)
    : null;
  let activeUser = { id: -1, name: "Self" };

  const readUser = async () => {
    if (usersService) {
      const userInfo = await usersService.getUsers({
        userName:
          activeUser.id <= -1
            ? userModel.mail
            : activeUser.name.replace(" ", ".") + config.defaultEmailDomain
      });
      if (userInfo && userInfo.data.length > 0) {
        entryDate = userInfo.data[0].startDate || '';
        CacheService.setOrUpdateValue(
          CacheKeys.StartDate,
          entryDate,
          new Date(Date.now() + 3600 * 1000)
        );
      }
    }
  };

  const updateUser = async () => {
    CacheService.setOrUpdateValue(
      CacheKeys.StartDate,
      entryDate,
      new Date(Date.now() + 3600 * 1000)
    );
    if (userModel && usersService) {
      const user = await usersService.updateUsers(
        userModel.id,
        userModel.givenName,
        userModel.displayName.replace(userModel.givenName, "").trim(),
        userModel.mailNickname,
        4,
        undefined,
        entryDate
      );
    }
  };

  const readUserObjectives = async () => {
    if (usersService) {
      const userObjectivesInfo = await usersService.getUserObjectives(
        userModel.id
      );

      if (userObjectivesInfo && userObjectivesInfo.data) {
        for (let type = 0; type < partOneInfo.length; ++type) {
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
        userModel.alteringUserId,
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

  const readUserReviews = async () => {
    const computeKey = k =>
      k === "objectivesMet"
        ? "show-further-actions-0"
        : k === "trainingsMet"
        ? "show-further-actions-1"
        : k;

    if (usersService) {
      const userReviewInfo = await usersService.getUserReview(userModel.id);
      const first = userReviewInfo.data.filter(e => e.period === 1);
      const firstActions = await populateUserRequiredAction(
        partTwoFirstReviewData,
        first.length > 0 ? first[0].id : -1
      );
      partTwoFirstReviewData = [...firstActions];
      partTwoFirstReviewInputs = Object.keys(first[0]).reduce((all, key) => {
        const computedKey = computeKey(key);
        all[`first-review-${computedKey}`] = first[0][key];
        return all;
      }, {});

      const second = userReviewInfo.data.filter(e => e.period === 2);
      const secondActions = await populateUserRequiredAction(
        partTwoSecondReviewData,
        second.length > 0 ? second[0].id : -1
      );
      partTwoSecondReviewData = [...secondActions];
      partTwoSecondReviewInputs = Object.keys(second[0]).reduce((all, key) => {
        const computedKey = computeKey(key);
        all[`second-review-${computedKey}`] = second[0][key];
        return all;
      }, {});

      const final = userReviewInfo.data.filter(e => e.period === 3);
      const finalActions = await populateUserRequiredAction(
        partTwoFinalReviewData,
        final.length > 0 ? final[0].id : -1
      );
      partTwoFinalReviewData = [...finalActions];
      partTwoFinalReviewInputs = Object.keys(final[0]).reduce((all, key) => {
        const computedKey = computeKey(key);
        all[`final-review-${computedKey}`] = final[0][key];
        return all;
      }, {});
    }
  };

  const itemBlurReview = async (e, type) => {
    if (usersService) {
      const userObjectivesInfo = await usersService.upsertUserReview(
        userModel.id,
        userModel.alteringUserId,
        e.detail.inputs[`${e.detail.uniqueId}-date`],
        e.detail.inputs[`${e.detail.uniqueId}-performance`],
        e.detail.inputs[`${e.detail.uniqueId}-concerns`],
        e.detail.inputs[`${e.detail.uniqueId}-summary`],
        e.detail.inputs[`${e.detail.uniqueId}-show-further-actions-0`],
        e.detail.inputs[`${e.detail.uniqueId}-show-further-actions-1`],
        type
      );
    }
  };

  const populateUserRequiredAction = async (reviewData, userReviewId) => {
    if (userReviewId <= 0) return reviewData;
    const actions = await readUserRequiredAction(userReviewId);
    for (let ndx = 0; ndx < actions.length; ++ndx) {
      reviewData[+actions[ndx].type - 1].actions.data.push({
        id: actions[ndx].id,
        cells: [actions[ndx].action, actions[ndx].date]
      });
    }
    return reviewData;
  };

  const readUserRequiredAction = async userRequiredActionsId => {
    if (usersService) {
      const userFeedbackInfo = await usersService.getUserRequiredActions(
        userRequiredActionsId
      );
      if (userFeedbackInfo && userFeedbackInfo.data) {
        return userFeedbackInfo.data;
      }
      return [];
    }
    return [];
  };

  const addNewUserRequiredAction = async (e, type) => {
    const firstKey = Object.keys(e.detail.inputs)[0];
    const radical = firstKey.substring(0, firstKey.lastIndexOf("-"));
    if (usersService) {
      const userRequiredActionInfo = await usersService.upsertUserRequiredActions(
        userModel.id,
        userModel.alteringUserId,
        e.detail.inputs[`${radical}-0`],
        e.detail.inputs[`${radical}-1`],
        +e.detail.type,
        +e.detail.userRequiredActionsId
      );
      if (userRequiredActionInfo && userRequiredActionInfo.data) {
        if (type === 1) {
          partTwoFirstReviewData[
            +e.detail.type - 1
          ].actions = updateObjectUserSpecificTopics(
            partTwoFirstReviewData[+e.detail.type - 1].actions,
            [userRequiredActionInfo.data]
          );
          partTwoFirstReviewData = [...partTwoFirstReviewData];
        } else if (type === 2) {
          partTwoSecondReviewData[
            +e.detail.type - 1
          ].actions = updateObjectUserSpecificTopics(
            partTwoSecondReviewData[+e.detail.type - 1].actions,
            [userRequiredActionInfo.data]
          );
          partTwoSecondReviewData = [...partTwoSecondReviewData];
        } else if (type === 3) {
          partTwoFinalReviewData[
            +e.detail.type - 1
          ].actions = updateObjectUserSpecificTopics(
            partTwoFinalReviewData[+e.detail.type - 1].actions,
            [userRequiredActionInfo.data]
          );
          partTwoFinalReviewData = [...partTwoFinalReviewData];
        }
      }
    }
  };

  const deleteUserRequiredAction = async (e, type) => {
    if (usersService) {
      const userRequiredActionInfo = await usersService.deleteUserRequiredActions(
        userModel.id,
        e.detail.id
      );
      if (userRequiredActionInfo && userRequiredActionInfo.status === 204) {
        if (type === 1) {
          partTwoFirstReviewData[e.detail.type - 1].actions.data = [
            ...partTwoFirstReviewData[e.detail.type - 1].actions.data.filter(
              el => +el.id !== e.detail.id
            )
          ];
          partTwoFirstReviewData = [...partTwoFirstReviewData];
        } else if (type === 2) {
          partTwoSecondReviewData[e.detail.type - 1].actions.data = [
            ...partTwoSecondReviewData[e.detail.type - 1].actions.data.filter(
              el => +el.id !== e.detail.id
            )
          ];
          partTwoSecondReviewData = [...partTwoSecondReviewData];
        } else if (type === 3) {
          partTwoFinalReviewData[e.detail.type - 1].actions.data = [
            ...partTwoFinalReviewData[e.detail.type - 1].actions.data.filter(
              el => +el.id !== e.detail.id
            )
          ];
          partTwoFinalReviewData = [...partTwoFinalReviewData];
        }
      }
    }
  };

  const readInfo = async () => {
    activeUserId = userModel ? userModel.id : -1;
    await readUser();
    await readUserObjectives();
    await readUserReviews();
  };

  const updateObjectUserSpecificTopics = (repository, fromData) => ({
    ...repository,
    data: [
      ...(repository.data || []),
      ...Array.from(fromData || []).map(e => ({
        cells: [e.action, e.date],
        id: e.id
      }))
    ]
  });

  const cacheSubscribe = CacheService.subscribe(async cache => {
    userModel = cache.get(CacheKeys.UserInfo) || {};
    activeUser = cache.get(CacheKeys.ActiveUser) || { id: -1, name: "Self" };
    if (!entryDate) {
      entryDate = cache.get(CacheKeys.StartDate);
    }
    if (userModel && userModel.id !== activeUserId) {
      await readInfo();
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
      headline: `Your line manager has identified specific objectives for you for the first three months / four months.
		These will be statements of what should be achieved during the probationary period, 
		including indicators of success and timescales for achievement.`,
      info: objectives,
      uniqueId: "objectives"
    },
    {
      title: "Development Plan",
      headline: `To support you in achieving these objectives, your line manager has identified the 
	  	training and development needs and has specified  how and when these needs will be addressed during your probationary period.`,
      info: developmentPlan,
      uniqueId: "development-plan"
    }
  ];

  const reviewActionsColumns = ["Required actions", "Review Date", "Delete"];
  const reviewActionsColumnVals = [
    OpenTableItemType.single,
    OpenTableItemType.date
  ];
  const reviewActionsQuestion1 =
    "Have the objectives identified for this period of the probation been met?";
  const reviewActionsQuesiton2 =
    "Have the training / development needs identified for this period of the probation been addressed?";

  let partTwoFirstReviewData = [
    {
      question: reviewActionsQuestion1,
      actions: {
        columns: [...reviewActionsColumns],
        data: [],
        columnVals: [...reviewActionsColumnVals]
      }
    },
    {
      question: reviewActionsQuesiton2,
      actions: {
        columns: [...reviewActionsColumns],
        data: [],
        columnVals: [...reviewActionsColumnVals]
      }
    }
  ];

  let partTwoSecondReviewData = JSON.parse(
    JSON.stringify(partTwoFirstReviewData)
  );
  let partTwoFinalReviewData = JSON.parse(
    JSON.stringify(partTwoFirstReviewData)
  );

  let partTwoFirstReviewInputs = {};
  let partTwoSecondReviewInputs = {};
  let partTwoFinalReviewInputs = {};
</script>

<svelte:head>
  <title>Probationary period goals</title>
</svelte:head>

<Layout>
  <div slot="content-header" class="container">
    <div class="row">
      <div class="col-6">
        <h1 class="m-0 text-dark">Probationary period plan</h1>
      </div>
      <div class="col-6">
        <ol class="breadcrumb float-right">
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
              <i class="fas fa-info mr-1 {config.iconsClassColor}" />
              Information
            </div>
          </div>
          <div class="card-body">
            <p>
              This Form should be completed during your probationary period.
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
                          bind:value={entryDate}
                          on:change={updateUser} />
                      </div>
                    </div>
                    <div class="form-group row">
                      <label for="end-date" class="col-3 col-form-label">
                        End date
                      </label>
                      <div class="col-9">
                        <input
                          readonly
                          id="end-date"
                          name="end-date"
                          type="date"
                          class="form-control"
                          bind:value={endDate} />
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
              <i class="fas fa-handshake mr-1 {config.iconsClassColor}" />
              Part One: Initial meeting
            </div>
          </div>
          <div class="card-body">
            <p>
              This section should be completed by your line manager within 3
              days of your employment.
            </p>

            <div id="accordion-part-one">
              {#each partOneInfo as cardInfo, ndx (cardInfo)}
                <div class="card">
                  <div class="card-header {config.tabsBgClassColor}">
                    <h4 class="card-title {config.tabsBgClassColor}">
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
              <i class="fas fa-puzzle-piece mr-1 {config.iconsClassColor}" />
              Part Two: Review
            </div>
          </div>
          <div class="card-body">
            <div id="accordion-part-two">

              <div class="card">
                <div class="card-header {config.tabsBgClassColor}">
                  <h4 class="card-title {config.tabsBgClassColor}">
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
                    <Review
                      reviewUniqueId="first-review"
                      reviewData={partTwoFirstReviewData}
                      inputs={partTwoFirstReviewInputs}
                      on:itemBlur={e => itemBlurReview(e, 1)}
                      on:addNewUserRequiredAction={e => addNewUserRequiredAction(e, 1)}
                      on:deleteUserRequiredAction={e => deleteUserRequiredAction(e, 1)} />
                  </div>
                </div>
              </div>

              <div class="card">
                <div class="card-header {config.tabsBgClassColor}">
                  <h4 class="card-title {config.tabsBgClassColor}">
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
                      reviewData={partTwoSecondReviewData}
                      inputs={partTwoSecondReviewInputs}
                      on:itemBlur={e => itemBlurReview(e, 2)}
                      on:addNewUserRequiredAction={e => addNewUserRequiredAction(e, 2)}
                      on:deleteUserRequiredAction={e => deleteUserRequiredAction(e, 2)} />
                  </div>
                </div>
              </div>

              <div class="card">
                <div class="card-header {config.tabsBgClassColor}">
                  <h4 class="card-title {config.tabsBgClassColor}">
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
                      This is your final review which concludes your
                      probationary period. If the probation is successful, the
                      objectives will be updated and transferred to your annual
                      performance document.
                    </p>
                    <Review
                      reviewUniqueId="final-review"
                      reviewData={partTwoFinalReviewData}
                      inputs={partTwoFinalReviewInputs}
                      on:itemBlur={e => itemBlurReview(e, 3)}
                      on:addNewUserRequiredAction={e => addNewUserRequiredAction(e, 3)}
                      on:deleteUserRequiredAction={e => deleteUserRequiredAction(e, 3)} />
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
