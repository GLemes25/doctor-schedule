"use server";

import { db } from "@/db";
import { clinicsTable, userToClinicsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const createClinic = async (name: string) => {
  const sessions = await auth.api.getSession({
    headers: await headers(),
  });

  if (!sessions?.user) {
    throw new Error("Unauthorized");
  }

  const [clinic] = await db.insert(clinicsTable).values({ name }).returning();

  await db.insert(userToClinicsTable).values({
    userId: sessions.user.id,
    clinicId: clinic.id,
  });
  redirect("/dashboard");
};
