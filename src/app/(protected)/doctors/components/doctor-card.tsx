"use client";
import { DeleteDoctor } from "@/actions/delete-doctor";
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
import { doctorsTable } from "@/db/schema";
import { formatCurrencyInCents } from "@/helpers/currency";
import { getGenderLabel } from "@/helpers/gender";
import {
  Calendar1Icon,
  ClockIcon,
  DollarSignIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
} from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";
import { getAvailabilityDoctor } from "../helpers/availability";
import { UpsertDoctorForm } from "./upsert-doctor-form";

type DoctorCardProps = {
  doctor: typeof doctorsTable.$inferSelect;
};

export const DoctorCard = ({ doctor }: DoctorCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const initials = doctor.name
    .split(" ")
    .map((name) => name[0])
    .join("");

  const deleteDoctorAction = useAction(DeleteDoctor, {
    onSuccess: () => {
      toast.success("Médico deletado com sucesso");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Erro ao deletar médico");
    },
  });

  const handleDeleteDoctor = () => {
    if (!doctor) return;
    deleteDoctorAction.execute({
      id: doctor?.id,
    });
  };

  const availability = getAvailabilityDoctor(doctor);
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="pt-6">
        <div className="flex items-center gap-2">
          <Avatar className="border-primary/10 h-14 w-14 shrink-0 border-2">
            <AvatarFallback className="bg-primary/5 text-primary text-lg font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 space-y-1">
            <h3 className="truncate text-base font-semibold">{doctor.name}</h3>
            <p className="text-muted-foreground truncate text-sm">{doctor.specialty}</p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              <Badge variant="secondary" className="font-normal">
                <UserIcon className="mr-1 size-3.5" />
                {getGenderLabel(doctor.gender)}
              </Badge>
            </div>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col gap-2 text-sm">
          <div className="text-muted-foreground flex items-center gap-2">
            <Calendar1Icon className="text-muted-foreground/70 size-4 shrink-0" />
            <span className="truncate">
              {availability.from.format("dddd") + " a " + availability.to.format("dddd")}
            </span>
          </div>
          <div className="text-muted-foreground flex items-center gap-2">
            <ClockIcon className="text-muted-foreground/70 size-4 shrink-0" />
            <span className="truncate">
              {availability.from.format("HH:mm")} as {availability.to.format("HH:mm")}
            </span>
          </div>
          <div className="text-muted-foreground flex items-center gap-2">
            <DollarSignIcon className="text-muted-foreground/70 size-4 shrink-0" />
            <span className="truncate">
              {formatCurrencyInCents(doctor.appointmentPriceInCents)}
            </span>
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
          <UpsertDoctorForm isOpen={isOpen} doctor={doctor} onSuccess={() => setIsOpen(false)} />
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
              <AlertDialogTitle>Deseja realmente excluir {doctor.name}?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação é irreversível. O Médico e todas as consultas agendadas serão excluídos.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={handleDeleteDoctor}
                disabled={deleteDoctorAction.isPending}
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
