import React from "react";

export const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return <section className="w-full h-full relative">{children}</section>;
};
