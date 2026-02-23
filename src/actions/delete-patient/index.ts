"use server";
import { db } from "@/db";
import { patientsTable } from "@/db/schema";
import { requiereAuthAndClinic } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import z from "zod";

export const DeletePatient = actionClient
  .inputSchema(z.object({ id: z.string().uuid() }))
  .action(async ({ parsedInput }) => {
    const session = await requiereAuthAndClinic();

    const patient = await db.query.patientsTable.findFirst({
      where: eq(patientsTable.id, parsedInput.id),
    });

    if (!patient || patient.clinicId !== session.user?.clinic?.id) {
      throw new Error("Paciente não encontrado");
    }

    await db.delete(patientsTable).where(eq(patientsTable.id, parsedInput.id));
    revalidatePath("/patients");
  });
