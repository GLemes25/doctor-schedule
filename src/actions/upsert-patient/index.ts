"use server";
import { db } from "@/db";
import { patientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { upsertPatientSchema } from "./schema";

export const UpsertPatient = actionClient
  .inputSchema(upsertPatientSchema)
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

    const values = {
      clinicId,
      name: parsedInput.name,
      email: parsedInput.email,
      phoneNumber: parsedInput.phoneNumber,
      gender: parsedInput.gender,
      birthDate: parsedInput.birthDate,
    };

    if (parsedInput.id) {
      await db
        .insert(patientsTable)
        .values({ ...values, id: parsedInput.id })
        .onConflictDoUpdate({
          target: [patientsTable.id],
          set: values,
        });
    } else {
      await db.insert(patientsTable).values(values);
    }

    revalidatePath("/patients");
  });
