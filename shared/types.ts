/**
 * Shared types for Am I Eligible? - Universal Eligibility & Opportunity Checker for India
 */

export type EducationLevel =
  | 'class10'
  | 'class12'
  | 'diploma'
  | 'undergraduate'
  | 'graduate'
  | 'postgraduate';

export type Category = 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';

export type Gender = 'male' | 'female' | 'other' | 'any';

export interface UserProfile {
  dob: string; // YYYY-MM-DD
  gender: Gender;
  citizenship: 'indian' | 'other';
  state: string;
  domicileState: string;
  category: Category;
  isPwBD: boolean;
  
  currentEducation: EducationLevel;
  
  // Class 10
  class10Percentage?: number;
  
  // Class 12
  class12Status?: 'passed' | 'appearing' | 'not_applicable';
  class12Percentage?: number;
  subjects: {
    maths: boolean;
    physics: boolean;
    chemistry: boolean;
    biology: boolean;
    english: boolean;
    commerce?: boolean;
    arts?: boolean;
  };
  
  // Higher Education
  graduationStatus?: 'passed' | 'final_year' | 'pursuing' | 'not_applicable';
  graduationDegree?: string;
  graduationSpecialization?: string;
  graduationPercentage?: number;
  
  // Experience
  workExperienceMonths?: number;
}

export type OpportunityCategory =
  | 'Defence'
  | 'UPSC'
  | 'SSC'
  | 'Banking & Finance'
  | 'Railways'
  | 'Engineering'
  | 'Medical'
  | 'Law'
  | 'Management'
  | 'College & University Admissions'
  | 'Maritime'
  | 'State Exams';

export interface AgeRule {
  minAge?: number;
  maxAge?: number;
  // Specific DOB window if cycle uses exact dates (e.g. NDA / CDS)
  dobMin?: string; // earliest eligible DOB (e.g. "2007-07-02")
  dobMax?: string; // latest eligible DOB (e.g. "2010-07-01")
  cutoffReferenceText?: string; // e.g. "As of 1st July of exam year"
  allowFinalYearAppearing?: boolean;
}

export interface CategoryAgeRelaxation {
  General?: number; // 0
  OBC?: number; // e.g. 3 years
  SC?: number;  // e.g. 5 years
  ST?: number;  // e.g. 5 years
  PwBD?: number;// e.g. 10 years
  EWS?: number; // usually 0
}

export interface SubjectRequirements {
  mathsRequired?: boolean;
  physicsRequired?: boolean;
  chemistryRequired?: boolean;
  biologyRequired?: boolean;
  englishRequired?: boolean;
  notes?: string;
}

export interface PhysicalStandards {
  heightMaleCm?: number;
  heightFemaleCm?: number;
  chestExpansionCm?: number;
  visionStandards?: string;
  notes?: string;
}

export interface AttemptRules {
  hasFixedAttemptLimit: boolean;
  maxAttemptsGeneral?: number | null;
  maxAttemptsOBC?: number | null;
  maxAttemptsSC_ST?: number | null;
  maxAttemptsPwBD?: number | null;
  cyclesPerYear: number; // e.g. 2 for NDA/CDS/AFCAT, 1 for UPSC/SSC
  officialRuleText: string;
}

export interface ApplicationCycle {
  cycleName: string; // e.g. "NDA & NA Exam (I), 2026"
  notificationDate?: string;
  applicationPeriod?: string;
  examDate?: string;
  officialSourceUrl: string;
  officialSourceOrg: string;
  lastVerifiedDate: string;
  isVerified: boolean;
}

export interface Opportunity {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  category: OpportunityCategory;
  conductingOrg: string;
  summary: string;
  description: string;
  
  // Education Level baseline
  minEducationLevel: EducationLevel;
  allowedEducationLevels: EducationLevel[];
  
  ageRule: AgeRule;
  categoryAgeRelaxation: CategoryAgeRelaxation;
  
  genderAllowed: 'all' | 'male_only' | 'female_only';
  maritalStatus?: 'unmarried' | 'any';
  
  subjectRequirements?: SubjectRequirements;
  
  minPercentageClass10?: number;
  minPercentageClass12?: number;
  minPercentageGraduation?: number;
  
  allowedDegrees?: string[]; // e.g. ["Any Bachelor's Degree", "B.Tech / B.E"]
  experienceRequiredMonths?: number;
  citizenshipRequired?: 'indian' | 'any';
  domicileRequired?: string; // 'none' or specific state like 'Maharashtra'
  
  physicalStandards?: PhysicalStandards;
  attemptsRule: AttemptRules;
  
  currentCycle: ApplicationCycle;
  
  selectionStages: string[];
  requiredDocuments: string[];
  faqs: { question: string; answer: string }[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export type EvaluationStatus = 'pass' | 'fail' | 'needs_verification' | 'info';

export interface CriterionEvaluation {
  id: string;
  criterion: string;
  status: EvaluationStatus;
  message: string;
  userValue?: string;
  requiredValue?: string;
}

export type EligibilityStatus = 'eligible' | 'potentially_eligible' | 'not_eligible';

export interface EligibilityResult {
  opportunity: Opportunity;
  overallStatus: EligibilityStatus;
  statusHeadline: string;
  criteriaBreakdown: CriterionEvaluation[];
  whyExplanation: string;
  attemptsInfo: {
    hasFixedLimit: boolean;
    attemptRuleSummary: string;
    estimatedUpcomingCycles: number | null;
    cycleEstimateNote: string;
  };
}

export interface EligibilityResponse {
  calculatedAge: number;
  profileSummary: {
    category: string;
    education: string;
    dob: string;
  };
  totalChecked: number;
  eligibleCount: number;
  potentiallyEligibleCount: number;
  ineligibleCount: number;
  results: EligibilityResult[];
}

export interface CollegeCourseEligibilityInput {
  courseName: string;
  class12Percentage: number;
  subjects: {
    maths: boolean;
    physics: boolean;
    chemistry: boolean;
    biology: boolean;
    english: boolean;
  };
  entranceExams?: {
    examName: string;
    scoreOrPercentile: number;
  }[];
  category: Category;
  state: string;
}

export interface CollegeCourseOption {
  id: string;
  courseTitle: string;
  degreeType: string;
  stream: string;
  eligibleToApply: boolean;
  eligibilityVerdict: 'Eligible to Apply' | 'Subject Condition Pending' | 'Marks Below Eligibility Threshold';
  minMarksRequired: number;
  subjectCondition: string;
  entranceExamAccepted: string;
  typicalInstitutions: string[];
  notes: string;
}

export interface SubscriptionAlertPreferences {
  applicationWindowOpening: boolean;
  deadlineClosingReminder: boolean;
  admitCardAndExamDates: boolean;
  eligibilityRuleChanges: boolean;
}

export interface DeadlineSubscription {
  id: string;
  email: string;
  opportunitySlug: string;
  opportunityName: string;
  opportunityShortName: string;
  category: OpportunityCategory;
  preferences: SubscriptionAlertPreferences;
  subscribedAt: string;
  active: boolean;
}

export interface SubscriptionCreateRequest {
  email: string;
  opportunitySlugs: string[];
  preferences?: Partial<SubscriptionAlertPreferences>;
}

export interface SubscriptionResponse {
  success: boolean;
  email: string;
  count: number;
  subscriptions: DeadlineSubscription[];
  message: string;
}

