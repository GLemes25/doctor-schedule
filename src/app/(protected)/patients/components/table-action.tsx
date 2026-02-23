import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { patientsTable } from "@/db/schema";
import { EditIcon, MoreVerticalIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { UpsertPatientForm } from "./upsert-patient-form";

type patientsType = typeof patientsTable.$inferSelect;

type TableActionPropsType = {
  patient: patientsType;
};
export const TableAction = ({ patient }: TableActionPropsType) => {
  const [upsertDialogIsOpen, setupsertDialogIsOpen] = useState(false);

  return (
    <Dialog open={upsertDialogIsOpen} onOpenChange={setupsertDialogIsOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVerticalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{patient.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setupsertDialogIsOpen(true)}>
            <EditIcon />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem>
            <TrashIcon />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UpsertPatientForm
        isOpen={upsertDialogIsOpen}
        patient={patient}
        onSuccess={() => setupsertDialogIsOpen(false)}
      />
    </Dialog>
  );
};
