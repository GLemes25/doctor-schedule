"use client";
import { UpsertPatient } from "@/actions/upsert-patient";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { patientsTable } from "@/db/schema";
import { genders } from "@/helpers/gender";
import { SessionType } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  name: z.string().trim().min(1, { message: "Nome é obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
  phoneNumber: z.string().trim().min(1, { message: "Telefone é obrigatório" }),
  gender: z.enum(["male", "female"]),
  birthDate: z.string().min(1, { message: "Data de nascimento é obrigatória" }),
});

type UpsertPatientFormProps = {
  onSuccess?: () => void;
  isOpen: boolean;
  patient?: typeof patientsTable.$inferSelect;
  session?: SessionType;
};

export const UpsertPatientForm = ({
  isOpen,
  session,
  patient,
  onSuccess,
}: UpsertPatientFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: patient?.name ?? "",
      email: patient?.email ?? "",
      phoneNumber: patient?.phoneNumber ?? "",
      gender: patient?.gender ?? "male",
      birthDate: patient?.birthDate ?? "",
    },
  });

  useEffect(() => {
    if (!isOpen) {
      form.reset(patient);
    }
  }, [isOpen, form, patient]);

  const upsertPatientAction = useAction(UpsertPatient, {
    onSuccess: () => {
      toast.success(patient ? "Paciente alterado com sucesso" : "Paciente adicionado com sucesso");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Erro ao salvar paciente");
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const clinicId = session?.user.clinic?.id ?? patient?.clinicId;
    if (!clinicId) return;

    upsertPatientAction.execute({
      ...values,
      id: patient?.id,
      clinicId,
    });
  };

  return (
    <DialogContent className="flex max-h-[90vh] flex-col">
      <DialogHeader className="shrink-0">
        <DialogTitle>{patient ? patient.name : "Adicionar Paciente"}</DialogTitle>
        <DialogDescription>
          {patient ? "Edite as informações do" : "Adicione um novo"} paciente
        </DialogDescription>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto">
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Nome do Paciente</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Digite o nome do paciente..."
                    autoComplete="off"
                    type="text"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Digite o email..."
                    autoComplete="off"
                    type="email"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="phoneNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Número de telefone</FieldLabel>
                  <PatternFormat
                    value={field.value ?? ""}
                    onValueChange={(values) => {
                      field.onChange(values.value ?? "");
                    }}
                    format="(##) #####-####"
                    allowEmptyFormatting
                    mask="_"
                    customInput={Input}
                    placeholder="(00) 00000-0000"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="gender"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Sexo</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o sexo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {genders.map((gender) => (
                          <SelectItem key={gender.key} value={gender.key}>
                            {gender.value}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="birthDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Data de Nascimento</FieldLabel>
                  <Input {...field} id={field.name} type="date" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Field orientation="horizontal">
              <Button type="submit" disabled={upsertPatientAction.isPending}>
                {upsertPatientAction.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : patient ? (
                  "Salvar"
                ) : (
                  "Adicionar"
                )}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </DialogContent>
  );
};
