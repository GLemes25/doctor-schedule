"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { doctorsTable, patientsTable } from "@/db/schema";
import { SessionType } from "@/lib/auth";
import { Plus } from "lucide-react";
import { useState } from "react";
import { UpsertAppointmentForm } from "./upsert-appointment-form";

type Patient = typeof patientsTable.$inferSelect;
type Doctor = typeof doctorsTable.$inferSelect;

type AddAppointmentButtonProps = {
  session: SessionType;
  patients: Patient[];
  doctors: Doctor[];
};

export const AddAppointmentButton = ({ session, patients, doctors }: AddAppointmentButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Novo Agendamento
        </Button>
      </DialogTrigger>
      <UpsertAppointmentForm
        isOpen={isOpen}
        session={session}
        patients={patients}
        doctors={doctors}
        onSuccess={() => setIsOpen(false)}
      />
    </Dialog>
  );
};
