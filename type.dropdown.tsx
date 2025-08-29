import { useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";

interface DropDownProps {
  className?: string;
  items: Array<{ label: string | React.ReactNode; value: string }>;
  onSelect: (value: string) => void;
  placeholder?: string | React.ReactNode;
}

const TypeDropDown: React.FC<DropDownProps> = ({
  className,
  items,
  onSelect,
  placeholder = "Select an option",
}) => {
  const [selectedValue, setSelectedValue] = useState<string>("");

  const handleSelect = (value: string) => {
    const foundItem = items.find((item) => item.value === value);

    setSelectedValue(foundItem?.label as string);
    onSelect(value);
  };

  return (
    <Dropdown className={className}>
      <DropdownTrigger>{selectedValue || placeholder}</DropdownTrigger>
      <DropdownMenu onAction={(key) => handleSelect(key as string)}>
        {items.map((item) => (
          <DropdownItem key={item.value}>{item.label}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default TypeDropDown;
