import { normalizeDigits } from "./numberLocale";
import { z } from "zod";

const mobileSchema = z.string().transform(normalizeDigits).refine((value) => /^[6-9]\d{9}$/.test(value), "Please enter a valid 10-digit mobile number.");
const aadhaarSchema = z.string().transform(normalizeDigits).refine((value) => /^\d{12}$/.test(value), "Aadhaar must be exactly 12 digits.");

export const familyMemberSchema = (t: any) => z.object({
  name: z.string().min(2, "Please enter family member name."),
  mobile: z.union([mobileSchema, z.literal("")]),
  age: z.union([z.string(), z.number()]).transform((value) => Number(normalizeDigits(String(value)))).pipe(z.number().int().min(1, t.errors.age).max(120, t.errors.age)),
  gender: z.enum(["male", "female"], { error: t.errors.gender }),
  aadhaar: z.union([aadhaarSchema, z.literal("")]),
  voterId: z.string().optional(),
  relation: z.enum(
    ["wife", "husband", "daughter", "son", "brother", "sister", "mother", "father", "father_in_law", "mother_in_law", "son_in_law", "daughter_in_law"],
    { error: t.errors.relation }
  ),
});

export const createPassengerSchema = (t: any) =>
  z.object({
    name: z.string().min(3, t.errors.name),
    mobile: mobileSchema,
    age: z.union([z.string(), z.number()]).transform((value) => Number(normalizeDigits(String(value)))).pipe(z.number().int().min(1, t.errors.age).max(120, t.errors.age)),
    gender: z.enum(["male", "female"], { error: t.errors.gender }),
    aadhaar: aadhaarSchema,
    voterId: z.string().optional(),
    address: z.string().min(10, t.errors.address),
    destination: z.string().min(1, t.errors.destination),
    ward: z.string().min(1, t.errors.ward),
    familyMembers: z.array(familyMemberSchema(t)),
  });

export type PassengerSchema = z.infer<ReturnType<typeof createPassengerSchema>>;
