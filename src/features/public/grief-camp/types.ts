// Grief Camp Application Form Types

export type ScaleValue = 1 | 2 | 3 | 4 | 5 | 6 | "N/A";
export type EmotionScaleValue = 1 | 2 | 3 | 4 | 5;
export type ParentScaleValue = 1 | 2 | 3 | 4 | 5;

export interface ParentQuestionnaireData {
    childName: string;
    gender: "Male" | "Female";
    dateOfBirth: string;
    religiousAffiliation?: string;
    dateOfDeath: string;
    parentName: string;
    parentEmail: string;
    relationshipToChild: string;
}

export interface BehaviorResponse {
    beforeDeath: ScaleValue;
    currently: ScaleValue;
}

export interface EmotionResponse {
    beforeDeath: EmotionScaleValue;
    currently: EmotionScaleValue;
}

export interface YesNoResponse {
    beforeDeath: boolean;
    currently: boolean;
}

export interface CamperSelfReportData {
    behaviors: {
        [key: string]: BehaviorResponse;
    };
    emotions: {
        [key: string]: EmotionResponse;
    };
    generalInfo: {
        [key: string]: YesNoResponse | boolean;
    };
    currentStatus: {
        mentalIllness: boolean;
        abused: boolean;
        allergiesAsthma: boolean;
        visualHearingSpeech: boolean;
        attendedFuneral: boolean;
        inTherapy: boolean;
        onMedication: boolean;
    };
    temperamentBefore: string[];
    temperamentCurrent: string[];
    circumstancesOfDeath: string;
    relationshipAndImpact: string;
    whoToldChild: string;
    dietaryNeeds: string;
}

export interface OtherLossesData {
    divorce?: { date: string };
    movingCommunity?: { date: string };
    friendsMoving?: { date: string };
    otherDeaths?: { date: string; who: string };
    petDeaths?: { date: string };
    parentsChangingJobs?: { date: string };
    parentsJobLoss?: { date: string };
    fireTheftLoss?: { date: string };
    otherChanges?: string;
    howChildHandled?: string;
}

export interface ParentSelfReportData {
    lostInterest: ParentScaleValue;
    needToDoThings: ParentScaleValue;
    stillCries: ParentScaleValue;
    painfulMemories: ParentScaleValue;
    struggleToFunction: ParentScaleValue;
}

export interface RegistrationFormData {
    childName: string;
    dateOfBirth: string;
    ageAndGrade: string;
    gender: "Male" | "Female";
    address: string;
    phoneAndEmail: string;
    medicalInsuranceProvider?: string;
    medicalInsuranceBillingAddress?: string;
    religiousAffiliation?: string;
    fathersName: string;
    mothersName: string;
    nameOfDeceased: string;
    relationshipToDeceased: string;
    deceasedDateOfBirth?: string;
    deceasedDateOfDeath: string;
    causeOfDeath: string;
}

export interface HealthHistoryData {
    conditions: string[];
    otherCondition?: string;
    lastTetanus: string;
    lastBooster?: string;
    lastTBTest?: string;
    immunizationsUpToDate: boolean;
    recentOperationInjuryIllness: boolean;
    operationDetails?: string;
    allergicReactions: string;
    medications: string;
    approvedMedications: string[];
    otherApprovedMedication?: string;
}

export interface ConsentData {
    releaseConsent: boolean;
    releaseConsentDate: string;
    medicalConsent: boolean;
    medicalConsentDate: string;
    signature: string;
    attendingParentSession: boolean;
}

export interface PaymentData {
    mpesaPaymentCode: string;
}

export interface GriefCampApplicationData {
    parentQuestionnaire: ParentQuestionnaireData;
    camperSelfReport: CamperSelfReportData;
    otherLosses: OtherLossesData;
    parentSelfReport: ParentSelfReportData;
    registration: RegistrationFormData;
    healthHistory: HealthHistoryData;
    consent: ConsentData;
    payment: PaymentData;
}
