"use server";
import { db } from "@/db";
import { appointmentsTable } from "@/db/schema";
import { requiereAuthAndClinic } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import z from "zod";

export const DeleteAppointments = actionClient
  .inputSchema(
    z.object({
      id: z.uuid(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const session = await requiereAuthAndClinic();
    if (session) {
      const appointment = await db.query.appointmentsTable.findFirst({
        where: eq(appointmentsTable.id, parsedInput.id),
      });

      if (!appointment || appointment.clinicId !== session.user?.clinic?.id) {
        throw new Error("agendamento não encontrado");
      }
    }
    await db.delete(appointmentsTable).where(eq(appointmentsTable.id, parsedInput.id));
    revalidatePath("/appointments");
  });
