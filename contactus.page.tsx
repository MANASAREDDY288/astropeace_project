import { Drawer, DrawerContent, DrawerBody } from "@heroui/react";
import { useSignals } from "@preact/signals-react/runtime";

import { ContactusList } from "./contactus.list";
import {
  contactusIsPopupOpen,
  contactusIsEditMode,
  editModeUpdate,
} from "./common/service";
import ContactusView from "./contactus.view";
import ContactusForm from "./contactus.form";

export function ContactusPage() {
  useSignals();

  return (
    <>
      <ContactusList />
      <Drawer
        hideCloseButton
        isOpen={contactusIsPopupOpen.value}
        size="4xl"
        onClose={() => editModeUpdate(undefined)}
      >
        <DrawerContent>
          <DrawerBody className="w-full">
            {contactusIsEditMode.value ? <ContactusForm /> : <ContactusView />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
