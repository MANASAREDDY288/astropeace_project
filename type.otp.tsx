import { InputOtp } from "@heroui/react";
import { Controller } from "react-hook-form";

type TypeOtpProps = {
  control: any;
  name: string;
  label?: string;
  length?: number;
  rules?: any;
  error?: any;
  className?: string;
  disabled?: boolean;
  onChange?: (val: string) => void;
};

const TypeOtp = ({
  control,
  name,
  label,
  length = 6,
  rules = {},
  error,
  className = "flex flex-col w-full",
  disabled = false,
  onChange,
}: TypeOtpProps) => {
  return (
    <section className={className}>
      {label && (
        <label className="text-sm font-medium px-1 mb-1">
          {label} {rules.required && <span className="text-red-500">*</span>}
        </label>
      )}

      <Controller
        control={control}
        defaultValue=""
        name={name}
        render={({ field }) => (
          <InputOtp
            isDisabled={disabled}
            length={length}
            value={field.value}
            onValueChange={(val: string) => {
              field.onChange(val);
              onChange?.(val);
            }}
          />
        )}
        rules={rules}
      />

      {error && <p className="text-xs text-red-500 mt-1">{error.message}</p>}
    </section>
  );
};

export default TypeOtp;
