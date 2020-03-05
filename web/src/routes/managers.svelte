<script>
  import { OpenTableItemType } from "../models/enums.js";
  import { responsabile, duration } from "../services/activities.service.js";
  import Activities from "../components/Activities.svelte";
  import {
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
      ]
    ],
    columnVals: [
      OpenTableItemType.single,
      OpenTableItemType.multi,
      Object.entries(duration).map(e => ({ key: e[0], value: e[1] })),
      Object.entries(responsabile).map(e => ({ key: e[0], value: e[1] }))
    ]
  };
</script>

<Activities
  pageTitle="Onboarding Form Managers"
  mode="Managers"
  welcomeToIss={welcomeToIssManagers}
  complianceTopics={complianceTopicsManagers}
  iisAps={iisApsManagers}
  trainings={trainingsManagers}
  {topics}
  {subjects} />
