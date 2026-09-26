/**
 * Server database storage for opportunities & eligibility rules
 * Persisted to data/opportunities.json with auto-seeding
 */
import fs from 'node:fs';
import path from 'node:path';
import { Opportunity, CollegeCourseOption, CollegeCourseEligibilityInput } from '../shared/types.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'opportunities.json');

const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-nda-na',
    slug: 'nda-eligibility',
    name: 'National Defence Academy & Naval Academy Examination (NDA & NA)',
    shortName: 'NDA & NA',
    category: 'Defence',
    conductingOrg: 'Union Public Service Commission (UPSC) & Ministry of Defence',
    summary: 'Direct entry into the Army, Navy, and Air Force wings of the National Defence Academy and Indian Naval Academy Cadets.',
    description: 'The National Defence Academy examination is conducted twice a year by UPSC. It offers 10+2 candidates an opportunity to join the Indian Armed Forces as commissioned officers after a 3-year rigorous joint training course at NDA Khadakwasla, Pune, followed by service-specific training.',
    minEducationLevel: 'class12',
    allowedEducationLevels: ['class12', 'undergraduate', 'graduate'],
    ageRule: {
      minAge: 16.5,
      maxAge: 19.5,
      dobMin: '2007-07-02',
      dobMax: '2010-07-01',
      cutoffReferenceText: 'Born not earlier than 2nd July 2007 and not later than 1st July 2010 (for NDA-I 2026 cycle)',
      allowFinalYearAppearing: true,
    },
    categoryAgeRelaxation: {
      OBC: 0,
      SC: 0,
      ST: 0,
      PwBD: 0,
      EWS: 0,
    },
    genderAllowed: 'all',
    maritalStatus: 'unmarried',
    subjectRequirements: {
      mathsRequired: false,
      physicsRequired: false,
      notes: 'Army Wing: 12th pass of any stream. Air Force & Navy Wings: 12th pass with Physics, Chemistry & Mathematics is mandatory.',
    },
    minPercentageClass12: 0,
    citizenshipRequired: 'indian',
    domicileRequired: 'none',
    physicalStandards: {
      heightMaleCm: 157,
      heightFemaleCm: 152,
      notes: 'Gorkhas and candidates from hills of North-Eastern regions receive 5 cm height relaxation. Flying branch requires 163 cm.',
    },
    attemptsRule: {
      hasFixedAttemptLimit: false,
      cyclesPerYear: 2,
      officialRuleText: 'No fixed attempt limit is prescribed. Candidates can apply as long as they satisfy the specific DOB window for that cycle.',
    },
    currentCycle: {
      cycleName: 'NDA & NA Examination (I), 2026',
      notificationDate: 'December 2025',
      applicationPeriod: 'December 2025 - January 2026',
      examDate: 'April 2026',
      officialSourceUrl: 'https://upsc.gov.in',
      officialSourceOrg: 'Union Public Service Commission',
      lastVerifiedDate: '2026-03-15',
      isVerified: true,
    },
    selectionStages: [
      'Written Examination (Mathematics: 300 marks, GAT: 600 marks)',
      'SSB Interview & Psychological Assessment (5 Days, 900 marks)',
      'Comprehensive Medical Board Examination',
      'Final All India Merit List based on Written + SSB marks',
    ],
    requiredDocuments: [
      'Class 10 Certificate (Proof of Date of Birth)',
      'Class 12 Marksheet / School Bonafide for appearing students',
      'Valid Government Photo ID (Aadhaar / Voter ID / Passport)',
    ],
    faqs: [
      {
        question: 'Are female candidates eligible for NDA?',
        answer: 'Yes. Following the Supreme Court ruling, unmarried female candidates are fully eligible to apply for all wings of the NDA.',
      },
      {
        question: 'Is there any age relaxation for SC/ST or OBC candidates in NDA?',
        answer: 'No. The Ministry of Defence and UPSC do not provide any age relaxation for reserved categories in NDA recruitment.',
      },
      {
        question: 'Can Class 12 appearing students apply?',
        answer: 'Yes. Students studying in Class 12 can apply, provided they produce proof of passing by the date specified in the official notification.',
      },
    ],
    isPublished: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-03-15T00:00:00.000Z',
  },
  {
    id: 'opp-upsc-cse',
    slug: 'upsc-cse-eligibility',
    name: 'Civil Services Examination (UPSC CSE)',
    shortName: 'UPSC CSE / IAS',
    category: 'UPSC',
    conductingOrg: 'Union Public Service Commission (UPSC)',
    summary: 'Premier recruitment exam for Indian Administrative Service (IAS), Indian Police Service (IPS), IFS, and Central Group A & B services.',
    description: 'UPSC Civil Services Examination is India’s foremost national competitive examination. It recruits top administrators for the Government of India across 24 civil services.',
    minEducationLevel: 'graduate',
    allowedEducationLevels: ['graduate', 'postgraduate'],
    ageRule: {
      minAge: 21,
      maxAge: 32,
      cutoffReferenceText: 'As on 1st August of the examination year',
      allowFinalYearAppearing: true,
    },
    categoryAgeRelaxation: {
      OBC: 3,
      SC: 5,
      ST: 5,
      PwBD: 10,
      EWS: 0,
    },
    genderAllowed: 'all',
    maritalStatus: 'any',
    minPercentageGraduation: 0,
    allowedDegrees: ['Any Bachelor’s Degree from a recognized university'],
    citizenshipRequired: 'indian',
    domicileRequired: 'none',
    attemptsRule: {
      hasFixedAttemptLimit: true,
      maxAttemptsGeneral: 6,
      maxAttemptsOBC: 9,
      maxAttemptsSC_ST: null, // Unlimited up to age limit
      maxAttemptsPwBD: 9,
      cyclesPerYear: 1,
      officialRuleText: 'General & EWS: 6 attempts. OBC: 9 attempts. SC/ST: Unlimited (up to upper age 37). PwBD: 9 attempts (Gen/OBC/EWS) or unlimited (SC/ST).',
    },
    currentCycle: {
      cycleName: 'Civil Services (Preliminary) Examination, 2026',
      notificationDate: 'February 2026',
      applicationPeriod: 'February 2026 - March 2026',
      examDate: 'May / June 2026',
      officialSourceUrl: 'https://upsc.gov.in',
      officialSourceOrg: 'Union Public Service Commission',
      lastVerifiedDate: '2026-03-20',
      isVerified: true,
    },
    selectionStages: [
      'Preliminary Examination (Objective: GS Paper I + CSAT qualifying)',
      'Main Examination (9 Written Papers: 1750 marks)',
      'Personality Test / Interview (275 marks)',
    ],
    requiredDocuments: [
      'Graduation Degree Certificate / Provisional Degree',
      'Matriculation Certificate (DOB proof)',
      'Category Certificate (OBC-NCL / SC / ST / EWS) if claiming relaxation',
    ],
    faqs: [
      {
        question: 'Does appearing in Prelims count as an attempt?',
        answer: 'Yes. An attempt at a Preliminary Examination is deemed to be an attempt at the Civil Services Examination if the candidate appears in at least one paper.',
      },
      {
        question: 'Can candidates in the final year of graduation apply?',
        answer: 'Yes, candidates who have appeared or intend to appear at the qualifying degree examination can apply for the Preliminary Exam.',
      },
    ],
    isPublished: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-03-20T00:00:00.000Z',
  },
  {
    id: 'opp-ssc-cgl',
    slug: 'ssc-cgl-eligibility',
    name: 'Combined Graduate Level Examination (SSC CGL)',
    shortName: 'SSC CGL',
    category: 'SSC',
    conductingOrg: 'Staff Selection Commission (SSC)',
    summary: 'Recruitment for Group B and Group C posts in various Central Ministries, Departments, and Constitutional Bodies.',
    description: 'SSC CGL is one of the largest recruitment drives in India for graduates, filling posts like Assistant Section Officer (ASO), Inspector of Income Tax, Central Excise Inspector, Assistant Enforcement Officer, and Auditors.',
    minEducationLevel: 'graduate',
    allowedEducationLevels: ['graduate', 'postgraduate'],
    ageRule: {
      minAge: 18,
      maxAge: 30,
      cutoffReferenceText: 'As on 1st August of the exam year (some specific posts allow up to 32 years, e.g., JSO)',
      allowFinalYearAppearing: true,
    },
    categoryAgeRelaxation: {
      OBC: 3,
      SC: 5,
      ST: 5,
      PwBD: 10,
      EWS: 0,
    },
    genderAllowed: 'all',
    maritalStatus: 'any',
    citizenshipRequired: 'indian',
    domicileRequired: 'none',
    attemptsRule: {
      hasFixedAttemptLimit: false,
      cyclesPerYear: 1,
      officialRuleText: 'No attempt limit is prescribed. Candidates can apply every year as long as they are within the age criteria for their category.',
    },
    currentCycle: {
      cycleName: 'Combined Graduate Level Examination, 2026',
      notificationDate: 'June 2026',
      applicationPeriod: 'June - July 2026',
      examDate: 'September - October 2026',
      officialSourceUrl: 'https://ssc.gov.in',
      officialSourceOrg: 'Staff Selection Commission',
      lastVerifiedDate: '2026-03-10',
      isVerified: true,
    },
    selectionStages: [
      'Tier-I (Computer Based Examination - Qualifying/Screening)',
      'Tier-II (Paper I: Mathematical Abilities, Reasoning, English, General Awareness, Computer Knowledge + Data Entry Speed Test)',
      'Document Verification conducted by user departments',
    ],
    requiredDocuments: [
      'Class 10 & 12 Certificates',
      'Bachelor’s Degree Certificate / Marksheets',
      'Caste / EWS / PwBD Certificate where applicable',
    ],
    faqs: [
      {
        question: 'Is there an attempt limit for SSC CGL?',
        answer: 'No. SSC does not restrict the number of attempts for CGL. Eligibility is solely governed by age and educational qualifications.',
      },
    ],
    isPublished: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-03-10T00:00:00.000Z',
  },
  {
    id: 'opp-cds-exam',
    slug: 'cds-eligibility',
    name: 'Combined Defence Services Examination (CDS)',
    shortName: 'UPSC CDS',
    category: 'Defence',
    conductingOrg: 'Union Public Service Commission (UPSC)',
    summary: 'Officer entry for graduates into Indian Military Academy (IMA), Naval Academy (INA), Air Force Academy (AFA), and Officers Training Academy (OTA).',
    description: 'CDS is conducted twice a year by UPSC for recruiting officers into the three wings of the armed forces. Male and female graduates can apply for permanent commission (IMA, INA, AFA) and short service commission (OTA Chennai).',
    minEducationLevel: 'graduate',
    allowedEducationLevels: ['graduate', 'postgraduate'],
    ageRule: {
      minAge: 19,
      maxAge: 25,
      dobMin: '2002-07-02',
      dobMax: '2007-07-01',
      cutoffReferenceText: 'IMA/INA: 19-24 years; AFA: 20-24 years; OTA: 19-25 years',
      allowFinalYearAppearing: true,
    },
    categoryAgeRelaxation: {
      OBC: 0,
      SC: 0,
      ST: 0,
      PwBD: 0,
      EWS: 0,
    },
    genderAllowed: 'all',
    maritalStatus: 'unmarried',
    subjectRequirements: {
      notes: 'IMA & OTA: Degree of a recognized University or equivalent. INA: Degree in Engineering. AFA: Degree with Physics & Math at 10+2 OR Bachelor of Engineering.',
    },
    citizenshipRequired: 'indian',
    domicileRequired: 'none',
    attemptsRule: {
      hasFixedAttemptLimit: false,
      cyclesPerYear: 2,
      officialRuleText: 'No fixed attempt limit. Eligible as long as candidate meets the age window for each academy.',
    },
    currentCycle: {
      cycleName: 'CDS Examination (I), 2026',
      notificationDate: 'December 2025',
      applicationPeriod: 'December 2025 - January 2026',
      examDate: 'April 2026',
      officialSourceUrl: 'https://upsc.gov.in',
      officialSourceOrg: 'Union Public Service Commission',
      lastVerifiedDate: '2026-03-12',
      isVerified: true,
    },
    selectionStages: [
      'Written Examination (English, General Knowledge, Elementary Mathematics)',
      'SSB Interview (Intelligence & Personality Test: 5 Days)',
      'Medical Board Inspection',
    ],
    requiredDocuments: [
      'Graduation Degree / Final Year Bonafide',
      'Class 10 Matriculation Certificate',
      'Class 12 Certificate (for AFA Physics & Maths verification)',
    ],
    faqs: [
      {
        question: 'Can female candidates join IMA or AFA through CDS?',
        answer: 'Currently female candidates can apply for the Officers Training Academy (OTA) Chennai through CDS.',
      },
      {
        question: 'Is mathematics compulsory for CDS OTA?',
        answer: 'No. The OTA written examination only tests English and General Knowledge. Elementary Mathematics is not required for OTA.',
      },
    ],
    isPublished: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-03-12T00:00:00.000Z',
  },
  {
    id: 'opp-neet-ug',
    slug: 'neet-ug-eligibility',
    name: 'National Eligibility cum Entrance Test (NEET UG)',
    shortName: 'NEET UG',
    category: 'Medical',
    conductingOrg: 'National Testing Agency (NTA) & National Medical Commission (NMC)',
    summary: 'Single national entrance test for MBBS, BDS, BAMS, BHMS, and other undergraduate medical admissions across India.',
    description: 'NEET UG is the mandatory entrance test for admission to undergraduate medical and dental programs across all government and private colleges in India, including AIIMS and JIPMER.',
    minEducationLevel: 'class12',
    allowedEducationLevels: ['class12', 'undergraduate', 'graduate'],
    ageRule: {
      minAge: 17,
      maxAge: 99, // Supreme Court & NMC removed upper age limit
      cutoffReferenceText: 'Must complete 17 years on or before 31st December of the admission year. NO upper age limit.',
      allowFinalYearAppearing: true,
    },
    categoryAgeRelaxation: {
      OBC: 0,
      SC: 0,
      ST: 0,
      PwBD: 0,
      EWS: 0,
    },
    genderAllowed: 'all',
    subjectRequirements: {
      physicsRequired: true,
      chemistryRequired: true,
      biologyRequired: true,
      englishRequired: true,
      notes: 'Must have studied Physics, Chemistry, Biology/Biotechnology and English as core subjects in Class 11 and 12.',
    },
    minPercentageClass12: 50, // 50% for Gen, 40% for SC/ST/OBC
    citizenshipRequired: 'indian',
    domicileRequired: 'none',
    attemptsRule: {
      hasFixedAttemptLimit: false,
      cyclesPerYear: 1,
      officialRuleText: 'No limit on the number of attempts. Candidates can appear as many times as they wish.',
    },
    currentCycle: {
      cycleName: 'NEET (UG) 2026',
      notificationDate: 'February 2026',
      applicationPeriod: 'February - March 2026',
      examDate: 'May 2026',
      officialSourceUrl: 'https://exams.nta.ac.in/NEET/',
      officialSourceOrg: 'National Testing Agency',
      lastVerifiedDate: '2026-03-18',
      isVerified: true,
    },
    selectionStages: [
      'National Pen-and-Paper Examination (Physics, Chemistry, Botany, Zoology - 720 marks)',
      'MCC All India Quota Counselling (15%) + State Quota Counselling (85%)',
    ],
    requiredDocuments: [
      'Class 10 & 12 Marksheets',
      'Passport size photo with white background and name/date',
      'Valid ID Card (Aadhaar)',
    ],
    faqs: [
      {
        question: 'Is there an upper age limit for NEET UG?',
        answer: 'No. The National Medical Commission (NMC) and Supreme Court of India removed the upper age limit. Any candidate aged 17 or above is eligible.',
      },
      {
        question: 'Are NIOS or private students eligible?',
        answer: 'Yes, as per recent NMC notifications, open school and private students who have studied required subjects are eligible.',
      },
    ],
    isPublished: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-03-18T00:00:00.000Z',
  },
  {
    id: 'opp-jee-main',
    slug: 'jee-main-eligibility',
    name: 'Joint Entrance Examination Main (JEE Main)',
    shortName: 'JEE Main',
    category: 'Engineering',
    conductingOrg: 'National Testing Agency (NTA)',
    summary: 'Entrance examination for admissions to NITs, IIITs, CFTIs, and the eligibility test for JEE Advanced (IITs).',
    description: 'JEE Main is conducted in two sessions every year. It serves as the gateway to premier central engineering institutions and shortlists the top 2.5 lakh candidates for JEE Advanced.',
    minEducationLevel: 'class12',
    allowedEducationLevels: ['class12', 'undergraduate'],
    ageRule: {
      cutoffReferenceText: 'No age limit for JEE Main. However, candidate must have passed Class 12 in the exam year or preceding 2 years.',
      allowFinalYearAppearing: true,
    },
    categoryAgeRelaxation: {
      OBC: 0,
      SC: 0,
      ST: 0,
      PwBD: 0,
      EWS: 0,
    },
    genderAllowed: 'all',
    subjectRequirements: {
      mathsRequired: true,
      physicsRequired: true,
      notes: 'B.Tech / B.E: Physics and Mathematics as compulsory subjects along with Chemistry, Biotechnology, Biology, or Technical Vocational subject.',
    },
    minPercentageClass12: 75, // 75% for Gen/OBC, 65% for SC/ST for NIT/IIT admission criteria
    citizenshipRequired: 'indian',
    domicileRequired: 'none',
    attemptsRule: {
      hasFixedAttemptLimit: true,
      maxAttemptsGeneral: 3,
      maxAttemptsOBC: 3,
      maxAttemptsSC_ST: 3,
      maxAttemptsPwBD: 3,
      cyclesPerYear: 1, // 2 sessions within 1 academic year cycle
      officialRuleText: 'Candidate can appear in JEE (Main) for 3 consecutive years starting from the year of passing Class 12.',
    },
    currentCycle: {
      cycleName: 'JEE (Main) 2026',
      notificationDate: 'November 2025',
      applicationPeriod: 'Session 1: Nov-Dec, Session 2: Feb-Mar',
      examDate: 'Session 1: Jan, Session 2: April',
      officialSourceUrl: 'https://jeemain.nta.ac.in',
      officialSourceOrg: 'National Testing Agency',
      lastVerifiedDate: '2026-03-01',
      isVerified: true,
    },
    selectionStages: [
      'Computer Based Test Paper 1 (Physics, Chemistry, Mathematics - 300 marks)',
      'JoSAA / CSAB Centralized Counselling for NITs/IIITs',
    ],
    requiredDocuments: [
      'Class 10 & 12 Marksheets',
      'Category / PwBD Certificate',
    ],
    faqs: [
      {
        question: 'How many times can I attempt JEE Main?',
        answer: 'You can appear for JEE Main for a maximum of 3 consecutive years immediately after passing your Class 12 board examination.',
      },
    ],
    isPublished: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-03-01T00:00:00.000Z',
  },
  {
    id: 'opp-ibps-po',
    slug: 'ibps-po-eligibility',
    name: 'IBPS Probationary Officer / Management Trainee (IBPS PO)',
    shortName: 'IBPS PO',
    category: 'Banking & Finance',
    conductingOrg: 'Institute of Banking Personnel Selection (IBPS)',
    summary: 'Recruitment for Probationary Officers across 11 participating Public Sector Undertaking Banks in India.',
    description: 'IBPS PO recruits Assistant Managers / Probationary Officers for public sector banks like Bank of Baroda, Canara Bank, Punjab National Bank, Union Bank of India, and Indian Bank.',
    minEducationLevel: 'graduate',
    allowedEducationLevels: ['graduate', 'postgraduate'],
    ageRule: {
      minAge: 20,
      maxAge: 30,
      cutoffReferenceText: 'As on 1st August of the notification year',
      allowFinalYearAppearing: false, // Must possess graduation degree by registration cutoff date
    },
    categoryAgeRelaxation: {
      OBC: 3,
      SC: 5,
      ST: 5,
      PwBD: 10,
      EWS: 0,
    },
    genderAllowed: 'all',
    maritalStatus: 'any',
    minPercentageGraduation: 0,
    allowedDegrees: ['Any Bachelor’s Degree in any discipline from a recognized University'],
    citizenshipRequired: 'indian',
    domicileRequired: 'none',
    attemptsRule: {
      hasFixedAttemptLimit: false,
      cyclesPerYear: 1,
      officialRuleText: 'No attempt limit is prescribed for IBPS PO. Candidates can apply as long as they are within the age bracket.',
    },
    currentCycle: {
      cycleName: 'CRP PO/MT-XVI (2026-27)',
      notificationDate: 'August 2026',
      applicationPeriod: 'August 2026',
      examDate: 'Prelims: October, Mains: November 2026',
      officialSourceUrl: 'https://ibps.in',
      officialSourceOrg: 'Institute of Banking Personnel Selection',
      lastVerifiedDate: '2026-03-05',
      isVerified: true,
    },
    selectionStages: [
      'Preliminary Examination (English, Quantitative Aptitude, Reasoning Ability - 100 marks)',
      'Main Examination (Objective 200 marks + English Descriptive 25 marks)',
      'Common Interview conducted by participating banks',
    ],
    requiredDocuments: [
      'Graduation Degree Certificate / Final Consolidated Marksheet',
      'Proof of Date of Birth',
      'Category / Disability Certificate',
    ],
    faqs: [
      {
        question: 'Is there an attempt limit for IBPS PO?',
        answer: 'No. Unlike SBI PO, IBPS does NOT restrict the number of attempts. You can apply as many times as you like before exceeding the upper age limit.',
      },
    ],
    isPublished: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-03-05T00:00:00.000Z',
  },
  {
    id: 'opp-sbi-po',
    slug: 'sbi-po-eligibility',
    name: 'State Bank of India Probationary Officer (SBI PO)',
    shortName: 'SBI PO',
    category: 'Banking & Finance',
    conductingOrg: 'State Bank of India (SBI)',
    summary: 'Direct recruitment of Probationary Officers in India’s largest commercial bank.',
    description: 'SBI PO is one of the most coveted banking careers in India, offering rapid career growth, premier compensation packages, and global posting opportunities.',
    minEducationLevel: 'graduate',
    allowedEducationLevels: ['graduate', 'postgraduate'],
    ageRule: {
      minAge: 21,
      maxAge: 30,
      cutoffReferenceText: 'As on 1st April of the recruitment year',
      allowFinalYearAppearing: true,
    },
    categoryAgeRelaxation: {
      OBC: 3,
      SC: 5,
      ST: 5,
      PwBD: 10,
      EWS: 0,
    },
    genderAllowed: 'all',
    maritalStatus: 'any',
    citizenshipRequired: 'indian',
    domicileRequired: 'none',
    attemptsRule: {
      hasFixedAttemptLimit: true,
      maxAttemptsGeneral: 4,
      maxAttemptsOBC: 7,
      maxAttemptsSC_ST: null, // Unlimited for SC/ST
      maxAttemptsPwBD: 7,
      cyclesPerYear: 1,
      officialRuleText: 'General & EWS: 4 attempts. General (PwBD) & OBC/OBC (PwBD): 7 attempts. SC/ST: No restriction (unlimited). Apprearing in Prelims is NOT counted as an attempt; only Mains counts.',
    },
    currentCycle: {
      cycleName: 'SBI PO Recruitment 2026',
      notificationDate: 'September 2026',
      applicationPeriod: 'September - October 2026',
      examDate: 'Prelims: Nov, Mains: Dec / Jan',
      officialSourceUrl: 'https://sbi.co.in/web/careers',
      officialSourceOrg: 'State Bank of India',
      lastVerifiedDate: '2026-03-14',
      isVerified: true,
    },
    selectionStages: [
      'Phase-I: Preliminary Examination (Screening)',
      'Phase-II: Main Examination (Objective 200 marks + Descriptive 50 marks)',
      'Phase-III: Psychometric Test, Group Discussion (20 marks) & Interview (30 marks)',
    ],
    requiredDocuments: [
      'Graduation Degree / Final Year Passing Undertaking',
      'Category Certificate (Central format)',
    ],
    faqs: [
      {
        question: 'Does appearing in the SBI PO Prelims exam count as an attempt?',
        answer: 'No. As per SBI official rules, appearing in the Preliminary Examination is NOT counted as an attempt. An attempt is only counted if you appear in the Main Examination.',
      },
    ],
    isPublished: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-03-14T00:00:00.000Z',
  },
  {
    id: 'opp-rrb-ntpc',
    slug: 'rrb-ntpc-eligibility',
    name: 'Railway Recruitment Board NTPC (Graduate & 10+2)',
    shortName: 'RRB NTPC',
    category: 'Railways',
    conductingOrg: 'Railway Recruitment Boards (RRB) & Ministry of Railways',
    summary: 'Recruitment for Station Master, Goods Train Manager, Commercial Apprentice, Junior Clerk, and Accounts Clerk in Indian Railways.',
    description: 'RRB Non-Technical Popular Categories (NTPC) recruits across two tiers: Under Graduate posts (Level 2 & 3 for 12th pass) and Graduate posts (Level 4, 5, 6 for degree holders).',
    minEducationLevel: 'class12',
    allowedEducationLevels: ['class12', 'diploma', 'undergraduate', 'graduate', 'postgraduate'],
    ageRule: {
      minAge: 18,
      maxAge: 33,
      cutoffReferenceText: '18-30 years for 10+2 level posts; 18-33 years for Graduate level posts as on 1st July of exam year',
    },
    categoryAgeRelaxation: {
      OBC: 3,
      SC: 5,
      ST: 5,
      PwBD: 10,
      EWS: 0,
    },
    genderAllowed: 'all',
    maritalStatus: 'any',
    citizenshipRequired: 'indian',
    domicileRequired: 'none',
    attemptsRule: {
      hasFixedAttemptLimit: false,
      cyclesPerYear: 1,
      officialRuleText: 'No attempt limit. Eligible as long as candidate is within the age limit.',
    },
    currentCycle: {
      cycleName: 'CEN 05/2026 (NTPC)',
      notificationDate: 'September 2026',
      applicationPeriod: 'September - October 2026',
      examDate: 'December 2026 - February 2027',
      officialSourceUrl: 'https://indianrailways.gov.in',
      officialSourceOrg: 'Railway Recruitment Boards',
      lastVerifiedDate: '2026-02-28',
      isVerified: true,
    },
    selectionStages: [
      '1st Stage Computer Based Test (CBT-1 common for all posts)',
      '2nd Stage CBT (Separate for each pay level)',
      'Computer Based Aptitude Test (for Station Master) / Typing Skill Test',
      'Document Verification and Medical Examination',
    ],
    requiredDocuments: [
      '10th / 12th / Degree certificates',
      'Community Certificate',
    ],
    faqs: [
      {
        question: 'Can Class 12 candidates apply for RRB NTPC?',
        answer: 'Yes. Positions such as Junior Clerk cum Typist, Accounts Clerk cum Typist, and Commercial cum Ticket Clerk require only Class 12.',
      },
    ],
    isPublished: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-02-28T00:00:00.000Z',
  },
  {
    id: 'opp-imu-cet',
    slug: 'merchant-navy-eligibility',
    name: 'Indian Maritime University CET (Merchant Navy - DNS & B.Sc Nautical)',
    shortName: 'IMU-CET / Merchant Navy',
    category: 'Maritime',
    conductingOrg: 'Indian Maritime University (IMU) & DG Shipping',
    summary: 'Officer cadet entry into Merchant Navy for Diploma in Nautical Science (DNS) and B.Sc Nautical Science.',
    description: 'IMU-CET is the mandatory entrance examination for joining the Merchant Navy as a deck cadet leading to Chief Mate and Captain ranks on international commercial merchant vessels.',
    minEducationLevel: 'class12',
    allowedEducationLevels: ['class12', 'undergraduate', 'graduate'],
    ageRule: {
      minAge: 17,
      maxAge: 25,
      cutoffReferenceText: 'As on 1st August of the year of admission. 5 years relaxation for SC/ST; 2 years for female candidates.',
    },
    categoryAgeRelaxation: {
      OBC: 0,
      SC: 5,
      ST: 5,
      PwBD: 0,
      EWS: 0,
    },
    genderAllowed: 'all',
    subjectRequirements: {
      mathsRequired: true,
      physicsRequired: true,
      chemistryRequired: true,
      englishRequired: true,
      notes: 'Mandatory minimum 60% aggregate marks in PCM (Physics, Chemistry, Maths) and minimum 50% marks in English at either 10th or 12th standard.',
    },
    minPercentageClass12: 60,
    citizenshipRequired: 'indian',
    domicileRequired: 'none',
    physicalStandards: {
      visionStandards: 'Unaided 6/6 in each eye for Nautical candidates; no color blindness allowed. Must be medically certified by DG Shipping approved doctor.',
    },
    attemptsRule: {
      hasFixedAttemptLimit: false,
      cyclesPerYear: 1,
      officialRuleText: 'No fixed attempt limit. Eligible within the prescribed age window.',
    },
    currentCycle: {
      cycleName: 'IMU-CET 2026',
      notificationDate: 'April 2026',
      applicationPeriod: 'April - May 2026',
      examDate: 'June 2026',
      officialSourceUrl: 'https://www.imu.edu.in',
      officialSourceOrg: 'Indian Maritime University',
      lastVerifiedDate: '2026-03-08',
      isVerified: true,
    },
    selectionStages: [
      'IMU-CET Online Computer Based Examination (English, GK, Aptitude, Chemistry, Physics, Mathematics)',
      'Shipping Company Sponsorship Interview (for DNS)',
      'DG Shipping Approved Medical Examination',
    ],
    requiredDocuments: [
      'Class 10 & 12 Marksheets showing 60% PCM & 50% English',
      'Passport (Mandatory for maritime trainees)',
      'Medical Fitness Certificate from DG Shipping Approved Doctor',
    ],
    faqs: [
      {
        question: 'Can someone with spectacles join DNS Deck Cadet?',
        answer: 'No. For Nautical Science and deck cadets, vision must be 6/6 in both eyes without optical aids, with normal color vision.',
      },
      {
        question: 'Is company sponsorship required before admission?',
        answer: 'For 1-year DNS leading to B.Sc Applied Nautical Science, DG Shipping requires candidates to obtain sponsorship from a recognized shipping company.',
      },
    ],
    isPublished: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-03-08T00:00:00.000Z',
  },
  {
    id: 'opp-clat-ug',
    slug: 'clat-eligibility',
    name: 'Common Law Admission Test (CLAT UG)',
    shortName: 'CLAT UG',
    category: 'Law',
    conductingOrg: 'Consortium of National Law Universities (NLUs)',
    summary: 'National entrance test for 5-Year Integrated Law degrees (BA LLB, BBA LLB, B.Sc LLB) across 24 NLUs.',
    description: 'CLAT is the gateway to India’s premier National Law Universities like NLSIU Bengaluru, NALSAR Hyderabad, and WBNUJS Kolkata for 5-year integrated law programs.',
    minEducationLevel: 'class12',
    allowedEducationLevels: ['class12', 'undergraduate', 'graduate'],
    ageRule: {
      cutoffReferenceText: 'NO upper age limit for CLAT UG as per Supreme Court of India directives.',
      allowFinalYearAppearing: true,
    },
    categoryAgeRelaxation: {
      OBC: 0,
      SC: 0,
      ST: 0,
      PwBD: 0,
      EWS: 0,
    },
    genderAllowed: 'all',
    minPercentageClass12: 45, // 45% for Gen/OBC, 40% for SC/ST
    citizenshipRequired: 'indian',
    domicileRequired: 'none',
    attemptsRule: {
      hasFixedAttemptLimit: false,
      cyclesPerYear: 1,
      officialRuleText: 'No upper age limit and no limit on the number of attempts.',
    },
    currentCycle: {
      cycleName: 'CLAT 2026',
      notificationDate: 'July 2025',
      applicationPeriod: 'July - October 2025',
      examDate: 'December 2025 / 2026',
      officialSourceUrl: 'https://consortiumofnlus.ac.in',
      officialSourceOrg: 'Consortium of NLUs',
      lastVerifiedDate: '2026-03-16',
      isVerified: true,
    },
    selectionStages: [
      'Offline Pen-and-Paper Exam (120 questions: English, Current Affairs, Legal Reasoning, Logical Reasoning, Quantitative Techniques)',
      'Centralized NLU Merit Counselling',
    ],
    requiredDocuments: [
      'Class 10 & 12 Marksheets',
      'Category Certificate for reservation seats',
    ],
    faqs: [
      {
        question: 'Is there any upper age limit for CLAT?',
        answer: 'No. The Supreme Court of India removed the upper age bar for both CLAT UG and CLAT PG.',
      },
    ],
    isPublished: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-03-16T00:00:00.000Z',
  },
  {
    id: 'opp-cat-iim',
    slug: 'cat-eligibility',
    name: 'Common Admission Test (CAT)',
    shortName: 'IIM CAT',
    category: 'Management',
    conductingOrg: 'Indian Institutes of Management (IIMs)',
    summary: 'National level management entrance exam for admission to MBA / PGDM programs at 21 IIMs and top B-schools.',
    description: 'CAT is the flagship management entrance exam in India, used by IIM Ahmedabad, IIM Bangalore, IIM Calcutta, FMS Delhi, SPJIMR Mumbai, and other top management institutions.',
    minEducationLevel: 'graduate',
    allowedEducationLevels: ['graduate', 'postgraduate'],
    ageRule: {
      cutoffReferenceText: 'No age limit for CAT examination.',
      allowFinalYearAppearing: true,
    },
    categoryAgeRelaxation: {
      OBC: 0,
      SC: 0,
      ST: 0,
      PwBD: 0,
      EWS: 0,
    },
    genderAllowed: 'all',
    minPercentageGraduation: 50, // 50% for Gen/NC-OBC/EWS, 45% for SC/ST/PwD
    allowedDegrees: ['Bachelor’s Degree with at least 50% marks or equivalent CGPA'],
    citizenshipRequired: 'indian',
    domicileRequired: 'none',
    attemptsRule: {
      hasFixedAttemptLimit: false,
      cyclesPerYear: 1,
      officialRuleText: 'No attempt limit. Candidates can appear for CAT any number of times.',
    },
    currentCycle: {
      cycleName: 'CAT 2026',
      notificationDate: 'July 2026',
      applicationPeriod: 'August - September 2026',
      examDate: 'Last Sunday of November 2026',
      officialSourceUrl: 'https://iimcat.ac.in',
      officialSourceOrg: 'Indian Institutes of Management',
      lastVerifiedDate: '2026-03-11',
      isVerified: true,
    },
    selectionStages: [
      'Computer Based Test (VARC, DILR, QA - 66 questions, 198 marks)',
      'Analytical Writing Test (AWT) / Written Ability Test (WAT)',
      'Personal Interview (PI) conducted independently by each IIM',
    ],
    requiredDocuments: [
      'Graduation Degree / Marksheets',
      'NC-OBC / SC / ST / EWS Certificate as per Government of India format',
    ],
    faqs: [
      {
        question: 'Can candidates in their final year of college take CAT?',
        answer: 'Yes. Candidates appearing for the final year of bachelor’s degree can apply, subject to providing evidence of completion.',
      },
    ],
    isPublished: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-03-11T00:00:00.000Z',
  },
  {
    id: 'opp-cuet-ug',
    slug: 'cuet-eligibility',
    name: 'Common University Entrance Test (CUET UG)',
    shortName: 'CUET UG',
    category: 'College & University Admissions',
    conductingOrg: 'National Testing Agency (NTA)',
    summary: 'Single window entrance test for undergraduate admissions to Delhi University (DU), BHU, JNU, and 250+ central & state universities.',
    description: 'CUET UG provides a single-window opportunity to students seeking admission in any of the Central Universities (CUs) and participating State, Deemed, and Private Universities across India for BA, B.Sc, B.Com, and professional courses.',
    minEducationLevel: 'class12',
    allowedEducationLevels: ['class12', 'undergraduate', 'graduate'],
    ageRule: {
      cutoffReferenceText: 'For appearing in the CUET (UG), there is no age limit. However, candidates must satisfy the age criteria of the university/college they seek admission in.',
      allowFinalYearAppearing: true,
    },
    categoryAgeRelaxation: {
      OBC: 0,
      SC: 0,
      ST: 0,
      PwBD: 0,
      EWS: 0,
    },
    genderAllowed: 'all',
    citizenshipRequired: 'indian',
    domicileRequired: 'none',
    attemptsRule: {
      hasFixedAttemptLimit: false,
      cyclesPerYear: 1,
      officialRuleText: 'No limit on the number of attempts.',
    },
    currentCycle: {
      cycleName: 'CUET (UG) 2026',
      notificationDate: 'February 2026',
      applicationPeriod: 'February - March 2026',
      examDate: 'May - June 2026',
      officialSourceUrl: 'https://exams.nta.ac.in/CUET-UG/',
      officialSourceOrg: 'National Testing Agency',
      lastVerifiedDate: '2026-03-17',
      isVerified: true,
    },
    selectionStages: [
      'Hybrid / Computer Based Test (Languages, Domain Subjects, General Test)',
      'University Specific Counselling (e.g. CSAS for Delhi University)',
    ],
    requiredDocuments: [
      'Class 10 & 12 Certificates',
      'Category Certificate if applicable',
    ],
    faqs: [
      {
        question: 'Does CUET guarantee university admission?',
        answer: 'No. CUET is an eligibility and entrance testing score. Actual admission depends on college cutoffs, seat matrices, and university-specific counselling portals.',
      },
    ],
    isPublished: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-03-17T00:00:00.000Z',
  },
  {
    id: 'opp-afcat',
    slug: 'afcat-eligibility',
    name: 'Air Force Common Admission Test (AFCAT)',
    shortName: 'IAF AFCAT',
    category: 'Defence',
    conductingOrg: 'Indian Air Force (IAF)',
    summary: 'Officer commissioning in Flying, Ground Duty (Technical), and Ground Duty (Non-Technical) branches of the Indian Air Force.',
    description: 'AFCAT is held twice a year by the Indian Air Force for commissioning Class I Gazetted Officers in Flying, Aeronautical Engineering, Administration, Logistics, and Accounts branches.',
    minEducationLevel: 'graduate',
    allowedEducationLevels: ['graduate', 'postgraduate'],
    ageRule: {
      minAge: 20,
      maxAge: 24, // Flying: 20-24, Ground Duty: 20-26
      cutoffReferenceText: 'Flying Branch: 20 to 24 years; Ground Duty (Tech & Non-Tech): 20 to 26 years',
      allowFinalYearAppearing: true,
    },
    categoryAgeRelaxation: {
      OBC: 0,
      SC: 0,
      ST: 0,
      PwBD: 0,
      EWS: 0,
    },
    genderAllowed: 'all',
    maritalStatus: 'unmarried',
    subjectRequirements: {
      mathsRequired: false,
      physicsRequired: false,
      notes: 'Flying Branch requires minimum 50% marks in both Maths and Physics at 10+2 level PLUS minimum 60% in Graduation (or B.E/B.Tech). Non-Tech branches require any graduate with 60%.',
    },
    minPercentageGraduation: 60,
    citizenshipRequired: 'indian',
    domicileRequired: 'none',
    attemptsRule: {
      hasFixedAttemptLimit: false,
      cyclesPerYear: 2,
      officialRuleText: 'No fixed attempt limit. Eligible as long as within the age limits for the specific branch.',
    },
    currentCycle: {
      cycleName: 'AFCAT 01/2026',
      notificationDate: 'December 2025',
      applicationPeriod: 'December 2025',
      examDate: 'February 2026',
      officialSourceUrl: 'https://afcat.cdac.in',
      officialSourceOrg: 'Indian Air Force',
      lastVerifiedDate: '2026-03-02',
      isVerified: true,
    },
    selectionStages: [
      'Online CBT Examination (General Awareness, Verbal Ability, Numerical Ability, Reasoning - 300 marks)',
      'Air Force Selection Board (AFSB Interview: 5 Days)',
      'CPSS (Computerised Pilot Selection System for Flying Branch)',
      'Medical Examination at IAM Bengaluru / AFCME New Delhi',
    ],
    requiredDocuments: [
      'Graduation Degree / Final Year Bonafide',
      'Class 10 Certificate for DOB proof',
      'Class 12 Marksheet for Physics & Maths marks verification',
    ],
    faqs: [
      {
        question: 'Can women apply for the Flying Branch in AFCAT?',
        answer: 'Yes. Women can apply for both Flying and Ground Duty branches on equal footing as Short Service Commissioned officers.',
      },
    ],
    isPublished: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-03-02T00:00:00.000Z',
  },
  {
    id: 'opp-ssc-chsl',
    slug: 'ssc-chsl-eligibility',
    name: 'Combined Higher Secondary Level (SSC CHSL 10+2)',
    shortName: 'SSC CHSL',
    category: 'SSC',
    conductingOrg: 'Staff Selection Commission (SSC)',
    summary: 'Recruitment for Lower Division Clerk (LDC), Junior Secretariat Assistant (JSA), and Data Entry Operator (DEO).',
    description: 'SSC CHSL offers 10+2 pass candidates a direct entry into Central Government Ministries and subordinate offices as ministerial staff.',
    minEducationLevel: 'class12',
    allowedEducationLevels: ['class12', 'diploma', 'undergraduate', 'graduate', 'postgraduate'],
    ageRule: {
      minAge: 18,
      maxAge: 27,
      cutoffReferenceText: 'As on 1st August of the notification year',
      allowFinalYearAppearing: true,
    },
    categoryAgeRelaxation: {
      OBC: 3,
      SC: 5,
      ST: 5,
      PwBD: 10,
      EWS: 0,
    },
    genderAllowed: 'all',
    maritalStatus: 'any',
    citizenshipRequired: 'indian',
    domicileRequired: 'none',
    attemptsRule: {
      hasFixedAttemptLimit: false,
      cyclesPerYear: 1,
      officialRuleText: 'No attempt limit. Candidates can apply every year within the permitted age limit.',
    },
    currentCycle: {
      cycleName: 'Combined Higher Secondary (10+2) Level Exam, 2026',
      notificationDate: 'April 2026',
      applicationPeriod: 'April - May 2026',
      examDate: 'June - July 2026',
      officialSourceUrl: 'https://ssc.gov.in',
      officialSourceOrg: 'Staff Selection Commission',
      lastVerifiedDate: '2026-03-04',
      isVerified: true,
    },
    selectionStages: [
      'Tier-I Computer Based Examination',
      'Tier-II (Session I: Maths, Reasoning, English, General Awareness + Computer Test; Session II: Skill Test / Typing Test)',
    ],
    requiredDocuments: [
      '10th & 12th Marksheets / Certificates',
      'Caste Certificate if applicable',
    ],
    faqs: [
      {
        question: 'Is Science stream required for SSC CHSL?',
        answer: 'For general LDC/JSA posts, any stream in Class 12 is eligible. For Data Entry Operator (DEO Grade A) in CAG/Ministry of Consumer Affairs, 12th standard in Science stream with Mathematics is required.',
      },
    ],
    isPublished: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-03-04T00:00:00.000Z',
  },
  {
    id: 'opp-ssc-mts',
    slug: 'ssc-mts-eligibility',
    name: 'Multi-Tasking (Non-Technical) Staff & Havaldar (SSC MTS)',
    shortName: 'SSC MTS',
    category: 'SSC',
    conductingOrg: 'Staff Selection Commission (SSC)',
    summary: 'Central Government Group C non-gazetted, non-ministerial recruitment for Class 10 pass candidates.',
    description: 'SSC MTS & Havaldar recruits matriculate candidates into various Central Government departments, Central Board of Indirect Taxes and Customs (CBIC), and Central Bureau of Narcotics (CBN).',
    minEducationLevel: 'class10',
    allowedEducationLevels: ['class10', 'class12', 'diploma', 'undergraduate', 'graduate', 'postgraduate'],
    ageRule: {
      minAge: 18,
      maxAge: 25, // 18-25 for MTS & 18-27 for Havaldar / certain MTS posts
      cutoffReferenceText: '18-25 years for MTS and 18-27 years for Havaldar in CBIC/CBN as on cutoff date',
    },
    categoryAgeRelaxation: {
      OBC: 3,
      SC: 5,
      ST: 5,
      PwBD: 10,
      EWS: 0,
    },
    genderAllowed: 'all',
    maritalStatus: 'any',
    citizenshipRequired: 'indian',
    domicileRequired: 'none',
    attemptsRule: {
      hasFixedAttemptLimit: false,
      cyclesPerYear: 1,
      officialRuleText: 'No attempt limit. Anyone who meets the age requirement can apply.',
    },
    currentCycle: {
      cycleName: 'Multi-Tasking Staff & Havaldar Examination, 2026',
      notificationDate: 'May 2026',
      applicationPeriod: 'May - June 2026',
      examDate: 'July - August 2026',
      officialSourceUrl: 'https://ssc.gov.in',
      officialSourceOrg: 'Staff Selection Commission',
      lastVerifiedDate: '2026-03-09',
      isVerified: true,
    },
    selectionStages: [
      'Computer Based Examination (Session-I: Numerical & Reasoning [No negative marking]; Session-II: General Awareness & English)',
      'Physical Efficiency Test (PET) / Physical Standard Test (PST) - for Havaldar posts only',
    ],
    requiredDocuments: [
      'Matriculation (10th) Certificate',
      'Category Certificate',
    ],
    faqs: [
      {
        question: 'What is the minimum qualification for SSC MTS?',
        answer: 'Candidates must have passed Matriculation (Class 10th) Examination from a recognized Board.',
      },
    ],
    isPublished: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-03-09T00:00:00.000Z',
  }
];

export class OpportunitiesDatabase {
  private opportunities: Opportunity[] = [];

  constructor() {
    this.init();
  }

  private init() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.opportunities = JSON.parse(raw);
      } catch (err) {
        console.error('Error reading opportunities.json, resetting to defaults:', err);
        this.resetDefaults();
      }
    } else {
      this.resetDefaults();
    }
  }

  public resetDefaults() {
    this.opportunities = [...INITIAL_OPPORTUNITIES];
    this.save();
  }

  private save() {
    try {
      const tempPath = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.opportunities, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  public getAll(includeUnpublished = false): Opportunity[] {
    if (includeUnpublished) {
      return [...this.opportunities];
    }
    return this.opportunities.filter(o => o.isPublished);
  }

  public getBySlug(slug: string): Opportunity | undefined {
    return this.opportunities.find(o => o.slug === slug);
  }

  public getById(id: string): Opportunity | undefined {
    return this.opportunities.find(o => o.id === id);
  }

  public add(oppData: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>): Opportunity {
    const id = `opp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const newOpp: Opportunity = {
      ...oppData,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.opportunities.unshift(newOpp);
    this.save();
    return newOpp;
  }

  public update(id: string, updates: Partial<Opportunity>): Opportunity | null {
    const index = this.opportunities.findIndex(o => o.id === id);
    if (index === -1) return null;

    const updated: Opportunity = {
      ...this.opportunities[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.opportunities[index] = updated;
    this.save();
    return updated;
  }

  public delete(id: string): boolean {
    const initialLen = this.opportunities.length;
    this.opportunities = this.opportunities.filter(o => o.id !== id);
    if (this.opportunities.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }
}

export const db = new OpportunitiesDatabase();

/**
 * College Courses Eligibility logic
 */
export function checkCollegeEligibility(input: CollegeCourseEligibilityInput): CollegeCourseOption[] {
  const options: CollegeCourseOption[] = [
    {
      id: 'course-btech-cse',
      courseTitle: 'B.Tech / B.E in Computer Science & Engineering',
      degreeType: 'Undergraduate (4 Years)',
      stream: 'Engineering & Technology',
      eligibleToApply: input.subjects.maths && input.subjects.physics && input.class12Percentage >= (['SC', 'ST'].includes(input.category) ? 65 : 75),
      eligibilityVerdict: !input.subjects.maths || !input.subjects.physics
        ? 'Subject Condition Pending'
        : input.class12Percentage >= (['SC', 'ST'].includes(input.category) ? 65 : 75)
          ? 'Eligible to Apply'
          : 'Marks Below Eligibility Threshold',
      minMarksRequired: ['SC', 'ST'].includes(input.category) ? 65 : 75,
      subjectCondition: 'Physics & Mathematics mandatory in 10+2',
      entranceExamAccepted: 'JEE Main, State Engineering CETs, BITSAT',
      typicalInstitutions: ['IITs, NITs, IIITs, State Technical Universities, Private Tech Institutes'],
      notes: 'Eligible to apply for admission counselling. Final seat allotment strictly depends on rank in JEE Main / State CET.',
    },
    {
      id: 'course-mbbs',
      courseTitle: 'MBBS (Bachelor of Medicine & Bachelor of Surgery)',
      degreeType: 'Undergraduate (5.5 Years)',
      stream: 'Medical & Healthcare',
      eligibleToApply: input.subjects.physics && input.subjects.chemistry && input.subjects.biology && input.subjects.english && input.class12Percentage >= (['SC', 'ST', 'OBC'].includes(input.category) ? 40 : 50),
      eligibilityVerdict: !input.subjects.biology || !input.subjects.physics || !input.subjects.chemistry
        ? 'Subject Condition Pending'
        : input.class12Percentage >= (['SC', 'ST', 'OBC'].includes(input.category) ? 40 : 50)
          ? 'Eligible to Apply'
          : 'Marks Below Eligibility Threshold',
      minMarksRequired: ['SC', 'ST', 'OBC'].includes(input.category) ? 40 : 50,
      subjectCondition: 'PCB (Physics, Chemistry, Biology) + English mandatory in 10+2',
      entranceExamAccepted: 'NEET UG (Mandatory single national exam)',
      typicalInstitutions: ['AIIMS, Central Universities, State Govt Medical Colleges, Private Medical Colleges'],
      notes: 'Eligible to register for MCC and State NEET counselling upon qualifying NEET UG cutoff marks.',
    },
    {
      id: 'course-ba-llb',
      courseTitle: 'BA LL.B / BBA LL.B (5-Year Integrated Law)',
      degreeType: 'Undergraduate (5 Years)',
      stream: 'Legal Studies',
      eligibleToApply: input.class12Percentage >= (['SC', 'ST'].includes(input.category) ? 40 : 45),
      eligibilityVerdict: input.class12Percentage >= (['SC', 'ST'].includes(input.category) ? 40 : 45)
        ? 'Eligible to Apply'
        : 'Marks Below Eligibility Threshold',
      minMarksRequired: ['SC', 'ST'].includes(input.category) ? 40 : 45,
      subjectCondition: 'Any stream in Class 12 (Arts, Commerce, or Science)',
      entranceExamAccepted: 'CLAT, AILET, SLAT, CUET UG Law',
      typicalInstitutions: ['National Law Universities (NLUs), Faculty of Law DU, Symbiosis Law School'],
      notes: 'Eligible to sit for entrance exams and apply for law admissions across all participating NLUs.',
    },
    {
      id: 'course-bsc-nautical',
      courseTitle: 'B.Sc Nautical Science / DNS (Merchant Navy)',
      degreeType: 'Undergraduate (3 Years / 1 Year DNS)',
      stream: 'Maritime & Nautical Studies',
      eligibleToApply: input.subjects.maths && input.subjects.physics && input.subjects.chemistry && input.subjects.english && input.class12Percentage >= 60,
      eligibilityVerdict: !input.subjects.maths || !input.subjects.physics
        ? 'Subject Condition Pending'
        : input.class12Percentage >= 60
          ? 'Eligible to Apply'
          : 'Marks Below Eligibility Threshold',
      minMarksRequired: 60,
      subjectCondition: 'Minimum 60% aggregate in PCM (Physics, Chemistry, Maths) + 50% in English',
      entranceExamAccepted: 'IMU-CET + Shipping Company Sponsorship',
      typicalInstitutions: ['Indian Maritime University campuses, Tolani Maritime, Anglo-Eastern Maritime Academy'],
      notes: 'Eligible to register for IMU-CET counselling and cadet sponsorship tests.',
    },
    {
      id: 'course-bcom-hons',
      courseTitle: 'B.Com (Honours) / B.Com',
      degreeType: 'Undergraduate (3 / 4 Years)',
      stream: 'Commerce & Finance',
      eligibleToApply: input.class12Percentage >= 50,
      eligibilityVerdict: input.class12Percentage >= 50 ? 'Eligible to Apply' : 'Marks Below Eligibility Threshold',
      minMarksRequired: 50,
      subjectCondition: 'Mathematics / Accountancy studied in 10+2 preferred for top tier central universities',
      entranceExamAccepted: 'CUET UG, State University Merit',
      typicalInstitutions: ['Delhi University (SRCC, LSR, Hindu), BHU, Christ University, Loyola Chennai'],
      notes: 'Eligible for CUET UG allocation for commerce honours courses.',
    },
    {
      id: 'course-ba-economics',
      courseTitle: 'B.A. (Honours) Economics',
      degreeType: 'Undergraduate (3 / 4 Years)',
      stream: 'Humanities & Social Sciences',
      eligibleToApply: input.subjects.maths && input.class12Percentage >= 50,
      eligibilityVerdict: !input.subjects.maths
        ? 'Subject Condition Pending'
        : input.class12Percentage >= 50
          ? 'Eligible to Apply'
          : 'Marks Below Eligibility Threshold',
      minMarksRequired: 50,
      subjectCondition: 'Mathematics is compulsory in 10+2 for B.A (Hons) Economics at DU and central universities',
      entranceExamAccepted: 'CUET UG',
      typicalInstitutions: ['St. Stephen’s College, Delhi School of Economics, Presidency University Kolkata'],
      notes: 'Eligible to choose Economics in CUET UG subject mapping.',
    },
  ];

  return options;
}
