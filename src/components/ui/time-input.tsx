import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
};

export function TimeInput({ value, onChange, className, disabled }: Props) {
  return (
    <Input
      type="time"
      value={value?.slice(0, 5)}
      disabled={disabled}
      onChange={(e) => {
        const v = e.target.value;
        if (!v) return;
        onChange?.(`${v}:00`);
      }}
      className={cn("h-9", className)}
    />
  );
}
