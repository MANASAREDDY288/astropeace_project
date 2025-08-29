import {
  Controller,
  Control,
  FieldError,
  FieldValues,
  RegisterOptions,
  Path,
} from "react-hook-form";
import MDEditor from "@uiw/react-md-editor";

type MdxEditorProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  rules?: RegisterOptions<T, Path<T>>;
  label?: string;
  error?: FieldError;
  disabled?: boolean;
  className?: string;
};

const TypeMdxEditor = <T extends FieldValues>({
  name,
  control,
  rules,
  label,
  error,
  disabled = false,
  className = "w-full",
}: MdxEditorProps<T>) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium mb-2">{label}</label>
      )}

      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <MDEditor
            height={400}
            preview="edit"
            previewOptions={{}}
            textareaProps={{ disabled }}
            value={field.value ?? ""}
            onChange={(val) => field.onChange(val)}
          />
        )}
        rules={rules} // or use a prop if needed
      />

      {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
    </div>
  );
};

export default TypeMdxEditor;
