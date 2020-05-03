import { OpenTableItemType } from "../models/enums.js";

export const specificTopicsType1 = {
  columns: ["Topic", "Training materials", "Date / Duration", "Responsible", "Done", "Remove"],
  data: [],
  columnVals: []
};

export const specificTopicsType2 = {
  columns: ["Topic", "Measure", "Date / Duration", "Responsible", "Done", "Remove"],
  data: [],
  columnVals: []
};

export const tableCards = [
  {
	title: "Welcome to IIS",
	columns: ["Welcome to IIS", "Tools", "Date", "Responsible", "Done"],
    information: null,
    id: "one",
    radicalName: "welcome",
    group: 1,
  },
  {
	title: "Compliance Topics",
	columns: ["Compliance Topics", "Tools", "Date", "Responsible", "Done"],
    information: null,
    id: "two",
    radicalName: "compliance",
    group: 2,
  },
  {
	title: "IIS Apps",
	columns: ["IIS Apps", "Tools", "Date", "Responsible", "Done"],
    information: null,
    id: "three",
    radicalName: "apps",
    group: 3,
  },
  {
	title: "Trainings / Workshops",
	columns: ["Trainings / workshops", "Tools", "Date", "Responsible", "Done"],
    information: null,
    id: "four",
    radicalName: "trainings",
    group: 4,
  },
];

const feedbackMonth1 = {
  columns: ["Feedback after one month", "Employee", "Fellow", "Line Manager & HR", "Other Comments"],
  data: [],
  columnVals: [OpenTableItemType.multi, OpenTableItemType.multi, OpenTableItemType.multi, OpenTableItemType.multi],
  rowValsHeaders: ["Strong points", "Week points", "Improvement Area"],
};

const feedbackMonth3 = {
  columns: [...feedbackMonth1.columns],
  data: [],
  columnVals: [...feedbackMonth1.columnVals],
  rowValsHeaders: [...feedbackMonth1.rowValsHeaders],
};
feedbackMonth3.columns[0] = "Feedback after 3 months";

const feedbackMonth6 = {
  columns: [...feedbackMonth1.columns],
  data: [],
  columnVals: [...feedbackMonth1.columnVals],
  rowValsHeaders: [...feedbackMonth1.rowValsHeaders],
};
feedbackMonth6.columns[0] = "Feedback at the end of 6 months";

export const feedbackAll = [feedbackMonth1, feedbackMonth3, feedbackMonth6];
