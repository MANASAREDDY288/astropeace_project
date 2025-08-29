import { Input } from "@heroui/react";
import React from "react";

import TypeIcon from "./type.icon";

type TypeSearchProps = {
  className?: string;
  label?: string;
  value: string;
  variant?: "underlined" | "flat" | "faded" | "bordered" | undefined;
  onChange: (value: string) => void;
};

const TypeSearch: React.FC<TypeSearchProps> = ({
  className = "",
  label = "Search...",
  value,
  variant = "underlined",
  onChange,
}) => {
  const [searchTerm, setSearchTerm] = React.useState<string>(value);

  return (
    <Input
      className={className}
      endContent={
        <TypeIcon name="Search" onClick={() => onChange(searchTerm)} />
      }
      placeholder={label}
      value={searchTerm}
      variant={variant}
      onChange={(e) => {
        setSearchTerm(e.currentTarget.value);
      }}
      onKeyUp={(e) => {
        if (e.key === "Enter") {
          onChange(e.currentTarget.value);
        }
      }}
    />
  );
};

export default TypeSearch;
