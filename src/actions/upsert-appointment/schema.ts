import z from "zod";

export const createAppointmentSchema = z.object({
  patientId: z.uuid({ message: "Paciente é obrigatório" }),
  doctorId: z.uuid({ message: "Médico é obrigatório" }),
  clinicId: z.uuid({ message: "Clínica é obrigatória" }),
  appointmentPriceInCents: z.number().min(1, { message: "Valor da consulta é obrigatório" }),
  appointmentDate: z.string().min(1, { message: "Data é obrigatória" }),
  appointmentTime: z.string().min(1, { message: "Horário é obrigatório" }),
});

export type CreateAppointmentSchemaType = z.infer<typeof createAppointmentSchema>;
