import { z } from "zod";

import { isValidKenyanPhone } from "@/lib/payments/utils";

const genderSchema = z.enum(["Male", "Female"]);
const dateString = z.string().trim();

const scaleValue = z.union([z.number().int().min(1).max(6), z.literal("N/A")]);

const beforeCurrentScale = z.object({
  before: scaleValue.optional(),
  current: scaleValue.optional(),
});

const beforeCurrentFlag = z.union([
  z.boolean(),
  z.object({ before: z.boolean().optional(), current: z.boolean().optional() }),
]);

export const parentQuestionnaireSchema = z.object({
  childName: z.string().trim().min(2, "Child's name is required"),
  gender: genderSchema,
  dateOfBirth: dateString.min(1, "Date of birth is required"),
  religiousAffiliation: z.string().trim().optional(),
  dateOfDeath: dateString.min(1, "Date of death is required"),
  parentName: z.string().trim().min(2, "Your name is required"),
  parentEmail: z.email("Enter a valid email address"),
  relationshipToChild: z.string().trim().min(1, "Relationship to child is required"),
});

export const camperSelfReportSchema = z.object({
  behaviors: z.record(z.string(), beforeCurrentScale).default({}),
  emotions: z.record(z.string(), beforeCurrentScale).optional(),
  generalInfo: z.record(z.string(), beforeCurrentFlag).optional(),
  currentStatus: z.record(z.string(), z.boolean()).optional(),
  temperamentBefore: z.array(z.string()).optional(),
  temperamentCurrent: z.array(z.string()).optional(),
  circumstancesOfDeath: z.string().trim().optional(),
  relationshipAndImpact: z.string().trim().optional(),
  whoToldChild: z.string().trim().optional(),
  dietaryNeeds: z.string().trim().optional(),
});

export const otherLossesSchema = z.object({
  divorceDate: dateString.optional(),
  movingDate: dateString.optional(),
  friendsMovingDate: dateString.optional(),
  otherDeathsDate: dateString.optional(),
  otherDeathsWho: z.string().trim().optional(),
  petDeathsDate: dateString.optional(),
  parentsJobChangeDate: dateString.optional(),
  parentsJobLossDate: dateString.optional(),
  fireTheftDate: dateString.optional(),
  otherChanges: z.string().trim().optional(),
  howChildHandled: z.string().trim().optional(),
});

export const parentSelfReportSchema = z.record(
  z.string(),
  z.number().int().min(1).max(5),
);

export const registrationSchema = z.object({
  childName: z.string().trim().min(2, "Child's name is required"),
  dateOfBirth: dateString.min(1, "Date of birth is required"),
  ageAndGrade: z.string().trim().min(1, "Age and class is required"),
  gender: genderSchema,
  address: z.string().trim().min(1, "Address is required"),
  phoneAndEmail: z.string().trim().min(1, "Phone and email is required"),
  medicalInsuranceProvider: z.string().trim().optional(),
  medicalInsuranceBillingAddress: z.string().trim().optional(),
  religiousAffiliation: z.string().trim().optional(),
  fathersName: z.string().trim().min(1, "Father's name is required"),
  mothersName: z.string().trim().min(1, "Mother's name is required"),
  nameOfDeceased: z.string().trim().min(1, "Name of deceased is required"),
  relationshipToDeceased: z
    .string()
    .trim()
    .min(1, "Relationship to deceased is required"),
  deceasedDateOfBirth: dateString.optional(),
  deceasedDateOfDeath: dateString.min(1, "Date of death is required"),
  causeOfDeath: z.string().trim().min(1, "Cause of death is required"),
});

export const healthHistorySchema = z.object({
  conditions: z.array(z.string()).default([]),
  otherCondition: z.string().trim().optional(),
  lastTetanus: dateString.min(1, "Last tetanus date is required"),
  lastBooster: dateString.optional(),
  lastTBTest: dateString.optional(),
  immunizationsUpToDate: z.boolean(),
  recentOperationInjuryIllness: z.boolean(),
  operationDetails: z.string().trim().optional(),
  allergicReactions: z
    .string()
    .trim()
    .min(1, "Required — write 'None' if not applicable"),
  medications: z.string().trim().optional(),
  approvedMedications: z.array(z.string()).default([]),
  otherApprovedMedication: z.string().trim().optional(),
});

export const consentSchema = z.object({
  releaseConsent: z.literal(true, { error: "Release consent is required" }),
  releaseConsentDate: dateString.min(1, "Consent date is required"),
  medicalConsent: z.literal(true, { error: "Medical consent is required" }),
  medicalConsentDate: dateString.min(1, "Consent date is required"),
  signature: z.string().trim().min(2, "Signature is required"),
  attendingParentSession: z.boolean(),
});

export const griefApplicationSchema = z.object({
  parentQuestionnaire: parentQuestionnaireSchema,
  camperSelfReport: camperSelfReportSchema,
  otherLosses: otherLossesSchema.optional(),
  parentSelfReport: parentSelfReportSchema.optional(),
  registration: registrationSchema,
  healthHistory: healthHistorySchema,
  consent: consentSchema,
  parentPhone: z
    .string()
    .trim()
    .refine(isValidKenyanPhone, "Enter a valid Kenyan phone number")
    .optional(),
  campSessionId: z.string().trim().min(1).optional(),
});

export type GriefApplicationInput = z.input<typeof griefApplicationSchema>;
export type GriefApplicationValues = z.output<typeof griefApplicationSchema>;

/** Derives the age in years from the registration date of birth, or the leading number in `ageAndGrade`. */
export function deriveChildAge(values: GriefApplicationValues): number | null {
  const dob = new Date(values.registration.dateOfBirth);
  if (!Number.isNaN(dob.getTime())) {
    const now = new Date();
    let age = now.getFullYear() - dob.getFullYear();
    const month = now.getMonth() - dob.getMonth();
    if (month < 0 || (month === 0 && now.getDate() < dob.getDate())) age -= 1;
    if (age >= 0 && age < 130) return age;
  }

  const parsed = /(\d{1,2})/.exec(values.registration.ageAndGrade);
  return parsed ? Number(parsed[1]) : null;
}

/** Phone is only collected as a freeform "phone & email" field on the registration step. */
export function deriveParentPhone(values: GriefApplicationValues): string | null {
  if (values.parentPhone) return values.parentPhone;

  const match = /(\+?254\d{9}|0\d{9})/.exec(values.registration.phoneAndEmail);
  return match ? match[1] : null;
}
