// import { Drawer, DrawerContent, DrawerBody } from "@heroui/react";
import { useSignals } from "@preact/signals-react/runtime";

import { TransactionsList } from "./transactions.list";
// import {
//   transactionsIsPopupOpen,
//   transactionsIsEditMode,
//   editModeUpdate,
// } from "./common/service";
// import TransactionsView from "./transactions.view";
// import TransactionsForm from "./transactions.form";

export function TransactionsPage() {
  useSignals();

  return (
    <>
      <TransactionsList />
      {/* <Drawer
        hideCloseButton
        isOpen={transactionsIsPopupOpen.value}
        size="4xl"
        onClose={() => editModeUpdate(undefined)}
      >
        <DrawerContent>
          <DrawerBody className="w-full">
            {transactionsIsEditMode.value ? (
              <TransactionsForm />
            ) : (
              <TransactionsView />
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer> */}
    </>
  );
}
