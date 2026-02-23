"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { patientsTable } from "@/db/schema";
import { getGenderLabel } from "@/helpers/gender";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { EditIcon, MoreVerticalIcon, TrashIcon } from "lucide-react";

type patientsType = typeof patientsTable.$inferSelect;

export const patientesTableColumns: ColumnDef<patientsType>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Nome",
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "phoneNumber",
    accessorKey: "phoneNumber",
    header: "Telefone",
    cell(props) {
      const value = props.row.original.phoneNumber as string;
      const match = value.match(/^(\d{2})(\d{5})(\d{4})$/);
      if (!match) return value;
      const [, ddd, n1, n2] = match;
      return `(${ddd}) ${n1}-${n2}`;
    },
  },
  {
    id: "birthDate",
    accessorKey: "birthDate",
    header: "Data de Nascimento",
    cell(props) {
      const patient = props.row.original;
      return dayjs(patient.birthDate).format("DD/MM/YYYY");
    },
  },
  {
    id: "gender",
    accessorKey: "gender",
    header: "Sexo",
    cell(props) {
      const patient = props.row.original;
      return getGenderLabel(patient.gender);
    },
  },
  {
    id: "actions",
    accessorKey: "actions",
    header: "",

    cell(props) {
      const patient = props.row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVerticalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{patient.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <EditIcon />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <TrashIcon />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
