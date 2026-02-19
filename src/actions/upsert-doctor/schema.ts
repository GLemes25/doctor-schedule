import z from "zod";

export const upsertDoctorSchema = z
  .object({
    id: z.uuid().optional(),
    clinicId: z.uuid().min(1, { message: "Clínica é obrigatória" }),
    name: z.string().trim().min(1, { message: "Nome é obrigatório" }),
    specialty: z.string().trim().min(1, { message: "Especialidade é obrigatória" }),
    appointmentPriceInCents: z.number().min(1, { message: "Preço da consulta é obrigatório" }),
    availabilityFromWeekDay: z.number().min(0).max(6),
    availabilityToWeekDay: z.number().min(0).max(6),
    availabilityFromTime: z.string(),
    availabilityToTime: z.string(),
    gender: z.enum(["male", "female"]).default("male"),
  })
  .refine(
    (data) => {
      const from = new Date(`1970-01-01T${data.availabilityFromTime}`);
      const to = new Date(`1970-01-01T${data.availabilityToTime}`);
      return from < to;
    },
    {
      message: "A hora final deve ser anterior a hora inicial",
      path: ["availabilityToTime"],
    },
  );

export type UpsertDoctorSchemaType = z.infer<typeof upsertDoctorSchema>;
