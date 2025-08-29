import { Card, CardBody } from "@heroui/react";
import { ReactNode } from "react";

export const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="container w-full p-1 overflow-y-auto h-[calc(100vh-88px)] flex items-center justify-end right  bg-white dark:bg-black   bg-auth-light dark:bg-auth-dark">
      <Card className="w-[360px] mx-8" radius="lg" shadow="sm">
        <CardBody className="p-0">{children}</CardBody>
      </Card>
    </main>
  );
};
