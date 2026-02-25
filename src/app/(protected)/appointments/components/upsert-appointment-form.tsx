"use client";

import { UpsertAppointment } from "@/actions/upsert-appointment";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
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
import { doctorsTable, patientsTable } from "@/db/schema";
import { SessionType } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import z from "zod";
import { getAvailability, getTimeUTC } from "../../doctors/helpers/availability";

type FormValues = z.infer<ReturnType<typeof formSchema>>;

const formSchema = (doctors: Doctor[]) =>
  z
    .object({
      patientId: z.string().min(1, { message: "Paciente é obrigatório" }),
      doctorId: z.string().min(1, { message: "Médico é obrigatório" }),
      appointmentPriceInCents: z.number().min(1, {
        message: "Valor da consulta é obrigatório",
      }),
      appointmentDate: z
        .string()
        .min(1, {
          message: "Data é obrigatória",
        })
        .refine(
          (data) => {
            const date = dayjs(data, "YYYY-MM-DD", true);
            if (!date.isValid()) return false;
            const today = dayjs().startOf("day");
            return date.isSame(today, "day") || date.isAfter(today);
          },
          { message: "A data do agendamento deve ser posterior à data atual" },
        ),
      appointmentTime: z.string().min(1, {
        message: "Horário é obrigatória",
      }),
    })
    .superRefine((data, ctx) => {
      const { doctorId, appointmentTime } = data;
      if (!doctorId || !appointmentTime) return;

      const doctor = doctors.find((d) => d.id === doctorId);
      if (!doctor) return;

      const [h, m] = appointmentTime.split(":").map(Number);
      const minutes = h * 60 + m;

      const availability = getAvailability(doctor);

      const min = Number(getTimeUTC(doctor.availabilityFromTime).slice(0, 5).replace(":", ""));
      const max = Number(getTimeUTC(doctor.availabilityToTime).slice(0, 5).replace(":", ""));

      if (minutes < min || minutes > max) {
        ctx.addIssue({
          path: ["appointmentTime"],
          message: "Horário fora do período de atendimento do médico",
          code: "custom",
        });
      }
    });

type Patient = typeof patientsTable.$inferSelect;
type Doctor = typeof doctorsTable.$inferSelect;

type UpsertAppointmentFormProps = {
  onSuccess?: () => void;
  isOpen: boolean;
  session: SessionType;
  patients: Patient[];
  doctors: Doctor[];
};

export const UpsertAppointmentForm = ({
  isOpen,
  session,
  patients,
  doctors,
  onSuccess,
}: UpsertAppointmentFormProps) => {
  const form = useForm<z.infer<ReturnType<typeof formSchema>>>({
    resolver: zodResolver(formSchema(doctors)),
    defaultValues: {
      patientId: "",
      doctorId: "",
      appointmentPriceInCents: 0,
      appointmentDate: "",
      appointmentTime: "",
    },
  });

  const watchedDoctorId = form.watch("doctorId");
  const watchedPatientId = form.watch("patientId");
  const selectedDoctorData = doctors.find((d) => d.id === watchedDoctorId);
  const hasPatientAndDoctor = Boolean(watchedPatientId && watchedDoctorId);

  useEffect(() => {
    if (selectedDoctorData && watchedDoctorId) {
      form.setValue("appointmentPriceInCents", selectedDoctorData.appointmentPriceInCents);
    }
  }, [watchedDoctorId, selectedDoctorData, form]);

  useEffect(() => {
    if (!isOpen) {
      form.reset({
        patientId: "",
        doctorId: "",
        appointmentPriceInCents: 0,
        appointmentDate: "",
        appointmentTime: "",
      });
    }
  }, [isOpen, form]);

  const UpsertAppointmentAction = useAction(UpsertAppointment, {
    onSuccess: () => {
      toast.success("Agendamento criado com sucesso");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Erro ao criar agendamento");
    },
  });

  const handleSubmit = (values: FormValues, doctor: Doctor) => {
    if (!session?.user?.clinic) return;

    UpsertAppointmentAction.execute({
      patientId: values.patientId,
      doctorId: doctor.id,
      appointmentPriceInCents: values.appointmentPriceInCents,
      appointmentDate: values.appointmentDate,
      appointmentTime: values.appointmentTime,
      clinicId: session.user.clinic.id,
    });
  };

  const minTime = selectedDoctorData?.availabilityFromTime
    ? getTimeUTC(selectedDoctorData.availabilityFromTime).slice(0, 5)
    : undefined;

  const maxTime = selectedDoctorData?.availabilityToTime
    ? getTimeUTC(selectedDoctorData.availabilityToTime).slice(0, 5)
    : undefined;

  return (
    <DialogContent className="flex max-h-[90vh] flex-col">
      <DialogHeader className="shrink-0">
        <DialogTitle>Novo Agendamento</DialogTitle>
        <DialogDescription>Preencha os dados para criar um novo agendamento</DialogDescription>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto">
        <form
          onSubmit={form.handleSubmit((values) => {
            if (!selectedDoctorData) return;
            handleSubmit(values, selectedDoctorData);
          })}
        >
          <FieldGroup>
            <Controller
              name="patientId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Paciente</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {patients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.name}
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
              name="doctorId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Médico</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o médico" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {doctors.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id}>
                            {doctor.name} - {doctor.specialty}
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
              name="appointmentPriceInCents"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Valor da Consulta</FieldLabel>
                  <NumericFormat
                    value={field.value ? field.value / 100 : ""}
                    onValueChange={(values) => {
                      field.onChange(values.floatValue ? Math.round(values.floatValue * 100) : 0);
                    }}
                    decimalScale={2}
                    fixedDecimalScale
                    decimalSeparator=","
                    allowNegative={false}
                    allowLeadingZeros={false}
                    thousandSeparator="."
                    customInput={Input}
                    prefix="R$ "
                    disabled={!watchedDoctorId}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="appointmentDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Data</FieldLabel>
                  <DatePicker
                    id={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="dd/mm/aaaa"
                    aria-invalid={fieldState.invalid}
                    disabled={!hasPatientAndDoctor}
                    disablePastDates={true}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="appointmentTime"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Horário</FieldLabel>
                  <TimeInput
                    value={field.value}
                    onChange={field.onChange}
                    minTime={minTime}
                    maxTime={maxTime}
                    disabled={!hasPatientAndDoctor}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Field orientation="horizontal">
              <Button type="submit" disabled={UpsertAppointmentAction.isPending}>
                {UpsertAppointmentAction.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Criar Agendamento"
                )}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </DialogContent>
  );
};
