import { Controller } from "react-hook-form";
import { Input, Textarea } from "@heroui/react";

import { t } from "@/i18n";

type TypeProps = {
  control: any;
  name: string;
  label?: string | undefined | null;
  rules?: any;
  error?: any;
  className?: string;
  type?:
    | "text"
    | "password"
    | "number"
    | "datetime-local"
    | "textarea"
    | "time";
  disabled?: boolean;
  radius?: "full" | "none" | "sm" | "md" | "lg";
  onChange?: (value: any) => void;
};

const TypeInput = ({
  control,
  name,
  label,
  rules = {},
  error,
  className = "flex flex-col w-full",
  type = "text",
  disabled = false,
  onChange,
  radius = "full",
}: TypeProps) => {
  return (
    <section className={className}>
      {label && (
        <label className="text-sm font-medium p-2">
          {label} {rules.required && <span className="text-red-500">*</span>}
        </label>
      )}

      <Controller
        control={control}
        defaultValue={type === "number" ? 0 : ""}
        name={name}
        render={({ field }) =>
          type === "textarea" ? (
            <Textarea
              {...field}
              className={className}
              disabled={disabled}
              radius={radius}
              value={field.value || ""}
              onChange={(e) => {
                const val = e.target.value;

                field.onChange(val);
                onChange?.(val);
              }}
            />
          ) : (
            <Input
              {...field}
              className={className}
              disabled={disabled}
              radius={radius}
              type={type}
              value={field.value ?? ""}
              onChange={(e) => {
                const val =
                  type === "number" ? Number(e.target.value) : e.target.value;

                field.onChange(val);
                onChange?.(val);
              }}
            />
          )
        }
        rules={rules}
      />

      {error && <p className="text-red-500 text-sm">{t(error.message)}</p>}
    </section>
  );
};

export default TypeInput;
