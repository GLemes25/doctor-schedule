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
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import z from "zod";
import { medicalSpecialties, weekDays } from "../_constants";

const formschema = z
  .object({
    name: z.string().trim().min(1, { message: "Nome é obrigatório" }),
    specialty: z.string().trim().min(1, { message: "Especialidade é obrigatória" }),
    appointmentsPrice: z.number().min(1, { message: "Preço da consulta é obrigatório" }),
    availableFromWeekDay: z.string().trim().min(1, { message: "Dia da semana é obrigatório" }),
    availableToWeekDay: z.string().trim().min(1, { message: "Dia da semana é obrigatório" }),
    availableFromTime: z.string(),
    availableToTime: z.string(),
  })
  .refine(
    (data) => {
      const from = new Date(`1970-01-01T${data.availableFromTime}`);
      const to = new Date(`1970-01-01T${data.availableToTime}`);
      return from < to;
    },
    {
      message: "A hora final deve ser anterior a hora inicial",
      path: ["availableToTime"],
    },
  );

export const UpsertDoctorForm = () => {
  const form = useForm<z.infer<typeof formschema>>({
    resolver: zodResolver(formschema),
    defaultValues: {
      name: "",
      specialty: "",
      appointmentsPrice: 0,
      availableFromWeekDay: weekDays[1].value,
      availableToWeekDay: weekDays[5].value,
      availableFromTime: "",
      availableToTime: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formschema>) => {
    console.log(values);
  };

  return (
    <DialogContent className="flex max-h-[90vh] flex-col">
      <DialogHeader className="shrink-0">
        <DialogTitle>Adicionar Médico</DialogTitle>
        <DialogDescription>Adicione um novo médico</DialogDescription>
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
              name="appointmentsPrice"
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
              name="availableFromWeekDay"
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
              name="availableToWeekDay"
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
              name="availableFromTime"
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
              name="availableToTime"
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
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Criar Médico"
                )}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </DialogContent>
  );
};
