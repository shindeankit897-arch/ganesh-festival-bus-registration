import { z } from "zod";

export const createPassengerSchema = (t: any) =>
  z.object({
    name: z
      .string()
      .min(3, t.errors.name),

    mobile: z
      .string()
      .regex(/^[6-9]\d{9}$/, t.errors.mobile),

    dob: z
      .string()
      .min(1, t.errors.dob),

    aadhaar: z
      .string()
      .regex(/^\d{12}$/, t.errors.aadhaar),

    voterId: z.string().optional(),

    address: z
      .string()
      .min(10, t.errors.address),

    destination: z
      .string()
      .min(1, t.errors.destination),

    ward: z
      .string()
      .min(1, t.errors.ward),
  });

export type PassengerSchema = z.infer<
  ReturnType<typeof createPassengerSchema>
>;