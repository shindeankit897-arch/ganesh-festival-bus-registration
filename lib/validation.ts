import { z } from "zod";

const mobileSchema = z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number.");
const aadhaarSchema = z.string().regex(/^\d{12}$/, "Aadhaar must be exactly 12 digits.");

export const familyMemberSchema = z.object({
  name: z.string().min(2, "Please enter family member name."),
  mobile: z.union([mobileSchema, z.literal("")]),
  age: z.number().int().min(1, "Please enter age.").max(120, "Please enter a valid age."),
  gender: z.enum(["male", "female"], { error: "Please select gender." }),
  aadhaar: z.union([aadhaarSchema, z.literal("")]),
  voterId: z.string().optional(),
  relation: z.enum(
    ["wife", "daughter", "son", "mother", "father", "son_in_law", "daughter_in_law"],
    { error: "Please select relation." }
  ),
});

export const createPassengerSchema = (t: any) =>
  z.object({
    name: z.string().min(3, t.errors.name),
    mobile: mobileSchema,
    age: z.number().int().min(1, "Please enter age.").max(120, "Please enter a valid age."),
    gender: z.enum(["male", "female"], { error: "Please select gender." }),
    aadhaar: aadhaarSchema,
    voterId: z.string().optional(),
    address: z.string().min(10, t.errors.address),
    destination: z.string().min(1, t.errors.destination),
    ward: z.string().min(1, t.errors.ward),
    familyMembers: z.array(familyMemberSchema),
  });

export type PassengerSchema = z.infer<ReturnType<typeof createPassengerSchema>>;
