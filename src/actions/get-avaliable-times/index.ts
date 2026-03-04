import { getAvailabilityDoctor } from "@/app/(protected)/doctors/helpers/availability";
import { db } from "@/db";
import { appointmentsTable } from "@/db/schema";
import { requiereAuthAndClinic } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { eq } from "drizzle-orm";
import z from "zod";

dayjs.extend(utc);
dayjs.extend(timezone);

export const getAvailableTimes = actionClient
  .inputSchema(
    z.object({
      doctorId: z.string(),
      date: z.date(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const session = requiereAuthAndClinic();

    const doctor = await db.query.doctorsTable.findFirst({
      where: eq(appointmentsTable.doctorId, parsedInput.doctorId),
    });

    if (!doctor) {
      throw new Error("Doctor not found");
    }

    const selectedDayOfWeek = dayjs(parsedInput.date).day();

    const doctorsIsAvailable =
      selectedDayOfWeek >= doctor.availabilityFromWeekDay &&
      selectedDayOfWeek <= doctor.availabilityToWeekDay;

    if (!doctorsIsAvailable) {
      return [];
    }

    const appointments = await db.query.appointmentsTable.findMany({
      where: eq(appointmentsTable.doctorId, parsedInput.doctorId),
    });

    const appointmentsOnSelectedDate = appointments.filter((appointment) => {
      return dayjs(appointment.appointmentDateTime).isSame(parsedInput.date, "day");
    });

    const availabilityDoctor = getAvailabilityDoctor(doctor);
  });
