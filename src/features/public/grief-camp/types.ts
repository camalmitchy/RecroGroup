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
    before?: ScaleValue;
    current?: ScaleValue;
}

export interface EmotionResponse {
    before?: EmotionScaleValue;
    current?: EmotionScaleValue;
}

export interface YesNoResponse {
    before?: boolean;
    current?: boolean;
}

export interface CamperSelfReportData {
    behaviors: Record<string, BehaviorResponse>;
    emotions?: Record<string, EmotionResponse>;
    generalInfo?: Record<string, YesNoResponse | boolean>;
    currentStatus?: Record<string, boolean>;
    temperamentBefore?: string[];
    temperamentCurrent?: string[];
    circumstancesOfDeath?: string;
    relationshipAndImpact?: string;
    whoToldChild?: string;
    dietaryNeeds?: string;
}

export interface OtherLossesData {
    divorceDate?: string;
    movingDate?: string;
    friendsMovingDate?: string;
    otherDeathsDate?: string;
    otherDeathsWho?: string;
    petDeathsDate?: string;
    parentsJobChangeDate?: string;
    parentsJobLossDate?: string;
    fireTheftDate?: string;
    otherChanges?: string;
    howChildHandled?: string;
}

export type ParentSelfReportData = Record<string, ParentScaleValue>;

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

export interface CampPriceTierView {
    attendeeType: "CAMPER" | "PARENT";
    label: string;
    amountKes: number;
    effectiveFrom: string;
    effectiveTo: string | null;
}

export interface CampPricing {
    campSessionId: string;
    campName: string;
    location: string | null;
    dateRange: string;
    tiers: CampPriceTierView[];
    current: {
        camperTierLabel: string;
        camperAmountKes: number;
        parentTierLabel: string | null;
        parentAmountKes: number;
    };
}

export interface GriefCampApplicationData {
    parentQuestionnaire: ParentQuestionnaireData;
    camperSelfReport: CamperSelfReportData;
    otherLosses: OtherLossesData;
    parentSelfReport: ParentSelfReportData;
    registration: RegistrationFormData;
    healthHistory: HealthHistoryData;
    consent: ConsentData;
}
