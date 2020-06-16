import { OpenTableItemType } from "../models/enums.js";

export const specificTopicsType1 = {
  columns: ["Topic", "Training materials", "Date / Duration", "Responsible", "Done", "Remove"],
  data: [],
  columnVals: [],
};

export const specificTopicsType2 = {
  columns: ["Topic", "Measure", "Date / Duration", "Responsible", "Done", "Remove"],
  data: [],
  columnVals: [],
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
feedbackMonth3.columns[0] = "Feedback after 2 months";

const feedbackMonth6 = {
  columns: [...feedbackMonth1.columns],
  data: [],
  columnVals: [...feedbackMonth1.columnVals],
  rowValsHeaders: [...feedbackMonth1.rowValsHeaders],
};
feedbackMonth6.columns[0] = "Feedback at the end of 3 months";

export const feedbackAll = [feedbackMonth1, feedbackMonth3, feedbackMonth6];

export const resources = [
  {
    link: "//google.com",
    title: "Resource title",
    description: `Fusce hendrerit blandit lacus, id accumsan metus finibus quis. Sed ac scelerisque leo. Donec felis mauris,
      porttitor eget quam quis, rhoncus maximus orci. Duis quis tristique lectus. Phasellus in dictum metus, eget 
      molestie purus. In in posuere lacus, eu molestie nisi. Fusce ut leo mi.`,
  },
  {
    link: "//google.com",
    title: "Resource title",
    description: `Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam non dui sagittis, 
      dapibus nibh at, congue purus. Quisque ac diam id odio faucibus dictum ac et diam. Nam sit amet lacus in justo ullamcorper mollis.
      Nulla nec interdum sapien, sed porta nulla. Cras consectetur magna quis nisi ultricies, maximus porttitor orci ullamcorper. 
      Pellentesque hendrerit justo elementum ex interdum dignissim. Donec ullamcorper malesuada ligula, id pretium ligula. 
      Morbi quis facilisis sem, vel facilisis ipsum. Nam dignissim mi eu ipsum blandit fermentum. Nunc in dictum sem.`,
  },
  {
    link: "//google.com",
    title: "Resource title",
    description: `Integer at imperdiet ante, vitae sollicitudin odio. Donec quis tincidunt mauris. Maecenas eu libero condimentum, 
      commodo metus ut, iaculis quam. Nullam et metus sagittis, facilisis velit non, ultrices turpis. Morbi condimentum, diam eget 
      ultrices volutpat, metus massa luctus sapien, et varius ex augue in leo. Etiam fermentum tortor eget justo blandit, 
      ut maximus nulla aliquet. Sed suscipit tempor justo, nec iaculis mi vestibulum ac. Aliquam mauris lacus, iaculis quis diam sed, 
      tincidunt sollicitudin lacus. Maecenas vehicula vestibulum tempor.`,
  },
];

export const contacts = [
  {
	name: "Romina Pricopie",
	email: "Romina.Pricopie@Ipsos.com",
    image:
      "https://outlook.office.com/owa/service.svc/s/GetPersonaPhoto?email=Romina.Pricopie@Ipsos.com&UA=0&size=HR96x96",
    description: `Integer at imperdiet ante, vitae sollicitudin odio. Donec quis tincidunt mauris. Maecenas eu libero condimentum, 
      commodo metus ut, iaculis quam. Nullam et metus sagittis, facilisis velit non, ultrices turpis. Morbi condimentum, diam eget 
      ultrices volutpat, metus massa luctus sapien, et varius ex augue in leo. Etiam fermentum tortor eget justo blandit, 
      ut maximus nulla aliquet. Sed suscipit tempor justo, nec iaculis mi vestibulum ac. Aliquam mauris lacus, iaculis quis diam sed, 
      tincidunt sollicitudin lacus. Maecenas vehicula vestibulum tempor.`,
  },
  {
	name: "Crina Marin",
	email: "Crina.Marin@Ipsos.com",
    image:
      "https://outlook.office.com/owa/service.svc/s/GetPersonaPhoto?email=Crina.Marin@Ipsos.com&UA=0&size=HR96x96",
    description: `Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam non dui sagittis, 
      dapibus nibh at, congue purus. Quisque ac diam id odio faucibus dictum ac et diam. Nam sit amet lacus in justo ullamcorper mollis.
      Nulla nec interdum sapien, sed porta nulla. Cras consectetur magna quis nisi ultricies, maximus porttitor orci ullamcorper. 
      Pellentesque hendrerit justo elementum ex interdum dignissim. Donec ullamcorper malesuada ligula, id pretium ligula. 
      Morbi quis facilisis sem, vel facilisis ipsum. Nam dignissim mi eu ipsum blandit fermentum. Nunc in dictum sem.`,
  },
  {
	name: "Manuela Gute",
	email: "Manuela.Gute@Ipsos.com",
    image:
      "https://outlook.office.com/owa/service.svc/s/GetPersonaPhoto?email=Manuela.Gute@Ipsos.com&UA=0&size=HR96x96",
    description: `Fusce hendrerit blandit lacus, id accumsan metus finibus quis. Sed ac scelerisque leo. Donec felis mauris,
      porttitor eget quam quis, rhoncus maximus orci. Duis quis tristique lectus. Phasellus in dictum metus, eget 
      molestie purus. In in posuere lacus, eu molestie nisi. Fusce ut leo mi.`,
  },
];
