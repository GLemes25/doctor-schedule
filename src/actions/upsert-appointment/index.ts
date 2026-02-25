"use server";
import { db } from "@/db";
import { appointmentsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createAppointmentSchema } from "./schema";

export const UpsertAppointment = actionClient
  .inputSchema(createAppointmentSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Usuário não encontrado");
    }

    if (!session?.user.clinic) {
      throw new Error("Clínica não encontrada");
    }

    const clinicId = session.user.clinic.id;

    const appointmentDateTime = new Date(
      `${parsedInput.appointmentDate}T${parsedInput.appointmentTime}`,
    );

    await db.insert(appointmentsTable).values({
      patientId: parsedInput.patientId,
      doctorId: parsedInput.doctorId,
      clinicId,
      appointmentPriceInCents: parsedInput.appointmentPriceInCents,
      appointmentDateTime,
    });

    revalidatePath("/appointments");
  });
