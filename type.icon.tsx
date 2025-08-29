"use client";
import { CircleOff, icons } from "lucide-react";
import React from "react";

export type IconName = keyof typeof icons;

interface IconProps {
  name: IconName;
  color?: string;
  size?: number;
  onClick?: () => void;
}

const TypeIcon: React.FC<IconProps> = ({
  name,
  color = "lightslategray",
  size = 24,
  onClick,
}) => {
  const LucideIcon = icons[name];

  if (!LucideIcon) {
    return <CircleOff color={color} size={size} />;
  }

  return (
    <LucideIcon
      className="cursor-pointer"
      color={color}
      size={size}
      onClick={onClick}
    />
  );
};

export default TypeIcon;
