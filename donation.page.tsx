import { Drawer, DrawerContent, DrawerBody } from "@heroui/react";
import { useSignals } from "@preact/signals-react/runtime";

import { DonationList } from "./donation.list";
import {
  donationIsPopupOpen,
  donationIsEditMode,
  editModeUpdate,
} from "./common/service";
import DonationView from "./donation.view";
import DonationForm from "./donation.form";

export function DonationPage() {
  useSignals();

  return (
    <>
      <DonationList />
      <Drawer
        hideCloseButton
        isOpen={donationIsPopupOpen.value}
        size="4xl"
        onClose={() => editModeUpdate(undefined)}
      >
        <DrawerContent>
          <DrawerBody className="w-full">
            {donationIsEditMode.value ? <DonationForm /> : <DonationView />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
