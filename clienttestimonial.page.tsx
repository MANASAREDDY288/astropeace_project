import { Drawer, DrawerContent, DrawerBody } from "@heroui/react";
import { useSignals } from "@preact/signals-react/runtime";

import { ClienttestimonialList } from "./clienttestimonial.list";
import {
  clienttestimonialIsPopupOpen,
  clienttestimonialIsEditMode,
  editModeUpdate,
} from "./common/service";
import ClienttestimonialView from "./clienttestimonial.view";
import ClienttestimonialForm from "./clienttestimonial.form";

export function ClienttestimonialPage() {
  useSignals();

  return (
    <>
      <ClienttestimonialList />
      <Drawer
        hideCloseButton
        isOpen={clienttestimonialIsPopupOpen.value}
        size="4xl"
        onClose={() => editModeUpdate(undefined)}
      >
        <DrawerContent>
          <DrawerBody className="w-full">
            {clienttestimonialIsEditMode.value ? (
              <ClienttestimonialForm />
            ) : (
              <ClienttestimonialView />
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
