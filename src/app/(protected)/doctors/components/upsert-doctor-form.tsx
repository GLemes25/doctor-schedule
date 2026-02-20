"use client";
import { UpsertDoctor } from "@/actions/upsert-doctor";
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
import { TimeInput } from "@/components/ui/time-input";
import { doctorsTable } from "@/db/schema";
import { SessionType } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { Controller, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import z from "zod";
import { genders, medicalSpecialties } from "../constants";
import { setWeekDayKey, weekDays } from "../helpers/availability";

const formschema = z
  .object({
    name: z.string().trim().min(1, { message: "Nome é obrigatório" }),
    specialty: z.string().trim().min(1, { message: "Especialidade é obrigatória" }),
    appointmentPrice: z.number().min(1, { message: "Preço da consulta é obrigatório" }),
    availabilityFromWeekDay: z.string().trim().min(1, { message: "Dia da semana é obrigatório" }),
    availabilityToWeekDay: z.string().trim().min(1, { message: "Dia da semana é obrigatório" }),
    availabilityFromTime: z.string(),
    availabilityToTime: z.string(),
    gender: z.enum(["male", "female"]),
  })
  .refine(
    (data) => {
      const from = new Date(`1970-01-01T${data.availabilityFromTime}`);
      const to = new Date(`1970-01-01T${data.availabilityToTime}`);
      return from <= to;
    },
    {
      message: "A hora final deve ser anterior a hora inicial",
      path: ["availabilityToTime"],
    },
  );

type UpsertDoctorFormProps = {
  onSuccess?: () => void;
  doctor?: typeof doctorsTable.$inferSelect;
  session?: SessionType;
};
export const UpsertDoctorForm = ({ session, doctor, onSuccess }: UpsertDoctorFormProps) => {
  const form = useForm<z.infer<typeof formschema>>({
    resolver: zodResolver(formschema),
    defaultValues: {
      name: doctor?.name ?? "",
      specialty: doctor?.specialty ?? "",
      appointmentPrice: doctor?.appointmentPriceInCents ? doctor?.appointmentPriceInCents / 100 : 0,
      availabilityFromWeekDay: doctor?.availabilityFromWeekDay
        ? weekDays[doctor?.availabilityFromWeekDay].value
        : weekDays[1].value,
      availabilityToWeekDay: doctor?.availabilityToWeekDay
        ? weekDays[doctor?.availabilityToWeekDay].value
        : weekDays[5].value,
      availabilityFromTime: doctor?.availabilityFromTime ?? "",
      availabilityToTime: doctor?.availabilityToTime ?? "",
      gender: doctor?.gender ?? "male",
    },
  });

  const upsertDoctorAction = useAction(UpsertDoctor, {
    onSuccess: () => {
      toast.success(doctor ? "Médico alterado com sucesso" : "Médico adicionado com sucesso");
      onSuccess?.();
    },
    onError: (error) => {
      console.log(error);
      toast.error("Erro ao adicionar médico");
    },
  });

  const handleSubmit = (values: z.infer<typeof formschema>) => {
    const clinicId = session?.user.clinic?.id ?? doctor?.clinicId;
    console.log(values);
    upsertDoctorAction.execute({
      ...values,
      id: doctor?.id,
      availabilityFromWeekDay: setWeekDayKey(values.availabilityFromWeekDay),
      availabilityToWeekDay: setWeekDayKey(values.availabilityToWeekDay),
      appointmentPriceInCents: values.appointmentPrice * 100,
      clinicId: clinicId!,
    });
  };

  return (
    <DialogContent className="flex max-h-[90vh] flex-col">
      <DialogHeader className="shrink-0">
        <DialogTitle>{doctor ? doctor.name : "Adicionar Médico"} </DialogTitle>
        <DialogDescription>
          {doctor ? "Edite as informações desse" : "Adicione um novo"} médico
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
                  <FieldLabel htmlFor={field.name}>Nome</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Digite o nome do médico..."
                    autoComplete="off"
                    type="text"
                  />

                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="specialty"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Especialidade</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma Especialidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {medicalSpecialties.map((specialty) => (
                          <SelectItem key={specialty.value} value={specialty.value}>
                            {specialty.label}
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
              name="appointmentPrice"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Valor da Consulta</FieldLabel>
                  <NumericFormat
                    value={field.value ?? ""}
                    onValueChange={(values) => {
                      field.onChange(values.floatValue ?? 0);
                    }}
                    decimalScale={2}
                    fixedDecimalScale
                    decimalSeparator=","
                    allowNegative={false}
                    allowLeadingZeros={false}
                    thousandSeparator="."
                    customInput={Input}
                    prefix="R$ "
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
              name="availabilityFromWeekDay"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Dia Inicial de disponibilidade</FieldLabel>
                  <Select value={field.value?.toString()} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um dia da semana" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {weekDays.map((weekDay) => (
                          <SelectItem key={weekDay.key} value={weekDay.value}>
                            {weekDay.label}
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
              name="availabilityToWeekDay"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Dia Final de disponibilidade</FieldLabel>
                  <Select value={field.value?.toString()} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um dia da semana" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {weekDays.map((weekDay) => (
                          <SelectItem key={weekDay.key} value={weekDay.value}>
                            {weekDay.label}
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
              name="availabilityFromTime"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Hora inicial de disponibilidade</FieldLabel>
                  <TimeInput value={field.value} onChange={field.onChange} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="availabilityToTime"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Hora final de disponibilidade</FieldLabel>
                  <TimeInput value={field.value} onChange={field.onChange} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Field orientation="horizontal">
              <Button type="submit" className="" disabled={upsertDoctorAction.isPending}>
                {upsertDoctorAction.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : doctor ? (
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
