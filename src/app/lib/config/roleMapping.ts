// lib/config/roleMapping.ts - Complete file

export const roleToCollection: Record<string, string> = {
  // Engineering and Development
  "Software Engineer / Developer":
    "Engineering_Development_Software_engineer_or_developer",
  "Mobile Developer (iOS/Android)": "Engineering_Development_Mobile_Developer",
  "DevOps Engineer": "Engineering_Development_DevOps_Engineer",
  "MLOps Engineer": "Engineering_Development_MLOps_Engineer",
  "Software Architect": "Engineering_Development_Software_Architect",

  // Product Management
  "Business Analyst": "Product_Management_Business_Analyst",
  "Product Manager": "Product_Management_Product_Manager",
  "Technical Product Manager": "Product_Management_Technical_Product_Manager",
  "Product Owner": "Product_Management_Product_Owner",

  // Quality Assurance
  "QA Engineer / Software Tester": "QA_Testing_QA_Engineer",
  "Automation Engineer": "QA_Testing_Automation_Engineer",

  // Design and UX
  "UX Designer (User Experience)": "Design_and_User_Experience_UX_Designer",
  "UI Designer (User Interface)": "Design_and_User_Experience_UI_Designer",

  // Data and Analytics
  "Data Scientist": "Data_Analytics_Data_Scientist",
  "AI/ML Engineer": "Data_Analytics_AI_ML_Engineer",
  "Data Engineer": "Data_Analytics_Data_Engineer",
  "Business Intelligence Expert": "Data_Analytics_BI_Expert",
  "Data Analyst": "Data_Analytics_Data_Analyst",

  // IT and Infrastructure
  "Systems Administrator": "IT_Infrastructure_Systems_Administrator",
  "Network Engineer": "IT_Infrastructure_Network_Engineer",
  "Cloud Engineer": "IT_Infrastructure_Cloud_Engineer",
  "Database Administrator (SQL/NoSQL DBA)": "IT_Infrastructure_DBA",

  // Business-Facing Tech
  "Pre-Sales Engineer / Solutions Consultant":
    "Business_Tech_Pre_Sales_Engineer",
  "IT Sales / Technical Business Development": "Business_Tech_IT_Sales",

  // Cybersecurity
  "Cybersecurity Analyst": "Cybersecurity_Cybersecurity_Analyst",
  "Security Engineer": "Cybersecurity_Security_Engineer",
  "SOC Analyst (Security Operations Center)": "Cybersecurity_SOC_Analyst",
  "Ethical Hacker / Penetration Tester": "Cybersecurity_Ethical_Hacker",
  "Information Security Specialist": "Cybersecurity_Info_Security_Specialist",
};

// Updated to match your Likert behavioral format
export const qualitativeClusters = {
  cognitive: "Cognitive_Agility",
  growth: "Self-Awareness_And_Growth-Mindset",
  collaboration: "Collaboration_And_Social-Intelligence",
  leadership: "Leadership_And_Ownership",
  ethics: "Values_And_Work-Ethic",
  resilience: "Resilience_And_Self-Regulation",
};

export const purposeToIntent: Record<string, string> = {
  "I'm a student exploring IT career options": "confused",
  "I'm from a non-IT background and want to switch": "switch",
  "I'm already in IT and want to switch domain": "switch",
  "I want to assess myself before investing in upskilling": "interested",
  "I'm already experienced in IT and want role validation": "grow",
};

// Intent-based qualitative question distribution
export const intentQualitativeMapping = {
  confused: {
    clusters: ["Cognitive_Agility", "Self-Awareness_And_Growth-Mindset"],
    distribution: [15, 14], // Total 29
  },
  interested: {
    clusters: [
      "Self-Awareness_And_Growth-Mindset",
      "Values_And_Work-Ethic",
      "Cognitive_Agility",
    ],
    distribution: [10, 10, 9], // Total 29
  },
  grow: {
    clusters: [
      "Leadership_And_Ownership",
      "Resilience_And_Self-Regulation",
      "Values_And_Work-Ethic",
    ],
    distribution: [10, 10, 9], // Total 29
  },
  switch: {
    clusters: [
      "Self-Awareness_And_Growth-Mindset",
      "Collaboration_And_Social-Intelligence",
      "Resilience_And_Self-Regulation",
    ],
    distribution: [10, 10, 9], // Total 29
  },
};

// Experience-based difficulty distribution for "grow" intent
export const experienceDifficultyMap = {
  "Fresher (0 years)": { easy: 15, medium: 20, advanced: 5 },
  "1–5 years": { easy: 15, medium: 20, advanced: 5 },
  "5–10 years": { easy: 5, medium: 20, advanced: 15 },
  "10+ years": { easy: 0, medium: 15, advanced: 25 },
};

// Random domains for confused users
export const explorationDomains = [
  "Data_Analytics_Data_Scientist",
  "Engineering_Development_Software_engineer_or_developer",
  "Cybersecurity_Cybersecurity_Analyst",
  "Product_Management_Product_Manager",
  "Design_and_User_Experience_UX_Designer",
  "IT_Infrastructure_Cloud_Engineer",
  "QA_Testing_Automation_Engineer",
];
