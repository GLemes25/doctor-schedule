import z from "zod";

export const upsertPatientSchema = z.object({
  id: z.uuid().optional(),
  clinicId: z.uuid().min(1, { message: "Clínica é obrigatória" }),
  name: z.string().trim().min(1, { message: "Nome é obrigatório" }),
  email: z.email({ message: "Email inválido" }),
  phoneNumber: z.string().trim().min(1, { message: "Telefone é obrigatório" }),
  gender: z.enum(["male", "female"]),
  birthDate: z.string().min(1, { message: "Data de nascimento é obrigatória" }),
});

export type UpsertPatientSchemaType = z.infer<typeof upsertPatientSchema>;
