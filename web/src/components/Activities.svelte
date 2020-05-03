<script>
  import { onMount, onDestroy } from "svelte";
  import config from "../config";
  import { OpenTableItemType } from "../models/enums.js";
  import {
    CacheKeys,
    CacheService,
    StateService,
    StateInfo
  } from "../services";
  import {
    specificTopicsType1,
    specificTopicsType2,
    tableCards,
    feedbackAll
  } from "../services/activities.service.js";
  import Layout from "./Layout.svelte";
  import ActivitiesTable from "./ActivitiesTable.svelte";
  import OpenActivitiesTable from "./OpenActivitiesTable.svelte";

  export let mode;
  export let pageTitle;
  /*
  export let welcomeToIss;
  export let complianceTopics;
  export let iisAps;
  export let trainings;
  */
  const colWidths = [5, 25, 30, 10, 10, 15, 5];

  let usersService;
  let userModel;
  let departments = [];
  let mandatoryTopics = [];
  let timespans = [];
  let responsibles = [];
  let userMandatoryTopics = new Set();
  let userSpecificTopics = new Map();
  let modeRadical = (mode || "").toLowerCase();
  let localSpecificTopicsType1 = {};
  let localSpecificTopicsType2 = {};
  let localUserFeedback = {};
  let localTableCards = [];

  const readUserMandatoryTopcis = async () => {
    if (usersService) {
      const userMandatoryTopicsInfo = await usersService.getUserMandatoryTopics(
        userModel.id
      );
      if (userMandatoryTopicsInfo && userMandatoryTopicsInfo.data) {
        userMandatoryTopics = userMandatoryTopicsInfo.data.reduce((all, e) => {
          if (e.done === true) {
            all.add(+e.mandatoryTopicsId);
          }
          return all;
        }, userMandatoryTopics || new Set());
        StateService.updateMandatoryTopics(userMandatoryTopics);
      }
    }
  };

  const updateObjectUserSpecificTopics = (repository, fromData) => ({
    ...repository,
    data: [
      ...repository.data,
      ...Array.from(fromData || []).map(e => ({
        cells: [
          e.specificTopicName,
          e.specificTopicMaterials,
          timespans.find(n => n.id === e.timespanId).description,
          responsibles.find(n => n.id === e.responsibleId).description
        ],
        done: e.done,
        id: e.id
      }))
    ]
  });

  const readUserSpecificTopics = async () => {
    if (usersService) {
      const userSpecificTopicsInfo = await usersService.getUserSpecificTopics(
        userModel.id
      );
      if (userSpecificTopicsInfo && userSpecificTopicsInfo.data) {
        userSpecificTopics = userSpecificTopicsInfo.data.reduce((all, e) => {
          let list = all.get(e.type);
          if (!list) {
            list = new Set();
            all.set(e.type, list);
          }
          list.add(e);
          return all;
        }, userSpecificTopics || new Set());
        StateService.updateSpecificTopics(userSpecificTopics);
        localSpecificTopicsType1 = updateObjectUserSpecificTopics(
          localSpecificTopicsType1,
          userSpecificTopics.get(1)
        );
        localSpecificTopicsType2 = updateObjectUserSpecificTopics(
          localSpecificTopicsType2,
          userSpecificTopics.get(2)
        );
      }
    }
  };

  const readUserFeedback = async () => {
    if (usersService) {
      const userFeedbackInfo = await usersService.getUserFeedback(userModel.id);
      if (userFeedbackInfo && userFeedbackInfo.data) {
        const tmpUserFeedbackInfo = {};
        const data = userFeedbackInfo.data;
        for (let ndx = 0; ndx < data.length; ++ndx) {
          const period = +data[ndx].period - 1;
          const type = +data[ndx].type - 1;
          const userType = +data[ndx].userType - 1;
          tmpUserFeedbackInfo[`feedback-${period}-${type}-${userType}`] =
            data[ndx].feedback;
        }
        localUserFeedback = { ...tmpUserFeedbackInfo };
        console.log(localUserFeedback);
      }
    }
  };

  const doneChangeMandatory = async e => {
    const evt = e.detail.original;
    if (usersService) {
      const response = await usersService.updateUserMandatoryTopics(
        userModel.id,
        +evt.target.dataset.id,
        !!evt.target.checked
      );
    }
  };

  const addNewSpecificTopic = async (e, type) => {
    if (usersService && e.detail.inputs) {
      const firstKey = Object.keys(e.detail.inputs)[0];
      const radical = firstKey.substring(0, firstKey.lastIndexOf("-"));
      const userSpecificTopicsInfo = await usersService.insertUserSpecificTopics(
        userModel.id,
        e.detail.inputs[`${radical}-0`],
        e.detail.inputs[`${radical}-1`],
        +e.detail.inputs[`${radical}-2`],
        +e.detail.inputs[`${radical}-3`],
        e.detail.inputs[`${radical}-4`] === true,
        type
      );
      if (userSpecificTopicsInfo && userSpecificTopicsInfo.data) {
        if (type === 1) {
          localSpecificTopicsType1 = updateObjectUserSpecificTopics(
            localSpecificTopicsType1,
            [userSpecificTopicsInfo.data]
          );
        } else if (type === 2) {
          localSpecificTopicsType2 = updateObjectUserSpecificTopics(
            localSpecificTopicsType2,
            [userSpecificTopicsInfo.data]
          );
        }
      }
    }
  };

  const doneChangeSpecific = async (e, type) => {
    if (usersService && e.detail.id) {
      const userSpecificTopicsInfo = await usersService.updateUserSpecificTopics(
        userModel.id,
        e.detail.id,
        !!e.detail.original.target.checked
      );
    }
  };

  const deleteClickedSpecific = async (e, type) => {
    if (usersService && e.detail.id) {
      const userSpecificTopicsInfo = await usersService.deleteUserSpecificTopics(
        userModel.id,
        e.detail.id
      );
      if (userSpecificTopicsInfo && userSpecificTopicsInfo.status === 204) {
        if (type === 1) {
          localSpecificTopicsType1 = {
            ...localSpecificTopicsType1,
            data: localSpecificTopicsType1.data.filter(
              el => +el.id !== e.detail.id
            )
          };
        } else if (type === 2) {
          localSpecificTopicsType2 = {
            ...localSpecificTopicsType2,
            data: localSpecificTopicsType2.data.filter(
              el => +el.id !== e.detail.id
            )
          };
        }
      }
    }
  };

  const itemBlurFeedback = async (e, period) => {
    if (usersService) {
      period = +period + 1;
      const type = +e.detail.type + 1;
      const userType = +e.detail.userType + 1;
      const feedback = (e.detail.original.target.value || "") + "";
      if (feedback.trim().length > 0) {
        const userFeedbackInfo = await usersService.upsertUserFeedback(
          userModel.id,
          period,
          type,
          userType,
          feedback
        );
      }
    }
  };

  const updateLists = () => {
    const columnsTypes = [OpenTableItemType.single, OpenTableItemType.multi];
    if (timespans) {
      columnsTypes.push(
        timespans
          .map(e => ({ key: e.id, value: e.description }))
          .sort((a, b) => a.key - b.key)
      );
    }
    if (responsibles) {
      columnsTypes.push(
        responsibles
          .map(e => ({ key: e.id, value: e.description }))
          .sort((a, b) => a.key - b.key)
      );
    }
    localSpecificTopicsType1 = {
      ...specificTopicsType1,
      columnVals: [...columnsTypes]
    };
    localSpecificTopicsType2 = {
      ...specificTopicsType1,
      columnVals: [...columnsTypes]
    };
  };

  const mapMandatoryTopicsLk = () => {
    const groups = {};
    for (const ndx in mandatoryTopics) {
      if (mandatoryTopics.hasOwnProperty(ndx)) {
        if (!groups.hasOwnProperty(mandatoryTopics[ndx].group)) {
          groups[mandatoryTopics[ndx].group] = [];
        }
        groups[mandatoryTopics[ndx].group].push({
          id: mandatoryTopics[ndx].id,
          data: [
            mandatoryTopics[ndx].description,
            mandatoryTopics[ndx].tools,
            timespans.find(e => e.id === mandatoryTopics[ndx].timespanId)
              .description,
            responsibles.find(e => e.id === mandatoryTopics[ndx].responsibleId)
              .description
          ]
        });
      }
    }

    localTableCards = [...tableCards];
    for (const ndx in groups) {
      if (groups.hasOwnProperty(ndx)) {
        const table = localTableCards.find(e => +e.group === +ndx);
        table.information = [...groups[ndx]];
      }
    }
  };

  const readInfo = async () => {
    await readUserMandatoryTopcis();
    await readUserSpecificTopics();
    await readUserFeedback();
  };

  const cacheSubscribe = CacheService.subscribe(cache => {
    if (!userModel) {
      userModel = cache.get(CacheKeys.UserInfo) || {};
    }
    if (!departments || departments.length === 0) {
      departments = cache.get(CacheKeys.Departments) || [];
    }
    if (!mandatoryTopics || mandatoryTopics.length === 0) {
      mandatoryTopics = cache.get(CacheKeys.MandatoryTopics) || [];
    }
    if (!timespans || timespans.length === 0) {
      timespans = cache.get(CacheKeys.Timespans) || [];
    }
    if (!responsibles || responsibles.length === 0) {
      responsibles = cache.get(CacheKeys.Responsibles) || [];
    }

    if (
      timespans.length > 0 &&
      responsibles.length > 0 &&
      !localSpecificTopicsType1.data &&
      !localSpecificTopicsType2.data
    ) {
      updateLists();
    }
    if (
      timespans.length > 0 &&
      responsibles.length > 0 &&
      mandatoryTopics.length > 0 &&
      localTableCards.length === 0
    ) {
      mapMandatoryTopicsLk();
    }
  });

  const stateSubscribe = StateService.subscribe(async state => {
    if (!usersService) {
      usersService = state.getService(StateInfo.Services.Users);
      await readInfo();
    }
    if (!userMandatoryTopics || userMandatoryTopics.size === 0) {
      userMandatoryTopics = state.getMandatoryTopics();
    }
    if (!userSpecificTopics || userSpecificTopics.size === 0) {
      userSpecificTopics = state.getSpecificTopics();
    }
  });

  onDestroy(() => {
    cacheSubscribe();
    stateSubscribe();
  });
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
            <a href="##" on:click={config.preventEvent}>{modeRadical}</a>
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
                  <label for="employeeName" class="col-sm-2 col-form-label">
                    Employee Name:
                  </label>
                  <div class="col-sm-10">
                    <input
                      disabled
                      type="text"
                      class="form-control"
                      id="employeeName"
                      name="employeeName"
                      value={userModel.displayName} />
                  </div>
                </div>
                <div class="form-group row">
                  <label for="manager" class="col-sm-2 col-form-label">
                    Manager:
                  </label>
                  <div class="col-sm-10">
                    <input
                      disabled
                      type="text"
                      class="form-control"
                      id="manager"
                      name="manager"
                      value={userModel.manager} />
                  </div>
                </div>
                <div class="form-group row">
                  <label for="department" class="col-sm-2 col-form-label">
                    Department:
                  </label>
                  <div class="col-sm-10">
                    <select
                      class="form-control"
                      id="department"
                      name="department"
                      placeholder="department">
                      <option value="-1" disabled selected>
                        Select department
                      </option>
                      {#each departments as department}
                        <option value={department.id}>{department.name}</option>
                      {/each}
                    </select>
                  </div>
                </div>
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
                <!-- /.card-body -->
              </div>
            </form>
          </div>
        </div>
        <!--card-->

        <div class="card">
          <div class="card-header">
            <div class="card-title">
              Mandatory topics for {modeRadical} positions
            </div>
          </div>
          <!-- card-header -->
          <div class="card-body">
            <div id="accordion-{modeRadical}-mandatory">
              {#each localTableCards as tableInfo (tableInfo)}
                <div class="card">
                  <div class="card-header bg-navy">
                    <h4 class="card-title bg-navy">
                      <a
                        data-toggle="collapse"
                        data-target="#{modeRadical}-collapse-{tableInfo.id}"
                        href="#{modeRadical}-collapse-{tableInfo.id}">
                        {tableInfo.title}
                      </a>
                    </h4>
                  </div>
                  <div
                    data-parent="#accordion-{modeRadical}-mandatory"
                    id="{modeRadical}-collapse-{tableInfo.id}"
                    class="panel-collapse collapse">
                    <div class="card-body table-responsive">
                      <ActivitiesTable
                        info={tableInfo}
                        {colWidths}
                        details={userMandatoryTopics}
                        on:doneChange={doneChangeMandatory} />
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
            <div class="card-title">
              Specific topics for {modeRadical} positions
            </div>
          </div>
          <!-- card-header -->
          <div class="card-body">
            <div id="accordion-{modeRadical}-specific">
              <div class="card">
                <div class="card-header bg-navy">
                  <h4 class="card-title bg-navy">
                    <a
                      data-toggle="collapse"
                      data-target="#{modeRadical}-collapse-topics"
                      href="#{modeRadical}-collapse-topics">
                      Specific technical topics and trainings (to be prepared by
                      employee and supervisor)
                    </a>
                  </h4>
                </div>
                <div
                  data-parent="#accordion-{modeRadical}-specific"
                  id="{modeRadical}-collapse-topics"
                  class="panel-collapse collapse">
                  <div class="card-body table-responsive">
                    <OpenActivitiesTable
                      switchName="{modeRadical}-topics"
                      info={localSpecificTopicsType1}
                      {colWidths}
                      on:addNewRow={e => addNewSpecificTopic(e, 1)}
                      on:doneChange={e => doneChangeSpecific(e, 1)}
                      on:deleteClicked={e => deleteClickedSpecific(e, 1)} />
                  </div>
                </div>
              </div>

              <div class="card">
                <div class="card-header bg-navy">
                  <h4 class="card-title bg-navy">
                    <a
                      data-toggle="collapse"
                      data-target="#{modeRadical}-collapse-subjects"
                      href="#{modeRadical}-collapse-subjects">
                      Subjects that are to be integrated in an individual
                      development plan
                    </a>
                  </h4>
                </div>
                <div
                  data-parent="#accordion-{modeRadical}-specific"
                  id="{modeRadical}-collapse-subjects"
                  class="panel-collapse collapse">
                  <div class="card-body table-responsive">
                    <OpenActivitiesTable
                      switchName="{modeRadical}-subjects"
                      info={localSpecificTopicsType2}
                      {colWidths}
                      on:addNewRow={e => addNewSpecificTopic(e, 2)}
                      on:doneChange={e => doneChangeSpecific(e, 2)}
                      on:deleteClicked={e => deleteClickedSpecific(e, 2)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--card-body -->
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">
              Feedback section for {modeRadical} positions
            </div>
          </div>
          <!-- card-header -->
          <div class="card-body">
            <div id="accordion-{modeRadical}-feedback">
              {#each feedbackAll as feedback, ndx (feedback)}
                <div class="card">
                  <div class="card-header bg-navy">
                    <h4 class="card-title bg-navy">
                      <a
                        data-toggle="collapse"
                        data-target="#{modeRadical}-collapse-month-{ndx}"
                        href="#{modeRadical}-collapse-month-{ndx}">
                        {feedback.columns[0]}
                      </a>
                    </h4>
                  </div>
                  <div
                    data-parent="#accordion-{modeRadical}-feedback"
                    id="{modeRadical}-collapse-month-{ndx}"
                    class="panel-collapse collapse">
                    <div class="card-body table-responsive">
                      <OpenActivitiesTable
                        info={feedback}
                        inputs={localUserFeedback}
                        switchName="feedback-{ndx}"
                        colWidths={[5, 19, 19, 19, 19, 19]}
                        showAddNew={false}
                        showClose={false}
                        showDone={false}
                        on:itemBlur={e => itemBlurFeedback(e, ndx)} />
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
