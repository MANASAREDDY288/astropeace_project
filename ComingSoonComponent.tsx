import { Image } from "@heroui/image";
import { useSignals } from "@preact/signals-react/runtime";

import BlueLogo from "../../public/blue-logo.svg";
import WhiteLogo from "../../public/white-logo.svg";

import { ThemeMode } from "@/utils/services/app.event";

export default function ComingSoonComponent() {
  useSignals();

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6">Coming Soon!</h1>
      {ThemeMode.value === "dark" ? (
        <Image alt="Logo" className="w-45 h-24" src={WhiteLogo} />
      ) : (
        <Image alt="Logo" className="w-45 h-24" src={BlueLogo} />
      )}
    </div>
  );
}
