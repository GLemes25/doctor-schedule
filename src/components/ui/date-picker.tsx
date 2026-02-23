"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ptBR } from "react-day-picker/locale";
import { CalendarIcon } from "lucide-react";
import { PatternFormat } from "react-number-format";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/pt-br";

dayjs.extend(customParseFormat);
dayjs.locale("pt-br");

function formatToYYYYMMDD(rawValue: string): string {
  if (rawValue.length !== 8) return "";
  const day = rawValue.slice(0, 2);
  const month = rawValue.slice(2, 4);
  const year = rawValue.slice(4, 8);
  const parsed = dayjs(`${year}-${month}-${day}`, "YYYY-MM-DD", true);
  return parsed.isValid() ? parsed.format("YYYY-MM-DD") : "";
}

function formatToRaw(value: string): string {
  if (!value) return "";
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format("DDMMYYYY") : "";
}

type DatePickerProps = {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  "aria-invalid"?: boolean;
  className?: string;
  disabled?: boolean;
};

export function DatePicker({
  value,
  onChange,
  placeholder = "dd/mm/aaaa",
  id,
  "aria-invalid": ariaInvalid,
  className,
  disabled,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const date = value ? dayjs(value).toDate() : undefined;
  const rawValue = formatToRaw(value ?? "");
  const [inputValue, setInputValue] = React.useState(rawValue);

  React.useEffect(() => {
    setInputValue(formatToRaw(value ?? ""));
  }, [value]);

  const handleInputChange = (values: { value: string }) => {
    const raw = values.value ?? "";
    setInputValue(raw);
    const iso = formatToYYYYMMDD(raw);
    onChange(iso);
  };

  const handleCalendarSelect = (selectedDate: Date | undefined) => {
    const iso = selectedDate ? dayjs(selectedDate).format("YYYY-MM-DD") : "";
    onChange(iso);
    setInputValue(formatToRaw(iso));
    setOpen(false);
  };

  return (
    <div
      className={cn(
        "border-input flex h-9 w-full items-center gap-1 rounded-md border bg-transparent px-3 shadow-xs transition-[color,box-shadow] outline-none focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        ariaInvalid && "border-destructive ring-destructive/20"
      )}
      aria-invalid={ariaInvalid}
    >
      <PatternFormat
        id={id}
        value={inputValue}
        onValueChange={handleInputChange}
        format="##/##/####"
        allowEmptyFormatting
        mask="_"
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={ariaInvalid}
        className="placeholder:text-muted-foreground min-w-0 flex-1 border-0 bg-transparent py-1 text-base outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            disabled={disabled}
            className="shrink-0"
            aria-label="Selecionar data"
          >
            <CalendarIcon className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="end">
          <Calendar
            mode="single"
            selected={date}
            defaultMonth={date}
            captionLayout="dropdown"
            locale={ptBR}
            fromYear={1900}
            toYear={new Date().getFullYear()}
            onSelect={handleCalendarSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
