import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import * as React from "react";

type Props = {
  value?: string; // HH:mm:ss
  onChange?: (value: string) => void;
  className?: string;
  minHour?: number;
  maxHour?: number;
};

export function TimeInput({ value, onChange, className, minHour = 0, maxHour = 23 }: Props) {
  const [hours, setHours] = React.useState("00");
  const [minutes, setMinutes] = React.useState("00");

  React.useEffect(() => {
    if (!value) return;
    const [h, m] = value.split(":");
    setHours(h);
    setMinutes(m);
  }, [value]);

  function emit(h: string, m: string) {
    onChange?.(`${h.padStart(2, "0")}:${m.padStart(2, "0")}:00`);
  }

  function clamp(val: number, min: number, max: number) {
    return Math.min(Math.max(val, min), max);
  }

  return (
    <div
      className={cn(
        "border-input flex items-center gap-2 rounded-md border px-3 py-1",
        "focus-within:ring-ring focus-within:ring-2",
        className,
      )}
    >
      {/* HOURS */}
      <Input
        type="number"
        min={minHour}
        max={maxHour}
        value={hours}
        onChange={(e) => {
          const v = clamp(Number(e.target.value), 0, 23);
          const h = String(v).padStart(2, "0");
          setHours(h);
          emit(h, minutes);
        }}
        className="h-7 w-14 border-none p-0 text-center focus-visible:ring-0"
      />
      {/* <span className="text-muted-foreground text-sm">h</span> */}

      <span className="">:</span>

      {/* MINUTES */}
      <Input
        type="number"
        min={0}
        max={59}
        value={minutes}
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
