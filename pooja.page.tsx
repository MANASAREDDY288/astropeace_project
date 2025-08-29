import { Drawer, DrawerContent, DrawerBody } from "@heroui/react";
import { useSignals } from "@preact/signals-react/runtime";

import { PoojaList } from "./pooja.list";
import {
  poojaIsPopupOpen,
  poojaIsEditMode,
  editModeUpdate,
} from "./common/service";
import PoojaView from "./pooja.view";
import PoojaForm from "./pooja.form";

export function PoojaPage() {
  useSignals();

  return (
    <>
      <PoojaList />
      <Drawer
        hideCloseButton
        isOpen={poojaIsPopupOpen.value}
        size="4xl"
        onClose={() => editModeUpdate(undefined)}
      >
        <DrawerContent>
          <DrawerBody className="w-full">
            {poojaIsEditMode.value ? <PoojaForm /> : <PoojaView />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
