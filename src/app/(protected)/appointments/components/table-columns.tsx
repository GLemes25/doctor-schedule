"use client";

import { appointmentsTable } from "@/db/schema";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { TableAction } from "./table-action";

type AppointmentWithRelations = typeof appointmentsTable.$inferSelect & {
  patient: { name: string };
  doctor: { name: string; specialty: string };
};

export const appointmentsTableColumns: ColumnDef<AppointmentWithRelations>[] = [
  {
    id: "patientName",
    accessorKey: "patient",
    header: "Paciente",
    cell(props) {
      const appointment = props.row.original;
      return appointment.patient?.name ?? "-";
    },
  },
  {
    id: "doctorName",
    accessorKey: "doctor",
    header: "Médico",
    cell(props) {
      const appointment = props.row.original;
      return appointment.doctor?.name ?? "-";
    },
  },
  {
    id: "appointmentDateTime",
    accessorKey: "appointmentDateTime",
    header: "Data e Horário",
    cell(props) {
      const appointment = props.row.original;
      return dayjs(appointment.appointmentDateTime).format("DD/MM/YYYY HH:mm");
    },
  },
  {
    id: "specialty",
    accessorKey: "doctor.specialty",
    header: "Especialidade",
    cell(props) {
      const appointment = props.row.original;
      return appointment.doctor?.specialty ?? "-";
    },
  },
  {
    id: "price",
    accessorKey: "appointmentPriceInCents",
    header: "Valor",
    cell(props) {
      const appointment = props.row.original;
      const value = (appointment.appointmentPriceInCents ?? 0) / 100;
      return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    },
  },
  {
    id: "actions",
    accessorKey: "actions",
    header: "",

    cell(props) {
      const appointment = props.row.original;
      return <TableAction appointment={appointment} />;
    },
  },
];
