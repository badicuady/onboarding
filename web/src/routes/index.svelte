<script>
  import { onMount } from "svelte";
  import { OpenTableItemType } from "../models/enums.js";
  import { responsabile, duration } from "../services/activities.service.js";
  import { CacheKeys, CacheService } from "../services";
  import Activities from "../components/Activities.svelte";
  import {
    welcomeToIssSpecialists,
    complianceTopicsSpecialists,
    iisApsSpecialists,
	trainingsSpecialists,
	welcomeToIssManagers,
    complianceTopicsManagers,
    iisApsManagers,
    trainingsManagers
  } from "../services/activities.service.js";

  const topics = {
    columns: [
      "Topic",
      "Training materials",
      "Date / Duration",
      "Responsible",
      "Done",
      "Remove"
    ],
    data: [
      [
        "Topic 1",
        "Material 1, Material 2",
        duration.firstDay,
        responsabile.lineManager
      ],
      [
        "Topic 2",
        "Material 1, Material 2",
        duration.firstWeek,
        responsabile.ldSpecialist
      ]
    ],
    columnVals: [
      OpenTableItemType.single,
      OpenTableItemType.multi,
      Object.entries(duration).map(e => ({ key: e[0], value: e[1] })),
      Object.entries(responsabile).map(e => ({ key: e[0], value: e[1] }))
    ]
  };

  const subjects = {
    columns: [
      "Topic",
      "Measure",
      "Date / Duration",
      "Responsible",
      "Done",
      "Remove"
    ],
    data: [
      [
        "Topic 1",
        "Measure 1, Measure 2",
        duration.firstDay,
        responsabile.lineManager
      ],
      [
        "Topic 2",
        "Measure 1, Measure 2",
        duration.firstWeek,
        responsabile.ldSpecialist
      ],
      [
        "Topic 3",
        "Measure 1, Measure 2",
        duration.firstWeek,
        responsabile.ldSpecialist
      ]
    ],
    columnVals: [
      OpenTableItemType.single,
      OpenTableItemType.multi,
      Object.entries(duration).map(e => ({ key: e[0], value: e[1] })),
      Object.entries(responsabile).map(e => ({ key: e[0], value: e[1] }))
    ]
  };

  let userModel;
  const cacheSubscribe = CacheService.subscribe(cache => {
    userModel = cache.get(CacheKeys.UserInfo);
  });
</script>

<Activities
  pageTitle={userModel.isManager ? "Onboarding Form Managers" : "Onboarding Form Specialists"}
  mode={userModel.isManager ? "Managers" : "Specialists"}
  welcomeToIss={userModel.isManager ? welcomeToIssManagers : welcomeToIssSpecialists}
  complianceTopics={userModel.isManager ? complianceTopicsManagers : complianceTopicsSpecialists}
  iisAps={userModel.isManager ? iisApsManagers : iisApsSpecialists}
  trainings={userModel.isManager ? trainingsManagers : trainingsSpecialists}
  {topics}
  {subjects} />
