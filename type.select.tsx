import { Controller } from "react-hook-form";
import { Select, SelectItem } from "@heroui/select";
import { useSignals } from "@preact/signals-react/runtime";
import { OptionType } from "dff-util";

import { trans } from "@/i18n";

type TypeProps = {
  control: any;
  name: string;
  label?: string | undefined | null;
  rules?: any;
  error?: any;
  className?: string;
  options: OptionType[];
  disabled?: boolean;
  multiSelect?: boolean;
  variant?: "flat" | "bordered" | "underlined" | "faded";
  onChange?: (value: string | string[]) => void;
  radius?: "full" | "none" | "sm" | "md" | "lg" | undefined;
};

const TypeSelect = ({
  control,
  name,
  label,
  rules = {},
  error,
  className = "flex flex-col w-full",
  options = [],
  disabled = false,
  multiSelect = false,
  variant = "bordered",
  onChange,
  radius = "full",
}: TypeProps) => {
  useSignals();

  return (
    <section className={className}>
      {label && (
        <label className="text-sm p-2">
          {label}
          {rules?.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const value = field.value
            ? Array.isArray(field.value)
              ? field.value
              : [field.value.toString()]
            : [];

          return (
            <Select
              className={className}
              disabled={disabled}
              radius={radius}
              selectedKeys={value}
              selectionMode={multiSelect ? "multiple" : "single"}
              variant={variant}
              onSelectionChange={(selected: any) => {
                if (multiSelect) {
                  const selectedKeys = Array.from(selected);

                  field.onChange(selectedKeys);
                  onChange?.(selectedKeys as any);
                } else {
                  const selectedKey = selected?.currentKey ?? selected;

                  field.onChange(selectedKey);
                  onChange?.(selectedKey);
                }
              }}
            >
              {options.map((option: OptionType) => (
                <SelectItem key={option.key} isDisabled={option.disabled}>
                  {trans(option.lang, option.label)}
                </SelectItem>
              ))}
            </Select>
          );
        }}
        rules={rules}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error.message}</p>}
    </section>
  );
};

export default TypeSelect;
