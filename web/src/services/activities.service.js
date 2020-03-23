export const responsabile = {
  none: "",
  administrativeOffice: "Administrative Office",
  lineManager: "Line Manager",
  ldSpecialist: "LD Specialist",
  hrGeneralist: "HR Generalist",
  hrAdmin: "HR Admin",
  qualityTeam: "Quality Team",
  dpoRomania: "DPO Romania",
  lineManagerOrLDSpecialist: "Line Manager / LD Specialist"
};

export const duration = {
  none: "",
  firstDay: "First day",
  firstThreeDays: "First three days",
  firstWeek: "First week",
  firstTwoWeeks: "First two weeks",
  firstTwoMonths: "First two months",
  firstThreeMonths: "First three months",
  firstSixMonths: "First six months"
};

export const welcomeToIssSpecialists = {
  columns: ["Welcome to IIS", "Tools", "Date", "Responsible", "Done"],
  data: [
    ["Welcome package", "Office supplies, Access Card, Employee Guideline", duration.firstDay, responsabile.administrativeOffice],
    ["Location tour", "Presentation", duration.firstDay, responsabile.lineManager],
    ["Buddy Introduction", "Meeting", duration.firstDay, responsabile.lineManager],
    ["IIS Romania presentation", "Presentation", duration.firstDay, responsabile.lineManager],
    ["New Hire Orientation Program  + Country Manager Introduction", "PPT", duration.firstWeek, responsabile.ldSpecialist],
    ["Discover Ipsos", "ITC Platform", duration.firstWeek, responsabile.lineManager],
    ["Corporate Social Responsibility – Abridged version", "ITC Platform", duration.firstWeek, responsabile.lineManager],
    ["Appropriate workplace behavior", "ITC Platform", duration.firstWeek, responsabile.lineManager],
    ["Green Book Presentation", "Ipsos Intranet", duration.firstWeek, responsabile.lineManager],
    ["Introduction key contacts", "Meeting", duration.firstTwoWeeks, responsabile.lineManager]
  ]
};

export const complianceTopicsSpecialists = {
  columns: ["Compliance Topics", "Tools", "Date", "Responsible", "Done"],
  data: [
    ["Health and Safety at work", "Intranet", duration.firstDay, responsabile.administrativeOffice],
    ["Job description discussion", "Job description form", duration.firstDay, responsabile.lineManager],
    ["IIS Internal Regulation and Collective Labour Agreement", "Documents Presentation", duration.firstDay, responsabile.hrGeneralist],
    ["Present the Probationary period goals plan", "Probationary period form", duration.firstThreeDays, "Line Manager"],
    ["Quality and Info Security Essentials", "E-learning / Email from Quality Team", duration.firstTwoWeeks, "Quality Team"],
    ["Security Awareness 2017", "ITC Platform", duration.firstWeek, "Line Manager"],
    ["Policies & Procedures - Book of Policies", "Ipsos Intranet", duration.firstThreeMonths, "Line Manager"],
    ["General Data Protection Regulation (GDPR) / Data Privacy", "Webinar", duration.firstThreeMonths, "DPO Romania"]
  ]
};

export const iisApsSpecialists = {
  columns: ["IIS Apps", "Tools", "Date", "Responsible", "Done"],
  data: [
    ["ME Platform", "Intranet / ME Guideline", duration.firstWeek, "HR Adim"],
    ["iTime: Ipsos Time Tracking System", "ITC Platform", duration.firstWeek, "Line Manager"],
    ["iService", "Intranet", duration.firstTwoWeeks, "IT"],
    ["iTalent", "Presentation", duration.firstTwoMonths, "OD"],
    ["Ipsos Training Center", "ITC Platform", duration.firstWeek, "LD"]
  ]
};

export const trainingsSpecialists = {
  columns: ["Trainings / workshops", "Tools", "Date", "Responsible", "Done"],
  data: [
    ["ITC : Fundamentals Program ( Communication / Time Management / Client Service )", "ITC Platform", duration.firstTwoMonths, responsabile.lineManagerOrLDSpecialist],
    ["In Class: Client Service ", "Workshop", duration.firstTwoMonths, "Andrei Ionescu"]
  ]
};

export const welcomeToIssManagers = { columns: [...welcomeToIssSpecialists.columns], data: [...welcomeToIssSpecialists.data] };
welcomeToIssManagers.data.push([
  "Specific management procedures (RAF forms, Performance Appraisal Policy, HC documentation, Budget documentation, Travell approvals, etc.)",
  "Internal procedures, forms, documentation",
  duration.firstTwoWeeks,
  responsabile.lineManager
]);

export const complianceTopicsManagers = { columns: [...complianceTopicsSpecialists.columns], data: [...complianceTopicsSpecialists.data] };

export const iisApsManagers = { columns: [...iisApsSpecialists.columns], data: [...iisApsSpecialists.data] };

export const trainingsManagers = { columns: [...trainingsSpecialists.columns], data: [...trainingsSpecialists.data] };
trainingsManagers.data = [["GROW IIS Leaders", "ITC Platform / In Class", duration.firstSixMonths, responsabile.lineManagerOrLDSpecialist]];
