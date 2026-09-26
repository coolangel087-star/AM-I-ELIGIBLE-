/**
 * Rules-based eligibility evaluation engine
 */
import {
  UserProfile,
  Opportunity,
  EligibilityResult,
  CriterionEvaluation,
  EducationLevel
} from '../shared/types.js';

const EDUCATION_RANK: Record<EducationLevel, number> = {
  class10: 1,
  class12: 2,
  diploma: 2,
  undergraduate: 2.5,
  graduate: 3,
  postgraduate: 4,
};

export function calculateAge(dobString: string, referenceDate: Date = new Date()): number {
  if (!dobString || typeof dobString !== 'string') {
    return 0;
  }
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) {
    return 0;
  }
  let age = referenceDate.getFullYear() - dob.getFullYear();
  const m = referenceDate.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && referenceDate.getDate() < dob.getDate())) {
    age--;
  }
  return Math.max(0, age);
}

export function evaluateEligibility(
  profile: UserProfile,
  opportunity: Opportunity
): EligibilityResult {
  const criteria: CriterionEvaluation[] = [];
  const referenceDate = new Date(); // Current date (2026)
  const currentAge = calculateAge(profile.dob, referenceDate);

  // 1. Age Evaluation
  const catKey = profile.category as keyof typeof opportunity.categoryAgeRelaxation;
  const categoryRelaxation = (opportunity.categoryAgeRelaxation[catKey] || 0) +
    (profile.isPwBD ? (opportunity.categoryAgeRelaxation.PwBD || 0) : 0);

  const baseMaxAge = opportunity.ageRule.maxAge;
  const effectiveMaxAge = baseMaxAge !== undefined ? baseMaxAge + categoryRelaxation : undefined;
  const minAge = opportunity.ageRule.minAge;

  let agePassed = true;
  let ageMessage = '';

  // Check explicit DOB window if provided for exact cycle
  if (opportunity.ageRule.dobMin && opportunity.ageRule.dobMax) {
    const userDob = new Date(profile.dob);
    // Relax dobMin if category relaxation applies
    const relaxedMinDob = new Date(opportunity.ageRule.dobMin);
    if (categoryRelaxation > 0) {
      relaxedMinDob.setFullYear(relaxedMinDob.getFullYear() - categoryRelaxation);
    }
    const maxDob = new Date(opportunity.ageRule.dobMax);

    if (userDob >= relaxedMinDob && userDob <= maxDob) {
      agePassed = true;
      ageMessage = `Your date of birth (${profile.dob}) falls within the eligible window (${relaxedMinDob.toISOString().slice(0, 10)} to ${opportunity.ageRule.dobMax})${categoryRelaxation > 0 ? ` including ${categoryRelaxation} years ${profile.category} relaxation` : ''}.`;
    } else {
      agePassed = false;
      if (userDob < relaxedMinDob) {
        ageMessage = `Your date of birth (${profile.dob}) is earlier than the cutoff (${relaxedMinDob.toISOString().slice(0, 10)})${categoryRelaxation > 0 ? ` after ${profile.category} relaxation` : ''}. You exceed the maximum age limit.`;
      } else {
        ageMessage = `Your date of birth (${profile.dob}) is later than the cutoff (${opportunity.ageRule.dobMax}). You are currently below the minimum age limit.`;
      }
    }
  } else if (minAge !== undefined && effectiveMaxAge !== undefined) {
    if (currentAge >= minAge && currentAge <= effectiveMaxAge) {
      agePassed = true;
      ageMessage = `Your current age (${currentAge} years) is within the required range of ${minAge} to ${effectiveMaxAge} years${categoryRelaxation > 0 ? ` (${baseMaxAge} + ${categoryRelaxation} years ${profile.category} relaxation)` : ''}.`;
    } else if (currentAge < minAge) {
      agePassed = false;
      ageMessage = `Your current age (${currentAge} years) is below the minimum required age of ${minAge} years.`;
    } else {
      agePassed = false;
      ageMessage = `Your current age (${currentAge} years) exceeds the maximum allowed age of ${effectiveMaxAge} years${categoryRelaxation > 0 ? ` (standard max ${baseMaxAge} + ${categoryRelaxation} yrs for ${profile.category})` : ''}.`;
    }
  } else if (minAge !== undefined) {
    if (currentAge >= minAge) {
      agePassed = true;
      ageMessage = `Your age (${currentAge} years) satisfies the minimum age of ${minAge} years. No upper age limit specified.`;
    } else {
      agePassed = false;
      ageMessage = `Your age (${currentAge} years) is below the minimum required age of ${minAge} years.`;
    }
  } else {
    agePassed = true;
    ageMessage = `No age restriction specified for this route.`;
  }

  criteria.push({
    id: 'age',
    criterion: 'Age & Date of Birth',
    status: agePassed ? 'pass' : 'fail',
    message: ageMessage,
    userValue: `${currentAge} years (DOB: ${profile.dob})`,
    requiredValue: opportunity.ageRule.dobMin
      ? `${opportunity.ageRule.dobMin} to ${opportunity.ageRule.dobMax}`
      : `${minAge ?? 'None'} - ${effectiveMaxAge ?? 'No limit'} years`
  });

  // 2. Education Level Evaluation
  const userRank = EDUCATION_RANK[profile.currentEducation] || 1;
  const reqRank = EDUCATION_RANK[opportunity.minEducationLevel] || 1;

  let educationPassed = true;
  let eduStatus: 'pass' | 'fail' | 'needs_verification' = 'pass';
  let eduMessage = '';

  if (userRank >= reqRank) {
    eduStatus = 'pass';
    educationPassed = true;
    eduMessage = `Your qualification level (${profile.currentEducation.toUpperCase()}) satisfies the minimum required level (${opportunity.minEducationLevel.toUpperCase()}).`;
  } else {
    // Check if user is in final year / appearing and opportunity allows it
    if (
      (opportunity.minEducationLevel === 'graduate' && profile.graduationStatus === 'final_year') ||
      (opportunity.minEducationLevel === 'class12' && profile.class12Status === 'appearing')
    ) {
      eduStatus = 'needs_verification';
      educationPassed = true; // Potentially eligible
      eduMessage = `You are appearing/in final year. Candidates awaiting results can apply subject to proof of passing by the specified document verification date.`;
    } else {
      eduStatus = 'fail';
      educationPassed = false;
      eduMessage = `This opportunity requires a minimum qualification of ${opportunity.minEducationLevel.toUpperCase()}. Your profile currently shows ${profile.currentEducation.toUpperCase()}.`;
    }
  }

  criteria.push({
    id: 'education',
    criterion: 'Educational Qualification',
    status: eduStatus,
    message: eduMessage,
    userValue: profile.currentEducation.toUpperCase(),
    requiredValue: `Minimum ${opportunity.minEducationLevel.toUpperCase()}`
  });

  // 3. Subject Requirements
  let subjectsPassed = true;
  let subjectStatus: 'pass' | 'fail' | 'needs_verification' = 'pass';
  const subReq = opportunity.subjectRequirements;

  if (subReq) {
    const missing: string[] = [];
    if (subReq.mathsRequired && !profile.subjects.maths) missing.push('Mathematics');
    if (subReq.physicsRequired && !profile.subjects.physics) missing.push('Physics');
    if (subReq.chemistryRequired && !profile.subjects.chemistry) missing.push('Chemistry');
    if (subReq.biologyRequired && !profile.subjects.biology) missing.push('Biology');
    if (subReq.englishRequired && !profile.subjects.english) missing.push('English');

    if (missing.length > 0) {
      subjectsPassed = false;
      subjectStatus = 'fail';
      criteria.push({
        id: 'subjects',
        criterion: 'Required Subjects',
        status: 'fail',
        message: `Missing mandatory subject(s): ${missing.join(', ')}. ${subReq.notes || ''}`,
        userValue: Object.entries(profile.subjects).filter(([, v]) => v).map(([k]) => k.toUpperCase()).join(', ') || 'None specified',
        requiredValue: [
          subReq.mathsRequired ? 'Maths' : null,
          subReq.physicsRequired ? 'Physics' : null,
          subReq.chemistryRequired ? 'Chemistry' : null,
          subReq.biologyRequired ? 'Biology' : null,
          subReq.englishRequired ? 'English' : null,
        ].filter(Boolean).join(' + ')
      });
    } else {
      criteria.push({
        id: 'subjects',
        criterion: 'Required Subjects',
        status: 'pass',
        message: `You meet the mandatory subject combination requirements. ${subReq.notes || ''}`,
        userValue: 'Requirements met',
        requiredValue: subReq.notes || 'Specified stream subjects'
      });
    }
  }

  // 4. Minimum Marks Evaluation
  let marksPassed = true;
  if (opportunity.minPercentageClass12 && profile.class12Percentage !== undefined) {
    // Check if category relaxation on marks applies (e.g. SC/ST usually 5% relaxation)
    let minMarks = opportunity.minPercentageClass12;
    if (['SC', 'ST', 'PwBD'].includes(profile.category)) {
      minMarks = Math.max(40, minMarks - 5);
    }
    if (profile.class12Percentage >= minMarks) {
      criteria.push({
        id: 'marks12',
        criterion: 'Class 12 Marks Percentage',
        status: 'pass',
        message: `Your Class 12 score (${profile.class12Percentage}%) meets the required threshold (${minMarks}% for ${profile.category}).`,
        userValue: `${profile.class12Percentage}%`,
        requiredValue: `${minMarks}%`
      });
    } else {
      marksPassed = false;
      criteria.push({
        id: 'marks12',
        criterion: 'Class 12 Marks Percentage',
        status: 'fail',
        message: `Your Class 12 score (${profile.class12Percentage}%) is below the minimum required ${minMarks}% for ${profile.category}.`,
        userValue: `${profile.class12Percentage}%`,
        requiredValue: `${minMarks}%`
      });
    }
  } else if (opportunity.minPercentageClass12 && profile.class12Percentage === undefined && userRank >= 2) {
    criteria.push({
      id: 'marks12',
      criterion: 'Class 12 Marks Percentage',
      status: 'needs_verification',
      message: `Minimum ${opportunity.minPercentageClass12}% required. Please enter your Class 12 marks to verify.`,
      userValue: 'Not provided',
      requiredValue: `${opportunity.minPercentageClass12}%`
    });
  }

  if (opportunity.minPercentageGraduation && profile.graduationPercentage !== undefined) {
    let minGradMarks = opportunity.minPercentageGraduation;
    if (['SC', 'ST', 'PwBD'].includes(profile.category)) {
      minGradMarks = Math.max(45, minGradMarks - 5);
    }
    if (profile.graduationPercentage >= minGradMarks) {
      criteria.push({
        id: 'marksGrad',
        criterion: 'Graduation Marks / CGPA',
        status: 'pass',
        message: `Your Graduation score (${profile.graduationPercentage}%) meets the minimum requirement (${minGradMarks}%).`,
        userValue: `${profile.graduationPercentage}%`,
        requiredValue: `${minGradMarks}%`
      });
    } else {
      marksPassed = false;
      criteria.push({
        id: 'marksGrad',
        criterion: 'Graduation Marks / CGPA',
        status: 'fail',
        message: `Your Graduation score (${profile.graduationPercentage}%) is below the required ${minGradMarks}% for ${profile.category}.`,
        userValue: `${profile.graduationPercentage}%`,
        requiredValue: `${minGradMarks}%`
      });
    }
  }

  // 5. Gender Restrictions
  let genderPassed = true;
  if (opportunity.genderAllowed !== 'all') {
    if (
      (opportunity.genderAllowed === 'male_only' && profile.gender !== 'male') ||
      (opportunity.genderAllowed === 'female_only' && profile.gender !== 'female')
    ) {
      genderPassed = false;
      criteria.push({
        id: 'gender',
        criterion: 'Gender Eligibility',
        status: 'fail',
        message: `This entry is currently restricted to ${opportunity.genderAllowed === 'male_only' ? 'male' : 'female'} candidates under applicable recruitment rules.`,
        userValue: profile.gender,
        requiredValue: opportunity.genderAllowed
      });
    } else {
      criteria.push({
        id: 'gender',
        criterion: 'Gender Eligibility',
        status: 'pass',
        message: `Candidate gender matches entry criteria.`,
        userValue: profile.gender,
        requiredValue: opportunity.genderAllowed
      });
    }
  }

  // 6. Citizenship & Domicile
  if (opportunity.citizenshipRequired === 'indian' && profile.citizenship !== 'indian') {
    criteria.push({
      id: 'citizenship',
      criterion: 'Citizenship',
      status: 'fail',
      message: 'Must be an Indian Citizen (or eligible subject as per official notification).',
      userValue: profile.citizenship,
      requiredValue: 'Indian'
    });
  }

  if (opportunity.domicileRequired && opportunity.domicileRequired !== 'none') {
    if (profile.domicileState.toLowerCase() !== opportunity.domicileRequired.toLowerCase()) {
      criteria.push({
        id: 'domicile',
        criterion: 'State Domicile Requirement',
        status: 'needs_verification',
        message: `State quota/domicile may apply for ${opportunity.domicileRequired}. Other state candidates may only be eligible under All India / Unreserved quotas.`,
        userValue: profile.domicileState,
        requiredValue: opportunity.domicileRequired
      });
    } else {
      criteria.push({
        id: 'domicile',
        criterion: 'State Domicile',
        status: 'pass',
        message: `Satisfies state domicile requirement for ${opportunity.domicileRequired}.`,
        userValue: profile.domicileState,
        requiredValue: opportunity.domicileRequired
      });
    }
  }

  // 7. Attempts vs Opportunities Calculation
  const attemptRule = opportunity.attemptsRule;
  let remainingCyclesEstimate: number | null = null;
  let cycleNote = '';
  let attemptRuleSummary = '';

  if (attemptRule.hasFixedAttemptLimit) {
    let maxAtt: number | null | undefined = attemptRule.maxAttemptsGeneral;
    if (profile.category === 'OBC' && attemptRule.maxAttemptsOBC !== undefined) {
      maxAtt = attemptRule.maxAttemptsOBC;
    } else if (['SC', 'ST'].includes(profile.category) && attemptRule.maxAttemptsSC_ST !== undefined) {
      maxAtt = attemptRule.maxAttemptsSC_ST;
    } else if (profile.isPwBD && attemptRule.maxAttemptsPwBD !== undefined) {
      maxAtt = attemptRule.maxAttemptsPwBD;
    }

    if (maxAtt === null || maxAtt === undefined) {
      attemptRuleSummary = `Attempt limit: Unlimited for ${profile.category} category (subject to the upper age limit).`;
    } else {
      attemptRuleSummary = `Official Attempt Limit: ${maxAtt} attempts for ${profile.category} category (${attemptRule.officialRuleText}).`;
    }

    if (effectiveMaxAge && currentAge <= effectiveMaxAge && agePassed) {
      const remainingYears = Math.max(0, effectiveMaxAge - currentAge);
      remainingCyclesEstimate = Math.min(
        maxAtt !== null && maxAtt !== undefined ? maxAtt : 99,
        remainingYears * attemptRule.cyclesPerYear
      );
      cycleNote = `Subject to both official attempt caps and notification cutoffs for each cycle.`;
    } else {
      remainingCyclesEstimate = 0;
      cycleNote = 'Age limit reached.';
    }
  } else {
    attemptRuleSummary = `Attempt limit: No fixed limit stated in official notification.`;
    if (effectiveMaxAge && currentAge <= effectiveMaxAge && agePassed) {
      const remainingYears = Math.max(0, effectiveMaxAge - currentAge);
      const estimatedCycles = Math.round(remainingYears * attemptRule.cyclesPerYear);
      remainingCyclesEstimate = Math.max(1, estimatedCycles);
      cycleNote = `Estimated eligible opportunities: ~${remainingCyclesEstimate} upcoming cycles based on current age & application frequency (${attemptRule.cyclesPerYear}x/year). Future eligibility depends on the official notification for each cycle.`;
    } else {
      remainingCyclesEstimate = 0;
      cycleNote = 'You have exceeded the maximum applicable age limit for this opportunity.';
    }
  }

  // 8. Overall Status Determination
  const hasFailures = criteria.some(c => c.status === 'fail');
  const hasNeedsVerification = criteria.some(c => c.status === 'needs_verification');

  let overallStatus: 'eligible' | 'potentially_eligible' | 'not_eligible';
  let statusHeadline = '';

  if (hasFailures) {
    overallStatus = 'not_eligible';
    statusHeadline = 'Not currently eligible';
  } else if (hasNeedsVerification) {
    overallStatus = 'potentially_eligible';
    statusHeadline = 'Potentially eligible — verify specific condition';
  } else {
    overallStatus = 'eligible';
    statusHeadline = 'Eligible based on available criteria';
  }

  // 9. Generate "Why this result?" narrative
  let whyExplanation = '';
  if (overallStatus === 'eligible') {
    whyExplanation = `You meet the age, qualification (${opportunity.minEducationLevel.toUpperCase()}), marks, and subject criteria currently stored for ${opportunity.name}. Please check the official notification (${opportunity.currentCycle.cycleName}) for exact post-specific or physical requirements.`;
  } else if (overallStatus === 'potentially_eligible') {
    const pendingCriteria = criteria.filter(c => c.status === 'needs_verification').map(c => c.criterion).join(', ');
    whyExplanation = `You meet basic criteria, but specific conditions (${pendingCriteria}) need manual verification or depend on your final results/marks.`;
  } else {
    const failedList = criteria
      .filter(c => c.status === 'fail')
      .map(c => `${c.criterion}: ${c.message}`)
      .join(' ');
    whyExplanation = `You do not currently meet the requirements: ${failedList}`;
  }

  return {
    opportunity,
    overallStatus,
    statusHeadline,
    criteriaBreakdown: criteria,
    whyExplanation,
    attemptsInfo: {
      hasFixedLimit: attemptRule.hasFixedAttemptLimit,
      attemptRuleSummary,
      estimatedUpcomingCycles: remainingCyclesEstimate,
      cycleEstimateNote: cycleNote,
    }
  };
}
