"use server";
import { db } from "@/db";
import { doctorsTable } from "@/db/schema";
import { requiereAuthAndClinic } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import z from "zod";

export const DeleteDoctor = actionClient
  .inputSchema(
    z.object({
      id: z.uuid(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const session = await requiereAuthAndClinic();
    if (session) {
      const doctor = await db.query.doctorsTable.findFirst({
        where: eq(doctorsTable.id, parsedInput.id),
      });

      if (!doctor || doctor.clinicId !== session.user?.clinic?.id) {
        throw new Error("Médico não encontrado");
      }
    }
    await db.delete(doctorsTable).where(eq(doctorsTable.id, parsedInput.id));
    revalidatePath("/doctors");
  });
