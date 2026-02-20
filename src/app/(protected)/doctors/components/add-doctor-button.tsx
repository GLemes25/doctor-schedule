"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { SessionType } from "@/lib/auth";
import { Plus } from "lucide-react";
import { useState } from "react";
import { UpsertDoctorForm } from "./upsert-doctor-form";

export const AddDoctorButton = ({ session }: { session: SessionType }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Adicionar Médico
        </Button>
      </DialogTrigger>
      <UpsertDoctorForm session={session} onSuccess={() => setIsOpen(false)} />
    </Dialog>
  );
};
