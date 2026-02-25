import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * Converte uma string de horário ("HH:mm" ou "HH:mm:ss")
 * em números de hora e minuto
 */
const parseTime = (timeStr: string): { hour: number; minute: number } => {
  const parts = timeStr.split(":");
  const hour = parseInt(parts[0] ?? "0", 10);
  const minute = parseInt(parts[1] ?? "0", 10);

  return {
    hour: Number.isNaN(hour) ? 0 : hour,
    minute: Number.isNaN(minute) ? 0 : minute,
  };
};

type Props = {
  value?: string;

  onChange?: (value: string) => void;

  className?: string;

  minHour?: number;
  maxHour?: number;
  minTime?: string;
  maxTime?: string;

  disabled?: boolean;
};

/**
 * TimeInput
 *
 * Input de horário em formato 24h com:
 * - Controle de hora e minuto separados
 * - Validação automática de limites
 * - Emissão no formato HH:mm:00
 */
export function TimeInput({
  value,
  onChange,
  className,
  minHour = 0,
  maxHour = 23,
  minTime,
  maxTime,
  disabled,
}: Props) {
  const [hours, setHours] = React.useState("00");
  const [minutes, setMinutes] = React.useState("00");

  /**
   * Define os limites reais de hora e minuto
   * priorizando minTime/maxTime quando existirem
   */
  const {
    minHour: actualMinHour,
    maxHour: actualMaxHour,
    minMinute,
    maxMinute,
  } = React.useMemo(() => {
    if (minTime && maxTime) {
      const min = parseTime(minTime);
      const max = parseTime(maxTime);

      return {
        minHour: min.hour,
        maxHour: max.hour,
        minMinute: min.minute,
        maxMinute: max.minute,
      };
    }

    return {
      minHour,
      maxHour,
      minMinute: 0,
      maxMinute: 59,
    };
  }, [minTime, maxTime, minHour, maxHour]);

  /**
   * Sincroniza o estado interno quando o value externo muda
   */
  React.useEffect(() => {
    if (!value) return;

    const [h, m] = value.split(":");
    setHours(h ?? "00");
    setMinutes(m ?? "00");
  }, [value]);

  const emit = (h: string, m: string) => {
    if (!onChange) return;

    const finalH = h.padStart(2, "0");
    const finalM = m.padStart(2, "0");

    onChange(`${finalH}:${finalM}:00`);
  };

  /** Garante que um número fique dentro de um intervalo */
  const clamp = (val: number, min: number, max: number) => {
    return Math.min(Math.max(val, min), max);
  };

  /** Minuto mínimo depende da hora atual */
  const getMinForMinutes = () => (parseInt(hours, 10) === actualMinHour ? minMinute : 0);

  /** Minuto máximo depende da hora atual */
  const getMaxForMinutes = () => (parseInt(hours, 10) === actualMaxHour ? maxMinute : 59);

  return (
    <div
      className={cn(
        "border-input flex items-center gap-2 rounded-md border px-3 py-1",
        "focus-within:ring-ring focus-within:ring-2",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      {/* Hora */}
      <Input
        type="number"
        min={actualMinHour}
        max={actualMaxHour}
        value={hours}
        disabled={disabled}
        formNoValidate
        onChange={(e) => {
          const v = clamp(Number(e.target.value), 0, 23);
          const h = String(v).padStart(2, "0");
          setHours(h);
          emit(h, minutes);
        }}
        className="h-7 w-14 border-none p-0 text-center focus-visible:ring-0"
      />

      <span>:</span>

      {/* Minutos */}
      <Input
        type="number"
        min={getMinForMinutes()}
        max={getMaxForMinutes()}
        value={minutes}
        disabled={disabled}
        onChange={(e) => {
          const v = clamp(Number(e.target.value), 0, 59);
          const m = String(v).padStart(2, "0");
          setMinutes(m);
          emit(hours, m);
        }}
        className="h-7 w-14 border-none p-0 text-center focus-visible:ring-0"
      />

      <span className="text-muted-foreground text-sm">min</span>
    </div>
  );
}
