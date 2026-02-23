"use client";
import { DeletePatient } from "@/actions/delete-patient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { patientsTable } from "@/db/schema";
import { getGenderLabel } from "@/helpers/gender";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { CalendarIcon, MailIcon, PencilIcon, PhoneIcon, TrashIcon, UserIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";
import { UpsertPatientForm } from "./upsert-patient-form";

dayjs.locale("pt-br");

type PatientCardProps = {
  patient: typeof patientsTable.$inferSelect;
};

export const PatientCard = ({ patient }: PatientCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const initials = patient.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const deletePatientAction = useAction(DeletePatient, {
    onSuccess: () => {
      toast.success("Paciente excluído com sucesso");
    },
    onError: () => {
      toast.error("Erro ao excluir paciente");
    },
  });

  const handleDelete = () => {
    deletePatientAction.execute({ id: patient.id });
  };

  const birthDateFormatted = dayjs(patient.birthDate).format("DD/MM/YYYY");

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="pt-6">
        <div className="flex items-start gap-4">
          <Avatar className="border-primary/10 h-14 w-14 shrink-0 border-2">
            <AvatarFallback className="bg-primary/5 text-primary text-lg font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 space-y-1">
            <h3 className="truncate text-base font-semibold">{patient.name}</h3>
            <p className="text-muted-foreground truncate text-sm">{patient.email}</p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              <Badge variant="secondary" className="font-normal">
                <UserIcon className="mr-1 size-3.5" />
                {getGenderLabel(patient.gender)}
              </Badge>
              <Badge variant="secondary" className="font-normal">
                <CalendarIcon className="mr-1 size-3.5" />
                {birthDateFormatted}
              </Badge>
            </div>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col gap-2 text-sm">
          <div className="text-muted-foreground flex items-center gap-2">
            <MailIcon className="text-muted-foreground/70 size-4 shrink-0" />
            <span className="truncate">{patient.email}</span>
          </div>
          <div className="text-muted-foreground flex items-center gap-2">
            <PhoneIcon className="text-muted-foreground/70 size-4 shrink-0" />
            <span>{patient.phoneNumber}</span>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardFooter className="flex flex-col gap-2 p-4">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <PencilIcon className="mr-2 size-4" />
              Editar
            </Button>
          </DialogTrigger>
          <UpsertPatientForm isOpen={isOpen} patient={patient} onSuccess={() => setIsOpen(false)} />
        </Dialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              <TrashIcon className="mr-2 size-4" />
              Excluir
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Deseja realmente excluir {patient.name}?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação é irreversível. O paciente e todas as consultas agendadas serão excluídos.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={handleDelete}
                disabled={deletePatientAction.isPending}
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};
