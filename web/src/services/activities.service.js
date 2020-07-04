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
    type: 1,
    link: "//intranet.ipsos.com/_/ro/home/support-functions/human-resources/onboarding-inboarding/onboarding",
    title: "Employee Guideline",
    description: `1 The guideline is an <strong>IPSOS "How to" book</strong>, that gives you a look inside our business, culture, 
      learning & communication tools. It will help you get a better understanding of Ipsos, bringing you key 
      information about what life as an IIS employee will be, while navigating inside our offices.`,
  },
  {
    type: 1,
    link: "//intranet.ipsos.com/_/ro/home/support-functions/human-resources/onboarding-inboarding/onboarding",
    title: "Proud to be Ipsos",
    description: `We are "Proud to be Ipsos" because we respect our heritage. The notebook takes you to a journey 
      of knowing the <strong>5 values uniting the 18,000+ Ipsos employees</strong>. Observing these values on a daily basis means 
      conveying a sense of our culture to our clients and more broadly to the rest of society. They testify to our 
      convictions and commitment, and also they differentiate us from other companies.`,
  },
  {
    type: 2,
    link: "//intranet.ipsos.com/_/ro/home/support-functions/human-resources/development",
    title: "Managers Tool Kit",
    description: `2 The toolkit is created as an interactive guide that is  designed to be a self-study resource for our managers. 
      It includes things you need to know as a manager, links to learning programs, procedures and internal apps that help you manage 
      your team in a successful way by having access and information to all the tools necessary.`,
  },
  {
    type: 2,
    link: "//intranet.ipsos.com/_/ro/home/support-functions/human-resources/onboarding-inboarding/onboarding",
    title: "Employee Guideline",
    description: `The guideline is an <strong>IPSOS "How to" book</strong>, that gives you a look inside our business, culture, 
      learning & communication tools. It will help you get a better understanding of Ipsos, bringing you key 
      information about what life as an IIS employee will be, while navigating inside our offices.`,
  },
  {
    type: 2,
    link: "//intranet.ipsos.com/_/ro/home/support-functions/human-resources/onboarding-inboarding/onboarding",
    title: "Proud to be Ipsos",
    description: `We are "Proud to be Ipsos" because we respect our heritage. The notebook takes you to a journey 
      of knowing the <strong>5 values uniting the 18,000+ Ipsos employees<strong>. Observing these values on a daily basis means 
      conveying a sense of our culture to our clients and more broadly to the rest of society. They testify to our 
      convictions and commitment, and also they differentiate us from other companies.`,
  },
  {
    type: 3,
    link: "//intranet.ipsos.com/_/ro/home/support-functions/quality-process/procedures-forms/human-resources",
    title: "First Months Discussion Guide",
    description: `3 The  guide provides an example of topics that you, the manager, can use while having the monthly
      discussions with the new employee, during the  probationary period. The questions created  will facilitate the 
      conversation between you and the participant and help you provide support and understanding.`,
  },
  {
    type: 3,
    link:
      "//ipsosgroup-my.sharepoint.com/personal/romina_pricopie_ipsos_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fromina%5Fpricopie%5Fipsos%5Fcom%2FDocuments%2FNew%20Hire%20Orientation%202020",
    title: "Let's talk tool",
    description: `The tool provides questions for the discussion with the new employee, in his new  30 days new hire check in. 
      The tool includes samples of possible questions that can help you better understand the new employee`,
  },
  {
    type: 3,
    link:
      "//ipsosgroup-my.sharepoint.com/personal/romina_pricopie_ipsos_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fromina%5Fpricopie%5Fipsos%5Fcom%2FDocuments%2FNew%20Hire%20Orientation%202020",
    title: "Onboarding Procedure",
    description: `<strong>The procedure</strong> describes responsibilities and processes in relation  to the Onboarding process.`,
  },
];

export const contacts = [
  {
    name: "Crina Marin",
    email: "Crina.Marin@Ipsos.com",
    image: "/img/profile/Crina.Marin.jpg",
    description: "Learning & Development Manager",
  },
  {
    name: "Florin Poturu",
    email: "Florin.Poturu@Ipsos.com",
    image: "/img/profile/Florin.Poturu.jpg",
    description: `Learning & Development Specialist`,
  },
  {
    name: "Romina Pricopie",
    email: "Romina.Pricopie@Ipsos.com",
    image: "/img/profile/Romina.Pricopie.jpg",
    description: "Organizational Development & Culture Specialist",
  },
  {
    name: "Manuela Gute",
    email: "Manuela.Gute@Ipsos.com",
    image: "/img/profile/Manuela.Gute.jpg",
    description: `Country Human Resources Director`,
  },
];
