import React from "react";
import { useSignals } from "@preact/signals-react/runtime";

import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { SessionToken } from "@/utils/services/app.event";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useSignals();
  const [toggled, setToggled] = React.useState(true);

  React.useEffect(() => {}, [toggled]);

  return (
    <>
      <div className="relative flex flex-col h-screen overflow-hidden gap-2">
        <Navbar onToggle={() => setToggled(!toggled)} />
        <main className="container mx-auto flex-grow">
          <div className="flex gap-2">
            {SessionToken.value && (
              <Sidebar isOpen={toggled} onToggle={() => setToggled(!toggled)} />
            )}
            <div className="flex-grow">{children}</div>
          </div>
        </main>
        {/* <footer className="w-full flex items-center justify-center py-3">
          <Link
            isExternal
            className="flex items-center gap-1 text-current"
            href="https://heroui.com"
            title="heroui.com homepage"
          >
            <span className="text-default-600">Powered by</span>
            <p className="text-primary">HeroUI</p>
          </Link>
        </footer> */}
      </div>
    </>
  );
}
