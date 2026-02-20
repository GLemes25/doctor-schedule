import { doctorsTable } from "@/db/schema";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.locale("pt-br");

export const weekDays = [
  { key: 0, value: "sunday", label: "Domingo" },
  { key: 1, value: "monday", label: "Segunda" },
  { key: 2, value: "tuesday", label: "Terça" },
  { key: 3, value: "wednesday", label: "Quarta" },
  { key: 4, value: "thursday", label: "Quinta" },
  { key: 5, value: "friday", label: "Sexta" },
  { key: 6, value: "saturday", label: "Sábado" },
];

export const setWeekDayKey = (value: string) => {
  const key = weekDays.find((day) => day.value === value)?.key;
  if (key) {
    return key;
  } else return 0;
};
export const getWeekDay = (key: number) => {
  const day = weekDays.find((day) => day.key === key);
  const newday = {
    key: day ? day.key : -1,
    value: day ? day.value : "",
    label: day ? day.label : "",
  };
  return newday;
};

export const businessHours = Array.from({ length: 35 }, (_, i) => {
  const minutes = 5 * 60 + i * 30;
  const h = String(Math.floor(minutes / 60)).padStart(2, "0");
  const m = String(minutes % 60).padStart(2, "0");
  return `${h}:${m}`;
});

export const getAvailability = (doctor: typeof doctorsTable.$inferSelect) => {
  const from = dayjs()
    .utc()
    .day(doctor.availabilityFromWeekDay)
    .set("hour", parseInt(doctor.availabilityFromTime.split(":")[0]))
    .set("minute", parseInt(doctor.availabilityFromTime.split(":")[1]))
    .set("second", parseInt(doctor.availabilityFromTime.split(":")[2]))
    .local();
  const to = dayjs()
    .utc()
    .day(doctor.availabilityToWeekDay)
    .set("hour", parseInt(doctor.availabilityToTime.split(":")[0]))
    .set("minute", parseInt(doctor.availabilityToTime.split(":")[1]))
    .set("second", parseInt(doctor.availabilityToTime.split(":")[2]))
    .local();
  return { from, to };
};
