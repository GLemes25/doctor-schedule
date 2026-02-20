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
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { doctorsTable } from "@/db/schema";
import { formatCurrencyInCents } from "@/helpers/currency";
import { Calendar1Icon, ClockIcon, DollarSignIcon, Trash } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";
import { getAvailability } from "../helpers/availability";
import { UpsertDoctorForm } from "./upsert-doctor-form";

type DoctorCardProps = {
  doctor: typeof doctorsTable.$inferSelect;
};

export const DoctorCard = ({ doctor }: DoctorCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const doctorInitials = doctor.name
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

  const availability = getAvailability(doctor);
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{doctorInitials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text sm font-medium">{doctor.name}</h3>
            <p className="text-muted-foreground text-sm">{doctor.specialty}</p>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-2">
        <Badge variant={"outline"}>
          <Calendar1Icon className="mr-1" />
          {availability.from.format("dddd") + " a " + availability.to.format("dddd")}
        </Badge>
        <Badge variant={"outline"}>
          <ClockIcon className="mr-1" />
          {availability.from.format("HH:mm")} as {availability.to.format("HH:mm")}
        </Badge>
        <Badge variant={"outline"}>
          <DollarSignIcon className="mr-1" />
          {formatCurrencyInCents(doctor.appointmentPriceInCents)}
        </Badge>
      </CardContent>
      <Separator />
      <CardFooter className="flex flex-col gap-2">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">Ver detalhes</Button>
          </DialogTrigger>

          <UpsertDoctorForm
            doctor={{
              ...doctor,
              availabilityFromTime: availability.from.format("HH:mm:ss"),
              availabilityToTime: availability.to.format("HH:mm:ss"),
            }}
            onSuccess={() => setIsOpen(false)}
          />
        </Dialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              <Trash />
              Deletar
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Deseja realmente deletar o {doctor.name}?</AlertDialogTitle>
              <AlertDialogDescription>
                Essa ação é irreversível. Isso irá deletar o médico e todas as consultas agendadas.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={handleDeleteDoctor}>
                Deletar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};
