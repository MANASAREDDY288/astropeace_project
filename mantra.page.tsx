import { Drawer, DrawerContent, DrawerBody } from "@heroui/react";
import { useSignals } from "@preact/signals-react/runtime";

import { MantraList } from "./mantra.list";
import {
  mantraIsPopupOpen,
  mantraIsEditMode,
  editModeUpdate,
} from "./common/service";
import MantraForm from "./mantra.form";
import MantraView from "./mantra.view";

export function MantraPage() {
  useSignals();

  return (
    <>
      <MantraList />
      <Drawer
        hideCloseButton
        isOpen={mantraIsPopupOpen.value}
        size="4xl"
        onClose={() => editModeUpdate(undefined)}
      >
        <DrawerContent>
          <DrawerBody className="w-full">
            {mantraIsEditMode.value ? <MantraForm /> : <MantraView />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
