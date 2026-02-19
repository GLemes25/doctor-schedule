"use server";
import { db } from "@/db";
import { doctorsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { headers } from "next/headers";
import { upsertDoctorSchema } from "./schema";

dayjs.extend(utc);

export const UpsertDoctor = actionClient
  .inputSchema(upsertDoctorSchema)
  .action(async ({ parsedInput }) => {
    const availabilityFromTime = parsedInput.availabilityFromTime;
    const availabilityToTime = parsedInput.availabilityToTime;

    const availabilityFromTimeUTC = dayjs()
      .set("hour", parseInt(availabilityFromTime.split(":")[0]))
      .set("minute", parseInt(availabilityFromTime.split(":")[1]))
      .set("second", parseInt(availabilityFromTime.split(":")[2]))
      .utc();
    const availabilityToTimeUTC = dayjs()
      .set("hour", parseInt(availabilityToTime.split(":")[0]))
      .set("minute", parseInt(availabilityToTime.split(":")[1]))
      .set("second", parseInt(availabilityToTime.split(":")[2]))
      .utc();

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("User not found");
    }

    if (!session?.user.clinic) {
      throw new Error("Clinic not found");
    }

    await db
      .insert(doctorsTable)
      .values({
        ...parsedInput,
        id: parsedInput.id,
        clinicId: session?.user.clinic?.id,
        availabilityFromTime: availabilityFromTimeUTC.format("HH:mm:ss"),
        availabilityToTime: availabilityToTimeUTC.format("HH:mm:ss"),
      })
      .onConflictDoUpdate({
        target: [doctorsTable.id],
        set: {
          ...parsedInput,
          availabilityFromTime: availabilityFromTimeUTC.format("HH:mm:ss"),
          availabilityToTime: availabilityToTimeUTC.format("HH:mm:ss"),
        },
      });
  });
