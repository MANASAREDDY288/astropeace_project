import { Switch } from "@heroui/react";
import { Controller } from "react-hook-form";

type TypeProps = {
  control: any;
  name: string;
  label?: string;
  className?: string;
  variant?: "square" | "circular";
  disabled?: boolean;
  onChange?: (value: boolean) => void; // Add onChange prop
};

const TypeSwitch = ({
  control,
  name,
  label,
  className = "flex w-full",
  disabled = false,
  onChange,
}: TypeProps) => {
  return (
    <section className={className}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Switch
            {...field}
            className={className}
            disabled={disabled}
            isSelected={field.value || false}
            onValueChange={(checked: boolean) => {
              field.onChange(checked); // Update form state
              onChange?.(checked); // Call custom onChange if provided
            }}
          >
            {label}
          </Switch>
        )}
      />
    </section>
  );
};

export default TypeSwitch;
