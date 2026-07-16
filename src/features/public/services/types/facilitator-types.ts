// Facilitator Application Form Types

export interface PersonalInformationData {
    name: string;
    dateOfBirth: string;
    emailAndPhone: string;
    workAddress?: string;
    placeOfEmployment: string;
    educationalBackground: string;
    references: string;
    emergencyContacts: string;
}

export interface ApplicationQuestionsData {
    consent: boolean;
    consentDate: string;
    philosophyOfChildren: string;
    experienceWithChildren: string;
    disciplineApproach: string;
    contributionToCamp: string;
    responsibilitiesDescription: string;
    reasonForInterest: string;
    previousExperience: string;
    additionalInformation: string;
    applicationType: "Therapist" | "Facilitator" | "";
    groupsFacilitated?: string;
    therapistCapacity?: string;
}

export interface HealthHistoryData {
    nameAndDate: string;
    familyPhysician: string;
    allergiesOrIllnesses: string;
    recentSurgeryInjuryIllness: boolean;
    surgeryDetails?: string;
    currentMedication: string;
}

export interface FacilitatorApplicationData {
    personalInformation: PersonalInformationData;
    applicationQuestions: ApplicationQuestionsData;
    healthHistory: HealthHistoryData;
}
